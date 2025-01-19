import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SERVER_API } from "utils/constants";
import axios, { AxiosError } from "axios";
import { OrderView } from "./orderview";
import { IoMdClose } from "react-icons/io";
import { FaGear } from "react-icons/fa6";

const WS_URL = "ws://localhost:8008";

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
  srcTxid: string;
  dstTxid: string;
}

interface OrderComponentProps {
  srctxhash: string;
  setModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  orderId: number;
  onSwap: () => void;
}

const useWebSocketOrderTracking = (orderId: number, onSwap: () => void) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    id: 0,
    fromAddress: "",
    toAddress: "",
    fromChain: "",
    toChain: "",
    fromAsset: "",
    toAsset: "",
    amount: 0,
    orderHash: "",
    vaultAddress: "",
    status: "",
    srcTxid: "",
    dstTxid: "",
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (orderId === 0) return;

    // Create WebSocket connection
    const ws = new WebSocket(`${WS_URL}`);

    // Connection opened
    ws.onopen = () => {
      console.log("WebSocket connection established");
      setIsConnected(true);

      // Subscribe to specific order
      ws.send(
        JSON.stringify({
          type: "subscribe",
          orderId: orderId,
        })
      );
    };

    // Listen for messages
    ws.onmessage = (event) => {
      try {
        const orderUpdate = JSON.parse(event.data);
        console.log("Order Update Received:", orderUpdate);

        // Update order details
        setOrderDetails((prevDetails) => ({
          ...prevDetails,
          ...orderUpdate,
        }));

        // Check for final states
        if (["completed", "failed", "cancelled"].includes(orderUpdate.status)) {
          onSwap();
          ws.close();
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        toast.error("Error processing order update");
      }
    };

    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      // toast.error("WebSocket connection error");
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
    };

    // Cleanup function
    return () => {
      ws.close();
    };
  }, [orderId]);

  return {
    orderDetails,
    isConnected,
  };
};

export default function OrderComponent({
  srctxhash,
  setModelOpen,
  orderId,
  onSwap,
}: OrderComponentProps) {
  const { orderDetails, isConnected } = useWebSocketOrderTracking(
    orderId,
    onSwap
  );

  const setsrcTxHashnReturnOrder = () => {
    if (srctxhash) {
      return {
        ...orderDetails,
        srcTxid: srctxhash,
      };
    }
    return orderDetails;
  };

  return (
    <div className="z-50 border-t border-r border-l rounded-2xl border-opacity-60 border-gray-500">
      <div className="flex w-full justify-between py-5 px-4">
        <div>
          {isConnected ? (
            <FaGear className="animate-spin text-xl" />
          ) : (
            "Order Details"
          )}
        </div>
        <div onClick={() => setModelOpen(false)}>
          <IoMdClose className="text-3xl cursor-pointer hover:scale-150 transition" />
        </div>
      </div>
      {orderDetails.id > 0 ? (
        <OrderView order={setsrcTxHashnReturnOrder()} />
      ) : (
        <div className="text-center text-gray-200">Connecting...</div>
      )}
    </div>
  );
}
