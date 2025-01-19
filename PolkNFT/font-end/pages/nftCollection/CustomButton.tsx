import { ReadFunc, WriteFunc } from "@/const/common.const";
import React, { useMemo } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { abis } from "../config/abis";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CustomButton({
   index,
   data,
   price,
   amount,
}: {
   index: number;
   data: any;
   price: string;
   amount: string;
}) {
   const { writeContractAsync } = useWriteContract();

   const checked = useReadContract({
      chainId: 420420421,
      address: `0x${process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS}`,
      functionName: ReadFunc.ISRETURNNFT,
      abi: abis,
   });

   const handleList = async () => {
      const execute = await writeContractAsync({
         abi: abis,
         address: `0x${process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS}`,
         functionName: WriteFunc.LIST,
         args: [BigInt(index), BigInt(data.id), Number(price), BigInt(amount), 100],
      });

      setTimeout(() => {
         toast.success("🦄 It is successfull Listed NFT!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
         });
      }, 5000);
   };

   const button = useMemo(() => {
      if (data.status == 0) {
         return (
            <button
               onClick={() => handleList()}
               className=" w-[30%] my-1 p-1 bg-red-500 rounded-xl"
            >
               List
            </button>
         );
      } else if (data.status == 1) {
         return (
            <button className=" w-full p-2 bg-gray-500 rounded-xl cursor-not-allowed">
               Pending
            </button>
         );
      } else if (data.status == 2 && checked) {
         return <button className=" w-full p-2 bg-green-500 rounded-xl">Withdraw</button>;
      } else if (data.status == 2 && !checked) {
         return (
            <button className=" w-full p-2 bg-yellow-500 rounded-xl cursor-not-allowed">
               Lending time
            </button>
         );
      }
   }, [data.status]);
   return (
      <>
         {button}
         <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
         />
      </>
   );
}

export default CustomButton;
