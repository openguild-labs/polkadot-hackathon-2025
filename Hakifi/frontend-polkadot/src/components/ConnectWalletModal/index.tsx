"use client";

import { useIsTablet } from '@/hooks/useMediaQuery';
import useAppStore from '@/stores/app.store';
import Modal from '../common/Modal';
import { SuiWallets } from './SuiWallets';
import Wallets from './Wallets';

const ConnectWalletModal = () => {
  const { isOpenConnectWallet, toggleConnectWalletModal } = useAppStore((state) => state);
  const handleCloseModal = () => toggleConnectWalletModal(false);
  const isTablet = useIsTablet();
  if (!isTablet) return (
    <>
      <Modal
        isOpen={isOpenConnectWallet}
        isMobileFullHeight
        modal={true}
        onRequestClose={handleCloseModal}
        className="text-title-24 text-typo-primary"
        descriptionClassName="!min-h-0"
      >
        <Wallets closeModal={handleCloseModal} />
        {/* <>
          <p className="text-title-24 text-typo-primary text-center">Connect Wallet</p>
          <SuiWallets closeModal={handleCloseModal} />
        </> */}
      </Modal>
    </>
  );
  return null;
};

export default ConnectWalletModal;
