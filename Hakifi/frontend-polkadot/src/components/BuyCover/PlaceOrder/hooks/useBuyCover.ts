// import { PairDetail } from '@/@type/pair.type';
// import { createInsurance, saveInsuranceTxHashApi } from '@/apis/insurance.api';
// import { SuiContext, SuiContextType } from '@/context';
// import useBalance from '@/hooks/useBalance';
// import { INSURANCE_STRUCTURED_ADDRESS, INSURANCE_SUI_ADDRESS, USDT_SUI_ADDRESS } from '@/web3/constants';
// import { TransactionBlock } from "@mysten/sui.js/transactions";
// import { useWallet } from '@suiet/wallet-kit';
// import { useCallback, useContext } from 'react';

// type BuyCoverDto = {
//   p_claim: number;
//   q_covered: number;
//   period: number;
//   margin: number;
//   periodUnit: string;
//   q_cover_pack_id: number;
// };

// const useBuyCover = (
//   pair: PairDetail,
// ): ({
//   // handleOnConfirmBuyCover: (params: ConfirmBuyCover) => Promise<void>,
//   buyCover: (params: BuyCoverDto) => Promise<void | null>;
// }) => {
//   const { SUIClient } = useContext(SuiContext) as SuiContextType;
//   const { account, signAndExecuteTransactionBlock } = useWallet();

//   const { balance, refetch } = useBalance();

//   const buyCover = useCallback(
//     async (params: BuyCoverDto) => {
//       if (!account || !INSURANCE_SUI_ADDRESS) {
//         return null;
//       }
//       const data = {
//         asset: pair.asset,
//         unit: pair.unit,
//         margin: params.margin,
//         period: params.period,
//         periodUnit: params.periodUnit,
//         p_claim: params.p_claim,
//         q_covered: params.q_covered,
//         q_cover_pack_id: params.q_cover_pack_id
//       };

//       // const provider = new AnchorProvider(connection, wallet, {});
//       // const program = new Program(IDL_INSURANCE, programId, provider);
//       const decimals = 10 ** 2;

//       let insuranceId = '';
//       try {

//         const insurance = await createInsurance(data);
//         const tx = new TransactionBlock();

//         const coinXs = await SUIClient.getCoins({ owner: account.address, coinType: USDT_SUI_ADDRESS });
//         const [primaryCoinX, ...restCoinXs] = coinXs.data;
//         const clockObject = "0x6";
//         if (restCoinXs.length > 0) {
//           tx.mergeCoins(
//             tx.object(primaryCoinX.coinObjectId),
//             restCoinXs.map((coin) => tx.object(coin.coinObjectId)),
//           );
//         }

//         // setting data
//         const [coinIn] = tx.splitCoins(tx.object(primaryCoinX.coinObjectId), [tx.pure(params.margin * decimals)]);
//         tx.moveCall({
//           target: `${INSURANCE_SUI_ADDRESS}::HAKIFI::create_insurance` as any,
//           arguments: [
//             tx.object(coinIn),
//             tx.object(INSURANCE_STRUCTURED_ADDRESS),
//             tx.pure.string(insurance.id),
//             tx.pure.u64(params.margin * decimals),
//             tx.object(clockObject),
//           ],
//           typeArguments: [USDT_SUI_ADDRESS],
//         });

//         const resData = await signAndExecuteTransactionBlock({
//           transactionBlock: tx,
//         });
//         console.log("executeMoveCall success", resData);

//         insuranceId = insurance.id;

//         // Signed
//         if (resData) {
//           // const { status, blockNumber, transactionHash, blockHash } =
//           //   await watchTransaction(result.hash);

//           // Save tx hash
//           saveInsuranceTxHashApi(insuranceId, resData.digest);

//           // usdtBalance.refetch();
//           refetch();
//           if (status === 'reverted') {
//             throw new Error('Your trasaction is reverted');
//           }
//         }
//       } catch (error: any) {
//         console.log({ error }, error instanceof Error, error.message, typeof error);
//         let reason = '';
//         // if (error instanceof TransactionExecutionError) {
//         //   if (error.cause instanceof UserRejectedRequestError) {

//         //     await deleteInsuranceApi(insuranceId);

//         //     reason = 'user_rejected_error';
//         //   }
//         //   // else if (error.cause instanceof ChainMismatchError) {
//         //   //   reason = 'chain_miss_match';
//         //   // }
//         // } else if (error instanceof ContractFunctionExecutionError) {
//         //   if (error.cause instanceof ContractFunctionRevertedError) {
//         //     if (error.cause.reason === 'ERC20: insufficient allowance')
//         //       reason = 'insufficient_allowance';
//         //     else if (error.cause.reason) reason = error.cause.reason;
//         //   }
//         // } else if (error.response.data.message === "INVALID_PERIOD") {
//         //   reason = "invalid_period";
//         // } else 
//         if (error instanceof Error) {
//           reason = error.message;
//         } else {
//           reason = 'internal_server_error';
//         }
//         throw new Error(reason);
//       }
//     },
//     [balance, pair.asset, pair.unit],
//   );

//   return {
//     // handleOnConfirmBuyCover,
//     buyCover,
//   };
// };

// export default useBuyCover;

import { PairDetail } from '@/@type/pair.type';
import { createInsurance, deleteInsuranceApi, saveInsuranceTxHashApi } from '@/apis/insurance.api';

import { sleep } from '@/utils/helper';

