import Checkbox from '@/components/common/Checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/common/Tabs';
import { useIsTablet } from '@/hooks/useMediaQuery';
import useAppStore from '@/stores/app.store';
import useInsuranceStore from '@/stores/insurance.store';
import useWalletStore from '@/stores/wallet.store';
import { cn } from '@/utils';
import { ORDER_LIST_MODE } from '@/utils/constant';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import ContractLoader from '../Loader/ContractLoader';
import { useWallet } from '@suiet/wallet-kit';
import { useAccount } from 'wagmi';

const DetailInsuranceModal = dynamic(() => import('@/components/BuyCover/Contract/Detail'),
    { ssr: false }
);

const CloseContract = dynamic(() => import('@/components/BuyCover/Contract/CloseContract'),
    { ssr: false }
);

const TabHistory = dynamic(() => import('@/components/BuyCover/Contract/TabHistory'), {
    loading: () => <ContractLoader />,
    ssr: false
});
const TabOpening = dynamic(() => import('@/components/BuyCover/Contract/TabOpening'), {
    loading: () => <ContractLoader />,
    ssr: false
});

const Contract = () => {
    const { isConnected } = useAccount();
    const isTablet = useIsTablet();
    const [currentTab, setCurrentTab] = useState(ORDER_LIST_MODE.OPENING);
    const handleChangeTab = (tab: string) => {
        setCurrentTab(tab);
    };
    const [accessToken] =
        useWalletStore((state) => [
            state.accessToken
        ]);
    const [hide, setHide] = useState(false);
    const handleHideOtherPair = (checked: boolean) => {
        setHideOtherSymbol();
        setHide(checked);
    };
    const [getInsuranceOpening, getInsuranceHistory, setHideOtherSymbol,] = useInsuranceStore(state => [
        state.getInsuranceOpening,
        state.getInsuranceHistory,
        state.setHideOtherSymbol,
    ]);
    const getDataInsurances = useCallback(() => {
        getInsuranceOpening({ page: 1 });
        getInsuranceHistory({ page: 1 });
    }, []);

    useEffect(() => {
        if (isConnected && accessToken) {
            getDataInsurances();
        }
    }, [currentTab, isConnected, accessToken]);

    const toggleConnectWalletModal = useAppStore(
        (state) => state.toggleConnectWalletModal,
    );

    return (
        <>
            <section
                data-tour="tab-covered"
                className={cn(
                    "flex items-center justify-between flex-wrap border-b border-t lg:border-t-0 border-divider-secondary px-5",
                    isTablet && "mx-4 px-0"
                )}>
                <Tabs
                    defaultValue={ORDER_LIST_MODE.OPENING}
                    className="pt-4"
                    onValueChange={handleChangeTab}
                    activationMode="automatic">
                    <TabsList className="flex items-center gap-5">
                        <TabsTrigger
                            value={ORDER_LIST_MODE.OPENING}
                            className={cn(
                                "text-tab-14 data-[state=inactive]:text-typo-secondary data-[state=active]:text-typo-accent pb-4 data-[state=active]:border-b data-[state=active]:border-typo-accent w-fit uppercase",
                            )}>
                            Available contracts
                        </TabsTrigger>
                        <TabsTrigger
                            value={ORDER_LIST_MODE.HISTORY}
                            className={cn(
                                "text-tab-14 data-[state=inactive]:text-typo-secondary data-[state=active]:text-typo-accent pb-4 data-[state=active]:border-b data-[state=active]:border-typo-accent w-fit",
                            )}>
                            CONTRACT HISTORY
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {
                    !isTablet && <div className="flex items-center space-x-2 mt-4 md:mt-0 py-1">
                        <Checkbox size="md" label="Hide other pairs" checked={hide} onChange={(event) => handleHideOtherPair(event.target.checked)} />
                    </div>
                }
            </section>
            {
                isTablet && <div className="flex items-center px-4 mt-5">
                    <Checkbox size="md" label="Hide other pairs" checked={hide} onChange={(event) => handleHideOtherPair(event.target.checked)} />
                </div>
            }

            {
                !isConnected ?
                    <section className="flex flex-col items-center justify-center min-h-[400px] gap-2">
                        <Image
                            width={124}
                            height={124}
                            quality={100}
                            src="/assets/images/icons/connect_wallet_icon.png"
                            alt="No data"
                        />
                        <section className="text-center text-typo-secondary text-body-14 mt-2">
                            Please <span className="text-typo-accent cursor-pointer" onClick={() => toggleConnectWalletModal(true)}>Connect wallet</span> to be able to use the feature
                        </section>
                    </section>
                    :
                    currentTab === ORDER_LIST_MODE.OPENING ? (
                        <TabOpening key={ORDER_LIST_MODE.OPENING} />
                    ) : (
                        <TabHistory key={ORDER_LIST_MODE.HISTORY} />
                    )
            }

            <DetailInsuranceModal />
            <CloseContract />
        </>
    );
};


export default Contract;