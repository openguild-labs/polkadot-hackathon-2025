import Button from '@/components/common/Button';
import Checkbox from '@/components/common/Checkbox';
import Modal from '@/components/common/Modal';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import useAppStore from '@/stores/app.store';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

const Onboard = () => {
    const { getItem, setItem } = useLocalStorage("intro-home");
    const router = useRouter();
    const [show, setShow] = useState(false);
    const handleToggleShow = useCallback(() => {
        setShow(status => !status);
    }, []);

    const [hide, setHide] = useState(false);
    const handleOnSetHide = (event: ChangeEvent<HTMLInputElement>) => {
        setHide(event.target.checked);
        setItem(event.target.checked);
    };

    const [setStartOnboard, toggleOpenTerminology] = useAppStore(state => [state.setStartOnboard, state.toggleOpenTerminology]);

    const handleBuycoverRedirect = () => {
        router.push("/buy-cover");
    };
    const handleLinkCampage = useCallback(() => {
        window.open('https://x.com/hakifi_io/status/1783767983778910644', '_blank')
    }, []);

    useEffect(() => {
        if (!getItem()) handleToggleShow();
    }, []);
    // const { isSupportChain } = useAppStore();
    const handleOutSideClick = (e: any) => {

        handleToggleShow();
    };

    return (
        <Modal
            modal={true}
            isOpen={show}
            isMobileFullHeight
            onRequestClose={handleToggleShow}
            useDrawer={false}
            contentClassName="bg-onboard bg-cover bg-no-repeat"
        // onInteractOutside={handleOutSideClick}
        >
            <>
                <p className="text-heading-3 text-typo-accent text-center">Beta Testnet is now Live</p>
                <section className="relative flex flex-col items-center gap-5 mt-12 border border-divider-primary h-[205px]">
                    <Image
                        src="/assets/images/home/onboard_home.png"
                        width={295}
                        height={250}
                        className="absolute top-[22px]"
                        alt="onboard"
                        priority
                    />
                    <section className="text-center absolute top-[-22px] bg-background-tertiary">
                        <p className="text-heading-4">Ready for a new way to</p>
                        <p className="text-heading-4 ">protect your assets?</p>
                    </section>
                </section>

                <div className="flex items-center justify-center mt-16">
                    <Checkbox size="lg" label="Do not show this again" labelClassName="text-typo-accent" checkClassName="border-typo-accent" checked={hide} onChange={handleOnSetHide} />
                </div>


                <section className="mt-8 flex items-center gap-4 flex-wrap flex-col w-full">
                    <Button size="lg" onClick={handleBuycoverRedirect} variant="primary" className="w-full flex justify-center ">
                        BUY COVER
                    </Button>
                    <Button size="lg" onClick={handleLinkCampage} variant="outline" className="w-full flex justify-center">
                        EARN UP TO $100!
                    </Button>
                </section>
            </>

        </Modal>
    );
};

export default Onboard;