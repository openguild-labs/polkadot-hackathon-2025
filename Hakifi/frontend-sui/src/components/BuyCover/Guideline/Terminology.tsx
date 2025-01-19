import Modal from '@/components/common/Modal';
import { Separator } from '@/components/common/Separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/Tabs';
import Tag from '@/components/common/Tag';
import useAppStore from '@/stores/app.store';
import { GLOSSARY_MODE, STATUS_DEFINITIONS } from '@/utils/constant';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const Terminology = () => {
	const state = useMemo(() => Object.keys(STATUS_DEFINITIONS), []);
	const [activationMode, setActivationMode] = useState(GLOSSARY_MODE.TERMINOLOGY);

	const searchParams = useSearchParams();
	const status = searchParams.get('status');
	useEffect(() => {
		if (status) {
			setActivationMode(GLOSSARY_MODE.STATUS);
		}
	}, [status]);

	const [isOpenTerminology, toggleOpenTerminology] = useAppStore(state => [state.isOpenTerminology, state.toggleOpenTerminology]);
	return (
		<Modal
			isOpen={isOpenTerminology}
			isMobileFullHeight
			onRequestClose={toggleOpenTerminology}
			showCloseButton={true}
			className="text-typo-primary"
			modal={true}
			useDrawer={false}
		>
			<>
				<p className="text-title-24">
					Terms and Definition
				</p>
				<section className="flex flex-col justify-start items-center mt-5">
					<Tabs
						defaultValue={GLOSSARY_MODE.TERMINOLOGY}
						value={activationMode}
						onValueChange={setActivationMode}
						className="w-full"
						activationMode="automatic">
						<section className="border-b border-divider-secondary">
							<TabsList className="grid w-fit grid-cols-2 gap-4 lg:gap-5">
								<TabsTrigger
									value={GLOSSARY_MODE.TERMINOLOGY}
									// onClick={() => setActivationMode(GLOSSARY_MODE.TERMINOLOGY)}
									className=
									"text-tab-14 data-[state=active]:text-typo-accent data-[state=inactive]:text-typo-secondary data-[state=active]:border-typo-accent data-[state=inactive]:border-transparent border-b-2 w-fit pb-3 lg:pb-4 uppercase"
								>
									Insurance terms
								</TabsTrigger>
								<TabsTrigger
									value={GLOSSARY_MODE.STATUS}
									// onClick={() => setActivationMode(GLOSSARY_MODE.TERMINOLOGY)}
									className=
									"text-tab-14 data-[state=active]:text-typo-accent data-[state=inactive]:text-typo-secondary data-[state=active]:border-typo-accent data-[state=inactive]:border-transparent border-b-2 w-fit pb-3 lg:pb-4 uppercase"
								>
									Contract status
								</TabsTrigger>
							</TabsList>
						</section>

						<TabsContent
							value={GLOSSARY_MODE.TERMINOLOGY}
							className="text-left">
							<div className="py-3 sm:py-4 flex items-center justify-start text-body-14">
								<div className="flex-1 text-typo-primary">Insured value</div>
								<div className="flex-2 text-typo-secondary">
									Value of spot asset or derivative volume
								</div>
							</div>
							<Separator />
							<div className="py-3 sm:py-4 flex items-center justify-start text-body-14">
								<div className="flex-1 text-typo-primary">Market price</div>
								<div className="flex-2 text-typo-secondary">
									The current price of the insured asset
								</div>
							</div>
							<Separator />
							<div className="py-3 sm:py-4 flex items-center justify-start text-body-14">
								<div className="flex-1 text-typo-primary">Claim Price</div>
								<div className="flex-2 text-typo-secondary">
									The price triggering insurance payment
								</div>
							</div>
							<Separator />
							<div className="py-3 sm:py-4 flex items-center justify-start text-body-14">
								<div className="flex-1 text-typo-primary">Liquid. price</div>
								<div className="flex-2 text-typo-secondary">
									The price triggering contract liquidation
								</div>
							</div>
							<Separator />
							<div className="py-3 sm:py-4 flex items-center justify-start text-body-14">
								<div className="flex-1 text-typo-primary">Refund price</div>
								<div className="flex-2 text-typo-secondary">
									The price within the margin refund terms
								</div>
							</div>
							<Separator />
							<div className="py-3 sm:py-4 flex items-center justify-start text-body-14">
								<div className="flex-1 text-typo-primary">Period</div>
								<div className="flex-2 text-typo-secondary">
									Duration of insurance contract
								</div>
							</div>
							<Separator />
							<div className="py-3 sm:py-4 flex items-center justify-start text-body-14">
								<div className="flex-1 text-typo-primary">Claim rate</div>
								<div className="flex-2 text-typo-secondary">
									Ratio of insurance payment to initial margin
								</div>
							</div>
							<Separator />
							<div className="py-3 sm:py-4 flex items-center justify-start text-body-14">
								<div className="flex-1 text-typo-primary">Claim amount</div>
								<div className="flex-2 text-typo-secondary">
									Insurance payment value
								</div>
							</div>
							<Separator />
							<div className="py-3 sm:py-4 flex items-center justify-start text-body-14">
								<div className="flex-1 text-typo-primary">Margin</div>
								<div className="flex-2 text-typo-secondary">
									Margin to open insurance contract
								</div>
							</div>
							<Separator />


							{/* <div className="py-3 flex items-center text-body-14">
                            <div className="flex-1 text-typo-primary ">
                                {t('terminology.refund_amount')}
                            </div>
                            <div className="flex-[2] text-grey-1">
                                {t('terminology.refund_amount_des')}
                            </div>
                        </div>
                        <Separator /> */}
						</TabsContent>
						<TabsContent value={GLOSSARY_MODE.STATUS} className="text-left">
							{
								state.map((item, index) => {
									const { variant, title, description } = STATUS_DEFINITIONS[item];
									return <section key={`${item}-${index}`}>
										<div className="py-3 flex items-center text-body-14 gap-4">
											<div className="flex-1">
												<Tag
													variant={variant}
													text={title}
												/>
											</div>
											<div className="flex-2 text-typo-secondary">
												{description}
											</div>
										</div>
										<Separator />
									</section>;
								})
							}
						</TabsContent>
					</Tabs>
				</section>
			</>
		</Modal>
	);
};

export default Terminology;
