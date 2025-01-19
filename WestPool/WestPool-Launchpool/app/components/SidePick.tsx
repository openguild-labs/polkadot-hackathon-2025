import { useState } from "react";
import { useCombinedStore, useCreateOfferStore } from "../zustand/store";
import { OfferType } from "@prisma/client";
// import { OfferType } from "@/prisma/enum";


const SidePick = () => {
    const [isBuyer, setIsBuyer] = useState(true);
    const {
        role,
        setRole
    } = useCombinedStore();



    const handleBuyer = () => {
        setIsBuyer(true);
        setRole(OfferType.Buy);
    };

    const handleSeller = () => {
        setIsBuyer(false);
        setRole(OfferType.Sell);
    };

    return (
        <div className="flex justify-center">
            <div className="border border-gray-500 rounded-xl w-6/12  bg-transparent">
                <div className="grid grid-cols-2">
                    {/* Buyer Button */}
                    <button
                        className={`text-center text-3xl font-semibold py-3 rounded-l-xl transition-all duration-300 ${isBuyer
                            ? "bg-black text-green-500 border-green-500 border-2"
                            : "bg-transparent text-white border-gray-500 border"
                            }`}
                        onClick={handleBuyer}
                    >
                        BE A BUYER
                    </button>

                    {/* Seller Button */}
                    <button
                        className={`text-center text-3xl font-semibold py-3 rounded-r-xl transition-all duration-300 ${!isBuyer
                            ? "bg-black text-red-500 border-red-500 border-2"
                            : "bg-transparent text-white border-gray-500 border"
                            }`}
                        onClick={handleSeller}
                    >
                        BE A SELLER
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SidePick;
