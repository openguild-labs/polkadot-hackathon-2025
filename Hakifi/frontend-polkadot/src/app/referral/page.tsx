/* eslint-disable react-hooks/rules-of-hooks */

import dynamic from "next/dynamic";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const ReferralPage = dynamic(() => import("@/components/referral"));

const Referral = () => {
	return (
		<div className="w-full mx-auto h-full bg-support-black">
			<ReferralPage />
		</div>
	);
};

export default Referral;


