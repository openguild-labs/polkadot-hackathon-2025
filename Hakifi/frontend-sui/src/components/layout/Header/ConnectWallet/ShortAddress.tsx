import Button from "@/components/common/Button";
import { cn } from "@/utils";
import { shortenHexString, uint8arrayToHex } from "@/utils/helper";
import { useWallet } from "@suiet/wallet-kit";
import React, { useMemo } from "react";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	afterIcon?: React.ReactNode;
	toggle: boolean;
	srcImage?: string;
}

const ShortAddress = React.forwardRef<HTMLButtonElement, IProps>(
	({ afterIcon, className, toggle, srcImage, ...rest }, forwardedRef) => {
		// const { address, connector } = useAccount();
		// const shortAddress = useMemo(
		// 	() => shortenHexString(address as string, 5, 4),
		// 	[address]
		// );

		const { account, connected } = useWallet();

		const shortAddress = useMemo(
			() => {
				const address = account?.address || "****************************************************";
				return shortenHexString(address as string, 5, 4);
			},
			[connected, account]
		);
		return (
			<Button
				size="lg"
				variant="outline"
				point={false}
				className={cn(
					"flex rounded p-2 hover:bg-background-secondary",
					toggle && "border-typo-accent text-typo-accent bg-background-secondary",
					className
				)}
				ref={forwardedRef}
				{...rest}
			>
				<div className="mr-2 flex items-center justify-center rounded-s">
					{account ? (
						<img
							className="size-6"
							src={srcImage || account.icon}
							alt={account.address}
						/>
					) : null}
				</div>
				<div className="flex flex-1 cursor-pointer items-center justify-between">
					<div className="text-button-16B mr-2">{shortAddress}</div>
					{afterIcon ? <span className="text-dark-3">{afterIcon}</span> : null}
				</div>
			</Button>
		);
	}
);

export default ShortAddress;
