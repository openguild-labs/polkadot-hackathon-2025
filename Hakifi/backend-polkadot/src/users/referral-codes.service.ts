import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateReferralDto } from './dto/create-referral-code.dto';
import { ReferralCodeError } from './constant/referralContants';
import { userInfo } from 'os';
import { UpdateReferralDto } from './dto/update-referral-code.dto';
import { FriendsListByCodeQueryDto } from './dto/query-list-friends.dto';
import { Prisma, User } from '@prisma/client';
import { UsersService } from './users.service';

@Injectable()
export class ReferralCodesService {
  private readonly logger = new Logger(ReferralCodesService.name);
  constructor(private readonly prismaService: PrismaService) {}

  private generateCode() {
    const length = 6;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  async findOne(userId: string, code: string) {
    return await this.prismaService.referralCode.findUnique({
      where: {
        code,
        userId,
      },
    });
  }

  async generateUniqueCode() {
    let isUnique = false;
    let code = '';

    while (!isUnique) {
      code = this.generateCode();
      const existed = await this.prismaService.referralCode.findUnique({
        where: {
          code,
        },
        select: {
          id: true,
        },
      });

      isUnique = !existed;
    }
    return code;
  }

  async createReferralCode(userId: string) {
    const code = await this.generateUniqueCode();

    return this.prismaService.referralCode.create({
      data: {
        code,
        userId,
      },
    });
  }

  async createCustomReferralCode(data: CreateReferralDto) {
    const count = await this.prismaService.referralCode.count({
      where: { userId: data.userId },
    });

    if (count >= 30) {
      throw new BadRequestException(
        ReferralCodeError.EXCEEDS_THE_LIMIT_PER_USER,
      );
    }

    const existed = await this.prismaService.referralCode.findUnique({
      where: { code: data.code },
      select: { id: true },
    });

    if (existed) {
      throw new BadRequestException(ReferralCodeError.CODE_ALREADY_EXISTS);
    }

    return this.prismaService.referralCode.create({
      data: {
        code: data.code,
        userId: data.userId,
        description: data.description,
        myPercent: data.myPercent,
      },
    });
  }

  async getReferralCodes(userId: string) {
    const refCodes = await this.prismaService.referralCode.findMany({
      where: {
        userId,
      },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });
    return refCodes.map(({ _count, ...rest }) => ({
      ...rest,
      totalFriends: _count.users,
    }));
  }

  async updateReferralCode(
    userId: string,
    code: string,
    data: UpdateReferralDto,
  ) {
    const updateData = {};
    if (data.description) {
      updateData['description'] = data.description;
    }

    if (data.myPercent >= 0) {
      updateData['myPercent'] = data.myPercent;
    }
    try {
      const refCode = await this.prismaService.referralCode.update({
        where: { code, userId },
        data: updateData,
      });
      return refCode;
    } catch (error) {
      throw new NotFoundException(ReferralCodeError.INVALID_REFERRAL_CODE);
    }
  }

  // add thêm info vào list friends
  async friendsWithInfo(friends: User[], userId: string) {
    const refInfos = await this.prismaService.referralInfo.findMany({
      where: {
        parentId: userId,
        childId: {
          in: friends.map((f) => f.id),
        },
      },
      select: {
        childId: true,
        note: true,
      },
    });

    const noteMaps = refInfos.reduce((acc, refInfo) => {
      acc[refInfo.childId] = refInfo.note;
      return acc;
    }, {});

    return friends.map((f) => ({ ...f, note: noteMaps[f.id] || '' }));
  }

  async getFriendsByReferralCode(query: FriendsListByCodeQueryDto) {
    const existed = await this.prismaService.referralCode.findUnique({
      where: { code: query.code, userId: query.userId },
      select: { id: true },
    });

    if (!existed) {
      throw new NotFoundException('Referral code not found');
    }

    const where: Prisma.UserWhereInput = {
      refCode: query.code,
    };

    if (query.q) {
      where.walletAddress = {
        contains: query.q,
        mode: 'insensitive',
      };
    }

    const [total, rows] = await Promise.all([
      this.prismaService.user.count({ where }),
      this.prismaService.user.findMany({
        where,
        select: {
          id: true,
          walletAddress: true,
          invitedAt: true,
        },
        skip: query.skip,
        take: query.limit,
        orderBy: query.orderBy,
      }),
    ]);

    return {
      total,
      rows,
    };
  }
}
