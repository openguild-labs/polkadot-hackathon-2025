'use client';
import { ChainAPI } from "@/api/chainAPI";
import HiddenCopyableText from "@/components/common/HiddenCopyableText";
import NFTImage from "@/components/common/nft/NFTImage";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import { CollectionInfo } from "@/interfaces/collection";
import { NFTStatus } from "@/interfaces/nft";
import { nftActions } from "@/redux/nft/nftSlice";
import  {polftRentAbi} from "@/utils/abi";
import { formatDate } from "@/utils/formatter";
import { Button, Col, Input, Modal, Row, Select, Typography } from "antd";
import { isNaN } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { useDebouncedCallback } from "use-debounce";
import { erc721Abi, erc20Abi } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import {MAX_INTEGER_BIGINT} from "@ethereumjs/util";

const { Text, Title } = Typography;

export default function MyListingsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 mt-4">
                <div className="flex justify-between items-center">
                    <Title level={2}>My listings</Title>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide font-bold h-[44px] text-base">
                        <Button className="h-full bg-transparent border border-light-secondary">
                            Edit Listings
                        </Button>
                        <ListNFT />
                        <Button
                            className="flex items-center h-full"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                                className="w-5 h-5 text-white mr-1"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <Text>Share your listings</Text>
                        </Button>
                    </div>
                </div>
                <section>
                    <div className="mb-5">
                        <nav
                            className="-mb-px flex space-x-8 overflow-x-auto    "
                            aria-label="Tabs"
                        >
                            <Link
                                className="hover:no-underline relative  text-white border-white hover:text-white whitespace-nowrap py-4 px-1 border-b-2 "
                                href="/my-listings/assets"
                                aria-current="page"
                            >
                                Listed NFTs
                            </Link>
                            <Link
                                className="hover:no-underline relative text-gray-400 border-transparent hover:text-gray-400 hover:border-gray-400 whitespace-nowrap py-4 px-1 border-b-2 "
                                href="/my-listings/activity"
                            >
                                Activity
                            </Link>
                        </nav>
                    </div>
                    {children}
                </section>
            </div>
        </main>
    )
}

const mockNFTAddress = "0xFA0bF8c359e83191b017Bb8f8383BBF915F6Ad39";

const availableCollections: Pick<CollectionInfo, 'id' | 'name' | 'img' | 'contract' | 'chainId'>[] = [{
    id: 1,
    name: 'Axie Infinity: Axies',
    img: 'https://lootrush-website-assets.s3.us-east-1.amazonaws.com/images/games/axie-infinity-axies/Icon.png',
    contract: mockNFTAddress,
    chainId: 1
}, {
    id: 2,
    name: "Axie Infinity: Lands",
    img: "https://lootrush-website-assets.s3.us-east-1.amazonaws.com/images/games/axie-infinity-lands/Icon.png",
    contract: mockNFTAddress,
    chainId: 1
}, {
    id: 3,
    name: "Axie Infinity: Charms",
    img: "https://lootrush-website-assets.s3.us-east-1.amazonaws.com/images/games/axie-infinity-charms/Icon.png",
    contract: mockNFTAddress,
    chainId: 1
}, {
    id: 4,
    name: "Axie Infinity: Runes",
    img: "https://lootrush-website-assets.s3.us-east-1.amazonaws.com/images/games/axie-infinity-runes/Icon.png",
    contract: mockNFTAddress,
    chainId: 1
}, {
    id: 5,
    name: "Axie Infinity: Accessories",
    img: "https://lootrush-website-assets.s3.us-east-1.amazonaws.com/images/games/axie-infinity-accessories/Icon.png",
    contract: mockNFTAddress,
    chainId: 1
}, {
    id: 6,
    name: "Axie Infinity: Items",
    img: "https://lootrush-website-assets.s3.us-east-1.amazonaws.com/images/games/axie-infinity-items/Icon.png",
    contract: mockNFTAddress,
    chainId: 1
}];

