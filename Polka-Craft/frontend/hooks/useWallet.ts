import { createThirdwebClient } from "thirdweb";
import { createWallet } from "thirdweb/wallets";
import { useState, useCallback } from 'react';
import { useActiveAccount, useConnect } from "thirdweb/react";

export type Providers = "thirdweb" | "okto" | "cdk";

interface Wallet {
    address: string;
    providerName: Providers;
}

interface UseWalletReturn {
    wallet: Wallet | null;
    connect: (providerName: Providers) => Promise<void>;
    disconnect: () => void;
    isConnecting: boolean;
    error: Error | null;
}

export function useWallet(): UseWalletReturn {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const thirdwebAddress = useActiveAccount();
    const thirdwebConnect = useConnect();

    const connect = useCallback(async (providerName: Providers) => {
        setIsConnecting(true);
        setError(null);

        try {
            if (providerName === "thirdweb") {
                console.log("Clicked thirdweb")
                const metamaskWallet = createWallet("io.metamask");
                await thirdwebConnect.connect(metamaskWallet);

                setWallet({
                    address: thirdwebAddress?.address || "",
                    providerName: "thirdweb"
                });
            } else if (providerName === "okto") {
                const client = createThirdwebClient({
                    clientId: "07edaeb20640aa496191f50d884c2dda",
                });

                const oktoWallet = createWallet("tech.okto");

                await oktoWallet.connect({
                    client,
                });

                setWallet({
                    address: thirdwebAddress?.address || "",
                    providerName: "okto"
                });
            } else if (providerName === "cdk") {
                setWallet({
                    address: "mock-cdk-address",
                    providerName: "cdk"
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to connect wallet'));
        } finally {
            setIsConnecting(false);
        }
    }, [thirdwebAddress]);

    const disconnect = useCallback(() => {
        setWallet(null);
        setError(null);
    }, []);

    return {
        wallet,
        connect,
        disconnect,
        isConnecting,
        error
    };
}

