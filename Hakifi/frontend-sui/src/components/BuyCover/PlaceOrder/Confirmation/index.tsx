import { PairDetail } from "@/@type/pair.type";
import Modal from "@/components/common/Modal";
import { memo, useState } from "react";
import ConfirmationInsurance from "./Wrapper";

type ModalConfirmInsuranceProps = {
  isOpen: boolean;
  handleCloseModal: () => void;
  pair: PairDetail;
};

export enum STEP {
  CONFIRM = "CONFIRM",
  SIGN = "SIGN",
  WAITING = "WAITING",
  SUCCESS = "SUCCESS",
}

const ConfirmInsuranceModal = ({
  isOpen,
  handleCloseModal,
  pair,
}: ModalConfirmInsuranceProps) => {
  const [step, setStep] = useState<STEP>(STEP.CONFIRM);

  const handleOnCloseModal = () => {
    handleCloseModal();
    setStep(STEP.CONFIRM);
  };

  return (
    <Modal
      modal={true}
      isOpen={isOpen}
      isMobileFullHeight
      onRequestClose={handleOnCloseModal}
      showCloseButton={![STEP.SIGN, STEP.WAITING].includes(step as STEP)}
      useDrawer={false}
    >
      <ConfirmationInsurance
        onCloseModal={handleCloseModal}
        pair={pair}
        setStep={setStep}
        step={step}
      />
    </Modal>
  );
};

export default memo(ConfirmInsuranceModal);

