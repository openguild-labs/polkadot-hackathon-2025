import { css } from "@emotion/react";
import { MoonLoader } from "react-spinners";
import { IoMdClose } from "react-icons/io";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { ContractInterface, ethers } from "ethers";
import { ExecutorAbi } from "./abi/executor";
import { Executor } from "./types/Executor";
import { SERVER_API, tokenAddressMap, vaultAddressMap } from "../../utils/constants";
import { useAddress, useSwitchChain } from "@thirdweb-dev/react";
import { Sepolia , PolygonAmoyTestnet , BaseSepoliaTestnet , ScrollSepoliaTestnet , OpSepoliaTestnet, BinanceTestnet, Chain, MoonbaseAlpha } from "@thirdweb-dev/chains";

// const vaultAddressMap : Record<string, string> = {
//   'sepolia': '0x08b38a2db59582FE7927BC46cd6808dB0d00a467', // Token : 0xa0907fA317E90d6cE330d28565E040f0474E932E
//   'base' : '0x638d492d8ebbBD286a9fba909580E54f57CA750C', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
//   'scroll' : '0xB05EE02Bd902dEb4AFcAeC64E6a137d2e5928154', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
//   'amoy' : '0xd9127c88eC7F508DA6248827b41Deda09E85A284', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
//   'optimism' : '0x8E53eF2Cf6800E209EABf1AC3a8383d16140D029', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D   
//   // 'hedera' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D   
//   // 'flow' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D   
//   // 'morph' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D   
//   // 'linea' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D   
//   // 'airdao' : '0xDeb4C7AB99e46aFEbfE374F6a7BBFB63D309166f', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D   
// }

// const tokenAddressMap : Record<string, string> = {
//   'sepolia': '0xa0907fA317E90d6cE330d28565E040f0474E932E', // Token : 0xa0907fA317E90d6cE330d28565E040f0474E932E
//   'base' : '0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
//   'scroll' : '0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
//   'amoy' : '0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
//   'optimism' : '0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748Df', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D   
//   // 'hedera' : '0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
//   // 'flow' : '0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
//   // 'morph' : '0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
//   // 'linea' : '0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
//   // 'airdao' : '0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D', // Token : 0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D
// }

// const rpcMap : Record<string, string> = {
//   'sepolia': 'https://sepolia.infura.io/v3/979d8f8712b24030a953ed0607a54e76',
//   'base' : 'https://base-sepolia-rpc.publicnode.com',
//   'scroll' : 'https://rpc.ankr.com/scroll_sepolia_testnet',
//   'amoy' : "https://rpc.ankr.com/polygon_amoy",
//   'optimism' : "https://sepolia.optimism.io"
// }

interface OrderDetails {
  id: number;
  fromAddress: string;
  toAddress: string;
  fromChain: string;
  toChain: string;
  fromAsset: string;
  toAsset: string;
  amount: number;
  orderHash: string;
  vaultAddress: string;
  status: string;
  srcTxid: string | null;
  dstTxid: string | null;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

// interface TransferParams extends Params {
//   amount?: string;
//   fromchain?: string;
//   tochain?: string;
// }

async function fetchOrderDetails(orderId: number): Promise<OrderDetails> {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const url = `${SERVER_API}${orderId}`;
  console.log("Requesting URL:", url);

  try {
    const response = await axios.get<OrderDetails>(url);
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Full error object:", axiosError);
      console.error("Request config:", axiosError.config);
      toast.error(
        `Error fetching order details: ${
          axiosError.response?.data || axiosError.message
        }`
      );
    } else {
      console.error("Non-Axios error:", error);
      toast.error(`Error fetching order details: ${error}`);
    }
    throw error;
  }
}

const cssOverride = css`
  display: block;
  margin: 0 auto;
  border-color: white;
  color: white;
`;

interface TransactionLoaderProps {
  setModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  orderId: number;
  onSwap: () => void;
}

function useOrderPolling(
  orderId: number,
  setOrderDetails: Dispatch<SetStateAction<OrderDetails | null>>,
  onSwap: () => void,
  initialPollingState: boolean = true
) {
  const [isPolling, setIsPolling] = useState(initialPollingState);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    if (orderId === 0) {
      return;
    }

    const pollOrderDetails = async () => {
      if (!isPolling) {
        console.log("Polling stopped");
        return;
      }

      try {
        const details = await fetchOrderDetails(orderId);
        
        setOrderDetails(details);

        if (["completed", "failed"].includes(details.status)) {
          
          console.log("Polling stopped due to final status");
          setIsPolling(false);
          onSwap();

        } else {
          timeoutId = setTimeout(pollOrderDetails, 2000);
        }
      } catch (error) {
        console.error("Error during polling:", error);
        timeoutId = setTimeout(pollOrderDetails, 2000);
      }
    };

    pollOrderDetails();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isPolling, orderId, setOrderDetails]);

  return { isPolling, setIsPolling };
}

