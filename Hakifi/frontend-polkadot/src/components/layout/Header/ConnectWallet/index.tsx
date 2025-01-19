"use client";

import { useIsTablet } from '@/hooks/useMediaQuery';
import useAppStore from '@/stores/app.store';
// import Profile from './Profile';
import { SuiWallets } from '@/components/ConnectWalletModal/SuiWallets';
import Button from '@/components/common/Button';
import DrawerWrapper from '@/components/common/Drawer';
import { cn } from '@/utils';
import { forwardRef } from 'react';
import Profile from './Profile';
import { useWallet } from '@suiet/wallet-kit';
import Modal from '@/components/common/Modal';
import { useAccount } from 'wagmi';

type ConnectWalletProps = {
    className?: string;
    onClick?: () => void;
};

const ConnectWallet = forwardRef<HTMLButtonElement, ConnectWalletProps>(({
    className,
    onClick,
}, forwardRef) => {
    const isTablet = useIsTablet();
    const { isConnected } = useAccount();
    const { isOpenConnectWallet, toggleConnectWalletModal } = useAppStore();
    const handleCloseModal = () => toggleConnectWalletModal(!isOpenConnectWallet);

    if (isConnected) {
        return <Profile />;
    }

    const handleToggleConnectModal = () => {
        toggleConnectWalletModal(true);
        onClick?.();
        console.log(isOpenConnectWallet);

    };

    if (isTablet) {
        return <>
            <Button
                ref={forwardRef}
                size="lg"
                onClick={handleCloseModal}
                variant="primary"
                className={cn('px-6 py-2', className)}
            >
                Connect Wallet
            </Button>
            <Modal
                isOpen={isOpenConnectWallet}
                onRequestClose={handleCloseModal}
                isMobileFullHeight
                useDrawer={false}
                modal={true}
            // contentClassName="px-4"
            >
                <section className="">
                    {/* <Wallets closeModal={handleCloseModal} /> */}
                    <SuiWallets closeModal={handleCloseModal} />
                </section>
            </Modal>
            {/* <DrawerWrapper
                isOpen={isOpenConnectWallet}
                handleOpenChange={handleCloseModal}
                classNameTitle="!text-title-24 text-typo-primary"
                title="Connect Wallet"
                content={
                    <section className="">

                        <SolanaWallets closeModal={handleCloseModal} />
                    </section>
                }
            >
                <Button
                    ref={forwardRef}
                    size="lg"
                    variant="primary"
                    className={cn('px-6 py-2', className)}
                >
                    Connect Wallet
                </Button>
            </DrawerWrapper> */}
        </>;
    }

    return (
        <>
            <Button
                size="lg"
                onClick={handleToggleConnectModal}
                variant="primary"
                className={cn('px-6 py-2', className)}
            >
                Connect Wallet
            </Button>
        </>
    );
});

export default ConnectWallet;
