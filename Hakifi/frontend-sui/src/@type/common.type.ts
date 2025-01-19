export type ResponsePagination<T> = {
  rows: T[];
  total: number;
};

export type FormValue = {
  unit: string;
  side: string;
  p_claim: number;
  q_covered: number;
  margin: number;
  period: number;
  periodUnit: string;
};

export type SeoConfig = { [key: string]: {}; };
