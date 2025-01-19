"use client";

import React from "react";
import ReferralInfo from "./ReferralInfo";
import ReferralStatistic from "./ReferralStatistic";
const ReferralTabs = () => {
	return (
		<div>
			<div className="w-full">
				<ReferralInfo />
			</div>
			<ReferralStatistic />
		</div>
	);
};

export default ReferralTabs;
