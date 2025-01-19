import { WalletConnect } from '@/components/WalletConnect';

export default function Test() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-8">Wallet Connection Test</h1>
            <WalletConnect />
        </div>
    );
}
