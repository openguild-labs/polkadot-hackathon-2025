
import { createContext, useContext, ReactNode } from 'react';
import { useWallet, type Providers } from '@/hooks/useWallet';

interface WalletContextValue {
  wallet: {
    address: string;
    providerName: Providers;
  } | null;
  connect: (providerName: Providers) => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  error: Error | null;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const walletState = useWallet();

  return (
    <WalletContext.Provider value={walletState}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
} 
