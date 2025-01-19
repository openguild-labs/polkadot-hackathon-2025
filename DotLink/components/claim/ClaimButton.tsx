'use client';

import { Button } from '@/components/ui/button';
import { WalletIcon } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useClaimTransaction } from '@/hooks/useClaimTransaction';

interface ClaimButtonProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function ClaimButton({ isLoading, setIsLoading }: ClaimButtonProps) {
  const { address, connect } = useWallet();
  const { handleClaim } = useClaimTransaction(setIsLoading);

  if (!address) {
    return (
      <Button 
        className="w-full rounded-full blob-button bg-primary text-primary-foreground"
        onClick={connect}
      >
        <WalletIcon className="mr-2 h-5 w-5" />
        Connect Wallet to Claim
      </Button>
    );
  }

  return (
    <Button 
      className="w-full rounded-full blob-button"
      onClick={handleClaim}
      disabled={isLoading}
    >
      {isLoading ? 'Claiming...' : 'Claim Tokens'}
    </Button>
  );
}