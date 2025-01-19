import { PaymentAbis } from "@/config/abis/payment";
import { PaymentWriteFunc } from "@/const/common.const";
import { InitPayment, Pay } from "@/types";
import { toBytes } from "viem";
import { useWriteContract } from "wagmi";

export const paymentInstance = () => {
    const { writeContractAsync } = useWriteContract();
    async function initPayment(params : InitPayment) {
        const { _delivery_id, _station_id, _total_amount } = params;
        const execute = await writeContractAsync({
            abi: PaymentAbis,
            address: `0x${process.env.NEXT_PUBLIC_PAYMENT_SMART_CONTRACT_ADDRESS}`,
            functionName: PaymentWriteFunc.INITPAYMENT,
            args: [
                toBytes(_delivery_id),
                toBytes(_station_id),
                BigInt(_total_amount),
            ],
          });
    }

    async function pay(params : Pay) {
        const { delivery_id, token, amount } = params;
        const execute = await writeContractAsync({
            abi: PaymentAbis,
            address: `0x${process.env.NEXT_PUBLIC_PAYMENT_SMART_CONTRACT_ADDRESS}`,
            functionName: PaymentWriteFunc.PAY,
            args: [
                toBytes(delivery_id),
                token,
                BigInt(amount),
            ],
          });
    }

    return {
        initPayment,
        pay,
    }
}
