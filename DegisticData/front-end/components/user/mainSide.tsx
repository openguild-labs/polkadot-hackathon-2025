import React from "react";
import { ShipmentCard } from "@/components/user/component/shipmentCard";
import { Card } from "@/types";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import OrderModal from "./component/modal";
import { useReadContract } from "wagmi";
import { DeliveryAbis } from "@/config/abis/delivery";

function MainSide() {
  const shipments: Card[] = [
    {
      number: "UA-145009BS",
      from: "Athens, GRC",
      fromDetail: "Piraeus Harbour",
      to: "Tallinn, EST",
      toDetail: "Hektor Container Hotel",
      buyer: "Milton Hines",
    },
    {
      number: "MK-549893XC",
      from: "Yingkou, CHN",
      fromDetail: "Bayuquan District Yingkou",
      to: "Abu Dhabi, UAE",
      toDetail: "Mina St - Zayed Port",
      buyer: "Gary Muncy",
    },
    {
      number: "DA-549893XC",
      from: "Huelva, ESP",
      fromDetail: "Port of Huelva",
      to: "Malaga, ESP",
      toDetail: "Puerto de Malaga",
      buyer: "Robert Williams",
    },
    {
      number: "PL-549893GH",
      from: "Boston, USA",
      fromDetail: "27 Drydock Boston",
      to: "Mecum Technologies",
      toDetail: "65 Hartwell St, West Boylston",
      buyer: "Vernon Bueno",
    },
    {
      number: "ND-911743BS",
      from: "Yingkou, CHN",
      fromDetail: "Bayuquan District Yingkou",
      to: "Abu Dhabi, UAE",
      toDetail: "Mina St - Zayed Port",
      buyer: "Barry Green",
    },
    {
      number: "UK-549893CC",
      from: "Yingkou, CHN",
      fromDetail: "Bayuquan District Yingkou",
      to: "Abu Dhabi, UAE",
      toDetail: "Mina St - Zayed Port",
      buyer: "Robert Nocera",
    },
  ];

   const list = useReadContract({
      chainId: 420420421,
      address: `0x${process.env.NEXT_PUBLIC_DELIVERY_SMART_CONTRACT_ADDRESS}`,
      functionName: "getAllOrder",
      abi: DeliveryAbis,
    });

    console.log(list)

  return (
    <ScrollShadow hideScrollBar className="h-screen w-[50%]">
      <div className="p-6 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Shipment Management</h1>
          <OrderModal />
        </div>
        <div className="flex space-x-4 mb-6">
          <button className="px-4 py-2 bg-gray-200 rounded-lg">View all</button>
          <button className="px-4 py-2 bg-blue-100 text-blue-600 font-semibold rounded-lg">
            Active
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {shipments.map((shipment: Card, index: number) => (
            <ShipmentCard key={index} shipment={shipment} />
          ))}
        </div>
      </div>
    </ScrollShadow>
  );
}

export default MainSide;
