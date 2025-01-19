import { MarketPair, TCategory } from "@/@type/pair.type";
import { getAllCategory, GetPairsParams } from "@/apis/pair.api";
import colors from "@/colors";
import Button from "@/components/common/Button";
import FormInput from "@/components/common/FormInput";
import ChevronIcon from "@/components/common/Icons/ChevronIcon";
import GuideIcon from "@/components/common/Icons/GuideIcon";
import SearchIcon from "@/components/common/Icons/SearchIcon";
import TwoWayArrowIcon from "@/components/common/Icons/TwoWayArrowIcon";
import Input from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import Popup from "@/components/common/Popup";
import useMarketPair from "@/hooks/useMarketPair";
import { useIsTablet } from "@/hooks/useMediaQuery";
import useSorting from "@/hooks/useSorting";
import useToggle from "@/hooks/useToggle";
import { cn } from "@/utils";
import debounce from "lodash.debounce";
import React, {
	ChangeEvent,
	useEffect,
	useMemo,
	useRef,
	useState
} from "react";
import TokenItem from "./TokenItem";

interface IButtonChangePairProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	afterIcon?: React.ReactNode;
	symbol: string;
	marketPairs: MarketPair[];
}

const ButtonPairsWrapper = React.forwardRef<
	HTMLButtonElement,
	IButtonChangePairProps
