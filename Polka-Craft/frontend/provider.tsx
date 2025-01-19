"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base } from "viem/chains";
import { Network, SatsWagmiConfig } from "@gobob/sats-wagmi";
import { ThirdwebProvider } from "thirdweb/react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { WalletProvider } from "./providers/WalletProvider";
import { createThirdwebClient } from "thirdweb";
import { StarknetProvider } from "./components/starknet-provider";

export const client = createThirdwebClient({
  clientId: "07edaeb20640aa496191f50d884c2dda"
});

const queryClient = new QueryClient();

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        <StarknetProvider>
          <OnchainKitProvider
            apiKey="uaBZtCjdJYxz2ViQAjIaEq2e5RDirLBY"
            chain={base}
          >
            <SatsWagmiConfig
              network={"testnet" as Network}
              queryClient={queryClient}
            >
              <WalletProvider>{children}</WalletProvider>
            </SatsWagmiConfig>
          </OnchainKitProvider>
        </StarknetProvider>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}
