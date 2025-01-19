import { BaseUnit, CommissionType } from '@prisma/client';

export class CreateCommissionDto {
  insuranceId: string;
  fromUserId: string;
  toUserId: string;
  toUserLevel?: number;
  amount: number;
  asset: BaseUnit;
  type: number; //1,2,3,4 (F1, F2, F3, F4)
  commissionType: CommissionType;
}
