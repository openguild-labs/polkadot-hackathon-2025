import toast from "react-hot-toast";
import { chainInfo } from ".";
import { FaArrowRightLong } from "react-icons/fa6";
import { FiClipboard } from "react-icons/fi";
import { useEffect } from "react";
import { Order } from "./History";

interface OrderDetailProps {
  order: Order;
}

const explorerUrls = {
  bitcoin: "https://mempool.space/testnet4/tx/",
  "evm:sepolia": "https://sepolia.etherscan.io/tx/",
  "evm:amoy": "https://amoy.polygonscan.com/tx/",
  "evm:base": "https://sepolia.basescan.org/tx/",
  "evm:scroll": "https://sepolia.scrollscan.com/tx/",
  "evm:optimism": "https://sepolia-optimism.etherscan.io/tx/",
  "evm:bnb": "https://testnet.bscscan.com/tx/",
  "evm:moonbase": "https://moonbase.moonscan.io/tx/",
  "evm:citrea" : "https://explorer.testnet.citrea.xyz/tx/"
};

export const OrderView: React.FC<OrderDetailProps> = ({ order }) => {
  // useEffect(() => {
  //   order.srcTxid = localStorage.getItem(order.orderHash) || order.srcTxid ; 
  //   console.log(order.srcTxid , order.orderHash)
  // })

  const srcTxHash = localStorage.getItem(order.orderHash) || order.srcTxid;
  return (
    <div className="px-4 py-3 border border-opacity-60 border-gray-500 rounded-2xl">
      {
        <div className="space-y-4">
          <div className={` ${order.fromChain === "bitcoin" && order.status !== "completed" ? "space-y-4" : "hidden"} `}>
            <div className="text-gray-200 text-lg">
              Send {order.amount} Sats To Below Address :
            </div>
            <div className="w-full justify-around flex">
              <div>{order.vaultAddress}</div>
              <FiClipboard
                className="text-xl cursor-pointer"
                onClick={async () => {
                  await navigator.clipboard.writeText(order.vaultAddress);
                  toast.success("Copied to clipboard");
                }}
              />
            </div>
            <hr className="text-gray-500 opacity-30" />
          </div>
          <div className="flex space-x-8 pb-4 items-center">
            <div className="space-y-4">
              <div>Order Id : {order.id}</div>
              <div className="flex space-x-2 items-center">
                <img
                  src={
                    chainInfo[order.fromChain as keyof typeof chainInfo].imgurl
                  }
                  alt=""
                  className="w-6 rounded-full"
                />
                <FaArrowRightLong />
                <img
                  src={
                    chainInfo[order.toChain as keyof typeof chainInfo].imgurl
                  }
                  alt=""
                  className="w-6 rounded-full"
                />
              </div>
            </div>
            <div>Order Status : {order.status}</div>
            <div className="flex flex-col">
              <a
                className="text-blue-400 hover:underline"
                target="_blank"
                href={
                  explorerUrls[order.fromChain as keyof typeof explorerUrls] +
                  srcTxHash
                }
                rel="noreferrer"
              >
                Source TxHash :{" "}
                {srcTxHash &&  srcTxHash.slice(0, 5) + "..." + srcTxHash.slice(-5)}
              </a>
              <a
                className="text-blue-400 hover:underline"
                target="_blank"
                href={
                  explorerUrls[order.toChain as keyof typeof explorerUrls] +
                  order.dstTxid
                }
                rel="noreferrer"
              >
                Destination TxHash :{" "}
                { order.dstTxid && order.dstTxid.slice(0, 5) + "..." + order.dstTxid.slice(-5)}
              </a>
            </div>
          </div>{" "}
        </div>
      }
    </div>
  );
};
