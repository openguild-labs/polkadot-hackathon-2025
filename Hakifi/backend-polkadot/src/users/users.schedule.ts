import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Cron } from '@nestjs/schedule';
import { InsuranceState, Prisma } from '@prisma/client';
import {
  getFriendTypeByHierarchy,
  getUserHierachyByType,
  getUserLevelByTotalFriendMargin,
} from './users.utils';
import { FRIEND_TYPE } from './type/referral.type';
import dayjs from 'dayjs';

const ARISING_LEVEL_MARGIN_RATE = {
  1: 0.1,
  2: 0.05,
  3: 0.03,
  4: 0.01,
};

@Injectable()
export class UsersSchedule {
  private readonly logger = new Logger(UsersSchedule.name);
  constructor(private readonly prismaService: PrismaService) {}

  // Cron job to upgrade user level
  @Cron('0 * * * *')
  async upgradeUserLevelCron() {
    this.logger.log('Running cron job to upgrade user...');
    let skip = 0,
      limit = 100;

    const where: Prisma.UserWhereInput = {
      totalFriends: { gt: 0 },
      level: { lt: 9 },
    };

    const total = await this.prismaService.user.count({ where });

    while (skip < total) {
      const users = await this.prismaService.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          isPartner: true,
          level: true,
          userStat: true,
        },
      });

      for (const user of users) {
        try {
          // Lấy danh sách bạn bè của user
          const friends = await this.prismaService.user.findMany({
            where: {
              hierarchy: {
                endsWith: user.isPartner
                  ? getUserHierachyByType(user.id, FRIEND_TYPE.ALL)
                  : getUserHierachyByType(user.id, FRIEND_TYPE.F1),
              },
            },
            select: {
              id: true,
              hierarchy: true,
              invitedAt: true,
            },
          });
          if (!friends.length) continue;

          // Tính toán tổng margin của bạn bè với điều kiện state không phải là INVALID và thời gian tạo hợp đồng sau thời gian kiểm tra level cuối cùng
          let totalMargin = 0;
          for (const friend of friends) {
            const checkTime = user.userStat?.lastCheckLevelTime ?? new Date(0);
            const invitedAt = friend.invitedAt ?? new Date(0);
            const isCheckTimeAfterInvitedTime =
              dayjs(checkTime).isAfter(invitedAt);

            const result = await this.prismaService.insurance.groupBy({
              by: ['userId'],
              where: {
                userId: friend.id,
                state: {
                  notIn: [InsuranceState.INVALID, InsuranceState.PENDING],
                },
                createdAt: {
                  gte: isCheckTimeAfterInvitedTime ? checkTime : invitedAt,
                },
              },
              _sum: {
                margin: true,
              },
            });
            if (!result.length) continue;

            // Tính toán tổng margin của tất cả bạn bè theo tỉ lệ tương ứng với F1, F2, F3, F4
            const friendType = getFriendTypeByHierarchy(
              friend.hierarchy,
              user.id,
            );
            if (!friendType) continue;
            const rate = ARISING_LEVEL_MARGIN_RATE[friendType];

            if (!rate) continue;
            const margin = result[0]?._sum?.margin ?? 0;

            totalMargin += rate * margin;
          }

          // Cập nhật userStat với totalFriendsMargin mới và lastCheckLevelTime mới
          const userStat = await this.prismaService.userStat.upsert({
            where: { userId: user.id },
            update: {
              totalFriendsMargin:
                (user.userStat?.totalFriendsMargin || 0) + totalMargin,
              lastCheckLevelTime: new Date(),
            },
            create: {
              userId: user.id,
              totalFriendsMargin: totalMargin,
              lastCheckLevelTime: new Date(),
            },
          });

          // Cập nhật level mới cho user nếu cần
          const level = getUserLevelByTotalFriendMargin(
            userStat.totalFriendsMargin,
          );

          if (level > user.level) {
            await this.prismaService.user.update({
              where: { id: user.id },
              data: { level },
            });
          }
        } catch (error) {
          this.logger.error(
            `Error while upgrading user level for user ${user.id}`,
            error,
          );
        }
      }
      skip += limit;
    }

    this.logger.log('Cron job to upgrade user completed');
  }
}
