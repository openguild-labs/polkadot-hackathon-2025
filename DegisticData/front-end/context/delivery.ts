import { DeliveryAbis } from "@/config/abis/delivery";
import { DeliveryWriteFunc } from "@/const/common.const";
import {
  CreateOrder,
  CreateStation,
  InitPayment,
  Pay,
  Validate,
} from "@/types";
import { useReadContract, useWriteContract } from "wagmi";
import { toBytes } from "viem";

const { writeContractAsync } = useWriteContract();
export async function createOrder(params: CreateOrder) {
  const { _station_ids, _name, _sender, _receiver } = params;
  const execute = await writeContractAsync({
    abi: DeliveryAbis,
    address: `0x${process.env.NEXT_PUBLIC_DELIVERY_SMART_CONTRACT_ADDRESS}`,
    functionName: DeliveryWriteFunc.CREATEORDER,
    args: [_station_ids.map((id) => toBytes(id)), _name, _sender, _receiver],
  });
}

export function deliveryInstance() {
  async function createStation(params: CreateStation) {
    const { _name, _total_order, _validators } = params;
    const execute = await writeContractAsync({
      abi: DeliveryAbis,
      address: `0x${process.env.NEXT_PUBLIC_DELIVERY_SMART_CONTRACT_ADDRESS}`,
      functionName: DeliveryWriteFunc.CREATESTATION,
      args: [_name, BigInt(_total_order), _validators],
    });
  }

  async function initPayment(params: InitPayment) {
    const { _delivery_id, _station_id, _total_amount } = params;
    const execute = await writeContractAsync({
      abi: DeliveryAbis,
      address: `0x${process.env.NEXT_PUBLIC_DELIVERY_SMART_CONTRACT_ADDRESS}`,
      functionName: DeliveryWriteFunc.INITPAYMENT,
      args: [
        toBytes(_delivery_id),
        toBytes(_station_id),
        BigInt(_total_amount),
      ],
    });
  }

  async function pay(params: Pay) {
    const { delivery_id, token, amount } = params;
    const execute = await writeContractAsync({
      abi: DeliveryAbis,
      address: `0x${process.env.NEXT_PUBLIC_DELIVERY_SMART_CONTRACT_ADDRESS}`,
      functionName: DeliveryWriteFunc.PAY,
      args: [toBytes(delivery_id), token, BigInt(amount)],
    });
  }

  async function validate(params: Validate) {
    const { _delivery_id, _station_id } = params;
    const execute = await writeContractAsync({
      abi: DeliveryAbis,
      address: `0x${process.env.NEXT_PUBLIC_DELIVERY_SMART_CONTRACT_ADDRESS}`,
      functionName: DeliveryWriteFunc.VALIDATE,
      args: [toBytes(_delivery_id), toBytes(_station_id)],
    });
  }

  return {
    createOrder,
    createStation,
    initPayment,
    pay,
    validate,
  };
}

export const data = useReadContract({
  // chainId: 420420421,
  address: `0x${process.env.NEXT_PUBLIC_DELIVERY_SMART_CONTRACT_ADDRESS}`,
  functionName: "getAllOrder",
  abi: DeliveryAbis,
  // args: [],
});
