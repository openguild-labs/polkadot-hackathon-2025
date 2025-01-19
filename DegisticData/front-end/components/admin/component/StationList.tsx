import React from "react";
import TableAdmin from "./table";
import { useReadContract } from "wagmi";
import { DeliveryReadFunc } from "@/const/common.const";
import { DeliveryAbis } from "@/config/abis/delivery";
import { ethers } from "ethers";

function StationList() {
  const list = useReadContract({
    chainId: 420420421,
    address: `0x${process.env.NEXT_PUBLIC_DELIVERY_SMART_CONTRACT_ADDRESS}`,
    functionName: DeliveryReadFunc.GETALLSTATION,
    abi: DeliveryAbis,
  });

  const header = ["Station ID", "Name", "Order Count", "Validators"];

  const data =
    Array.isArray(list.data) &&
    list.data.length > 0 &&
    list.data.map((item) => ({
      id: item.station_id.substring(2, 10),
      name: ethers.decodeBytes32String(item.name),
      orderCount: Number(item.total_order),
      validators: Number(item.validitors.length),
    }));

  return <TableAdmin header={header} data={data} type="station"/>;
}

export default StationList;
