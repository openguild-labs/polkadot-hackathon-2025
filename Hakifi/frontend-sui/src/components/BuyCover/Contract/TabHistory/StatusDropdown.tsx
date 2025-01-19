import colors from "@/colors";
import Button from "@/components/common/Button";
import ChevronIcon from "@/components/common/Icons/ChevronIcon";
import TickIcon from "@/components/common/Icons/TickIcon";
import Popup from "@/components/common/Popup";
import { useIsTablet } from "@/hooks/useMediaQuery";
import useToggle from "@/hooks/useToggle";
import { cn } from "@/utils";
import { STATE_INSURANCES } from "@/utils/constant";
import React, { useMemo, useState } from "react";

interface IStatusDropdownProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	afterIcon?: React.ReactNode;
	classContent?: string;
	status?: string;
	handleSetStatus: (asset: string | undefined) => void;
}

const StatusDropdown = React.forwardRef<
	HTMLButtonElement,
	IStatusDropdownProps
>(
	(
		{ className, classContent, handleSetStatus, status, ...rest },
		forwardedRef
	) => {
		const isTablet = useIsTablet();
		const { handleToggle, toggle } = useToggle();

		const getStatus = useMemo(() => {
			const status = Object.keys(STATE_INSURANCES);
			return ["All", ...status];
		}, []);

		const handleSetSelectedStatus = (status: string) => {
			handleSetStatus(status !== "All" ? status : undefined);
			handleToggle();
		};
		if (isTablet) {
			return (
				<>
					<p className="my-4 text-title-20">Contract status</p>

					<section className="mt-3 flex flex-col gap-3 -mr-[15px] custom-scroll overflow-auto max-h-[300px]">
						{getStatus.map((s, index) => (
							<Button
								size="md"
								key={s}
								onClick={() => handleSetStatus(s)}
								className={cn(
									"w-full flex items-center justify-between py-2 hover:text-typo-accent hover:bg-background-secondary hover:px-2 transition-all duration-200",
									s === status &&
									"bg-background-secondary text-typo-accent px-2"
								)}
							>
								<span
									className={cn(
										s === status
											? "text-typo-accent"
											: "text-typo-primary"
									)}
								>
									{STATE_INSURANCES[s] || "All"}
								</span>

								{s === status && <TickIcon className="size-3.5" />}
							</Button>
						))}
					</section>
				</>
			);
		}



		return (
			<Popup
				isOpen={toggle}
				classTrigger="px-4"
				classContent={cn("min-w-[180px] w-full overflow-hidden", classContent)}
				handleOnChangeStatus={() => handleToggle()}
				// contentClassName="px-4"
				content={

					<section className="mt-3 flex flex-col gap-3  custom-scroll overflow-x-hidden overflow-y-auto max-h-[300px]">
						{getStatus.map((s, index) => (
							<Button size="md" key={s} onClick={() => handleSetSelectedStatus(s)} className={cn("w-full flex items-center justify-between py-2 px-4 hover:text-typo-accent hover:bg-background-secondary ",
								s === status && "text-typo-accent"
							)}>
								<span className={cn(s === status ? "text-typo-accent" : "text-typo-secondary")}>{STATE_INSURANCES[s] || "All"}</span>

								{
									s === status && <TickIcon className="size-3.5" />
								}
							</Button>
						))}
					</section>
				}
			>
				<Button
					size="lg"
					variant="outline"
					point={false}
					className={cn("w-full hover:bg-background-secondary", toggle && "border-typo-accent bg-background-secondary ")}
					ref={forwardedRef}
					{...rest}
				>
					<section className="w-full flex items-center justify-between gap-2">
						<div className="!text-body-14">
							{
								status && status !== "All" ? <span className={cn(!toggle ? "text-typo-primary" : "text-typo-accent")}>{STATE_INSURANCES[status]}</span> : <span className={cn(toggle ? "text-typo-accent" : "text-typo-secondary")}>Select status</span>
							}
						</div>
						<ChevronIcon
							className={cn('duration-200 ease-linear transition-all', toggle ? 'rotate-180' : 'rotate-0')}
							color={toggle ? colors.typo.accent : colors.typo.secondary}
						/>
					</section>
				</Button>
			</Popup >
		);
	});

export default StatusDropdown;
