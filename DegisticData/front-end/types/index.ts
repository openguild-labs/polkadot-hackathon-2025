import { ReactHTML, ReactNode, SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Chain = {
  id: number;
  name: string;
  logo: string;
  label: string;
};

export type CreateOrder = {
  _station_ids: string[],
  _name: string,
  _sender: string,
  _receiver: string,
};

export type CreateStation = {
  _name: string,
  _total_order: string,
  _validators: string[],
}

export type InitPayment = {
  _delivery_id: string,
  _station_id: string,
  _total_amount: string,
}

export type Pay = {
  delivery_id: string,
  token: string,
  amount: string,
}

export type Validate = {
  _delivery_id: string,
  _station_id: string,
}

export type CategoryItem = {
  id: number;
  title: string;
  icon: string;
}

export type Card = {
  number: string,
  from: string,
  fromDetail: string,
  to: string,
  toDetail: string,
  buyer: string,
}



