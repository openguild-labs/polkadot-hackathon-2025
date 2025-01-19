import { useAddress } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { OrderView } from "./orderview";

export interface Order {
  id: number;
  toAddress: string;
  fromChain: string;
  toChain: string;
  fromAsset: string;
  toAsset: string;
  amount: number;
  orderHash: string;
  status: string;
  srcTxid: string;
  dstTxid: string;
  vaultAddress: string;
}

export default function History() {
  const address = useAddress();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:8008/orders?toAddress=${address}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (err) {
        toast.error("Error fetching orders: " + err);
        console.error(err);
        return;
      }
    };

    fetchOrders();
  }, [address]);

  return (
    <div className="w-full h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-2xl h-3/4 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-center">Orders</h2>
        <div className="flex-1 overflow-hidden">
          {orders.length > 0 ? (
            <div className="h-full overflow-y-auto pr-2">
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className=" p-4 rounded-md shadow">
                    <OrderView order={order} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No orders found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
