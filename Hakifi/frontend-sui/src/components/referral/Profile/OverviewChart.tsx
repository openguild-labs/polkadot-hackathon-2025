import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import dayjs from "dayjs";
import clsx from "clsx";
import { formatNumber } from "@/utils/format";
import colors from "@/colors";
import {
	SelectGroup,
	SelectContent,
	SelectTrigger,
	Select,
	SelectItem,
} from "@/components/common/Dropdown/Base";
import { UserStats } from "../type";
import { formatLabelChart } from "../constant";
type TProps = {
	data: UserStats[];
	filter: string;
	setFilter: React.Dispatch<React.SetStateAction<string>>;
};

const OverviewChart: React.FC<TProps> = ({ data, filter, setFilter }) => {
	const chartRef = React.useRef<any>(null);
	const options: ApexOptions = React.useMemo(() => {
		const categories = data.map((item: any) => item.time);
		return {
			chart: {
				type: "area",
				height: "100%",
				width: "100%",
				toolbar: {
					show: false,
				},
				parentHeightOffset: 0,
				background: "transparent",
				zoom: {
					enabled: false,
				},
				scales: {
					y: {
						beginAtZero: true,
					},
				},
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				curve: "straight",
				width: 2,
				colors: [colors.divider.primary],
			},
			tooltip: {
				custom: function ({ series, seriesIndex, dataPointIndex, w }) {
					const value = series[seriesIndex][dataPointIndex];
					return `<div class="p-1 bg-background-secondary border border-background-scrim/60">
                  <p class="text-typo-primary text-sm">${formatNumber(
										value,
										2
									)} USDT</p>
            </div>`;
				},
				theme: "dark",
				marker: {
					show: false,
				},
				onDatasetHover: {
					highlightDataSeries: true,
				},
				x: {
					show: false,
				},
				y: {
					title: {
						formatter: function (seriesName) {
							return "";
						},
					},
				},
			},
			xaxis: {
				type: "category",
				axisBorder: {
					show: true,
					color: colors.divider.secondary,
				},
				axisTicks: {
					show: false,
				},
				labels: {
					show: true,
					formatter: (value: string) => {
						return formatLabelChart(value, categories);
					},
					style: {
						colors: colors.typo.secondary,
						fontSize: "12px",
						fontFamily: "var(--font-saira)",
					},
				},
				categories,
				crosshairs: {
					show: true,
					stroke: {
						color: colors.divider.primary,
					},
				},
			},
			yaxis: {
				tickAmount: 4,
				floating: false,
				axisBorder: {
					show: true,
					color: colors.divider.secondary,
					offsetX: 7,
				},
				opposite: false,
				axisTicks: {
					show: false,
				},
				labels: {
					formatter: (value: number) => {
						return formatNumber(value, 2);
					},
					show: false,
				},
			},
			fill: {
				type: "gradient",
				gradient: {
					shadeIntensity: 1,
					opacityFrom: 0.6,
					opacityTo: 0.1,
					stops: [10, 90, 100],
				},
				colors: [colors.typo.accent],
			},
			colors: [colors.typo.accent],
			grid: {
				borderColor: colors.divider.primary,
				xaxis: {
					lines: {
						show: false,
						offsetX: 1,
					},
				},
				yaxis: {
					lines: {
						offsetX: 0,
						show: false,
					},
				},
				padding: {
					left: 20,
				},
			},
			markers: {
				size: 0,
				color: colors.typo.accent,
				strokeColor: colors.typo.accent,
				strokeOpacity: 0.4,
				strokeWidth: 2,
				fillOpacity: 1,
				show: true,
				radius: 1,
				padding: 4,
				hover: {
					sizeOffset: 2,
				},
				shape: "square",
				showNullDataPoints: true,
				strokeDashArray: 8,
			},
			theme: {
				mode: "dark",
				monochrome: {
					enabled: true,
					color: colors.typo.accent,
					shadeTo: "dark",
					shadeIntensity: 0.65,
				},
			},
			noData: {
				text: "No data available",
				align: "center",
				verticalAlign: "middle",
				offsetX: 0,
				offsetY: 0,
				style: {
					color: colors.typo.secondary,
					fontSize: "16px",
					fontFamily: "var(--font-saira)",
					fontWeight: "bold",
					background: "transparent",
				},
			},
			plotOptions: {
				area: {
					fillTo: "origin",
				},
			},
			annotations: {
				points: data.map((item) => ({
					image: {
						path: "/assets/images/referral/highlight.png",
					},
					x: formatLabelChart(item.time as string, categories),
					y: item.totalPnl,
				})),
			},
		};
	}, [data, filter]);
	const series: ApexOptions["series"] = React.useMemo(() => {
		const parseDate = data.map((item: any) => item.totalPnl);
		return [
			{
				name: "PNL User",
				data: parseDate,
			},
		];
	}, [data, filter]);
	const optionsSelect = [
		{
			label: "All",
			value: "all",
		},
		{
			label: "7D",
			value: "week",
		},
		{
			label: "1M",
			value: "month",
		},
		{
			label: "1Y",
			value: "year",
		},
	];

	return (
		<div className="w-full">
			<div className="py-4 flex flex-col lg:gap-y-4 gap-y-5">
				<div className="w-full flex items-center justify-between">
					<p className="text-base text-typo-primary">Personal overview</p>
					{/* <Select
						onChange={(value) => {
							setFilter(value);
						}}
						value={filter}
						options={optionsSelect}
						size="md"
					/> */}
					<Select
						onValueChange={(value: any) => {
							setFilter(value);
						}}
						value={filter}>
						<SelectTrigger className={"max-w-[84px]"} size={"md"} border>
							<span className="text-xs">
								{optionsSelect.find((item) => item.value === filter)?.label ||
									"Select date"}
							</span>
						</SelectTrigger>
						<SelectContent className="">
							<SelectGroup>
								{optionsSelect.map((item, index) => {
									return (
										<SelectItem
											key={item.label + index}
											value={item.value}
											size={"md"}>
											{item.label || ""}
										</SelectItem>
									);
								})}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-full items-start justify-between">
					<div className="flex flex-col gap-y-1">
						<p className="text-typo-secondary text-sm leading-[22px]">PnL</p>
						<div
							className={clsx("text-base leading-6", {
								"text-positive":
									data[data.length - 1]?.totalPnl >= 0 ||
									data[data.length - 1]?.totalPnl === undefined,
								"text-negative-label": data[data.length - 1]?.totalPnl < 0,
							})}>
							{data[data.length - 1]?.totalPnl >= 0 ||
							data[data.length - 1]?.totalPnl === undefined
								? "+"
								: ""}
							{formatNumber(data[data.length - 1]?.totalPnl, 2)} USDT
						</div>
					</div>
				</div>
			</div>
			<ReactApexChart
				options={options}
				series={series}
				type="area"
				height={152}
				style={{
					background: "transparent",
				}}
				width={"100%"}
				id="overview-chart"
				ref={chartRef}
			/>
		</div>
	);
};

export default OverviewChart;
