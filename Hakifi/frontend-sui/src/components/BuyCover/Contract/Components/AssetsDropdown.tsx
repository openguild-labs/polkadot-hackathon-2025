import { MarketPair } from "@/@type/pair.type";
import colors from "@/colors";
import Button from "@/components/common/Button";
import FormInput from "@/components/common/FormInput";
import ChevronIcon from "@/components/common/Icons/ChevronIcon";
import SearchIcon from "@/components/common/Icons/SearchIcon";
import TickIcon from "@/components/common/Icons/TickIcon";
import Popup from "@/components/common/Popup";
import useToggle from "@/hooks/useToggle";
import useMarketStore from "@/stores/market.store";
import { cn } from "@/utils";
import Image from "next/image";
import React, { ChangeEvent, useMemo, useState } from "react";

interface IAssetDropdownProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	afterIcon?: React.ReactNode;
	classContent?: string;
	asset?: string;
	handleSetAsset: (asset: string) => void;
	classTrigger?: string;
}

const AssetDropdown = React.forwardRef<HTMLButtonElement, IAssetDropdownProps>(
	(
		{ className, classContent, handleSetAsset, asset, classTrigger, ...rest },
		forwardedRef
	) => {
		const { handleToggle, toggle } = useToggle();
		const [marketPairs, getMarketParis] = useMarketStore((state) => [
			state.marketPairs,
			state.getMarketParis,
		]);
		const [searchKey, setSetSearchKey] = useState("");
		const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
			const { value } = e.target;
			setSetSearchKey(value);
		};
		const [selectedPair, setSelectedPair] = useState<MarketPair | null>(null);
		const getPairs = useMemo(() => {
			if (searchKey) {
				return marketPairs.filter((item) =>
					item.asset.toLowerCase().includes(searchKey.toLowerCase())
				);
			}

			return marketPairs;
		}, [marketPairs, searchKey]);

		const handleSetSelectedPair = (pair: MarketPair) => {
			if (pair.asset === asset) {
				handleSetAsset("");
			} else handleSetAsset(pair.asset);
			setSelectedPair((prev) => {
				if (prev?.asset === pair.asset) return null;
				else return pair;
			});
			handleToggle();
		};
		React.useEffect(() => {
			if (marketPairs.length === 0) {
				getMarketParis();
			}
			if (selectedPair && selectedPair.asset !== asset) {
				setSelectedPair(null);
			}
		}, [marketPairs, asset]);
		return (
			<Popup
				isOpen={toggle}
				classTrigger={classTrigger}
				classContent="w-full pt-4"
				handleOnChangeStatus={() => handleToggle()}
				content={
					<>
						<section className="px-4">
							<FormInput
								size="md"
								value={searchKey}
								onChange={handleOnChange}
								wrapperClassInput="w-full"
								suffixClassName="!border-none"
								placeholder="Search pair"
								suffix={<SearchIcon className="size-4" />}
							/>
						</section>

						<section className="mt-3 flex flex-col gap-3 custom-scroll overflow-auto max-h-[300px]">
							{getPairs.map((pair, index) => (
								<Button
									size="md"
									key={pair.id}
									onClick={() => handleSetSelectedPair(pair)}
									className={cn(
										"w-full flex items-center justify-between py-2 hover:!text-typo-accent transition-all duration-200 group hover:bg-background-secondary px-4",
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

										<span className={cn("text-typo-secondary text-body-14", selectedPair?.asset === pair.asset &&
											"!text-typo-accent")}>
											<span className={cn("group-hover:text-typo-accent", selectedPair?.asset === pair.asset ?
												"!text-typo-accent" : "text-typo-primary")}>{pair.asset}</span> /
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
				}
			>
				<Button
					size="lg"
					variant="outline"
					point={false}
					className={cn("w-full hover:bg-background-secondary", toggle && "border-typo-accent")}
					ref={forwardedRef}
					{...rest}
				>
					<section className="w-full flex items-center justify-between gap-2">
						<div className={cn("!text-body-14", toggle ? "text-typo-accent" : "text-typo-secondary")}>
							{selectedPair ? (
								<div className="flex items-center gap-2">
									<Image
										className="size-5"
										src={selectedPair.token.attachment}
										width={20}
										height={20}
										alt="logo"
									/>
									<span
										className={cn(
											!toggle ? "text-typo-primary" : "text-typo-accent"
										)}
									>
										{selectedPair?.asset}
									</span>
									<span
										className={cn(
											!toggle ? "text-typo-secondary" : "text-typo-accent"
										)}
									>
										{" "}
										/ {" "} USDT
									</span>
								</div>
							) : (
								<span className="text-typo-secondary">Select pair</span>
							)}
						</div>
						<ChevronIcon
							className={cn(
								"duration-200 ease-linear transition-all",
								toggle ? "rotate-180" : "rotate-0"
							)}
							color={toggle ? colors.typo.accent : colors.typo.secondary}
						/>
					</section>
				</Button>
			</Popup>
		);
	}
);

export default AssetDropdown;
