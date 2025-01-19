import { BaseUnit, TransactionStatus, TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  userId: string;
  txhash: string;
  insuranceId: string;
  status: TransactionStatus;
  amount: number;
  unit: BaseUnit;
  type: TransactionType;
}
