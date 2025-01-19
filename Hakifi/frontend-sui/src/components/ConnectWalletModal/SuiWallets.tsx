import { getNonce, login } from "@/apis/auth.api";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import useWalletStore from "@/stores/wallet.store";
import { cn } from "@/utils";
import { IWallet, useWallet } from "@suiet/wallet-kit";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import Button from "../common/Button";
import { useNotification } from "../common/Notification";
import { verifyPersonalMessage } from '@mysten/sui.js/verify';

type WalletsProps = {
    closeModal: () => void;
};

const getSignMessage = (nonce: string) => {
    return `Please sign this message to verify your address. Nonce: ${nonce}`;
};

export function SuiWallets({ closeModal }: WalletsProps) {
    const { configuredWallets, account, signPersonalMessage, verifySignedMessage, disconnect, select, } = useWallet();
    const { removeItem } = useLocalStorage("auth-storage");
    // const { wallets, select, publicKey, signMessage, disconnect } = useWallet();
    const [loading, setLoading] = useState(false);
    const notification = useNotification();
    const [setWallet, setAccessToken, reset] = useWalletStore(
        (state) => [
            state.setWallet,
            state.setAccessToken,
            state.reset
        ]
    );
    const listedWallets = useMemo(() => {

        return configuredWallets.filter(item => item.installed);
    }, [configuredWallets]);

    const handleWalletClick = useCallback(
        async (event: MouseEvent<HTMLButtonElement>, walletName: string) => {
            select(walletName);

            // await setTimeout(() => {
            //     setLoading(true);
            //     handleOnSignMessage;
            // }, 1500);

            // setLoading(false);
        },
        [select]
    );

    useEffect(() => {
        if (account) handleOnSignMessage();
    }, [account]);

    const handleOnSignMessage = useCallback(async () => {
        setLoading(true);
        try {
            if (!account) throw new Error("Wallet not connected!");

            if (!signPersonalMessage)
                throw new Error("Wallet does not support message signing!");
            const nonce = await getNonce(account.address);
            // const messageEncoded = new TextEncoder().encode(getSignMessage(nonce));
            const msgBytes = new TextEncoder().encode(getSignMessage(nonce));
            const result = await signPersonalMessage({
                message: msgBytes,
            });

            // const verifyResult = await verifySignedMessage(
            //     result,
            //     account.publicKey
            // );

            // const serializedSignature = bs58.encode(signature.signature);
            console.log("Signature: ", result.signature);
            // setSignature(serializedSignature);

            const data = await login({
                walletAddress: account.address,
                signature: result.signature,
            });

            setWallet(data.user);
            setAccessToken(data.accessToken);

            notification.success("Connect successfully!");
        } catch (error: any) {
            console.error(error);

            disconnect();
            reset();
            removeItem();
        } finally {
            // setLoading(false);
            closeModal();
        }
    }, [account?.address, signPersonalMessage]);


    return (
        <div className={cn("flex flex-col gap-y-5 p-0 w-full duration-300 ease-linear mt-5", loading && "items-center")}>
            {
                loading && <Loader2 className="my-4 animate-spin text-typo-primary h-[98px]" />
            }
            {!loading && listedWallets.map((wallet) => (
                <Button
                    key={wallet.name}
                    size="md"
                    point={false}
                    variant="outline"
                    customHeight={true}
                    className={cn(
                        "p-3 justify-start text-typo-primary hover:text-typo-accent bg-support-black border border-divider-secondary",
                        // !disabled ? "hover:bg-background-secondary hover:text-typo-accent hover:border-divider-primary" : "",
                        // className
                    )}
                    disabled={!wallet.installed}
                    onClick={(e) => handleWalletClick(e, wallet.name)}
                >
                    <Image
                        width={32}
                        height={32}
                        src={wallet.iconUrl}
                        alt={wallet.name}
                        className="mr-4 size-6"
                    />
                    <div className="text-body-16">{wallet.name}</div>
                </Button>
            ))}
        </div >
    );
}





