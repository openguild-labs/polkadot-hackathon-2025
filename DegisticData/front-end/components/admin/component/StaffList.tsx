import React from "react";
import TableAdmin from "./table";
import { useReadContract } from "wagmi";
import { ethers, id } from "ethers";
import { StaffReadFunc } from "@/const/common.const";
import { StaffAbis } from "@/config/abis/staff";

function StaffList() {
  const defaultStationId = ethers.encodeBytes32String("default");
  const list = useReadContract({
    chainId: 420420421,
    address: `0x${process.env.NEXT_PUBLIC_STAFF_SMART_CONTRACT_ADDRESS}`,
    functionName: StaffReadFunc.GETALLSTAFFSONSTATION,
    abi: StaffAbis,
    args: [defaultStationId],
  });
  
  const data = Array.isArray(list.data) && list.data.length > 0 && list.data.map((item) => ({
    id: item.station_id.substring(2, 10),
    address: item.staff_address,
    orderCount: item.order_ids.length,
    status: item.is_active,
  }));
  const header = ["Station ID", "Addresss", "Order Count", "Status"];
  return <TableAdmin header={header} data={data} type="staff"/>;
}

export default StaffList;
