import React, { useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleSendLovelace } from "@/role/AuctionStage/sendLovelace";

function Airdrop() {
    const [ isOpen, setOpen] = useState(false)
    const [amount, setAmount] = useState(0)
    const [network, setNetwork] = useState("devnet")
    const [address, setAddress] = useState<string>('')

    const getAmount = (e: number) => {
      setAmount(e)
      setOpen(false)
    }


    const airdropButton = async() => {
      // handleSendLovelace(wallet, address, amount)

      setTimeout(() => {
         toast.success("🦄 Airdrop successfully!", {
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
      }, 10000);
    }

   return (
      <div id="Airdrop" className=" w-full justify-center flex-col gap-10 items-center flex z-30 border-x-4 border-[#F7F7F9] py-5 px-10">
         <div className=" w-full flex-col flex gap-2 text-white">
            <p className=" text-4xl font-semibold">Airdrop</p>
            <p className=" text-sm text-fuchsia-600">
               You are now successfully Create Solana Token.
            </p>
         </div>
         <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full mx-auto md:max-w-lg">
            <div className="flex flex-col space-y-1.5 p-6 text-red-200">
               <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  <div className="flex items-center justify-between gap-3">
                     <span>Request Airdrop</span>
                     <select value={network} className="w-min bg-transparent text-sm border-[1px] border-white p-1 rounded-xl hover:bg-[#2C282F]">
                        <option className=" bg-white" value="devnet" selected>
                           Preview testnet
                        </option>
                        <option className=" bg-black" value="testnet">
                           Preprod testnet
                        </option>
                     </select>
                  </div>
               </h3>
               <p className="text-sm text-muted-foreground">
                  Maximum of 1 requests per day
               </p>
            </div>
            <div className="p-6 pt-0 flex flex-row space-x-2 relative">
               <input
                  onChange={(e:any) => setAddress(e.target.value)}
                  className=" w-[80%] px-2 bg-transparent border-[1px] border-white text-white rounded-lg placeholder:text-gray-300"
                  type="text"
                  placeholder="Wallet Address"
                  required
               />
               <button
                  className="cursor-pointer hover:bg-[#2C282F] text-white whitespace-nowrap inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-24"
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded="false"
                  aria-controls="radix-:Rl6ula:"
                  data-state="closed"
                  onClick={() => setOpen(!isOpen)}
               >
                  Amount {amount != 0 ? `: ${amount}` : ""}
               </button>
               <div className={` ${isOpen == true ? " grid" : " hidden"}  w-28 h-28 rounded-lg bg-[#09090B] border-[1px] p-2 border-white grid-cols-2 gap-2 absolute top-12 right-5 justify-center items-center`}>
                  <div onClick={() => getAmount(0.5)} className=" w-full h-full cursor-pointer bg-[#09090B] border-[1px] border-white rounded-lg hover:bg-[#494159] text-white justify-center items-center flex">
                     <p className=" text-center">0.5</p>
                  </div>
                  <div onClick={() => getAmount(1)} className=" w-full h-full cursor-pointer bg-[#09090B] border-[1px] border-white rounded-lg hover:bg-[#494159] text-white justify-center items-center flex">
                     <p className=" text-center">1.0</p>
                  </div>
                  <div onClick={() => getAmount(2.5)}  className=" w-full h-full cursor-pointer bg-[#09090B] border-[1px] border-white rounded-lg hover:bg-[#494159] text-white justify-center items-center flex">
                     <p className=" text-center">2.5</p>
                  </div>
                  <div onClick={() => getAmount(5)}  className=" w-full h-full cursor-pointer bg-[#09090B] border-[1px] border-white rounded-lg hover:bg-[#494159] text-white justify-center items-center flex">
                     <p className=" text-center">5.0</p>
                  </div>
               </div>
            </div>
            <div className="flex items-center justify-center rounded-b-lg p-6">
               <section className="flex w-full bg-[#8e489f] justify-center items-center gap-3 rounded-xl cursor-pointer">
                  <button
                     className=" w-[60%] cursor-pointer whitespace-nowrap inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                     onClick={() => airdropButton()}
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="w-4 h-4 mr-2"
                     >
                        <circle cx="8" cy="8" r="6"></circle>
                        <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
                        <path d="M7 6h1v4"></path>
                        <path d="m16.71 13.88.7.71-2.82 2.82"></path>
                     </svg>
                     Confirm Airdrop
                  </button>
               </section>
            </div>
         </div>
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
            className={" z-30"}
         />
      </div>
   );
}

export default Airdrop;