>(({ className, symbol, marketPairs, ...rest }, forwardedRef) => {
	const { toggle, handleToggle } = useToggle();
	const [searchKey, setSetsearchKey] = useState("");
	const { getMarketPairAsync } = useMarketPair();
	const [categories, setCategories] = useState<TCategory[]>([]);
	const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setSetsearchKey(value);

		debounce(() => {
			getAllPair({ isReset: true, q: value });
		}, 300)();
	};
	const { getSort, handleSortFunc, sorting } = useSorting();
	const [pairs, setPairs] = useState<MarketPair[]>([]);

	const getAllPair = async ({
		isReset = false,
		...rest
	}: GetPairsParams & { isReset?: boolean; }) => {
		const sort =
			sorting
				.map((item) => {
					if (item.desc === "") return "";
					return `${item.desc ? "-" : ""}${item.field}`;
				})
				.join("") || undefined;

		const response = await getMarketPairAsync({
			marketPairs,
			sort,
			...rest,
		});
		setPairs(response);
	};

	useEffect(() => {
		const handleGetListCategories = async () => {
			try {
				const res = await getAllCategory();
				if (res) {
					setCategories(res);
				}
			} catch (err) {
				console.log(err);
			}
		};
		getAllPair({ isReset: true });
		handleGetListCategories();
	}, [sorting]);

	const category = useMemo(() => {
		if (pairs && categories) {
			const pairId = pairs.find((item) => item.symbol === symbol)?.token
				.tagIds[0];
			const categoryItem = categories.find((item) => {
				return pairId === item.id;
			});
			return categoryItem;
		} else
			return {
				name: "----",
			};
	}, [pairs, categories, symbol]);
	const isTablet = useIsTablet();
	if (isTablet) {
		return (
			<section className="flex flex-col gap-1" data-tour="market">
				<Modal
					isOpen={toggle}
					onRequestClose={handleToggle}
					onInteractOutside={handleToggle}
					contentClassName="!overflow-hidden"
					descriptionClassName="-mr-4"
					useDrawer={false}
				>
					<>
						<p className="text-title-20 text-left">Trading pair</p>
						<section className="max-w-[calc(100%-16px)]">
							<section className="border border-divider-secondary rounded-sm py-1 px-2 my-5">
								<Input
									size="md"
									value={searchKey}
									onChange={handleOnChange}
									suffixClassName="!border-none !py-0"
									placeholder="Search pair"
									prefix={<SearchIcon className="size-4" />}
								/>
							</section>
							<section className="mt-3 flex items-center gap-6">
								<Button
									size="sm"
									onClick={() => handleSortFunc("symbol")}
									className="w-[140px] text-typo-secondary flex items-center gap-1"
								>
									Trading pairs{" "}
									<TwoWayArrowIcon
										sort={getSort("symbol")?.desc}
										className="size-4"
									/>
								</Button>
								<section className="flex-2 flex items-center justify-end gap-8">
									<Button
										size="sm"
										onClick={() => handleSortFunc("last_price")}
										className="w-[90px] text-right text-typo-secondary flex items-center gap-1 justify-end"
									>
										Last price{" "}
										<TwoWayArrowIcon
											sort={getSort("last_price")?.desc}
											className="size-4"
										/>
									</Button>
									<Button
										size="sm"
										onClick={() => handleSortFunc("price_change")}
										className="w-[90px] text-right text-typo-secondary flex items-center gap-1 justify-end"
									>
										24h Change{" "}
										<TwoWayArrowIcon
											sort={getSort("price_change")?.desc}
											className="size-4"
										/>
									</Button>
								</section>
							</section>
							<section className="mt-1 flex flex-col gap-3 max-h-[300px] overflow-auto !custom-scroll">
								{pairs.map((pair, index) => (
									<TokenItem key={`${pair.id}-${index}`} pair={pair} />
								))}
							</section>
						</section>
					</>
				</Modal>
				<Button
					size="lg"
					className={cn("flex flex-col items-start", className)}
					onClick={() => handleToggle()}
					ref={forwardedRef}
					{...rest}
				>
					<section className="flex items-center gap-2">
						<div className="text-title-20 sm:text-title-24">
							<span
								className={cn(
									!toggle ? "text-typo-primary" : "text-typo-accent"
								)}
							>
								{symbol.split("USDT")[0]}
							</span>{" "}
							<span
								className={!toggle ? "text-typo-secondary" : "text-typo-accent"}
							>
								{" "}
								/ USDT
							</span>
						</div>
						<ChevronIcon
							className={cn(
								"duration-200 ease-linear transition-all size-6",
								toggle ? "rotate-180" : "rotate-0"
							)}
							color={toggle ? colors.typo.accent : colors.typo.secondary}
						/>
					</section>
				</Button>
				<div className="text-body-12 w-full text-typo-secondary flex items-center justify-start gap-2">
					{category?.name} <GuideIcon />
				</div>
			</section>
		);
	}

	return (
		<section className="flex flex-col gap-1" data-tour="market">
			<Popup
				isOpen={toggle}
				classTrigger=""
				classContent="max-w-[560px] py-4"
				handleOnChangeStatus={() => handleToggle()}
				sideOffset={-2}
				content={
					<>
						<div className="px-4">

							<FormInput
								size="lg"
								value={searchKey}
								onChange={handleOnChange}
								wrapperClassInput="w-full"
								suffixClassName="!border-none"
								placeholder="Search pair"
								prefix={<SearchIcon className="size-4" />}
							/>
						</div>

						<section className="mt-3 flex items-center gap-6 px-4">
							<Button
								size="sm"
								onClick={() => handleSortFunc("symbol")}
								className="w-[140px] text-typo-secondary flex items-center gap-1"
							>
								Trading pairs{" "}
								<TwoWayArrowIcon
									sort={getSort("symbol")?.desc}
									className="size-4"
								/>
							</Button>
							<section className="flex-2 flex items-center gap-8">
								<Button
									size="sm"
									onClick={() => handleSortFunc("last_price")}
									className="w-[90px] text-right text-typo-secondary flex items-center gap-1 justify-end"
								>
									Last price{" "}
									<TwoWayArrowIcon
										sort={getSort("last_price")?.desc}
										className="size-4"
									/>
								</Button>
								<Button
									size="sm"
									onClick={() => handleSortFunc("price_change")}
									className="w-[90px] text-right text-typo-secondary flex items-center gap-1 justify-end"
								>
									24h Change{" "}
									<TwoWayArrowIcon
										sort={getSort("price_change")?.desc}
										className="size-4"
									/>
								</Button>
							</section>
						</section>
						<section className="mt-3 flex flex-col gap-3 custom-scroll overflow-auto max-h-[300px]">
							{pairs.map((pair, index) => (
								<TokenItem key={`${pair.id}-${index}`} pair={pair} />
							))}
						</section>
					</>
				}
			>
				<Button
					size="lg"
					className={cn("flex flex-col items-start", className)}
					ref={forwardedRef}
					{...rest}
				>
					<section className="flex items-center gap-2">
						<div className="text-title-20 sm:text-title-24">
							<span
								className={cn(
									!toggle ? "text-typo-primary" : "text-typo-accent"
								)}
							>
								{symbol.split("USDT")[0]}
							</span>{" "}
							<span
								className={!toggle ? "text-typo-secondary" : "text-typo-accent"}
							>
								{" "}
								/ USDT
							</span>
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
			<div className="text-body-12 w-full text-typo-secondary flex items-center justify-start gap-2">
				{category?.name} <GuideIcon className="[&>path]:hover:fill-typo-accent" />
			</div>
		</section>
	);
});

export default ButtonPairsWrapper;
