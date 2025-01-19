"use client";

import { getNonce, login } from '@/apis/auth.api';
import { getAuthUser } from '@/apis/users.api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import useUserSocket from '@/hooks/useUserSocket';
import useAppStore from '@/stores/app.store';
import useWalletStore from '@/stores/wallet.store';
import { useWallet } from '@suiet/wallet-kit';
import { useEffect } from 'react';
import { useNotification } from '../common/Notification';

const getSignMessage = (nonce: string) => {
  return `Please sign this message to verify your address. Nonce: ${nonce}`;
};

const Auth = () => {
  const notification = useNotification();
  const { isOpenConnectWallet } = useAppStore((state) => state);
  const { removeItem } = useLocalStorage("auth-storage");
  const { account, signPersonalMessage, verifySignedMessage } = useWallet();
  const { disconnect } = useWallet();
  const [wallet, setWallet, isLogging, setAccessToken, setIsLogging, reset] =
    useWalletStore((state) => [
      state.wallet,
      state.setWallet,
      state.isLogging,
      state.setAccessToken,
      state.setIsLogging,
      state.reset
    ]);

  const address = account?.address;

  // useWatchChain();
  useUserSocket();
  const loginWallet = async () => {
    if (!address) return;
    if (!signPersonalMessage)
      throw new Error("Wallet does not support message signing!");
    setIsLogging(true);
    try {
      const nonce = await getNonce(address);
      const messageEncoded = new TextEncoder().encode(getSignMessage(nonce));
      const result = await signPersonalMessage({
        message: messageEncoded,
      });

      // const verifyResult = await verifySignedMessage(
      //   result,
      //   account.publicKey
      // );

      // if (!verifyResult) {
      //   notification.error("Message signature invalid!");
      //   throw new Error("Message signature invalid!");
      // }

      const data = await login({
        walletAddress: account.address,
        signature: result.signature,
      });
      
      setWallet(data.user);
      setAccessToken(data.accessToken);
    } catch (error) {
      disconnect();
      reset();
      removeItem();
      let message = 'common:connect_error.default';
      if (error instanceof Error) {

        message = error.message;

      }
      notification.error(message);
      console.error('Connect error: ', error);
    }
    setIsLogging(false);
  };

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const wallet = await getAuthUser();
        if (wallet.user.walletAddress === address) {
          setAccessToken(wallet.accessToken);
          setWallet(wallet.user);
        } else {
          reset();
          removeItem();

          throw new Error('wallet is not same address');

        }
      } catch (error) {
        console.error('getAuthWallet Failed', error);
        loginWallet();
      }
    };

    if (address && !wallet && !isLogging && !isOpenConnectWallet) {
      fetchWallet();
    } else if (
      !!wallet &&
      !!address &&
      !isLogging &&
      wallet.walletAddress !== address
    ) {
      // reset();
      loginWallet();
    }
  }, [wallet, isLogging, address]);

  return null;
};

export default Auth;
