import { SuiContext, SuiContextType } from "@/context";

import { useWallet } from "@suiet/wallet-kit";
import { useContext, useEffect } from "react";

const useBalance = () => {
    const { balance, refetch } = useContext(SuiContext) as SuiContextType;
    // const { connection } = useConnection();
    const { account } = useWallet();

    // const tokenAccount = useMemo(() => {
    //     if (!account?.address) return null;

    //     return getAssociatedTokenAddressSync(tokenPubkey, publicKey);
    // }, [publicKey]);

    // const balance = useMemo(() => {
    //     return tokenAccount ? balances[tokenAccount?.toBase58()] : 0
    // }, [tokenAccount, balances]);


    useEffect(() => {
        if (account?.address)
            refetch();
    }, [account]);

    const fetchBalance = () => {
        if (!account?.address) return;
        return refetch();
    };

    return { balance, refetch: fetchBalance };
};

export default useBalance;