import { Injectable, Logger } from '@nestjs/common';
import { Insurance, InsuranceState, UserStatDaily } from '@prisma/client';
import dayjs from 'dayjs';

import { Command, Positional } from 'nestjs-command';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersCommand {
  private readonly logger = new Logger(UsersCommand.name);
  constructor(private readonly prismaService: PrismaService) {}

  @Command({
    command: 'user:sync_user_stats',
    describe: 'Sync user stats',
  })
  async syncUserStats() {
    const results = (await this.prismaService.insurance.aggregateRaw({
      pipeline: [
        {
          $match: {
            state: {
              $nin: ['INVALID', 'PENDING'],
            },
          },
        },
        {
          $addFields: {
            claimed: {
              $cond: [
                {
                  $in: ['$state', ['CLAIMED', 'CLAIM_WAITING']],
                },
                '$q_claim',
                0,
              ],
            },
            refunded: {
              $cond: [
                {
                  $in: ['$state', ['REFUNDED', 'REFUND_WAITING']],
                },
                '$margin',
                0,
              ],
            },
          },
        },
        {
          $group: {
            _id: {
              $toString: '$userId',
            },
            totalInsurance: {
              $sum: 1,
            },
            totalInsuranceClosed: {
              $sum: {
                $cond: [
                  {
                    $ne: ['$state', 'AVAILABLE'],
                  },
                  1,
                  0,
                ],
              },
            },
            totalInsuranceClaimed: {
              $sum: {
                $cond: [
                  {
                    $in: ['$state', ['CLAIMED', 'CLAIM_WAITING']],
                  },
                  1,
                  0,
                ],
              },
            },
            totalInsuranceRefunded: {
              $sum: {
                $cond: [
                  {
                    $in: ['$state', ['REFUNDED', 'REFUND_WAITING']],
                  },
                  1,
                  0,
                ],
              },
            },
            totalInsuranceLiquidated: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$state', 'LIQUIDATED'],
                  },
                  1,
                  0,
                ],
              },
            },
            totalInsuranceExpired: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$state', 'EXPIRED'],
                  },
                  1,
                  0,
                ],
              },
            },
            totalMargin: {
              $sum: '$margin',
            },
            totalPayback: {
              $sum: {
                $add: ['$claimed', '$refunded'],
              },
            },
            totalPnl: {
              $sum: '$pnlUser',
            },
          },
        },
      ],
    })) as any;

    for (const result of results) {
      const userId = result._id;
      delete result._id;
      await this.prismaService.userStat.upsert({
        where: {
          userId,
        },
        update: result,
        create: {
          userId,
          ...result,
        },
      });
      console.log(`Sync user ${userId} stats`);
    }
    console.log(`Sync ${results.length} users`);
  }

  @Command({
    command: 'user:sync_user_daily_stats',
    describe: 'Sync user stats',
  })
  async syncUserStatDaily(
    @Positional({
      name: 'userId',
      describe: 'User Id',
      type: 'string',
    })
    userId: string,
  ) {
    const insurances = await this.prismaService.insurance.findMany({
      where: {
        userId,
        state: {
          notIn: [InsuranceState.PENDING, InsuranceState.INVALID],
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (insurances.length === 0) {
      return;
    }

    let date = insurances[0].createdAt;

    const today = new Date();

    const userStat = {
      totalInsurance: 0,
      totalInsuranceClosed: 0,
      totalInsuranceClaimed: 0,
      totalInsuranceRefunded: 0,
      totalInsuranceLiquidated: 0,
      totalInsuranceExpired: 0,
      totalMargin: 0,
      totalPayback: 0,
      totalPnl : 0,
    };

    while (dayjs(date).isBefore(today)) {
      const startOfDay = dayjs.utc(date).startOf('day').toDate();
      const ins = insurances.filter((i) =>
        dayjs.utc(i.createdAt).isSame(startOfDay, 'day'),
      );
      for (const insurance of ins) {
        userStat.totalInsurance += 1;
        if (insurance.state !== InsuranceState.AVAILABLE) {
          userStat.totalInsuranceClosed += 1;
        }
        if (
          insurance.state === InsuranceState.CLAIMED ||
          insurance.state === InsuranceState.CLAIM_WAITING
        ) {
          userStat.totalInsuranceClaimed += 1;
          userStat.totalPayback += insurance.q_claim;
        }
        if (
          insurance.state === InsuranceState.REFUNDED ||
          insurance.state === InsuranceState.REFUND_WAITING
        ) {
          userStat.totalInsuranceRefunded += 1;
          userStat.totalPayback += insurance.margin;
        }
        if (insurance.state === InsuranceState.LIQUIDATED) {
          userStat.totalInsuranceLiquidated += 1;
        }
        if (insurance.state === InsuranceState.EXPIRED) {
          userStat.totalInsuranceExpired += 1;
        }
        userStat.totalPnl += insurance.pnlUser;
        userStat.totalMargin += insurance.margin;
      }

      date = dayjs.utc(date).add(1, 'day').toDate();
      await this.prismaService.userStatDaily.upsert({
        where: {
          userId_time: {
            userId,
            time: startOfDay,
          },
        },
        update: userStat,
        create: {
          userId,
          time: startOfDay,
          ...userStat,
        },
      });
    }
    console.log(`Sync user ${userId} daily stats`);
  }

  @Command({
    command: 'user:sync_user_daily_stats_all',
    describe: 'Sync all user daily stats',
  })
  async syncUserStatDailyAll() {
    const results = await this.prismaService.insurance.groupBy({
      by: ['userId'],
    });

    for (const result of results) {
      const userId = result.userId;
      await this.syncUserStatDaily(userId);
    }
    console.log(`Sync ${results.length} users`);
  }
}
