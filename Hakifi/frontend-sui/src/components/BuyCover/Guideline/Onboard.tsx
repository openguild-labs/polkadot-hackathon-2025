import Button from '@/components/common/Button';
import Checkbox from '@/components/common/Checkbox';
import Modal from '@/components/common/Modal';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import useAppStore from '@/stores/app.store';
import Image from 'next/image';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

const Onboard = () => {
    const { getItem, setItem } = useLocalStorage("intro-buy-cover");

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
    
    const handleOnboard = () => {
        handleToggleShow();
        if (setStartOnboard) setStartOnboard(true);
    };
    const handleToggleTerminologyModal = useCallback(() => {
        handleToggleShow();
        toggleOpenTerminology();
    }, []);

    useEffect(() => {
        if (!getItem()) handleToggleShow();
    }, []);
    const { isSupportChain } = useAppStore();
    const handleOutSideClick = (e: any) => {

        if (isSupportChain) {

            e.preventDefault();
        } else {
            handleToggleShow;
        }
    };

    return (
        <Modal
            modal={true}
            isOpen={show}
            isMobileFullHeight
            onRequestClose={handleToggleShow}
            useDrawer={false}
            onInteractOutside={handleOutSideClick}
        >
            <>
                <section className="flex flex-col items-center gap-5">
                    <Image
                        src="/assets/images/Onboard.png"
                        width={495}
                        height={237}
                        className=""
                        alt="onboard"
                        priority
                    />
                    <section className="text-center">
                        <p className="text-title-24 text-typo-primary">Welcome to Hakifi</p>
                        <section className="mt-3 text-typo-secondary">
                            <p>Are you a new user? Click <span className="text-typo-primary">“See tutorial Now”</span></p>
                            <p>to discover how to create and tracking a contract!</p>
                        </section>
                        <div className="flex items-center justify-center mt-4">
                            <Checkbox size="lg" label="Do not show this again" checked={hide} onChange={handleOnSetHide} />
                        </div>
                    </section>
                </section>


                <section className="mt-8 flex items-center gap-4 flex-wrap flex-col w-full">
                    <Button size="lg" onClick={handleOnboard} variant="primary" className="w-full flex justify-center">
                        See tutorial now
                    </Button>
                    <Button size="lg" onClick={handleToggleTerminologyModal} variant="outline" className="w-full flex justify-center">
                        Terms and Definition
                    </Button>
                </section>
            </>

        </Modal>
    );
};

export default Onboard;