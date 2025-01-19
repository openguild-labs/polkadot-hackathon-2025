import Image from "next/image";
import { Connector } from "wagmi";
import Button from "../common/Button";
import { cn } from "@/utils";

type TWallet = {
    logoUrl: string;
    connector: Connector;
    active?: boolean;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
};

const Wallet = ({
    logoUrl,
    connector,
    active = false,
    onClick,
    disabled,
    className,
}: TWallet) => {
    return (
        <Button
            size="md"
            point={false}
            variant="outline"
            customHeight={true}
            className={cn(
                "p-3 justify-start text-typo-primary  hover:text-typo-accent bg-support-black border border-divider-secondary",
                !disabled ? "hover:bg-background-secondary hover:text-typo-accent hover:border-divider-primary" : "",
                className
            )}
            disabled={disabled}
            onClick={onClick}
        >
            <Image
                width={32}
                height={32}
                src={logoUrl}
                alt={connector.name}
                className="mr-4 size-6 rounded-full"
            />
            <div className="text-body-16">{connector.name}</div>
        </Button>
    );
};

export default Wallet;