import { FormValue } from '@/@type/common.type';
import Button from '@/components/common/Button';
import useBalance from '@/hooks/useBalance';
import { useIsTablet } from '@/hooks/useMediaQuery';
import useAppStore from '@/stores/app.store';
import useBuyCoverStore from '@/stores/buy-cover.store';
import { cn } from '@/utils';
import { useWallet } from '@suiet/wallet-kit';
import { ENUM_INSURANCE_SIDE } from 'hakifi-formula';
import { FC, useEffect, useMemo } from 'react';
import { UseFormReturn, useFormState } from 'react-hook-form';
import { useAccount } from 'wagmi';

type SubmitButtonProps = {
    form: UseFormReturn<FormValue>;
    handleConfirmAction: () => void;
};

const SubmitButton: FC<SubmitButtonProps> = ({ handleConfirmAction, form }) => {
    const isTablet = useIsTablet();
    // const { connected } = useWallet();
    const { isConnected } = useAccount();
    const { side, toggleFormBuyCover, plan, errorFields } = useBuyCoverStore();
    const { toggleConnectWalletModal } = useAppStore();
    const handleToggleConnectWallet = () => {
        toggleFormBuyCover(false);
        toggleConnectWalletModal(true);
    };

    const { isValid, errors, dirtyFields } = useFormState({
        control: form.control,
    });

    const { balance, refetch } = useBalance();
    useEffect(() => {
        setTimeout(() => {
            refetch();
        }, 1500);
    }, []);

    const isDisableBuyCover = useMemo(() => {
        const isErrors = Object.values(errors).length > 0;
        return balance === 0 || isErrors || !isValid || errorFields.length > 0;
    }, [balance, errors, isValid, errorFields, dirtyFields]);

    return (
        <>
            {/* Submit button */}
            {isConnected ? (
                <Button
                    variant={isTablet ? "custom" : "primary"}
                    size="lg"
                    type="submit"
                    disabled={isDisableBuyCover}
                    onClick={form.handleSubmit(handleConfirmAction)}
                    className={cn(
                        "my-4 w-full justify-center",
                        !isDisableBuyCover &&
                        !isTablet &&
                        side === ENUM_INSURANCE_SIDE.BULL &&
                        "sm:hover:!bg-positive-label sm:hover:!text-typo-primary",
                        !isDisableBuyCover &&
                        !isTablet &&
                        side === ENUM_INSURANCE_SIDE.BEAR &&
                        "sm:hover:!bg-negative-label sm:hover:!text-typo-primary",
                        !isDisableBuyCover &&
                        isTablet &&
                        side === ENUM_INSURANCE_SIDE.BULL &&
                        "bg-positive-label !text-typo-primary",
                        !isDisableBuyCover &&
                        isTablet &&
                        side === ENUM_INSURANCE_SIDE.BEAR &&
                        "bg-negative-label !text-typo-primary"
                    )}
                    pointClassName="!bg-support-white">
                    Buy cover
                </Button>
            ) : (
                <Button
                    variant="primary"
                    size="lg"
                    type="button"
                    onClick={handleToggleConnectWallet}
                    className={cn(
                        "my-4 w-full justify-center",
                        isTablet &&
                        side === ENUM_INSURANCE_SIDE.BULL &&
                        "bg-positive-label !text-typo-primary",
                        isTablet &&
                        side === ENUM_INSURANCE_SIDE.BEAR &&
                        "bg-negative-label !text-typo-primary"
                    )}
                    pointClassName="!bg-support-white">
                    Connect wallet
                </Button>
            )}

        </>
    );
};

export default SubmitButton;