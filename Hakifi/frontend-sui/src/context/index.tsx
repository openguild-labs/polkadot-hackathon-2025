import useWalletStore from "@/stores/wallet.store";
import { handleRequest } from "@/utils/helper";
import { USDT_SUI_ADDRESS } from "@/web3/constants";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { useWallet } from "@suiet/wallet-kit";
import throttle from "lodash.throttle";
import { createContext, ReactNode, useCallback, useMemo, useState } from "react";

export type SuiContextType = {
    SUIClient: SuiClient;
    balance: number,
    refetch: () => void;
};

const SuiContext = createContext<SuiContextType | null>(null);

async function getTokenBalanceWeb3(
    client: SuiClient,
    address: string
) {
    if (!address) return 0;

    const [err, response] = await handleRequest(client.getBalance({
        owner: address,
        coinType: USDT_SUI_ADDRESS,
    }));

    if (err) return 0;
    console.log(response);
    if (response.totalBalance == null) return 0;
    return response.totalBalance / 10 ** 2;
}

// A "provider" is used to encapsulate only the
// components that needs the state in this context
function SuiProvider({ children }: { children: ReactNode; }) {
    const { account } = useWallet();
    const [balance, setBalance] = useState(0);
    const SUIClient = useMemo(() => new SuiClient({ url: getFullnodeUrl("testnet") }), [SuiClient]);

    const fetchBalance = useCallback(throttle(async () => {
        if (SUIClient) {
            const balance = await getTokenBalanceWeb3(SUIClient, account?.address || '');
            setBalance(balance);
        }
    }, 1000), [SUIClient, account?.address]);

    return (
        <SuiContext.Provider value={{ SUIClient, balance, refetch: fetchBalance }}>
            {children}
        </SuiContext.Provider>
    );
}

export { SuiContext, SuiProvider };
