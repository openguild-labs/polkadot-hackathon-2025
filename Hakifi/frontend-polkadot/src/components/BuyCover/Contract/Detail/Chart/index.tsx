"use client";

import { IPairConfig } from "@/@type/insurance.type";
import { InsuranceChartParams } from "@/components/BuyCover/Chart/drawing";
import { useIsTablet } from "@/hooks/useMediaQuery";
import { cn } from "@/utils";
import { useRef } from "react";
import Glosbe from "./Glosbe";

type ChartProps = {
	symbol: string;
	decimals?: { symbol: number; price: number };
	isMobile?: boolean;
	pairConfig?: IPairConfig;
	isHistory?: boolean;
	onFullScreen?: (e: boolean) => void;
	className?: string;
	classContainer?: string;
	toolbar?: boolean;
	fullScreen: boolean;
	setFullScreen: (expand: boolean) => void;
	data: InsuranceChartParams;
};

const Chart = ({
	symbol,
	onFullScreen,
	classContainer,
	fullScreen,
	setFullScreen,
	data,
}: ChartProps) => {
	const isTable = useIsTablet();
	const container = useRef<HTMLDivElement>(null);

	return (
		<div
			ref={container}
			data-tour="chart"
			className={cn(
				!isTable && "min-h-[650px]",
				fullScreen && isTable && "w-[100vh] h-[100vw] fixed"
			)}
		>
			<div
				className={cn(
					"bg-white transition-all",
					fullScreen &&
						isTable &&
						"w-[100vh] h-[100vw] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90",
					classContainer
				)}
			>
				<Glosbe
					data={data}
					symbol={symbol}
					fullScreen={fullScreen}
					onFullScreen={(fullScreen: boolean) => setFullScreen(fullScreen)}
				/>
			</div>
		</div>
	);
};

export default Chart;
