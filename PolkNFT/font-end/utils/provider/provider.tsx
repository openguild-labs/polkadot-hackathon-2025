import {
   createContext,
   ReactNode,
   useContext,
   useEffect,
   useMemo,
   useState,
} from "react";

interface Wallet {
   address: string;
   balance: number;
   assets: any;
}

const initialWallet: Wallet = {
   address: "",
   balance: 0,
   assets: [],
};
const WalletProvider = createContext<Wallet>(initialWallet);

export function BlockchainProvider({ children }: { children: ReactNode }) {
   const [address, setAddress] = useState<string>("");
   const [balance, setBalance] = useState<any>();
   const [assets, setAssets] = useState<any>();

   return (
      <WalletProvider.Provider value={{ address, balance, assets }}>
         {children}
      </WalletProvider.Provider>
   );
}

export const useMyContext = () => {
   const context = useContext(WalletProvider);
   if (!context) {
      throw new Error("useMyContext must be used within a MyProvider");
   }
   return context;
};
