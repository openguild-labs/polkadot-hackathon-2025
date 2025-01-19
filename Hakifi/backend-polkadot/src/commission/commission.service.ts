import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  CommissionType,
  Insurance,
  InsuranceState,
  Prisma,
  User,
} from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { INSURANCE_EVENTS } from 'src/common/constants/event';
import { CreateCommissionDto } from './dto/create-commission.dto';
import {
  LIQUIDATED_COMMISSION_DIRECT,
  COMMISSION_INDIRECT_RATE,
  PAYBACK_COMMISSION_DIRECT_BY_LEVEL,
} from './constant/commission.constant';
import { getFriendTypeByHierarchy } from 'src/users/users.utils';
import { ListCommissionsQueryDto } from './dto/query-commission.dto';
import { round } from 'src/common/helpers/utils';

@Injectable()
export class CommissionService {
  logger = new Logger(CommissionService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query: ListCommissionsQueryDto) {
    const where: Prisma.CommissionWhereInput = {
      toUserId: query.userId,
    };
    if (query.type) where.type = query.type;

    if (query.commissionType) where.commissionType = query.commissionType;

    if (query.createdFrom || query.createdTo) {
      where.createdAt = {};
      if (query.createdFrom) where.createdAt.gte = query.createdFrom;
      if (query.createdTo) where.createdAt.lte = query.createdTo;
    }

    if (query.q) {
      where.fromUser = {
        walletAddress: {
          equals: query.q,
          mode: 'insensitive',
        },
      };
    }

    const [total, rows] = await Promise.all([
      this.prismaService.commission.count({ where }),
      this.prismaService.commission.findMany({
        skip: query.skip,
        take: query.limit,
        where,
        orderBy: query.orderBy,
        include: {
          fromUser: {
            select: {
              id: true,
              walletAddress: true,
            },
          },
          insurance: {
            select: {
              id: true,
              asset: true,
              unit: true,
              side: true,
              margin: true,
              closedAt: true,
              token: {
                select: {
                  attachment: true,
                  symbol: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return { total, rows };
  }

  @OnEvent(INSURANCE_EVENTS.UPDATED)
  async createCommissionsByInsuranceCompleted(insurance: Insurance) {
    if (
      ![
        InsuranceState.EXPIRED,
        InsuranceState.LIQUIDATED,
        InsuranceState.CANCELLED,
        InsuranceState.CLAIMED,
        InsuranceState.REFUNDED,
      ].includes(insurance.state as any)
    ) {
      return;
    }
    this.logger.log('Create commissions by insurance completed');

    const user = await this.prismaService.user.findUnique({
      where: { id: insurance.userId },
      include: {
        refferalCode: true,
      },
    });

    if (!user?.hierarchy || !user?.refferalCode) {
      return;
    }

    const parentIds = user.hierarchy.split(',');

    //Lấy danh sách dòng họ của user
    const parents = await this.prismaService.user.findMany({
      where: {
        OR: [
          { id: { in: parentIds }, isPartner: true },
          { id: user.refferalCode.userId },
        ],
      },
    });

    if (!parents.length) return;

    for (const parent of parents) {
      // Lấy loại bạn bè của user
      const friendType = getFriendTypeByHierarchy(user.hierarchy, parent.id);
      let amount = this.getCommissionAmount(parent, friendType, insurance);
      const isF1 = friendType === 1;
      let parentAmount = amount;

      // Check nếu user là F1 kiểm tra share back cho user
      if (isF1) {
        parentAmount = amount * user.refferalCode.myPercent;
        const shareBackAmount = amount - parentAmount;
        if (shareBackAmount > 0) {
          try {
            await this.createCommision({
              fromUserId: user.id,
              toUserId: user.id,
              amount: shareBackAmount,
              commissionType: CommissionType.SHARE_BACK,
              type: 0,
              asset: insurance.unit,
              insuranceId: insurance.id,
            });
          } catch (error) {
            this.logger.error(
              `Insurance: ${insurance.id} | Create commission for user ${user.id} error: ${error.message}`,
            );
          }
        }
      }

      if (parentAmount > 0) {
        const commissionData: CreateCommissionDto = {
          fromUserId: user.id,
          toUserId: parent.id,
          amount: parentAmount,
          commissionType: isF1
            ? CommissionType.DIRECT
            : CommissionType.INDIRECT,
          type: friendType,
          toUserLevel: parent.level,
          asset: insurance.unit,
          insuranceId: insurance.id,
        };
        try {
          await this.createCommision(commissionData);
        } catch (error) {
          this.logger.error(
            `Insurance: ${insurance.id} | Create commission for user ${parent.id} error: ${error.message}`,
          );
        }
      }
    }
  }

  private getCommissionAmount(
    parent: User,
    friendType: number,
    insurance: Insurance,
  ) {
    let payback = 0;
    const isDirect = friendType === 1;
    let amount = 0;
    switch (insurance.state) {
      case InsuranceState.EXPIRED:
      case InsuranceState.LIQUIDATED:
        // ======= Hợp đồng kết thúc với trạng thái Thanh lý =========
        // Trực tiếp =  1% * Ký quỹ * Tỷ lệ chia sẻ (nếu có)
        if (isDirect) amount = LIQUIDATED_COMMISSION_DIRECT * insurance.margin;
        // 0.3% * Ký quỹ
        else amount = COMMISSION_INDIRECT_RATE * insurance.margin;
        break;
      case InsuranceState.REFUNDED:
      case InsuranceState.CANCELLED:
      case InsuranceState.CLAIMED:
        // ======== Hợp đồng kết thúc với trạng thái được Payback: ========
        if (insurance.state === InsuranceState.CLAIMED)
          payback = insurance.q_claim;
        else payback = insurance.margin;
        // Trực tiếp = Config Tỷ lệ hh theo cấp * Giá trị Payback * Tỷ lệ chia sẻ (nếu có)
        if (isDirect)
          amount = PAYBACK_COMMISSION_DIRECT_BY_LEVEL[parent.level] * payback;
        // Gián tiếp = Config Tỷ lệ hh gián tiếp * Giá trị Payback
        else amount = COMMISSION_INDIRECT_RATE * payback;
        break;
      default:
        break;
    }

    return amount;
  }

  private async createCommision(data: CreateCommissionDto) {
    data.amount = round(data.amount, 12);

    await this.prismaService.$transaction([
      this.prismaService.commission.create({
        data,
      }),
      this.prismaService.wallet.upsert({
        where: {
          userId_asset: {
            userId: data.toUserId,
            asset: data.asset,
          },
        },
        update: {
          balance: {
            increment: data.amount,
          },
          totalCommission: {
            increment: data.amount,
          },
        },
        create: {
          userId: data.toUserId,
          asset: data.asset,
          balance: data.amount,
          totalCommission: data.amount,
        },
      }),
    ]);
  }
}