const TransactionLoader: React.FC<TransactionLoaderProps> = ({
  setModelOpen,
  orderId,
  onSwap,
}) => {

  const [srctxid_eth , setSrctxid_eth] = useState<string | null>(null);
 
  
  const address = useAddress();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const { isPolling,  } = useOrderPolling(
    orderId,
    setOrderDetails,
    onSwap
  );
  const switchChain = useSwitchChain();

  // in useeffect change setModelOpen to false if poling is false

  // useEffect(() => {
  //   if (!isPolling) {
  //     setModelOpen(false);
  // }}, [isPolling, setModelOpen]);

  const chains : Record<string, Chain> = {
    "evm:sepolia": Sepolia,
    "evm:amoy" : PolygonAmoyTestnet,
    "evm:base" : BaseSepoliaTestnet,
    "evm:scroll" : ScrollSepoliaTestnet,
    "evm:optimism" : OpSepoliaTestnet,
    "evm:bnb": BinanceTestnet,
    "evm:moonbase": MoonbaseAlpha,

    // "evm:linea" : LineaSepolia,
    // "evm:morph" : MorphHolesky,
    // "evm:flow" : Testnet,
    // "evm:hedera" : HederaTestnet,
    // "evm:airdao" : AirdaoTestnet,
  };

  const complete_ethereum_side_swap = async (
    amount: number,
    orderHash: string,
    chain: string
  ) => {
    if (window.ethereum === undefined) {
      toast.error("Please install MetaMask");
      return;
    }

    await switchChain(chains[chain].chainId);
    await ethereum_side_swap(amount, orderHash , chain.split(":")[1]);
  };

  const ethereum_side_swap = async (amount: number, orderHash: string , chain : string) => {
    if (window.ethereum === undefined) {
      toast.error("Please install MetaMask");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner(address);

    const Executor = new ethers.Contract(
      vaultAddressMap[chain],
      ExecutorAbi as unknown as ContractInterface,
      signer
    ) as unknown as Executor;

    const tx = await Executor.lock(
      tokenAddressMap[chain],
      "0x" + orderHash,
      amount
    );
    setSrctxid_eth(tx.hash)
    // await tx.wait(); // Wait for the transaction to be mined

    // toast.success(`Transaction complete: ${tx.hash}`);

    // let order = orderDetails!
    // order.srcTxid = tx.hash;
    // // setSrctxid_eth(tx.hash);
    // if (order.status !== "completed") {
    //   setOrderDetails(order);
    // }
  };

  return (
    <div className={`text-gray-200 h-auto w-auto flex flex-col justify-center items-center p-24 relative `} >
      <div
        className="absolute top-0 right-0 p-7"
        onClick={() => setModelOpen(false)}
      >
        <IoMdClose className="text-3xl cursor-pointer hover:scale-150 transition" />{" "}
      </div>
      <div className={`absolute top-0 left-0 px-5 py-3 border m-5 rounded-xl flex items-center justify-center space-x-2 `}>
        <div>{orderDetails?.status}</div>
        <div className={`${isPolling ? "" : "hidden"}`}>
          {" "}
          <MoonLoader
            color={"#ffca00"}
            loading={true}
            css={cssOverride}
            size={15}
          />{" "}
        </div>
      </div>
      <div className="font-semibold text-xl mb-12">
        Transaction in {isPolling ? "progress..." : "completed"}
      </div>
      <div className="flex space-y-4">
        {orderDetails?.fromChain.startsWith("evm") ? (
          (orderDetails.status === "created" && srctxid_eth === null) ? (
            <button
              className="bg-[#2f9b2a] px-4 py-2 border glassmorphicFAQ rounded-lg hover:bg-[#54b54f]"
              onClick={() =>
                complete_ethereum_side_swap(
                  orderDetails?.amount,
                  orderDetails?.orderHash,
                  orderDetails.fromChain
                )
              }
            >
              Complete {orderDetails?.fromChain.slice(4)} Swap
            </button>
          ) : (
            <div className="flex flex-col space-y-4">
              <div className=" p-7 border rounded-md text-xl font-bold justify-center flex flex-col w-full items-center">
                {(orderDetails?.srcTxid ) ? (
                  <div>
                    <div>Source Transaction ID</div>
                    {orderDetails.srcTxid.split(",").map((txid, index) => (
                      <div key={index}>{txid}</div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div>Source Transaction ID</div>
                    <div >{srctxid_eth}</div>
                  </div>
                )}
              </div>

              <div className=" p-7 border rounded-md text-xl font-bold justify-center flex flex-col w-full items-center">
                {orderDetails?.dstTxid ? (
                  <div>
                    <div>Destination Transaction ID</div>
                    {orderDetails.dstTxid.split(",").map((txid, index) => (
                      <div key={index}>{txid}</div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col space-y-4">
            <div className=" p-7 border rounded-md text-xl font-bold justify-center flex flex-col w-full items-center">
              <div>Deposit Address</div>
              <div>{orderDetails?.vaultAddress}</div>
            </div>
            <div className="text-2xl w-full items-center flex justify-center">
              Deposit Amount : {orderDetails?.amount} Sats
            </div>

            <div className="flex flex-col space-y-4">
              <div className=" p-7 border rounded-md text-xl font-bold justify-center flex flex-col w-full items-center">
                {orderDetails?.srcTxid ? (
                  <div>
                    <div>Source Transaction ID</div>
                    {orderDetails.srcTxid.split(",").map((txid, index) => (
                      <div key={index}>{txid}</div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className=" p-7 border rounded-md text-xl font-bold justify-center flex flex-col w-full items-center">
                {orderDetails?.dstTxid ? (
                  <div>
                    <div>Destination Transaction ID</div>
                    {orderDetails.dstTxid.split(",").map((txid, index) => (
                      <div key={index}>{txid}</div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionLoader;