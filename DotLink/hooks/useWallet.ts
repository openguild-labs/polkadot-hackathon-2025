'use client';

import { useState, useCallback } from 'react';

export function useWallet() {
  const [address, setAddress] = useState<string>();

  const connect = useCallback(async () => {
    // Implement Polkadot.js wallet connection
    try {
      // Simulated connection for now
      setAddress('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(undefined);
  }, []);

  return {
    address,
    connect,
    disconnect,
  };
}