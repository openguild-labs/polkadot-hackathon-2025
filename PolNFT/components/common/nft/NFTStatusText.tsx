import { NFTStatus } from "@/interfaces/nft";

export default function NFTStatusText({
    status,
    className
}: {
    status: NFTStatus,
    className?: string
}) {
    return (
        <span
            className={`font-bold ${className}`}
            style={{
                color: status === NFTStatus.RENTED ? "rgb(61,255,185)" : "rgb(17,218,244)"
            }}
        >
            {status}
        </span>
    )
}
