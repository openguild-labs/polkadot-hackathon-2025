import { Insurance } from '@/@type/insurance.type';
import request from './request/instance';

type CreateInsuranceDto = {
  asset: string;
  unit: string;
  period: number;
  periodUnit: string;
  margin: number;
  q_covered: number;
  p_claim: number;
};

export const createInsurance = (data: CreateInsuranceDto) => {
  return request.post<Insurance>(`/insurances`, data);
};

export interface IGetPairsParams {
  asset?: string;
  page: number;
  q?: string;
  state?: string;
  isClosed?: boolean;
  limit?: number;
  sort?: string;
  closedFrom?: Date;
  closedTo?: Date;
  expiredFrom?: Date;
  expiredTo?: Date;
  createdFrom?: Date;
  createdTo?: Date;
  txhash?: string;
}

export const getInsuranceApi = ({ limit = 10, ...params }: IGetPairsParams) => {
  return request.get<{ rows: Insurance[], total: number; }>(`/insurances`, {
    params
  });
};

export const cancelInsuranceApi = (id: string) => {
  return request.put<Insurance>(`/insurances/${id}/cancel`);
};

export const deleteInsuranceApi = (id: string) => {
  return request.delete<Insurance>(`/insurances/pending/${id}`);
};

export const saveInsuranceTxHashApi = (id: string, txhash: string) => {
  return request.put(`/insurances/${id}/update-txhash`, {
    txhash
  });
};

