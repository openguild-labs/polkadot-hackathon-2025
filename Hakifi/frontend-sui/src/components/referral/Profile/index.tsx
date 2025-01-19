import React, { useEffect, useState } from "react";
import OverviewChart from "./OverviewChart";
import OverviewStatistic from "./OverviewStatistic";
import { getPnlUser } from "@/apis/referral.api";
import dayjs from "dayjs";
import useWalletStore from "@/stores/wallet.store";
import isoWeek from "dayjs/plugin/isoWeek";
import InfoUser from "./InfoUser";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/common/Tabs";
import OverviewIcon from "@/components/common/Icons/OverViewIcon";
import { DoubleUserIcon } from "@/components/common/Icons/UserIcon";
import ReferralTabs from "../referralTab";
import useReferralStore from "@/stores/referral.store";
import { useSearchParams } from "next/navigation";
dayjs.extend(isoWeek);

const Profile: React.FC = () => {
	const [tabs, setTabs] = useState<"referral" | "overview">("overview");
	const [filter, setFilter] = useState<string>("week");
	const [setOpenModalInfo, getUserStats] = useReferralStore((state) => [
		state.setOpenModalInfo,
		state.getUserStats,
	]);
	const [wallet] = useWalletStore((state) => [state.wallet]);
	const [data, setData] = React.useState<any>([]);
	const searchParams = useSearchParams();
	const tab = searchParams.get("tab");
	const params = React.useMemo(() => {
		switch (filter) {
			case "week": {
				return {
					from: dayjs().add(-7, "day").startOf("day").valueOf(),
					to: dayjs().endOf("day").valueOf(),
				};
			}
			case "month": {
				return {
					from: dayjs().add(-30, "day").startOf("day").valueOf(),
					to: dayjs().endOf("day").valueOf(),
				};
			}
			case "year": {
				return {
					from: dayjs().add(-365, "day").startOf("year").valueOf(),
					to: dayjs().endOf("day").valueOf(),
				};
			}
			default: {
				return undefined;
			}
		}
	}, [filter]);
	const handleGetPnlUser = async () => {
		try {
			const res = await getPnlUser(
				params
					? {
						from: dayjs(params?.from).startOf("day").toISOString(),
						to: dayjs(params?.to).endOf("day").toISOString(),
					}
					: undefined
			);
			setData(res);
		} catch (error) { }
	};
	useEffect(() => {
		handleGetPnlUser();
		getUserStats();

	}, [params, wallet]);

	useEffect(() => {
		if (tab) {
			setTabs(tab as "overview" | "referral");
		}


	}, []);

	return (
		<div className="bg-background-tertiary lg:h-[calc(100vh-66px)] h-max overflow-y-auto custom-scroll">
			<div className="border-b border-divider-secondary pb-5">
				<InfoUser handleOpenModalEdit={() => setOpenModalInfo(true)} />
			</div>
			<Tabs
				activationMode="manual"
				defaultValue="overview"
				className="w-full p-5"
				value={tabs}>
				<TabsList className="flex items-center gap-x-5 w-full justify-start border-divider-secondary border-b !mb-1">
					<TabsTrigger
						value="overview"
						onClick={() => setTabs("overview")}
						className="flex items-center uppercase gap-x-2 text-sm font-determination tracking-widest hover:text-typo-accent data-[state=active]:text-typo-accent text-typo-secondary data-[state=active]:border-typo-accent data-[state=active]:border-b py-4 ">
						<OverviewIcon />
						<p>Overview</p>
					</TabsTrigger>
					<TabsTrigger
						value="referral"
						onClick={() => setTabs("referral")}
						className="flex items-center gap-x-2 uppercase text-sm font-determination tracking-widest hover:text-typo-accent py-4 data-[state=active]:text-typo-accent text-typo-secondary data-[state=active]:border-typo-accent data-[state=active]:border-b">
						<DoubleUserIcon /> <p>Referral</p>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="overview">
					<div className="flex w-full flex-col items-start lg:flex-nowrap">
						<div className="w-full lg:w-full">
							<OverviewChart
								data={data}
								filter={filter}
								setFilter={setFilter}
							/>
						</div>
						<OverviewStatistic />
					</div>
				</TabsContent>
				<TabsContent value="referral">
					<ReferralTabs />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Profile;
