import useSocketStore from "@/stores/socket.store";
import { useWallet } from "@suiet/wallet-kit";
import { useEffect } from "react";
import { useAccount } from "wagmi";

const useEventSocket = (
    event: string,
    callback: (data: any) => void,
) => {
    const {isConnected} = useAccount()
    // const { connected } = useWallet();
    const { socket, isSocketConnected } = useSocketStore();

    useEffect(() => {
        if (!isConnected) {
            return;
        }
        if (!isSocketConnected && !isConnected) {
            console.log("Log out disconnect");
            socket?.disconnect();
        }

        socket?.subscribe(event, callback);
        return () => {
            socket?.unsubscribe(event, callback);
        };
    }, [callback, isConnected, isSocketConnected]);
};

export default useEventSocket;