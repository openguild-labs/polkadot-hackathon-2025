import { NFTInfo } from "@/interfaces/nft";
import Image from "next/image";
import HiddenCopyableText from "../HiddenCopyableText";
import { Button, Typography } from "antd";

const { Text } = Typography;

type NFTCardProps = Pick<NFTInfo, "name" | "img" | "author" | "tokenId" | "feePerDay">;

export default function NFTCard({
    name,
    img,
    author,
    feePerDay
}: NFTCardProps) {
    return (
        <>
            <div
                className="flex flex-col gap-1 md:gap-2 rounded-xl bg-[rgb(34,34,48)] transition-all relative h-full group/card"
            >
                <div className="relative rounded-md overflow-hidden transition flex flex-col items-center justify-center h-full w-full">
                    <Image
                        className="px-0  hover:scale-110 transform transition-transform duration-300"
                        alt={name}
                        src={img}
                        width={311}
                        height={311}
                    />
                </div>
                <div className="px-2 lg:px-4">
                    <h3 className="text-xl m-0 mb-2 overflow-clip font-bold">{name}</h3>
                    <div className="flex flex-col gap-1">
                        <div className="flex gap-1 font-light">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                                className="w-4"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>{" "} Delivery in 1min</span>
                        </div>
                        <div className="flex gap-1 font-light text-muted">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                                className="w-5 h-5 min-w-[1.25rem]"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <HiddenCopyableText textToCopy={author} iconProps={{ className: "w-[287px]", ellipsis: true }}>
                                {author}
                            </HiddenCopyableText>
                        </div>
                    </div>
                </div>
                <Button className="py-6 mx-3 mb-3 group-hover/card:!bg-primary">
                    <Text className="font-bold text-lg">${feePerDay}/day</Text>
                </Button>
            </div>
        </>
    );
}
