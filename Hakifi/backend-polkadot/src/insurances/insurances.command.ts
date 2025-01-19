import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { InsuranceState } from '@prisma/client';
import { Command } from 'nestjs-command';

@Injectable()
export class InsurancesCommand {
  private readonly logger = new Logger(InsurancesCommand.name);
  constructor(private readonly prismaService: PrismaService) {}

  @Command({
    command: 'insurance:sync_pnl',
    describe: 'Sync pnl of each insurance',
  })
  async syncInsurancePnl() {
    const insurances = await this.prismaService.insurance.findMany({
      where: {
        state: {
          notIn: [InsuranceState.PENDING, InsuranceState.INVALID],
        },
      },
      select: {
        id: true,
        margin: true,
        q_claim: true,
        state: true,
        pnlUser: true,
        pnlProject: true,
        pnlBinance: true,
      },
    });

    for (const insurance of insurances) {
      let pnlUser = 0;

      switch (insurance.state) {
        case InsuranceState.CLAIMED:
        case InsuranceState.CLAIM_WAITING:
          pnlUser = insurance.q_claim - insurance.margin;
          break;
        case InsuranceState.EXPIRED:
        case InsuranceState.LIQUIDATED:
          pnlUser = -insurance.margin;
          break;
        default:
          break;
      }
      const pnlProject = insurance.pnlBinance - pnlUser;
      if (
        pnlUser !== insurance.pnlUser ||
        pnlProject !== insurance.pnlProject
      ) {
        await this.prismaService.insurance.update({
          where: {
            id: insurance.id,
          },
          data: {
            pnlProject,
            pnlUser,
          },
        });
        console.log(`Update insurance ${insurance.id} pnl`);
      }
    }
    console.log(`Sync ${insurances.length} insurances`);
  }

  @Command({
    command: 'insurance:update_q_cover_pack',
    describe: 'Update insurances without q_cover_pack_id',
  })
  async updateQCoverPack() {
    const insurances = await this.prismaService.insurance.findMany({
      select: {
        id: true,
        margin: true,
      },
    });

    for (const insurance of insurances) {
      const qCoverPack = await this.prismaService.qCoverPack.findFirst({
        where: {
          min_margin: { lte: insurance.margin },
          max_margin: { gte: insurance.margin },
        },
      });

      if (qCoverPack) {
        await this.prismaService.insurance.update({
          where: { id: insurance.id },
          data: {
            q_cover_pack_id: qCoverPack.id,
            q_covered: qCoverPack.q_cover_default,
          },
        });
        console.log(
          `Updated insurance ${insurance.id} with q_cover_pack_id ${qCoverPack.id}`,
        );
      } else {
        console.log(
          `No qCoverPack found for insurance ${insurance.id} with margin ${insurance.margin}`,
        );
      }
    }
    console.log(`Updated ${insurances.length} insurances`);
  }
}
