import { USDT_MOON_ADDRESS } from "@/web3/constants";
import { useContext, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";

const useBalances = () => {
    const { address } = useAccount();
    const {data, refetch} = useBalance({
            address,
            token: USDT_MOON_ADDRESS
        })

    useEffect(() => {
        if (address)
            refetch();
    }, [address]);

    const fetchBalance = () => {
        if (!address) return;
        return refetch();
    };
    
    return { balance: data ? parseFloat(data.formatted) : 0, refetch: fetchBalance, data };
};

export default useBalances;