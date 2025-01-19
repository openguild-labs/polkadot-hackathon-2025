import colors from "@/colors";
import { cn } from "@/utils";
import range from "lodash/range";

import Button from "@/components/common/Button";
import ArrowIcons from "@/components/common/Icons/ArrowIcon";
import CloseIcon from "@/components/common/Icons/CloseIcon";
import { useIsTablet } from "@/hooks/useMediaQuery";
import useAppStore from "@/stores/app.store";
import useBuyCoverStore from "@/stores/buy-cover.store";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { useEffect, useMemo, useRef, useState } from "react";
import Tour, { ReactourStep, ReactourStepContentArgs } from "reactour";

const TourWrapper = () => {
	const { startOnboard, setStartOnboard } = useAppStore((state) => state);
	const isTablet = useIsTablet();
	const [step, setStep] = useState(0);
	const refGuide = useRef<any>(null);

	const onClose = (e: boolean) => {
		if (!e) {
			setTimeout(
				() => {
					if (refGuide.current.state.current === tourConfig.length - 1) {
						setStartOnboard(false);
					} else {
						refGuide.current.nextStep();
					}
				},
				refGuide.current.state.current === 1 ? 500 : 0
			);
		} else {
			setStartOnboard(false);
		}
	};

	const getCurrentStep = (step: number) => {
		if (step === 2) {
			window.scrollTo(0, 0);
		}
		setStep(step);
	};

	const tourConfig: ReactourStep[] = [
		{
			selector: '[data-tour="market"]',
			content: (props: ReactourStepContentArgs) => (
				<Content title="Asset" {...props} onClose={onClose}>
					Choose your asset
				</Content>
			),
			position: "bottom",
		},
		{
			selector: '[data-tour="chart"]',
			content: (props: ReactourStepContentArgs) => (
				<Content title="Chart" {...props} onClose={onClose}>
					View price milestones related to your contracts. You can
					expand/collapse the chart if needed
				</Content>
			),
			position: isTablet ? "bottom" : "right",
		},
		{
			selector: '[data-tour="place-order"]',
			content: (props: ReactourStepContentArgs) => (
				<Content
					title="Input contract information"
					{...props}
					onClose={onClose}>
					<ul className="list-disc pl-4 text-typo-secondary">
						<li>
							Insured value - Value of spot asset or derivative position to be
							insured.
						</li>
						<li>Margin to open an insurance contract</li>
						<li>Claim Price - The price triggering insurance payment</li>
						<li>Period - Duration of the contract</li>
					</ul>
				</Content>
			),
			position: isTablet ? "bottom" : "left",
		},
		{
			selector: '[data-tour="confirm-order"]',
			content: (props: ReactourStepContentArgs) => (
				<Content title="Insurance benefit" {...props} onClose={onClose}>
					<ul className="list-disc pl-4">
						<li>
							Claim Amount (Claim Ratio) - Insurance payment received when
							Market price reaches Claim price and payment ratio compared to
							initial margin
						</li>
						<li>
							Profit - The profit from insurance payment excluding the margin
						</li>
					</ul>
				</Content>
			),
			position: isTablet ? "top" : "left",
		},
		{
			selector: '[data-tour="tab-covered"]',
			highlightedSelectors: ['[data-tour="tab-covered2"]'],
			content: (props: ReactourStepContentArgs) => (
				<Content
					title="Follow the progress of insurance contracts"
					{...props}
					onClose={onClose}>
					Track progress and view contract details in the Contract History and
					Avalable Contracts sections.
				</Content>
			),
			position: "top",
		},
	];

	const { toggleFormBuyCover } = useBuyCoverStore();
	useEffect(() => {
		isTablet && toggleFormBuyCover([2, 3].includes(step));
	}, [step, isTablet]);

	const currentPosition = useMemo(
		() => tourConfig[step].position,
		[refGuide?.current?.state?.current, tourConfig]
	);
	const disableBody = (target: HTMLDivElement) => disableBodyScroll(target);
	const enableBody = (target: HTMLDivElement) => enableBodyScroll(target);
	return (
		<Tour
			onRequestClose={() => onClose(false)}
			steps={tourConfig}
			isOpen={startOnboard}
			showCloseButton={false}
			className={cn("reactour_hakifi", currentPosition)}
			rounded={6}
			startAt={0}
			maskSpace={4}
			disableInteraction
			disableKeyboardNavigation
			getCurrentStep={getCurrentStep}
			highlightedMaskClassName="bg-background-scrim"
			showNavigation={false}
			showButtons={false}
			showNumber={false}
			ref={refGuide}
			maskClassName="guideline"
			accentColor={colors.background.tertiary}
			inViewThreshold={isTablet ? 300 : 100}
			onAfterOpen={disableBody}
			onBeforeClose={enableBody}
			closeWithMask={false}
		/>
	);
};

const Content = ({ title, children, step, onClose, goTo, close }: any) => {
	const steps = 5;
	// console.log("step", step);
	return (
		<div
			className={cn(
				"relative w-full rounded min-w-[354px]",
				step === 1 && "sm:min-w-[488px]",
				step === 2 && "sm:min-w-[404px]",
				step === 3 && "sm:min-w-[404px]",
				step === 4 && "sm:min-w-[404px]",
				step === 5 && "sm:min-w-[404px]"
			)}>
			<div
				id={`guideline-step-${step}`}
				className="flex flex-col gap-5 bg-background-tertiary p-5 rounded ">
				<div
					className={cn(
						"flex items-centerspace-x-4",
						step > 1 ? "justify-between" : "justify-end"
					)}>
					{step > 1 ? (
						<Button
							size="lg"
							onClick={() => {
								console.log("click", step);
								goTo(step - 2);
							}}>
							<ArrowIcons className="rotate-180" />
						</Button>
					) : null}

					<Button size="lg" id="close" onClick={() => onClose(true)}>
						<CloseIcon />
					</Button>
				</div>
				<div className="">
					<div className="text-title-20 md:text-title-24 text-typo-primary">
						{title}
					</div>
					<div className="text-typo-secondary text-body-14  md:text-body-16 mt-3">
						{children}
					</div>
				</div>
				<section className="flex justify-between items-center">
					<div className="flex space-x-1 w-full">
						{range(steps).map((index) => (
							<div
								key={index}
								className={cn(
									"max-w-6 sm:max-w-10 w-full h-1 rounded",
									step > index
										? "bg-background-primary"
										: "bg-background-quaternary"
								)}
							/>
						))}
					</div>
					{step !== steps ? (
						<Button
							size="lg"
							variant="primary"
							className="px-11"
							id="next"
							onClick={() => onClose(false)}>
							Next
						</Button>
					) : (
						<Button
							variant="primary"
							point={true}
							size="lg"
							className="px-11"
							id="close"
							onClick={close}>
							Done
						</Button>
					)}
				</section>
			</div>
		</div>
	);
};

export default TourWrapper;
