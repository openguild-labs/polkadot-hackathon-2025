import { MarketPair } from "@/@type/pair.type";
import Button from "@/components/common/Button";
import FormInput from "@/components/common/FormInput";
import SearchIcon from "@/components/common/Icons/SearchIcon";
import TickIcon from "@/components/common/Icons/TickIcon";
import useMarketStore from "@/stores/market.store";
import { cn } from "@/utils";
import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

type AssetDrawerProps = {
	handleSelectedPair: (pair: MarketPair) => void;
	selectedPair?: MarketPair;
};

const AssetDrawer = ({
	selectedPair,
	handleSelectedPair,
}: AssetDrawerProps) => {
	const [marketPairs, getMarketParis] = useMarketStore((state) => [
		state.marketPairs,
		state.getMarketParis,
	]);
	const [searchKey, setSetsearchKey] = useState("");
	const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setSetsearchKey(value);
	};
	const getPairs = useMemo(() => {
		if (searchKey) {
			return marketPairs.filter((item) =>
				item.asset.toLowerCase().includes(searchKey.toLowerCase())
			);
		}

		return marketPairs;
	}, [marketPairs, searchKey]);
	useEffect(() => {
		if (marketPairs.length === 0) {
			getMarketParis();
		}
	}, [marketPairs]);
	return (
		<>
			<p className="my-4 text-title-20 !font-medium">Asset</p>

			<FormInput
				size="md"
				value={searchKey}
				onChange={handleOnChange}
				wrapperClassInput="w-full py-[5px]"
				prefixClassName="!border-none"
				placeholder="Search pair"
				prefix={<SearchIcon className="size-4" />}
				// classFocus="border-background-primary bg-background-secondary text-typo-accent"
			/>

			<section className="mt-4 flex flex-col gap-3 -mr-[15px] custom-scroll pr-2 overflow-auto max-h-[278px]">
				{getPairs.map((pair, index) => (
					<Button
						size="md"
						point={false}
						key={pair.id}
						onClick={() => handleSelectedPair(pair)}
						className={cn(
							"w-full flex items-center justify-between py-2 hover:text-typo-accent transition-all duration-200",
							selectedPair?.asset === pair.asset &&
							"text-typo-accent"
						)}
					>
						<div className="flex items-center gap-2">
							<Image
								className="size-5 rounded-full"
								src={pair.token.attachment}
								width={20}
								height={20}
								alt="logo"
							/>

							<span className={cn("text-typo-secondary text-body-12",
								selectedPair?.asset === pair.asset &&
								"!text-typo-accent"
							)}>
								<span className={cn("group-hover:text-typo-accent", selectedPair?.asset === pair.asset ?
									"!text-typo-accent" : "text-typo-primary")}>{pair.asset}</span> /{" "}
								{pair.unit}
							</span>
						</div>

						{selectedPair?.asset === pair.asset && (
							<TickIcon className="size-3.5" />
						)}
					</Button>
				))}
			</section>
		</>
	);
};

export default AssetDrawer;
