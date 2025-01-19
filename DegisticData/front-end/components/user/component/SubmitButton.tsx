import { Button } from "@nextui-org/button";
import { useWriteContract } from "wagmi";
import { CreateOrder } from "@/types";
import { DeliveryAbis } from "@/config/abis/delivery";
import { DeliveryWriteFunc, PaymentWriteFunc } from "@/const/common.const";
import { PaymentAbis } from "@/config/abis/payment";
import { useState } from "react";

export const SubmitButton = ({ data }: { data: CreateOrder }) => {
  const { writeContractAsync } = useWriteContract();
  const { _station_ids, _name, _sender, _receiver } = data;
  const [isValidated, setValidated] = useState<boolean>(false);

  const createOrder = async () => {
    console.log(_station_ids, _name, _sender, _receiver);
    const execute = await writeContractAsync({
      abi: DeliveryAbis,
      address: `0x${process.env.NEXT_PUBLIC_DELIVERY_SMART_CONTRACT_ADDRESS}`,
      functionName: DeliveryWriteFunc.CREATEORDER,
      args: [_station_ids, _name, _sender, _receiver],
    });
  };

  const initialPrice = async () => {
    const execute = await writeContractAsync({
      abi: PaymentAbis,
      address: `0x${process.env.NEXT_PUBLIC_PAYMENT_SMART_CONTRACT_ADDRESS}`,
      functionName: PaymentWriteFunc.INITPAYMENT,
      args: [_station_ids, _name, BigInt(1)],
    });
  };

  return (
    <>
      {!isValidated ? (
        <Button color="primary" onPress={createOrder}>
          Submit
        </Button>
      ) : (
        <Button color="secondary" onPress={initialPrice}>
          Validate
        </Button>
      )}
    </>
  );
};
