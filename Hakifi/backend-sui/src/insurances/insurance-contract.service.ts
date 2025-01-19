import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config, ContractConfig } from 'src/configs/config.interface';
import dayjs from 'dayjs';
import { PrismaService } from 'nestjs-prisma';
import {
  Insurance,
  InsuranceState,
  StateLog,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import { InsuranceHelper } from './insurance.helper';
import {
  INVALID_REASONS,
  IsuranceContractType,
} from './constant/insurance.contant';
import { PriceService } from 'src/price/price.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { INSURANCE_EVENTS } from 'src/common/constants/event';
import { TransactionsService } from 'src/transactions/transactions.service';

import { floor } from 'src/common/helpers/utils';
import { isMongoId } from 'class-validator';
import { BinanceService } from 'src/binance/binance.service';

import { getFullnodeUrl, SuiClient, SuiHTTPTransport } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';

@Injectable()
export class InsuranceContractService implements OnModuleInit {
  logger = new Logger(InsuranceContractService.name);

  private decimals = 100;

  private client: SuiClient;

  private packageId: string;
  private insuranceObject: string;
  private moderatorObject: string;
  private coinType: string;
  private keyPair: Ed25519Keypair;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService<Config>,
    private readonly priceService: PriceService,
    private readonly insuranceHelper: InsuranceHelper,
    private readonly eventEmitter: EventEmitter2,
    private readonly transactionService: TransactionsService,
    private readonly binanceService: BinanceService,
  ) {
    const config = this.configService.get<ContractConfig>('contract');
    this.packageId = config.packageId;
    this.insuranceObject = config.insuranceObject;
    this.moderatorObject = config.moderatorObject;
    this.coinType = config.coinType;
    this.keyPair = Ed25519Keypair.deriveKeypair(config.mnemonic, "m/44'/784'/0'/0'/0'");
    this.client = new SuiClient({
      url: config.rpc_url,
    });
 }

  onModuleInit() {
    // this.initEvents();
  }

  // private async initEvents() {
  //   await this.client.subscribeEvent({
  //     filter: {
  //       Package: this.packageId,
  //     },
  //     onMessage: (event) => {
  //       this.onEventInsurance(event);
  //     },
  //   });
  // }

  async getTransactionBlock(tx: string) {
    const data = await this.client.getTransactionBlock({
      digest:tx,
      options: {
        showEvents:true,
      }
    });
    this.onEventInsurance(tx, data.events[0].parsedJson); 
  }

  private onEventInsurance(tx:string, event) {
    //todo: get event when update txhash   
    const id = event.id_insurance as string;
    const address = event.buyer as string;
    const margin = Number(event.margin) / this.decimals;
    const eventType = event.event_type as number;
    const txhash = tx;
    const unit = 'USDT';
    this.logger.debug('onEventInsurance:', {
      eventType,
      id,
      address,
      margin,
      txhash,
    });

    if (!isMongoId(id)) {
      return;
    }

    switch (eventType) {
      case IsuranceContractType.CREATE: // CREATE
        this.logger.debug('onContractCreated');
        this.onContractCreated(id, address, unit, margin, txhash);
        break;
      case IsuranceContractType.UPDATE_AVAILABLE: // UPDATE_AVAILABLE
        break;
      case IsuranceContractType.UPDATE_INVALID: // UPDATE_INVALID
        break;
      case IsuranceContractType.REFUND: // REFUND
        // this.logger.debug('onContractStateChanged', {
        //   id,
        //   state: InsuranceState.REFUNDED,
        //   txhash,
        // });
        // this.onContractStateChanged(id, InsuranceState.REFUNDED, txhash);
        break;
      case IsuranceContractType.CANCEL: // CANCEL
        break;
      case IsuranceContractType.CLAIM: // CLAIM
        // this.logger.debug('onContractStateChanged', {
        //   id,
        //   state: InsuranceState.CLAIMED,
        //   txhash,
        // });
        // this.onContractStateChanged(id, InsuranceState.CLAIMED, txhash);
        break;
      case IsuranceContractType.EXPIRED: // EXPIRED
        break;
      case IsuranceContractType.LIQUIDATED: // LIQUIDATED
        break;
      default:
        break;
    }
  }


  /**
   * Handles the event when a contract is created.
   * @param id - The ID of the contract.
   * @param address - The address of the contract.
   * @param unit - The unit of the contract.
   * @param margin - The margin of the contract.
   * @param txhash - The transaction hash of the contract.
   */
  private async onContractCreated(
    id: string,
    address: string,
    unit: string,
    margin: number,
    txhash: string,
  ) {
    const insurance = await this.prismaService.insurance.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            walletAddress: true,
          },
        },
      },
    });

    if (!insurance) {
      return;
    }

    this.updateTxhash(id, txhash);

    const isLocked = await this.insuranceHelper.isInsuranceLocked(id);
    if (isLocked) {
      this.logger.warn(`Insurance ${id} is locked`);
      return;
    }

    if (insurance.state !== InsuranceState.PENDING) {
      this.logger.warn(`Insurance ${id} is not pending`);
      return;
    }

    let invalidReason;
    let payback = false;
    if (margin !== insurance.margin) {
      invalidReason = INVALID_REASONS.INVALID_MARGIN;
    } else if (insurance.user?.walletAddress !== address) {
      invalidReason = INVALID_REASONS.INVALID_WALLET_ADDRESS;
    } else if (dayjs().diff(insurance.createdAt, 'seconds') > 60) {
      invalidReason = INVALID_REASONS.CREATED_TIME_TIMEOUT;
      payback = true;
    } else if (insurance.unit !== unit) {
      invalidReason = INVALID_REASONS.INVALID_UNIT;
    }

    if (!!invalidReason) {
      this.invalidateInsurance(id, invalidReason, payback, address);
      return;
    }
    try {
      insurance.txhash = txhash;
      await this.availableInsurance(insurance);
    } catch (error) {
      this.logger.error('Error when availableInsurance: ' + error.message);
    }
  }

  async onContractStateChanged(
    id: string,
    state: InsuranceState,
    txhash?: string,
  ) {
    try {
      const updated = await this.prismaService.insurance.update({
        where: { id, state: { not: state } },
        data: {
          state,
          closedAt: new Date(),
        },
      });

      if (updated) {
        this.eventEmitter.emit(INSURANCE_EVENTS.UPDATED, updated);
        this.addStateLog(id, {
          state,
          time: new Date(),
          txhash,
          error: null,
        });
      }
    } catch (error) {
      this.logger.error('Error when onContractStateChanged: ' + error.message);
    }
  }

  async invalidateInsurance(
    id: string,
    invalidReason: string = '',
    payback = true,
    creatorAdress: string,
  ) {
    const tx = new TransactionBlock();
    this.logger.log(`Invalidate Insurance ${id}`);
    await this.insuranceHelper.lockInsurance(id, async () => {
      await this.prismaService.insurance.update({
        where: { id },
        data: {
          state: InsuranceState.INVALID,
          invalidReason,
          closedAt: new Date(),
        },
      });

      let hash: string;
      let error: string;
      if (payback) {
        try {
          tx.moveCall({
            target: `${this.packageId}::HAKIFI::update_invalid_insurance`,
            arguments: [
              tx.object(this.moderatorObject),
              tx.object(this.insuranceObject),
              tx.pure.string(id)
            ],
            typeArguments: [this.coinType],
          });
          const result = await this.client.signAndExecuteTransactionBlock({
            signer: this.keyPair,
            transactionBlock: tx,
          });
          hash = result.digest;
        } catch (e) {
          this.logger.error('Error when updateInvalidInsurance: ' + e.message);
          error = e.message;
        }
      }

      this.addStateLog(id, {
        state: InsuranceState.INVALID,
        txhash: hash,
        error,
        time: new Date(),
      });
    });
  }

  async availableInsurance(insurance: Insurance) {
    await this.insuranceHelper.lockInsurance(insurance.id, async () => {
      const symbol = `${insurance.asset}${insurance.unit}`;
      const currentPrice = await this.priceService.getFuturePrice(symbol);

      const {
        expiredAt,
        hedge,
        p_liquidation,
        q_claim,
        systemCapital,
        p_refund,
        leverage,
        p_cancel,
      } = this.insuranceHelper.calculateInsuranceParams({
        margin: insurance.margin,
        q_covered: insurance.q_covered,
        p_open: currentPrice,
        p_claim: insurance.p_claim,
        period: insurance.period,
        periodUnit: insurance.periodUnit,
        periodChangeRatio: insurance.periodChangeRatio,
      });
      let updatedInsurance: Insurance;

      const futureQuantity = this.insuranceHelper.calculatFutureQuantity({
        hedge,
        margin: insurance.margin,
        p_claim: insurance.p_claim,
        p_open: currentPrice,
        periodChangeRatio: insurance.periodChangeRatio,
      });
      try {
        updatedInsurance = await this.prismaService.insurance.update({
          where: { id: insurance.id, state: { not: InsuranceState.AVAILABLE } },
          data: {
            state: InsuranceState.AVAILABLE,
            p_open: currentPrice,
            p_liquidation,
            q_claim,
            systemCapital,
            p_refund,
            p_cancel,
            leverage,
            expiredAt,
            hedge,
            futureQuantity,
          },
        });
      } catch (error) {
        return;
      }

      if (!updatedInsurance) return;

      this.transactionService.create({
        amount: insurance.margin,
        insuranceId: insurance.id,
        status: TransactionStatus.SUCCESS,
        txhash: insurance.txhash,
        type: TransactionType.MARGIN,
        unit: insurance.unit,
        userId: insurance.userId,
      });

      this.eventEmitter.emit(INSURANCE_EVENTS.CREATED, updatedInsurance);

      await this.availableContractInsurance(updatedInsurance);

      //TODO: Transfer To Binance
      if (updatedInsurance.canTransferBinance) {
        this.binanceService.order(updatedInsurance);
      }
      //End TODO

    });
  }

  async availableContractInsurance(insurance: Insurance) {
    let hash: string;
    let error: string;
    const tx = new TransactionBlock();
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: insurance.userId },
        select: {
          walletAddress: true,
        },
      });
      if (!user) throw new Error('User not found');

      const q_claim = floor(insurance.q_claim * this.decimals, 0);      
      tx.moveCall({
        target: `${this.packageId}::HAKIFI::update_available_insurance`,
        arguments: [
          tx.object(this.moderatorObject),
          tx.object(this.insuranceObject),
          tx.pure.string(insurance.id),
          tx.pure.u64(q_claim),
          tx.pure.u64(dayjs(insurance.expiredAt).unix())
        ],
        typeArguments: [this.coinType],
      });
      const result = await this.client.signAndExecuteTransactionBlock({
        signer: this.keyPair,
        transactionBlock: tx,
      });
      hash = result.digest;
    } catch (e) {
      this.logger.error(
        'Smart Contract updateAvailableInsurance Error: ' + e.message,
      );
      error = e.message;
    }

    this.addStateLog(insurance.id, {
      state: InsuranceState.AVAILABLE,
      txhash: hash,
      error,
      time: new Date(),
    });
  }

  async cancelInsurance(insurance: Insurance, p_close: number) {
    let updatedInsurance: Insurance;
    let tx = new TransactionBlock();
    await this.insuranceHelper.lockInsurance(insurance.id, async () => {
      updatedInsurance = await this.prismaService.insurance.update({
        where: { id: insurance.id, state: { not: InsuranceState.CANCELLED } },
        data: {
          state: InsuranceState.CANCELLED,
          p_close,
          closedAt: new Date(),
          pnlProject: insurance.pnlBinance - insurance.pnlUser,
        },
      });
      if (!updatedInsurance) return;
      this.eventEmitter.emit(INSURANCE_EVENTS.UPDATED, updatedInsurance);

      let hash: string;
      let error: string;
      try {
        const user = await this.prismaService.user.findUnique({
          where: { id: insurance.userId },
          select: {
            walletAddress: true,
          },
        });
        if (!user) throw new Error('User not found');
        tx.moveCall({
          target: `${this.packageId}::HAKIFI::cancel`,
          arguments: [
            tx.object(this.moderatorObject),
            tx.object(this.insuranceObject),
            tx.pure.string(insurance.id)
          ],
          typeArguments: [this.coinType],
        });
        const result = await this.client.signAndExecuteTransactionBlock({
          signer: this.keyPair,
          transactionBlock: tx,
        });
        hash = result.digest;
      } catch (e) {
        this.logger.error('Error when cancelInsurance: ' + e.message);
        error = e.message;
      }

      if (hash) {
        this.transactionService.create({
          amount: insurance.margin,
          insuranceId: insurance.id,
          status: TransactionStatus.SUCCESS,
          txhash: hash,
          type: TransactionType.CANCEL,
          unit: insurance.unit,
          userId: insurance.userId,
        });
      }

      this.addStateLog(insurance.id, {
        state: InsuranceState.CANCELLED,
        txhash: hash,
        error,
        time: new Date(),
      });
    });
    return updatedInsurance;
  }

  public async claimInsurance(insurance: Insurance, currentPrice: number) {
    let updatedInsurance: Insurance;
    await this.insuranceHelper.lockInsurance(insurance.id, async () => {
      const pnlUser = insurance.q_claim - insurance.margin;
      updatedInsurance = await this.prismaService.insurance.update({
        where: {
          id: insurance.id,
          state: { not: InsuranceState.CLAIM_WAITING },
        },
        data: {
          state: InsuranceState.CLAIM_WAITING,
          p_close: currentPrice,
          pnlUser,
          pnlProject: insurance.pnlBinance - pnlUser,
        },
      });
      if (!updatedInsurance) return;
      this.eventEmitter.emit(INSURANCE_EVENTS.UPDATED, updatedInsurance);

      await this.claimContractInsurance(insurance);
    });
    return updatedInsurance;
  }

  public async claimContractInsurance(insurance: Insurance) {
    let hash: string;
    let error: string;
    try {
      const tx = new TransactionBlock();
      const user = await this.prismaService.user.findUnique({
        where: { id: insurance.userId },
        select: {
          walletAddress: true,
        },
      });
      if (!user) throw new Error('User not found');
      tx.moveCall({
        target: `${this.packageId}::HAKIFI::claim`,
        arguments: [
          tx.object(this.moderatorObject),
          tx.object(this.insuranceObject),
          tx.pure.string(insurance.id)
        ],
        typeArguments: [this.coinType],
      });
      const result = await this.client.signAndExecuteTransactionBlock({
        signer: this.keyPair,
        transactionBlock: tx,
      });
      hash = result.digest;
    } catch (e) {
      this.logger.error('Smart Contract claimInsurance Error: ' + e.message);
      error = e.message;
    }

    await this.addStateLog(insurance.id, {
      state: InsuranceState.CLAIM_WAITING,
      txhash: hash,
      error,
      time: new Date(),
    });

    if (hash) {
      this.transactionService.create({
        amount: insurance.q_claim,
        insuranceId: insurance.id,
        status: TransactionStatus.SUCCESS,
        txhash: hash,
        type: TransactionType.CLAIM,
        unit: insurance.unit,
        userId: insurance.userId,
      });

      await this.onContractStateChanged(
        insurance.id,
        InsuranceState.CLAIMED,
        hash,
      );
    }
  }

  public async refundInsurance(insurance: Insurance, p_close: number) {
    let updatedInsurance: Insurance;
    await this.insuranceHelper.lockInsurance(insurance.id, async () => {
      updatedInsurance = await this.prismaService.insurance.update({
        where: {
          id: insurance.id,
          state: { not: InsuranceState.REFUND_WAITING },
        },
        data: {
          state: InsuranceState.REFUND_WAITING,
          p_close,
          closedAt: new Date(),
          pnlProject: insurance.pnlBinance - insurance.pnlUser,
        },
      });
      if (!updatedInsurance) return;
      this.eventEmitter.emit(INSURANCE_EVENTS.UPDATED, updatedInsurance);

      await this.refundContractInsurance(insurance);
    });
    return updatedInsurance;
  }

  public async refundContractInsurance(insurance: Insurance) {
    let hash: string;
    let error: string;
    try {
      const tx = new TransactionBlock();
      const user = await this.prismaService.user.findUnique({
        where: { id: insurance.userId },
        select: {
          walletAddress: true,
        },
      });
      if (!user) throw new Error('User not found');
      tx.moveCall({
        target: `${this.packageId}::HAKIFI::refund`,
        arguments: [
          tx.object(this.moderatorObject),
          tx.object(this.insuranceObject),
          tx.pure.string(insurance.id)
        ],
        typeArguments: [this.coinType],
      });
      const result = await this.client.signAndExecuteTransactionBlock({
        signer: this.keyPair,
        transactionBlock: tx,
      });
      hash = result.digest;
    } catch (e) {
      this.logger.error('Smart Contract refundInsurance Error: ' + e.message);
      error = e.message;
    }

    await this.addStateLog(insurance.id, {
      state: InsuranceState.REFUND_WAITING,
      txhash: hash,
      error,
      time: new Date(),
    });

    if (hash) {
      this.transactionService.create({
        amount: insurance.margin,
        insuranceId: insurance.id,
        status: TransactionStatus.SUCCESS,
        txhash: hash,
        type: TransactionType.REFUND,
        unit: insurance.unit,
        userId: insurance.userId,
      });

      await this.onContractStateChanged(
        insurance.id,
        InsuranceState.REFUNDED,
        hash,
      );
    }
  }

  public async liquidatedOrExpiredInsurance(
    insurance: Insurance,
    state: InsuranceState,
    p_close: number,
  ) {
    let updatedInsurance: Insurance;
    const tx = new TransactionBlock();
    await this.insuranceHelper.lockInsurance(insurance.id, async () => {
      const pnlUser = -insurance.margin;
      updatedInsurance = await this.prismaService.insurance.update({
        where: { id: insurance.id, state: { not: state } },
        data: {
          state,
          p_close,
          closedAt: new Date(),
          pnlUser,
          pnlProject: insurance.pnlBinance - pnlUser,
        },
      });

      if (!updatedInsurance) return;

      this.eventEmitter.emit(INSURANCE_EVENTS.UPDATED, updatedInsurance);

      let hash: string;
      let error: string;
      try {
        const user = await this.prismaService.user.findUnique({
          where: { id: insurance.userId },
          select: {
            walletAddress: true,
          },
        });
        if (!user) throw new Error('User not found');

        switch (state) {
          case InsuranceState.LIQUIDATED:
            tx.moveCall({
              target: `${this.packageId}::HAKIFI::liquidate`,
              arguments: [
                tx.object(this.moderatorObject),
                tx.object(this.insuranceObject),
                tx.pure.string(insurance.id)
              ],
              typeArguments: [this.coinType],
            });
            const liquidateResult = await this.client.signAndExecuteTransactionBlock({
              signer: this.keyPair,
              transactionBlock: tx,
            });
            hash = liquidateResult.digest;
            break;
          case InsuranceState.EXPIRED:
            tx.moveCall({
              target: `${this.packageId}::HAKIFI::expire`,
              arguments: [
                tx.object(this.moderatorObject),
                tx.object(this.insuranceObject),
                tx.pure.string(insurance.id)
              ],
              typeArguments: [this.coinType],
            });
            const expireResult = await this.client.signAndExecuteTransactionBlock({
              signer: this.keyPair,
              transactionBlock: tx,
            });
            hash = expireResult.digest;
            break;
        }
      } catch (e) {
        this.logger.error(
          'Smart Contract liquidatedOrExpiredInsurance Error: ' + e.message,
        );
        error = e.message;
      }

      this.addStateLog(insurance.id, {
        state,
        txhash: hash,
        error,
        time: new Date(),
      });
    });
    return updatedInsurance;
  }

  private async updateTxhash(id: string, txhash: string) {
    try {
      await this.prismaService.insurance.update({
        where: { id },
        data: {
          txhash,
        },
      });
    } catch (error) {
      this.logger.error('Error when update txhash: ' + error.message);
    }
  }

  private async addStateLog(id: string, stateLog: StateLog) {
    try {
      const ins = await this.prismaService.insurance.update({
        where: { id },
        data: {
          stateLogs: {
            push: stateLog,
          },
        },
      });
      return ins;
    } catch (error) {
      this.logger.error('addStateLog Error: ', error);
    }
  }

  async getObject(id: string) {
    const insurance = await this.prismaService.insurance.findUnique({
      where: { id },
      select: { txhash: true }
    });
    const data = await this.client.getTransactionBlock({
      digest: insurance.txhash,
      options: {
        showObjectChanges: true
      }
    });
    const result = data.objectChanges.find(item => item["objectType"].includes("UserInsurance"));
    const user = await this.client.getObject({
      id: result['objectId'],
      options: {
        showContent: true,
      }
    });
    return user.data.content['fields'].value.fields;

  }

  async getInsuranceContract(id: string) {    
    try {
      const data = await this.getObject(id);
      return {
        id: data.id_insurance as string,
        address: data.buyer as string,
        margin: Number(data.margin) / this.decimals,
        unit: 'USDT',
        q_claim: Number(data.claimAmount) / this.decimals,
        state: Number(data.state),
        valid: data.valid,
      };
    } catch (error) {
      return null;
    }
  }
}
