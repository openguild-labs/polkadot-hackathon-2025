"use client";

import { ReactNode, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Tabs";
import { cn } from "@/utils";
import useMarketStore from "@/stores/market.store";

type Props = {
	listTab: {
		value: string;
		title: string;
		prefix?: ReactNode;
		suffix?: ReactNode;
	}[];
	listContent: { value: string; children: ReactNode }[];
	defaultValue?: string;
	filterTable?: ReactNode;
};

export default function TableTabs({
	listTab,
	listContent,
	filterTable,
}: Props) {
	const [tabs, setTabs] = useMarketStore((state: any) => [
		state.tabs,
		state.setTabs,
	]);

	return (
		<Tabs
			defaultValue={tabs}
			onValueChange={(value) => setTabs(value as "favorite" | "hot" | "policy")}
		>
			<div className="flex flex-col lg:flex-row items-start justify-between lg:border-b lg:border-divider-secondary bg-transparent">
				<TabsList className="space-x-5 lg:space-x-6 border-b border-divider-secondary lg:border-none w-full justify-start rounded-none p-0">
					{listTab.map((tab) => (
						<TabsTrigger
							className={cn(
								"text-sm font-normal font-determination lg:pt-1.5 pb-3 uppercase lg:pb-4 flex items-center gap-x-2 border-b-[2px] border-solid pt-0",
								{
									"text-typo-accent border-divider-primary": tabs === tab.value,
									"text-typo-secondary border-transparent": tabs !== tab.value,
								}
							)}
							value={tab.value}
							key={tab.value}
						>
							{tab.prefix}
							{tab.title}
							{tab.suffix}
						</TabsTrigger>
					))}
				</TabsList>
				{filterTable && (
					<div className="pt-2 lg:py-0 lg:w-max w-full">{filterTable}</div>
				)}
			</div>
			{listContent.map((content) => (
				<TabsContent key={content.value} value={content.value}>
					{content.children}
				</TabsContent>
			))}
		</Tabs>
	);
}
