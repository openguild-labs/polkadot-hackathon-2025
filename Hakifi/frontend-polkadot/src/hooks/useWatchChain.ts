import useAppStore from '@/stores/app.store';
import useWalletStore from '@/stores/wallet.store';
import useUserSocket from './useUserSocket';

const useWatchChain = () => {

    const { disconnect } = useUserSocket();

    const { toggleIsSupportChainModal } = useAppStore();
    const [wallet] =
        useWalletStore((state) => [
            state.wallet,
        ]);
    // const handleConnectorUpdate = ({ account, chain }: ConnectorData) => {
    //     if (wallet) {
    //         if (account) {
    //             console.log("new account", account);
    //             disconnect();
    //         } else if (chain) {
    //             toggleIsSupportChainModal((chain?.id !== bscTestnet.id));
    //         }
    //     }
    // };
    // useEffect(() => {

    //     if (activeConnector) {
    //         toggleIsSupportChainModal(chain && (chain?.id !== bscTestnet.id));
    //     }

    //     if (activeConnector) {
    //         activeConnector.on("change", handleConnectorUpdate);
    //     }

    //     return () => activeConnector?.off("change", handleConnectorUpdate) as any;
    // }, [activeConnector]);

};

export default useWatchChain;