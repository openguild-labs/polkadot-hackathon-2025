"use client";

import useReferralStore from "@/stores/referral.store";
import useWalletStore from "@/stores/wallet.store";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Button from "../common/Button";
import ModalAddReferralCode from "../referral/modal/ModalAddReferralCode";
import AnimationText from "./AnimationText";
import DevTeamLanding from "./DevTeam";
import MapPool from "./MapPool";
import OnchainActivity from "./OnchainActivity";
import PartnerDesc from "./PartnerDesc";
import Statistic from "./Statistic";
import StepInsurance from "./StepInsurance";
import WhyChoose from "./WhyChoose";
import dynamic from "next/dynamic";
import { useWallet } from "@suiet/wallet-kit";

// const Onboard = dynamic(() => import('@/components/Home/Onboard'), { ssr: false });

const Home = () => {
	const searchParams = useSearchParams();
	const { connected } = useWallet();
	const wallet = useWalletStore((state) => state.wallet);
	const [openRefCode, setOpenAddRefCode] = useReferralStore((state) => [
		state.openAddRefCode,
		state.setOpenAddRefCode,
	]);
	const ref = searchParams.get("ref");
	const refCode = localStorage.getItem("refCode");
	useEffect(() => {
		if (ref && !wallet?.refCode) {
			localStorage.setItem("refCode", ref);
		}
		if (refCode && wallet?.refCode === null && ref && connected) {
			setOpenAddRefCode(true);
		}
	}, [ref, wallet, refCode, connected]);

	return (
		<div>
			<div
				style={{ backgroundImage: "url(/assets/images/home/banner_bg.png)" }}
				className="max-w-desktop mx-auto h-max  lg:min-h-[630px] bg-contain lg:bg-right bg-top bg-no-repeat"
			>
				<div className="desktop-screen h-full lg:pt-[180px] pt-[310px] flex items-start justify-center flex-col">
					<div className="my-auto lg:w-1/3 w-full h-max px-4">
						<div className="flex flex-col lg:items-start items-center gap-y-4">
							<AnimationText
								contents={[
									["Change Risk", "To Payback"],
									["Cover", " Your Future"],
								]}
							/>
							<Link href="/buy-cover">
								<Button size="lg" variant="primary" className="w-max">
									Buy Cover
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>
			<div className="desktop-screen flex flex-col lg:gap-y-[160px] gap-y-[80px] lg:px-0 px-4 overflow-hidden">
				<div className="mt-[60px]">
					<Statistic />
				</div>
				<div>
					<MapPool />
				</div>
				<div>
					<WhyChoose />
				</div>
				<div>
					<StepInsurance />
				</div>
				<div>
					<PartnerDesc />
				</div>
			</div>
			<div>
				<OnchainActivity />
			</div>
			<div>
				<DevTeamLanding />
			</div>
			{openRefCode ? (
				<ModalAddReferralCode
					open={openRefCode}
					onClose={() => setOpenAddRefCode(false)}
				/>
			) : null}

			{/* <Onboard /> */}
		</div>
	);
};

export default Home;