import { INSURANCE_ABI } from '@/web3/abi/insurance.abi';
import { USDT_ABI } from '@/web3/abi/usdt.abi';
import { INSURANCE_ADDRESS, USDT_MOON_ADDRESS } from '@/web3/constants';
import { mainChain } from '@/web3/wagmiConfig';
import {
  ChainMismatchError,
  WaitForTransactionResult,
  prepareWriteContract,
  readContract,
  waitForTransaction,
  writeContract
} from '@wagmi/core';
import { useCallback } from 'react';
import {
  Address,
  ContractFunctionExecutionError,
  ContractFunctionRevertedError,
  TransactionExecutionError,
  UserRejectedRequestError,
  parseEther,
} from 'viem';
import { useAccount, useBalance, useNetwork, useSwitchNetwork } from 'wagmi';

type BuyCoverDto = {
  p_claim: number;
  q_covered: number;
  period: number;
  margin: number;
  periodUnit: string;
  q_cover_pack_id: number;
};

type ConfirmBuyCover = {
  margin: number;
};

const watchTransaction = async (
  hash: Address,
  retry = 5,
): Promise<WaitForTransactionResult> => {
  try {
    const result = await waitForTransaction({
      hash,
    });
    return result;
  } catch (error) {
    if (retry > 1) {
      await sleep(1000);
      return watchTransaction(hash, retry - 1);
    }
    throw error;
  }
};

enum UnitContract {
  USDT = 0,
  VNST = 1,
}

const useBuyCover = (
  pair: PairDetail,
): ({
  handleOnConfirmBuyCover: (params: ConfirmBuyCover) => Promise<void>,
  buyCover: (params: BuyCoverDto) => Promise<void>;
}) => {
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address } = useAccount();
  const usdtBalance = useBalance({
    address,
    token: USDT_MOON_ADDRESS,
  });

  const handleOnConfirmBuyCover = useCallback(async (params: ConfirmBuyCover) => {
    try {
      const marginAmount = parseEther(params.margin.toString());
      if (chain?.unsupported) {
        const response = await switchNetworkAsync?.(mainChain.id);
      }
      const allowance = (await readContract({
        abi: USDT_ABI,
        address: USDT_MOON_ADDRESS,
        functionName: 'allowance',
        args: [address, INSURANCE_ADDRESS],
      })) as bigint;
      if (allowance < marginAmount) {
        const config = await prepareWriteContract({
          address: USDT_MOON_ADDRESS,
          abi: USDT_ABI,
          functionName: 'approve',
          args: [INSURANCE_ADDRESS, usdtBalance.data?.value || marginAmount],
        });

        const result = await writeContract(config);
        if (result.hash) {
          const { status } = await watchTransaction(result.hash);
        }
      }
    } catch (error) {
      let reason = '';
      if (error instanceof UserRejectedRequestError) {
        reason = 'user_rejected_error';
      }
      else if (error instanceof TransactionExecutionError) {
        if (error.cause instanceof UserRejectedRequestError) {
          reason = 'user_rejected_error';
        } else if (error.cause instanceof ChainMismatchError) {
          reason = 'chain_miss_match';
        }
      } else if (error instanceof ContractFunctionExecutionError) {
        if (error.cause instanceof ContractFunctionRevertedError) {
          if (error.cause.reason === 'ERC20: insufficient allowance')
            reason = 'insufficient_allowance';
          else if (error.cause.reason) reason = error.cause.reason;
        }
      }
      console.log(error)
      throw new Error(reason);
    }
  }, []);

  const buyCover = useCallback(
    async (params: BuyCoverDto) => {
      let insuranceId = '';
      try {
        const marginAmount = parseEther(params.margin.toString());

        const data = {
          asset: pair.asset,
          unit: pair.unit,
          margin: params.margin,
          period: params.period,
          periodUnit: params.periodUnit,
          p_claim: params.p_claim,
          q_covered: params.q_covered,
          q_cover_pack_id: params.q_cover_pack_id
        };

        // Create temp insurance 
        const insurance = await createInsurance(data);

        insuranceId = insurance.id;
        console.log("Insurance Address: ", INSURANCE_ADDRESS);
        
        const config = await prepareWriteContract({
          address: INSURANCE_ADDRESS,
          abi: INSURANCE_ABI,
          functionName: 'createInsurance',
          args: [
            insurance.id,
            BigInt(UnitContract[pair.unit as any]),
            marginAmount,
          ],
        });
        const result = await writeContract(config);

        // Signed
        if (result.hash) {
          const { status, blockNumber, transactionHash, blockHash } =
            await watchTransaction(result.hash);

          // Save tx hash
          saveInsuranceTxHashApi(insuranceId, result.hash);

          usdtBalance.refetch();
          if (status === 'reverted') {
            throw new Error('Your trasaction is reverted');
          }
        }
      } catch (error: any) {
        let reason = '';
        console.log("error: ", error);
        
        if (error instanceof UserRejectedRequestError) {
          reason = 'user_rejected_error';
        } else if (error instanceof TransactionExecutionError) {
          if (error.cause instanceof UserRejectedRequestError) {

            await deleteInsuranceApi(insuranceId);

            reason = 'user_rejected_error';
          } else if (error.cause instanceof ChainMismatchError) {
            reason = 'chain_miss_match';
          }
        } else if (error instanceof ContractFunctionExecutionError) {
          if (error.cause instanceof ContractFunctionRevertedError) {
            if (error.cause.reason === 'ERC20: insufficient allowance')
              reason = 'insufficient_allowance';
            else if (error.cause.reason) reason = error.cause.reason;
          }
        } else if (error.response.data.message === "INVALID_PERIOD") {
          reason = "invalid_period";
        } else {
          reason = 'internal_server_error';
        }
        throw new Error(reason);
      }
    },
    [usdtBalance.data?.value, pair.asset, pair.unit],
  );

  return {
    handleOnConfirmBuyCover,
    buyCover,
  };
};

export default useBuyCover;

