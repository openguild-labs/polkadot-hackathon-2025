"use client";
import { useState } from 'react';
import { useWalletContext } from '@/providers/WalletProvider';
import { Providers } from '@/hooks/useWallet';

type ChainType = 'EVM' | 'MOVE';

export function WalletConnect() {
    const { wallet, connect, disconnect, isConnecting } = useWalletContext();
    const [isMainModalOpen, setIsMainModalOpen] = useState(false);
    const [selectedChain, setSelectedChain] = useState<ChainType | null>(null);

    const handleChainSelect = (chain: ChainType) => {
        setSelectedChain(chain);
    };

    const handleProviderSelect = async (provider: Providers) => {
        try {
            await connect(provider);
            setIsMainModalOpen(false);
            setSelectedChain(null);
        } catch (error) {
            console.error('Failed to connect:', error);
        }
    };

    const handleDisconnect = () => {
        disconnect();
        setIsMainModalOpen(false);
        setSelectedChain(null);
    };

    return (
        <div className="flex flex-col items-center justify-center text-black">
            {!wallet ? (
                <button
                    onClick={() => setIsMainModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Connect Wallet
                </button>
            ) : (
                <button
                    onClick={handleDisconnect}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Disconnect
                </button>
            )}

            {/* Main Modal */}
            {isMainModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[320px]">
                        <h2 className="text-xl font-bold mb-4">Select Chain</h2>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleChainSelect('EVM')}
                                className="w-full px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                EVM
                            </button>
                            <button
                                onClick={() => handleChainSelect('MOVE')}
                                className="w-full px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Move
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                setIsMainModalOpen(false);
                                setSelectedChain(null);
                            }}
                            className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Provider Selection Modal */}
            {selectedChain && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[320px]">
                        <h2 className="text-xl font-bold mb-4">
                            Select {selectedChain} Provider
                        </h2>
                        <div className="space-y-3">
                            {selectedChain === 'EVM' ? (
                                <>
                                    <button
                                        onClick={() => handleProviderSelect('thirdweb')}
                                        className="w-full px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                        disabled={isConnecting}
                                    >
                                        Thirdweb
                                    </button>
                                    <button
                                        onClick={() => handleProviderSelect('okto')}
                                        className="w-full px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                        disabled={isConnecting}
                                    >
                                        Okto
                                    </button>
                                    <button
                                        onClick={() => handleProviderSelect('cdk')}
                                        className="w-full px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                        disabled={isConnecting}
                                    >
                                        CDK
                                    </button>
                                </>
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    Move providers coming soon...
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setSelectedChain(null)}
                            className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                        >
                            Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 