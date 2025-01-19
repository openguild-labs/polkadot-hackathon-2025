import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  BaseUnit,
  Insurance,
  InsuranceState,
  Prisma,
  User,
  UserStat,
} from '@prisma/client';
import dayjs from 'dayjs';
import { OnEvent } from '@nestjs/event-emitter';
import { INSURANCE_EVENTS } from 'src/common/constants/event';
import { UserStatsDailyQueryDto } from './dto/user-stats-query.dto';
import { Cron } from '@nestjs/schedule';
import { ReferralCodesService } from './referral-codes.service';
import { getFriendTypeByHierarchy, getUserHierachyByType } from './users.utils';
import { FriendsListQueryDto } from './dto/query-list-friends.dto';
import { FRIEND_TYPE } from './type/referral.type';
import { UpdateReferralInfoDto, UpdateUserDto } from './dto/update-user.dto';
import { UserError } from './constant/userContants';
import { ReferralCodeError } from './constant/referralContants';
import { uniq } from 'src/common/helpers/utils';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly referralsCodeService: ReferralCodesService,
  ) {}

  findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async findByWalletAddress(walletAddress: string) {
    const wallet = await this.prismaService.user.findUnique({
      where: { walletAddress },
    });

    return wallet;
  }

  public async getNonce(walletAddress: string) {
    const nonce = Math.floor(Math.random() * 900000) + 100000; // 6 digit nonce

    await this.prismaService.user.upsert({
      where: { walletAddress },
      update: {
        nonce,
      },
      create: {
        walletAddress,
        nonce,
        hierarchy: '',
      },
    });

    return nonce;
  }

  async update(user: User, data: UpdateUserDto) {
    const updateData: Prisma.UserUpdateInput = {};

    const validateFields = [
      {
        field: 'username',
        error: UserError.INVALID_USER_NAME,
      },
      {
        field: 'email',
        error: UserError.INVALID_EMAIL,
      },
      {
        field: 'phoneNumber',
        error: UserError.INVALID_PHONE_NUMBER,
      },
    ];

    // update default ref code
    if (
      data.defaultMyRefCode &&
      user.defaultMyRefCode !== data.defaultMyRefCode
    ) {
      const existed = await this.prismaService.referralCode.findFirst({
        where: { code: data.defaultMyRefCode, userId: user.id },
        select: { id: true },
      });

      if (!existed) {
        throw new BadRequestException(ReferralCodeError.INVALID_REFERRAL_CODE);
      }
      updateData.defaultMyRefCode = data.defaultMyRefCode;
    }

    for (const f of validateFields) {
      if (data[f.field] && user[f.field] !== data[f.field]) {
        const existed = await this.prismaService.user.findFirst({
          where: { [f.field]: data[f.field], id: { not: user.id } },
          select: { id: true },
        });

        if (existed) {
          throw new BadRequestException(f.error);
        }
        updateData[f.field] = data[f.field];
      }
    }

    let updatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: updateData,
    });

    if (!user.refCode && data.refCode) {
      updatedUser = await this.addReferralCodeToUser(updatedUser, data.refCode);
    }

    return updatedUser;
  }

  async addReferralCodeToUser(user: User, code: string) {
    if (!!user.refCode) {
      throw new BadRequestException('User already has a referral code');
    }

    const referralCode = await this.prismaService.referralCode.findUnique({
      where: {
        code,
      },
      include: {
        owner: true,
      },
    });

    if (!referralCode) {
      throw new BadRequestException('Referral code not found');
    }

    if (referralCode.owner.id === user.id) {
      throw new BadRequestException(ReferralCodeError.INVALID_REFERRAL_CODE);
    }

    let hierarchyArr = referralCode.owner.hierarchy
      ? referralCode.owner.hierarchy.split(',')
      : [];

    hierarchyArr.push(referralCode.owner.id);
    hierarchyArr = uniq(hierarchyArr);
    if (hierarchyArr.length > 4) {
      hierarchyArr = hierarchyArr.slice(-4);
    }

    // kiểm tra thằng user này có chính nó trong hierarchy của owner không
    if (hierarchyArr.includes(user.id)) {
      throw new BadRequestException('Cannot use your own referral code');
    }

    // kiểm tra thằng user này có owner trong hierarchy của nó không
    const isExistedOwnerInChildUsers = await this.prismaService.user.findFirst({
      where: {
        id: referralCode.owner.id,
        hierarchy: {
          endsWith: getUserHierachyByType(user.id, FRIEND_TYPE.ALL),
        },
      },
    });

    if (!!isExistedOwnerInChildUsers) {
      throw new BadRequestException(ReferralCodeError.INVALID_REFERRAL_CODE);
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        refCode: code,
        hierarchy: hierarchyArr.join(','),
        invitedAt: new Date(),
      },
    });

    this.updateChildsHierarchy(updatedUser);

    // Update Total Friends for father and acenstors (isPartner = true)
    await this.prismaService.user.updateMany({
      where: {
        OR: [
          {
            id: { in: hierarchyArr },
            isPartner: true,
          },
          {
            id: referralCode.owner.id,
          },
        ],
      },
      data: {
        totalFriends: {
          increment: 1,
        },
      },
    });

    return updatedUser;
  }

  private async updateChildsHierarchy(parent: User) {
    if (!parent.hierarchy) return;
    const users = await this.prismaService.user.findMany({
      where: {
        hierarchy: {
          endsWith: getUserHierachyByType(parent.id, FRIEND_TYPE.ALL),
        },
      },
      select: {
        id: true,
        hierarchy: true,
      },
    });

    for (const child of users) {
      let hierarchyArr = (parent.hierarchy + ',' + child.hierarchy).split(',');
      hierarchyArr = uniq(hierarchyArr);

      if (hierarchyArr.length > 4) {
        hierarchyArr = hierarchyArr.slice(-4);
      }

      try {
        await this.prismaService.user.update({
          where: { id: child.id },
          data: {
            hierarchy: hierarchyArr.join(','),
          },
        });
      } catch (error) {
        this.logger.error('update hierarchy error', error);
      }
    }
  }

  async getFriendsList(query: FriendsListQueryDto) {
    const where: Prisma.UserWhereInput = {
      hierarchy: {
        endsWith: getUserHierachyByType(
          query.userId,
          query.type ? FRIEND_TYPE[query.type] : FRIEND_TYPE.ALL,
        ),
      },
    };

    if (query.q) {
      where.walletAddress = {
        contains: query.q,
        mode: 'insensitive',
      };
    }

    if (query.level) {
      where.level = query.level;
    }

    if (query.invitedAtFrom || query.invitedAtTo) {
      where.invitedAt = {};
      if (query.invitedAtFrom) where.invitedAt.gte = query.invitedAtFrom;
      if (query.invitedAtTo) where.invitedAt.lte = query.invitedAtTo;
    }

    const [total, rows] = await Promise.all([
      this.prismaService.user.count({ where }),
      this.prismaService.user.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: query.orderBy,
      }),
    ]);

    let commissionMap = {};

    if (rows.length > 0) {
      const resultCommission = await this.prismaService.commission.groupBy({
        by: ['fromUserId'],
        where: {
          toUserId: query.userId,
          fromUserId: { in: rows.map((r) => r.id) },
        },
        _sum: {
          amount: true,
        },
      });

      commissionMap = resultCommission.reduce((acc, r) => {
        acc[r.fromUserId] = r._sum.amount;
        return acc;
      }, {});
    }

    return {
      total,
      rows: rows.map((user) => ({
        ...user,
        totalCommission: commissionMap[user.id] ?? 0,
        type: getFriendTypeByHierarchy(user.hierarchy, query.userId),
      })),
    };
  }

  async getFriendDetail(userId: string, friendId: string) {
    const friend = await this.prismaService.user.findUnique({
      where: {
        id: friendId,
        hierarchy: {
          endsWith: getUserHierachyByType(userId, FRIEND_TYPE.ALL),
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        walletAddress: true,
        refCode: true,
        hierarchy: true,
        invitedAt: true,
      },
    });

    if (!friend) {
      throw new BadRequestException('Friend not found');
    }

    const [result1, result2] = await Promise.all([
      this.prismaService.insurance.groupBy({
        by: ['userId'],
        where: {
          userId: friendId,
          state: {
            notIn: [InsuranceState.INVALID, InsuranceState.PENDING],
          },
          createdAt: {
            gte: friend.invitedAt,
          },
        },
        _sum: {
          margin: true,
        },
        _count: {
          id: true,
        },
      }),
      this.prismaService.commission.groupBy({
        by: ['fromUserId'],
        where: {
          toUserId: userId,
          fromUserId: friendId,
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    const totalCommission = result2[0]?._sum.amount ?? 0;
    const totalMargin = result1[0]?._sum.margin ?? 0;
    const totalContract = result1[0]?._count.id ?? 0;

    const friendType = getFriendTypeByHierarchy(friend.hierarchy, userId);
    const metadata: Record<string, any> = { friendType };
    if (friendType === 1) {
      const referralCode = await this.prismaService.referralCode.findUnique({
        where: {
          code: friend.refCode,
        },
      });
      if (referralCode) {
        metadata.referralCode = referralCode;
        const referralInfo = await this.prismaService.referralInfo.findUnique({
          where: {
            childId_parentId: {
              childId: friendId,
              parentId: userId,
            },
          },
        });
        metadata.note = referralInfo?.note ?? '';
      }
    } else {
      const parent = await this.prismaService.user.findUnique({
        where: {
          id: friend.hierarchy.split(',').pop(),
        },
      });
      metadata.parent = parent;
    }

    return {
      ...friend,
      totalCommission,
      totalMargin,
      totalContract,
      metadata,
    };
  }

  async updateReferralInfo(data: UpdateReferralInfoDto) {
    const isFriend = await this.prismaService.user.findUnique({
      where: {
        id: data.childId,
        hierarchy: {
          endsWith: getUserHierachyByType(data.parentId, FRIEND_TYPE.ALL),
        },
      },
      select: {
        id: true,
      },
    });

    if (!isFriend) {
      throw new BadRequestException('User is not your friend');
    }

    return this.prismaService.referralInfo.upsert({
      where: {
        childId_parentId: {
          childId: data.childId,
          parentId: data.parentId,
        },
      },
      update: {
        note: data.note,
      },
      create: {
        note: data.note,
        childId: data.childId,
        parentId: data.parentId,
      },
    });
  }

  async updateUserOnLogin(walletAddress: string) {
    const user = await this.prismaService.user.findUnique({
      where: { walletAddress },
    });

    if (!user) return null;

    let defaultMyRefCode = user.defaultMyRefCode;

    if (!defaultMyRefCode) {
      const referralCode = await this.referralsCodeService.createReferralCode(
        user.id,
      );
      defaultMyRefCode = referralCode.code;
    }

    return this.prismaService.user.update({
      where: { walletAddress },
      data: {
        defaultMyRefCode,
        nonce: null,
      },
    });
  }

  @OnEvent(INSURANCE_EVENTS.CREATED)
  async updateUserStatsCreatedInsurance(insurance: Insurance) {
    try {
      const userStat = await this.prismaService.userStat.upsert({
        where: {
          userId: insurance.userId,
        },
        update: {
          totalInsurance: {
            increment: 1,
          },
          totalMargin: {
            increment: insurance.margin,
          },
        },
        create: {
          userId: insurance.userId,
          totalInsurance: 1,
          totalMargin: insurance.margin,
        },
      });

      await this.updateUserStatDaily(userStat);
    } catch (error) {
      this.logger.error('update stats Error', error);
    }
  }

  @OnEvent(INSURANCE_EVENTS.UPDATED)
  async updateUserStatsUpdatedInsurance(insurance: Insurance) {
    let claimed = 0,
      refunded = 0,
      liquidated = 0,
      expired = 0,
      payback = 0,
      pnl = insurance.pnlUser;
    switch (insurance.state) {
      case InsuranceState.CLAIMED:
        claimed = 1;
        payback = insurance.q_claim;
        break;
      case InsuranceState.REFUNDED:
        refunded = 1;
        payback = insurance.margin;
        break;
      case InsuranceState.LIQUIDATED:
        liquidated = 1;
        break;
      case InsuranceState.EXPIRED:
        expired = 1;
        break;
      case InsuranceState.CANCELLED:
        payback = insurance.margin;
        break;
      default:
        return;
    } 
    try {
      const userStat = await this.prismaService.userStat.upsert({
        where: {
          userId: insurance.userId,
        },
        update: {
          totalInsuranceClosed: {
            increment: 1,
          },
          totalInsuranceClaimed: {
            increment: claimed,
          },
          totalInsuranceRefunded: {
            increment: refunded,
          },
          totalInsuranceLiquidated: {
            increment: liquidated,
          },
          totalInsuranceExpired: {
            increment: expired,
          },
          totalPayback: {
            increment: payback,
          },
          totalPnl: {
            increment: pnl,
          },
        },
        create: {
          userId: insurance.userId,
          totalInsurance: 1,
          totalMargin: insurance.margin,
          totalInsuranceClaimed: claimed,
          totalInsuranceClosed: 1,
          totalInsuranceExpired: expired,
          totalInsuranceLiquidated: liquidated,
          totalInsuranceRefunded: refunded,
          totalPayback: payback,
          totalPnl: pnl,
        },
      });

      await this.updateUserStatDaily(userStat);
    } catch (error) {
      this.logger.error('update stats Error', error);
    }
  }

  @Cron('59 23 * * *', {
    // 23:59 UTC
    timeZone: 'UTC',
  })
  async updateUserStatsDaily() {
    const insurances = await this.prismaService.insurance.groupBy({
      by: ['userId'],
      where: {
        state: {
          notIn: [InsuranceState.PENDING, InsuranceState.INVALID],
        },
      },
    });
    const startOfDay = dayjs.utc().startOf('day').toDate();

    for (const ins of insurances) {
      const userStat = await this.prismaService.userStat.findUnique({
        where: {
          userId: ins.userId,
        },
      });

      if (!userStat) {
        continue;
      }

      await this.updateUserStatDaily(userStat, startOfDay);
    }
  }

  private async updateUserStatDaily(
    userStat: UserStat,
    startOfDay: Date = dayjs.utc().startOf('day').toDate(),
  ) {
    const updateData = {
      totalInsurance: userStat.totalInsurance,
      totalInsuranceClosed: userStat.totalInsuranceClosed,
      totalInsuranceClaimed: userStat.totalInsuranceClaimed,
      totalInsuranceRefunded: userStat.totalInsuranceRefunded,
      totalInsuranceLiquidated: userStat.totalInsuranceLiquidated,
      totalInsuranceExpired: userStat.totalInsuranceExpired,
      totalMargin: userStat.totalMargin,
      totalPayback: userStat.totalPayback,
      totalPnl: userStat.totalPnl,
    };

    return await this.prismaService.userStatDaily.upsert({
      where: {
        userId_time: {
          userId: userStat.userId,
          time: startOfDay,
        },
      },
      update: updateData,
      create: {
        userId: userStat.userId,
        time: startOfDay,
        ...updateData,
      },
    });
  }

  async getUserStats(userId: string) {
    return await this.prismaService.userStat.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
    });
  }

  getUserStatsDaily(query: UserStatsDailyQueryDto) {
    const where: Prisma.UserStatDailyWhereInput = {
      userId: query.userId,
      time: {
        gte: query.from,
        lte: query.to,
      },
    };

    return this.prismaService.userStatDaily.findMany({
      where,
      orderBy: {
        time: 'asc',
      },
    });
  }
}
