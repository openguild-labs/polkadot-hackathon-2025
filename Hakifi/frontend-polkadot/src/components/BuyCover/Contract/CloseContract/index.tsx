import { cancelInsuranceApi } from '@/apis/insurance.api';
import colors from '@/colors';
import Button from '@/components/common/Button';
import WarningIcon from '@/components/common/Icons/WarningIcon';
import Modal from '@/components/common/Modal';
import { useNotification } from '@/components/common/Notification';
import useInsuranceStore from '@/stores/insurance.store';
import { handleRequest } from '@/utils/helper';
import { Loader2 } from 'lucide-react';
import { memo, useState } from 'react';

const CloseContract = () => {
    const [loading, setLoading] = useState(false);
    const [isOpenCloseModal, toggleCloseModal, insuranceSelected] = useInsuranceStore(state => [
        state.isOpenCloseModal,
        state.toggleCloseModal,
        state.insuranceSelected
    ]);
    const notifications = useNotification();
    const handleConfirmClose = async () => {
        setLoading(true);
        const [err, response] = await handleRequest(cancelInsuranceApi(insuranceSelected?.id as string));
        if (err) return;
        setLoading(false);
        toggleCloseModal();

        notifications.success('Close contract successfully!');
    };

    // const changeStep = (step: STEP, insurance?: Insurance) => {
    //     setStep(() => {
    //         setInsurance(insurance as Insurance);
    //         setInsuranceSelected(insurance as Insurance);
    //         return step;
    //     });
    // };

    return (
        <Modal
            modal={true}
            isOpen={isOpenCloseModal}
            isMobileFullHeight
            onRequestClose={toggleCloseModal}
        >
            <div className="flex flex-col items-center">
                <WarningIcon width={80} height={80} color={colors.warning.DEFAULT} />
                <p className="text-title-24 text-typo-primary text-center mt-5">
                    Close insurance contract
                </p>

                <p className="text-center text-body-16 text-typo-secondary mt-3">
                    Do you want to end your insurance policy early
                    and miss out on profits?
                </p>


                <Button size="lg" variant="primary" className="w-full mt-8 justify-center" onClick={handleConfirmClose} disabled={loading}>
                    {
                        !loading ? "Confirm" : <Loader2 className="animate-spin text-typo-primary" />
                    }
                </Button>
            </div>
        </Modal >
    );
};

export default memo(CloseContract);