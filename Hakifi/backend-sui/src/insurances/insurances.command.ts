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
}
