import useWalletStore from '@/stores/wallet.store';
import { disableAutoConnect } from '@/web3/utils';
import { useDisconnect } from 'wagmi';
import useUserSocket from './useUserSocket';

const useDisconnectWallet = () => {
    const [reset] = useWalletStore((state) => [state.reset]);
    const { disconnect } = useUserSocket();
    const config = useDisconnect({
        onSuccess: () => {
            console.log("disconnect");
            disconnect();

            disableAutoConnect();
            config.reset();
            reset();
        },
        onError(error) {
            console.log('Error', error);
        },
    });
    return config;
};

export default useDisconnectWallet;
