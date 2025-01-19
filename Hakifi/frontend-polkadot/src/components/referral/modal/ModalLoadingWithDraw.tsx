import Modal from '@/components/common/Modal';
import React from 'react';
import Image from 'next/image';
interface ModalLoadingWithDrawProps {
  open: boolean;
  onClose: () => void;
}

const ModalLoadingWithDraw: React.FC<ModalLoadingWithDrawProps> = (props) => {
  return (
    // Add your JSX code here
    <Modal
      isOpen={props.open}
      onRequestClose={props.onClose}
      modal
      useDrawer={false}
      contentClassName='px-4'
      descriptionClassName='!px-0'
      >
      <div>
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center">
            <Image
              width={124}
              height={124}
              quality={100}
              src="/assets/images/referral/waiting_contract.png"
              alt="waiting_contract"
              className="mt-5"
            />
          </div>
        </div>
        <div className="mt-5 text-center text-typo-secondary">
          <p>Commission withdrawing...</p>
        </div>
      </div>
    </Modal>
  );
};

export default ModalLoadingWithDraw;
