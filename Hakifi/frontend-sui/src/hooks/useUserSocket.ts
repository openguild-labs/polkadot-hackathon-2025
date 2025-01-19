import UserSocket from "@/socket/user.socket";
import useSocketStore from "@/stores/socket.store";
import useWalletStore from "@/stores/wallet.store";
import { useWallet } from "@suiet/wallet-kit";
import { useEffect, useRef } from "react";

const useUserSocket = () => {
    const { connected } = useWallet();
    const token = useWalletStore(state => state.accessToken);
    const socket = useRef<UserSocket | null>(null);

    const { setSocket, setIsSocketConnected } = useSocketStore();
    const onConnect = () => {
        setIsSocketConnected(true);
    };
    const onDisconnect = () => {
        setSocket(undefined);
        setIsSocketConnected(false);
    };

    const disconnect = () => {
        socket.current?.removeInstance();
        socket.current?.disconnect();
    };

    useEffect(() => {
        if (token) {
            socket.current = UserSocket.getInstance(token as string);
            socket.current.connect();
            setSocket(socket.current);
        }

        socket.current?.on('connect', onConnect);
        socket.current?.on('disconnect', onDisconnect);
        return () => {
            socket.current?.off('connect', onConnect);
            socket.current?.off('disconnect', onDisconnect);
        };
    }, [token, connected]);

    return {
        disconnect
    };
};

export default useUserSocket;