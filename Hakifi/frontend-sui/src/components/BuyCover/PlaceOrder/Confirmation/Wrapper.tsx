import { PairDetail } from "@/@type/pair.type";
import { memo } from "react";
import { STEP } from ".";
import StepConfirm from "./Confirm";
import StepSign from "./Sign";
import StepSuccess from "./Success";
import StepWaiting from "./Waiting";

type ConfirmInsuranceProps = {
    step: STEP;
    setStep: (step: STEP) => void;
    pair: PairDetail;
    onCloseModal: () => void;
};

const ConfirmationInsurance = ({
    step, setStep, pair, onCloseModal
}: ConfirmInsuranceProps) => {
    const handleOnCloseModal = () => {
        onCloseModal();
        setStep(STEP.CONFIRM);
    };

    return (
        <>
            {step === STEP.CONFIRM && (
                <StepConfirm
                    setStep={setStep}
                    pair={pair}
                    onCloseModal={handleOnCloseModal}
                />
            )}
            {step === STEP.SIGN && <StepSign />}
            {step === STEP.WAITING && (
                <StepWaiting asset={pair.asset} setStep={setStep} />
            )}
            {step === STEP.SUCCESS && (
                <StepSuccess onCloseModal={handleOnCloseModal} />
            )}
        </>
    );
};

export default memo(ConfirmationInsurance);