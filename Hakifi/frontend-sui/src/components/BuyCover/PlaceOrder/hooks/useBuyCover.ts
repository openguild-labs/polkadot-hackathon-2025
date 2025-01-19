import { PairDetail } from '@/@type/pair.type';
import { createInsurance, saveInsuranceTxHashApi } from '@/apis/insurance.api';
import { SuiContext, SuiContextType } from '@/context';
import useBalance from '@/hooks/useBalance';
import { INSURANCE_ADDRESS, INSURANCE_STRUCTURED_ADDRESS, INSURANCE_SUI_ADDRESS, USDT_ADDRESS, USDT_SUI_ADDRESS } from '@/web3/constants';
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useAccountBalance, useWallet } from '@suiet/wallet-kit';
import { useCallback, useContext } from 'react';

type BuyCoverDto = {
  p_claim: number;
  q_covered: number;
  period: number;
  margin: number;
  periodUnit: string;
};

const useBuyCover = (
  pair: PairDetail,
): ({
  // handleOnConfirmBuyCover: (params: ConfirmBuyCover) => Promise<void>,
  buyCover: (params: BuyCoverDto) => Promise<void | null>;
}) => {
  const { SUIClient } = useContext(SuiContext) as SuiContextType;
  const { account, signAndExecuteTransactionBlock } = useWallet();

  const { balance, refetch } = useBalance();

  const buyCover = useCallback(
    async (params: BuyCoverDto) => {
      if (!account || !INSURANCE_SUI_ADDRESS) {
        return null;
      }
      const data = {
        asset: pair.asset,
        unit: pair.unit,
        margin: params.margin,
        period: params.period,
        periodUnit: params.periodUnit,
        p_claim: params.p_claim,
        q_covered: params.q_covered,
      };

      // const provider = new AnchorProvider(connection, wallet, {});
      // const program = new Program(IDL_INSURANCE, programId, provider);
      const decimals = 10 ** 2;

      let insuranceId = '';
      try {

        const insurance = await createInsurance(data);
        const tx = new TransactionBlock();

        const coinXs = await SUIClient.getCoins({ owner: account.address, coinType: USDT_SUI_ADDRESS });
        const [primaryCoinX, ...restCoinXs] = coinXs.data;
        const clockObject = "0x6";
        if (restCoinXs.length > 0) {
          tx.mergeCoins(
            tx.object(primaryCoinX.coinObjectId),
            restCoinXs.map((coin) => tx.object(coin.coinObjectId)),
          );
        }

        // setting data
        const [coinIn] = tx.splitCoins(tx.object(primaryCoinX.coinObjectId), [tx.pure(params.margin * decimals)]);
        tx.moveCall({
          target: `${INSURANCE_SUI_ADDRESS}::HAKIFI::create_insurance` as any,
          arguments: [
            tx.object(coinIn),
            tx.object(INSURANCE_STRUCTURED_ADDRESS),
            tx.pure.string(insurance.id),
            tx.pure.u64(params.margin * decimals),
            tx.object(clockObject),
          ],
          typeArguments: [USDT_SUI_ADDRESS],
        });

        const resData = await signAndExecuteTransactionBlock({
          transactionBlock: tx,
        });
        console.log("executeMoveCall success", resData);

        insuranceId = insurance.id;

        // Signed
        if (resData) {
          // const { status, blockNumber, transactionHash, blockHash } =
          //   await watchTransaction(result.hash);

          // Save tx hash
          saveInsuranceTxHashApi(insuranceId, resData.digest);

          // usdtBalance.refetch();
          refetch();
          if (status === 'reverted') {
            throw new Error('Your trasaction is reverted');
          }
        }
      } catch (error: any) {
        console.log({ error }, error instanceof Error, error.message, typeof error);
        let reason = '';
        // if (error instanceof TransactionExecutionError) {
        //   if (error.cause instanceof UserRejectedRequestError) {

        //     await deleteInsuranceApi(insuranceId);

        //     reason = 'user_rejected_error';
        //   }
        //   // else if (error.cause instanceof ChainMismatchError) {
        //   //   reason = 'chain_miss_match';
        //   // }
        // } else if (error instanceof ContractFunctionExecutionError) {
        //   if (error.cause instanceof ContractFunctionRevertedError) {
        //     if (error.cause.reason === 'ERC20: insufficient allowance')
        //       reason = 'insufficient_allowance';
        //     else if (error.cause.reason) reason = error.cause.reason;
        //   }
        // } else if (error.response.data.message === "INVALID_PERIOD") {
        //   reason = "invalid_period";
        // } else 
        if (error instanceof Error) {
          reason = error.message;
        } else {
          reason = 'internal_server_error';
        }
        throw new Error(reason);
      }
    },
    [balance, pair.asset, pair.unit],
  );

  return {
    // handleOnConfirmBuyCover,
    buyCover,
  };
};

export default useBuyCover;