function ListNFT() {
    const {
        data: chainsInfo
    } = useSWR(availableCollections.map((collection) => collection.chainId), (chainIds) => {
        return Promise.all(chainIds.map((chainId) => {
            return ChainAPI.getChainById(chainId);
        }));
    });

    const dispatch = useDispatch();

    const walletAccount = useAccount();
    const {
        data: txHash,
        writeContractAsync
    } = useWriteContract();

    const [openModal, setOpenModal] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(-1);
    const [tokenId, setTokenId] = useState(0);
    const [feePerDay, setFeePerDay] = useState(0);
    const [price, setPrice] = useState(0);

    const validateTokenId = useDebouncedCallback((tokenId: number) => {
        if (tokenId < 0 || isNaN(tokenId)) {
            return;
        }
        setTokenId(tokenId);
    }, 300);

    return (
        <>
            <Button
                type="primary"
                className="h-full"
                onClick={() => setOpenModal(true)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="w-5 h-5"
                >
                    <path
                        fillRule="evenodd"
                        d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                        clipRule="evenodd"
                    />
                </svg>
                List
            </Button>
            <Modal
                open={openModal}
                destroyOnClose
                width={800}
                footer={[]}
                closeIcon={null}
            >
                <div className="bg-secondary relative py-5 rounded-2xl">
                    <Title level={3} className="mx-5">List NFT</Title>
                    <Button
                        onClick={() => setOpenModal(false)}
                        className="px-2 py-5 absolute top-2 right-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                            className="w-6"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Button>
                    <div className="flex flex-col gap-8">
                        <SearchBar placeholder="Search for a Game, Contract Address or Blockchain" className="w-auto mx-5" />
                        <div className="h-[1px] w-full bg-gray-600"></div>
                        <Title level={4} className="mx-5">Select a Collection</Title>
                        <div className="max-h-[320px] overflow-y-auto overflow-x-hidden">
                            <Row gutter={[25, 33]} className="flex-wrap px-5">
                                {
                                    availableCollections.map((collection, i) => {
                                        return (
                                            <Col key={collection.id} span={12}>
                                                <div
                                                    className={`cursor-pointer flex gap-2 items-center border-2 ${selectedCollection == i ? 'border-primary' : 'border-gray-600'} rounded-xl p-3 text-base`}
                                                    onClick={() => setSelectedCollection(i)}
                                                >
                                                    <Image src={collection.img} width={50} height={50} alt={collection.name} className="rounded-lg" />
                                                    <div className="flex flex-col">
                                                        <Text>{collection.name}</Text>
                                                        {chainsInfo &&
                                                            <div className="flex gap-2 items-center">
                                                                <Image src={chainsInfo[i].img} alt={''} width={1} height={1} className="w-[16px] h-[16px]" />
                                                                <Text className="text-muted">{chainsInfo[i].name}</Text>
                                                            </div>
                                                        }
                                                        <HiddenCopyableText iconProps={{
                                                            className: 'text-muted w-[250px]',
                                                            ellipsis: true
                                                        }}>
                                                            {collection.contract}
                                                        </HiddenCopyableText>
                                                    </div>
                                                </div>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </div>
                        <div className="flex flex-col gap-8 mx-5">
                            <div className="flex flex-col gap-2">
                                <Title level={4} className="!mb-0">Target chain: </Title>
                                <Select defaultValue={'hehe'} disabled options={[{
                                    value: 'hehe',
                                    label: <Text className="text-muted">{walletAccount.chain?.name}</Text>
                                }]}/>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Title level={4} className="!mb-0">Token ID: </Title>
                                <Input placeholder="E.g: 18" className="border-transparent h-10"
                                       onChange={(e) => validateTokenId(Number(e.target.value))}/>
                                {selectedCollection >= 0 && tokenId !== 0 &&
                                    <NFTImage tokenId={tokenId}
                                              contractAddress={availableCollections[selectedCollection].contract}
                                              rpcUrl={"https://moonbase-alpha.drpc.org"}/>
                                }
                            </div>
                            <div className="flex flex-col gap-2">
                                <Title level={4} className="!mb-0">Price NFT (in USD): </Title>
                                <Input placeholder="E.g: 18" className="border-transparent h-10" suffix="USD"
                                       onChange={(e) => setPrice(Number(e.target.value))}/>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Title level={4} className="!mb-0">Fee per day (in USD): </Title>
                                <Input placeholder="E.g: 18" className="border-transparent h-10" suffix="USD"
                                       onChange={(e) => setFeePerDay(Number(e.target.value))}/>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Title level={4} className="!mb-0">Payout address: </Title>
                                <Input className="!border-transparent h-10" disabled
                                       defaultValue={walletAccount.address}/>
                            </div>
                            <div className="h-[1px] w-full bg-gray-600"></div>
                            <div className="flex flex-col gap-2">
                                <Title level={4}>Summary</Title>
                                <div className="flex">
                                    <Text strong className="flex-1">Collection:</Text>
                                    <Text
                                        className="text-muted">{selectedCollection < 0 ? '' : availableCollections[selectedCollection].name}</Text>
                                </div>
                                <div className="flex">
                                    <Text strong className="flex-1">Target chain:</Text>
                                    <Text className="text-muted">{walletAccount.chain?.name}</Text>
                                </div>
                                <div className="flex">
                                    <Text strong className="flex-1">Token ID:</Text>
                                    <Text className="text-muted">{tokenId}</Text>
                                </div>
                                <div className="flex">
                                    <Text strong className="flex-1">Fee per day:</Text>
                                    <Text className="text-muted">{feePerDay} USD</Text>
                                </div>
                                <div className="flex">
                                    <Text strong className="flex-1">Service fee:</Text>
                                    <Text className="text-muted">0.01 USD</Text>
                                </div>
                                <div className="flex">
                                    <Text strong className="flex-1">Payout address:</Text>
                                    <Text className="text-muted">{walletAccount.address}</Text>
                                </div>
                            </div>
                            <Button type="primary" className="py-6" onClick={handleListing}>
                                <Text strong className="text-xl">Listing</Text>
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );

    async function handleListing() {

        // // approve NFT
        let txHash = await writeContractAsync({
            abi: erc721Abi,
            functionName: "setApprovalForAll",
            address: '0x547704fD446186B60234fC44969c04bD708Ed61A',
            args: ['0x1b54ff158684402D9a8E15C11b3076ADDAF695Fd', true]
        });
        console.log("txHash", txHash);
        // approve ERC20
        txHash = await writeContractAsync({
            abi: erc20Abi,
            address: '0x571C02E1F981EEd9b241be144949a8E85C2fa683',
            args: ['0x1b54ff158684402D9a8E15C11b3076ADDAF695Fd', MAX_INTEGER_BIGINT],
            functionName: "approve"
        });
        console.log(txHash);

       // // start lending


        await writeContractAsync({
            abi: polftRentAbi,
            functionName: "lend",
            address: '0x1b54ff158684402D9a8E15C11b3076ADDAF695Fd',
            args: [
                ['0xFA0bF8c359e83191b017Bb8f8383BBF915F6Ad39'],
                [tokenId],
                [1],
                [35],
                [5000000000000000000],
                [price],
                ['0x571C02E1F981EEd9b241be144949a8E85C2fa683']
            ]
        });

        dispatch(nftActions.addListedNFT([{
            name: "Axie",
            img: "https://image-cdn.lootrush.com/unsafe/311x0/smart/filters:format(webp)/https%3A%2F%2Faxiecdn.axieinfinity.com%2Faxies%2F11849301%2Faxie%2Faxie-full-transparent.png",
            tokenId,
            feePerDay,
            totalFees: 0,
            status: NFTStatus.AVAILABLE,
            collection: availableCollections[selectedCollection].name,
            listingDate: formatDate(new Date())
        }]));

        setOpenModal(false);

        setTimeout(() => {
            dispatch(nftActions.updateListedNFT({
                id: 0,
                data: {
                    status: NFTStatus.RENTED,
                    // totalFees: 1
                }
            }))
        }, 30000)
    }
}
