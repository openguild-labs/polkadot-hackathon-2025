'use client';
import Image from "next/image";
import React, { useState } from "react";
import PolkadotImage from '@/public/images/polkadot.png';
import { Button } from "antd";
import Link from "next/link";
import GamePlatformIcon from "@/components/common/icons/GamePlatform";
import { GamePlatform } from "@/interfaces/game";
import NFTCard from "@/components/common/nft/NFTCard";
import useSWR from "swr";
import { isUndefined, uniqueId } from "lodash";
import { CollectionAPI } from "@/api/collectionAPI";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import RentNFT from "@/components/common/nft/RentNFT";
import { CollectionInfo } from "@/interfaces/collection";
import { ChainInfo } from "@/interfaces/chain";
import { ChainAPI } from "@/api/chainAPI";
import HiddenCopyableText from "@/components/common/HiddenCopyableText";

const swrKey = uniqueId();
const swrKey2 = uniqueId();

export default function CollectionsPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = React.use(params);
    const {
        data: collection,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } = useSWR([swrKey, slug], ([_, slug]) => CollectionAPI.getCollectionBySlug(slug));
    const {
        data: chainInfo,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } = useSWR([swrKey2, collection?.chainId], ([_, chainId]) => {
        if (isUndefined(chainId)) {
            return undefined;
        }
        return ChainAPI.getChainById(chainId);
    });

    const [selectedNFTIndex, setselectedNFTIndex] = useState(0);

    const [openBuyNFT, setOpenBuyNFT] = useState(false);
    return (
        <main>
            {collection && chainInfo && <Landing collection={collection} chainInfo={chainInfo} />}
            <div className="px-5 md:px-10 max-w-[2560px] mx-auto mt-8">
                <div className="relative">
                    <div className="flex flex-col">
                        <SearchBar className="w-full" placeholder="Search by name" />

                        <div className="flex flex-row justify-between mt-4 mb-4 items-center flex-wrap-reverse md:flex-nowrap">
                            <div className="flex flex-col px-4 md:px-0">
                                <p className="text-md">Showing 6 results of 6</p>
                                <p />
                            </div>
                            <div className="relative">
                                <button
                                    role="button"
                                    className="cursor-pointer flex items-center font-body font-bold select-none relative whitespace-nowrap align-middle outline-0 justify-center w-auto px-3 py-2 text-sm leading-4 rounded-lg border border-transparent transition bg-opacity-0 hover:bg-opacity-20 active:bg-opacity-30 focus:outline-none hover:no-underline text-white hover:text-white active:text-white bg-gray-400"
                                    id="headlessui-listbox-button-:R6mjajdm:"
                                    aria-haspopup="listbox"
                                    aria-expanded="false"
                                    data-headlessui-state=""
                                    type="button"
                                >
                                    <p className="leading-6 font-body text-base mb-0">
                                        <b>Sort by</b>&nbsp;
                                        <span className="font-normal">Lower Daily Fee</span>
                                    </p>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_4fr] gap-5">
                        <div className="w-full text-left">
                            <div className="relative flex flex-col">
                                <form className="flex flex-col w-full overflow-auto scrollbar-hide max-h-full hidden md:flex">
                                    <div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div className="bg-[rgb(34,34,48)] text-gray-300 py-5 px-6 w-full text-left uppercase font-semibold text-sm tracking-wider rounded-t-lg">
                                                <p>Market Filters</p>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>Order type</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <input
                                                    type="radio"
                                                    hidden=""
                                                    readOnly=""
                                                    name="deliveryTime"
                                                    style={{
                                                        position: "fixed",
                                                        top: 1,
                                                        left: 1,
                                                        width: 1,
                                                        height: 0,
                                                        padding: 0,
                                                        margin: "-1px",
                                                        overflow: "hidden",
                                                        clip: "rect(0, 0, 0, 0)",
                                                        whiteSpace: "nowrap",
                                                        borderWidth: 0,
                                                        display: "none"
                                                    }}
                                                    defaultChecked=""
                                                    defaultValue=""
                                                />
                                                <div
                                                    className="flex px-6 flex-col items-start hidden"
                                                    id="headlessui-radiogroup-:Riarajdm:"
                                                    role="radiogroup"
                                                >
                                                    <div className="flex items-center gap-3 mb-4" role="none">
                                                        <div
                                                            className="flex items-center gap-4"
                                                            id="headlessui-radiogroup-option-:Rdiarajdm:"
                                                            role="radio"
                                                            aria-checked="false"
                                                            tabIndex={0}
                                                            data-headlessui-state=""
                                                        >
                                                            <div className="relative flex cursor-pointer rounded-full focus:outline-none bg-gray-800 ring-2 w-4 h-4 ring-gray-600" />
                                                            <p className="text-sm">Instant delivery</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 mb-4" role="none">
                                                        <div
                                                            className="flex items-center gap-4"
                                                            id="headlessui-radiogroup-option-:Rliarajdm:"
                                                            role="radio"
                                                            aria-checked="false"
                                                            tabIndex={-1}
                                                            data-headlessui-state=""
                                                        >
                                                            <div className="relative flex cursor-pointer rounded-full focus:outline-none bg-gray-800 ring-2 w-4 h-4 ring-gray-600" />
                                                            <p className="text-sm">Place bid</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>Limit (U$)</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col px-6 justify-between gap-2 mb-4">
                                                    <div className="flex gap-4 items-center">
                                                        <input
                                                            name="limitRange"
                                                            type="number"
                                                            placeholder="Minimum"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                        <p>to</p>
                                                        <input
                                                            name="limitRange"
                                                            type="number"
                                                            placeholder="Maximum"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>Rental Fees (U$)</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col px-6 justify-between gap-2 mb-4">
                                                    <div className="flex gap-4 items-center">
                                                        <input
                                                            name="rentalFeeRange"
                                                            type="number"
                                                            placeholder="Minimum"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                        <p>to</p>
                                                        <input
                                                            name="rentalFeeRange"
                                                            type="number"
                                                            placeholder="Maximum"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div className="bg-[rgb(34,34,48)] text-gray-300 py-5 px-6 w-full text-left uppercase font-semibold text-sm tracking-wider rounded-t-lg">
                                                <p>Game Filters</p>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>special collection xmas</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="hidden">
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.specialCollectionXmas"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="False"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">False</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.specialCollectionXmas"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="True"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">True</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>purity</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col px-6 justify-between gap-2 mb-4 hidden">
                                                    <div className="flex gap-4 items-center">
                                                        <input
                                                            name="metadata.purity"
                                                            type="number"
                                                            placeholder="Minimum"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                        <p>to</p>
                                                        <input
                                                            name="metadata.purity"
                                                            type="number"
                                                            placeholder="Maximum"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>horn name</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="hidden">
                                                    <div className="px-5 mb-5">
                                                        <input
                                                            name="search-bar"
                                                            type="text"
                                                            placeholder="Search horn name"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.hornName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Anemone"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Anemone</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.hornName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Antenna"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Antenna</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.hornName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Arco"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Arco</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.hornName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Babylonia"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Babylonia</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.hornName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Bamboo"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Bamboo</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <div className="px-5 mb-5">
                                                        <span className="text-sm text-primary-200 font-bold cursor-pointer hover:text-primary-500">
                                                            View All
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>pureness</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col px-6 justify-between gap-2 mb-4 hidden">
                                                    <div className="flex gap-4 items-center">
                                                        <input
                                                            name="metadata.pureness"
                                                            type="number"
                                                            placeholder="Minimum"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                        <p>to</p>
                                                        <input
                                                            name="metadata.pureness"
                                                            type="number"
                                                            placeholder="Maximum"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>hp</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col px-6 justify-between gap-2 mb-4 hidden">
                                                    <div className="flex gap-4 items-center">
                                                        <input
                                                            name="metadata.hp"
                                                            type="number"
                                                            placeholder="Minimum"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                        <p>to</p>
                                                        <input
                                                            name="metadata.hp"
                                                            type="number"
                                                            placeholder="Maximum"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>special collection summer</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="hidden">
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.specialCollectionSummer"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="False"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">False</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.specialCollectionSummer"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="True"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">True</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>speed</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col px-6 justify-between gap-2 mb-4 hidden">
                                                    <div className="flex gap-4 items-center">
                                                        <input
                                                            name="metadata.speed"
                                                            type="number"
                                                            placeholder="Minimum"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                        <p>to</p>
                                                        <input
                                                            name="metadata.speed"
                                                            type="number"
                                                            placeholder="Maximum"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>tail name</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="hidden">
                                                    <div className="px-5 mb-5">
                                                        <input
                                                            name="search-bar"
                                                            type="text"
                                                            placeholder="Search tail name"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.tailName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Ant"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Ant</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.tailName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Carrot"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Carrot</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.tailName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Cattail"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Cattail</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.tailName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Cloud"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Cloud</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.tailName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Cotton"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Cotton</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <div className="px-5 mb-5">
                                                        <span className="text-sm text-primary-200 font-bold cursor-pointer hover:text-primary-500">
                                                            View All
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>body name</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="hidden">
                                                    <div className="px-5 mb-5">
                                                        <input
                                                            name="search-bar"
                                                            type="text"
                                                            placeholder="Search body name"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.bodyName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue=""
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm" />
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.bodyName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Big yak"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Big yak</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.bodyName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Bigyak"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Bigyak</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.bodyName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Curly"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Curly</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.bodyName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Fuzzy"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Fuzzy</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <div className="px-5 mb-5">
                                                        <span className="text-sm text-primary-200 font-bold cursor-pointer hover:text-primary-500">
                                                            View All
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>stage</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col px-6 justify-between gap-2 mb-4 hidden">
                                                    <div className="flex gap-4 items-center">
                                                        <input
                                                            name="metadata.stage"
                                                            type="number"
                                                            placeholder="Minimum"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                        <p>to</p>
                                                        <input
                                                            name="metadata.stage"
                                                            type="number"
                                                            placeholder="Maximum"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>eyes name</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="hidden">
                                                    <div className="px-5 mb-5">
                                                        <input
                                                            name="search-bar"
                                                            type="text"
                                                            placeholder="Search eyes name"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.eyesName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Blossom"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Blossom</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.eyesName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Bookworm"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Bookworm</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.eyesName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Broken"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Broken</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.eyesName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Broken bookworm"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Broken bookworm</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.eyesName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Calico"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Calico</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <div className="px-5 mb-5">
                                                        <span className="text-sm text-primary-200 font-bold cursor-pointer hover:text-primary-500">
                                                            View All
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>skill</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col px-6 justify-between gap-2 mb-4 hidden">
                                                    <div className="flex gap-4 items-center">
                                                        <input
                                                            name="metadata.skill"
                                                            type="number"
                                                            placeholder="Minimum"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                        <p>to</p>
                                                        <input
                                                            name="metadata.skill"
                                                            type="number"
                                                            placeholder="Maximum"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>special collection mystic</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="hidden">
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.specialCollectionMystic"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="False"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">False</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.specialCollectionMystic"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="True"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">True</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>special collection shiny</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="hidden">
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.specialCollectionShiny"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="False"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">False</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.specialCollectionShiny"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="True"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">True</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>back name</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="hidden">
                                                    <div className="px-5 mb-5">
                                                        <input
                                                            name="search-bar"
                                                            type="text"
                                                            placeholder="Search back name"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.backName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Anemone"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Anemone</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.backName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Balloon"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Balloon</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.backName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Beach"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Beach</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.backName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Beach ball"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Beach ball</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.backName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Bidens"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Bidens</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <div className="px-5 mb-5">
                                                        <span className="text-sm text-primary-200 font-bold cursor-pointer hover:text-primary-500">
                                                            View All
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>morale</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col px-6 justify-between gap-2 mb-4 hidden">
                                                    <div className="flex gap-4 items-center">
                                                        <input
                                                            name="metadata.morale"
                                                            type="number"
                                                            placeholder="Minimum"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                        <p>to</p>
                                                        <input
                                                            name="metadata.morale"
                                                            type="number"
                                                            placeholder="Maximum"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>mouth name</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="hidden">
                                                    <div className="px-5 mb-5">
                                                        <input
                                                            name="search-bar"
                                                            type="text"
                                                            placeholder="Search mouth name"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.mouthName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Axie"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Axie</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.mouthName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Axie kiss"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Axie kiss</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.mouthName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Bubble"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Bubble</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.mouthName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Bubble fish"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Bubble fish</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.mouthName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Catfish"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Catfish</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <div className="px-5 mb-5">
                                                        <span className="text-sm text-primary-200 font-bold cursor-pointer hover:text-primary-500">
                                                            View All
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>ears name</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="hidden">
                                                    <div className="px-5 mb-5">
                                                        <input
                                                            name="search-bar"
                                                            type="text"
                                                            placeholder="Search ears name"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.earsName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Beetle"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Beetle</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.earsName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Beetle spike"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Beetle spike</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.earsName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Belieber"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Belieber</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.earsName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Bubblemaker"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Bubblemaker</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.earsName"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Clover"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Clover</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <div className="px-5 mb-5">
                                                        <span className="text-sm text-primary-200 font-bold cursor-pointer hover:text-primary-500">
                                                            View All
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>class</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="hidden">
                                                    <div className="px-5 mb-5">
                                                        <input
                                                            name="search-bar"
                                                            type="text"
                                                            placeholder="Search class"
                                                            className="text-gray-200 bg-[rgb(34,34,48)] border-gray-500 focus:bg-gray-800 focus:ring-primary-400 focus:border-primary-400 block w-full placeholder:text-gray-500 rounded-md border-gray-600 px-4 py-2 text-base"
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.class"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Aquatic"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Aquatic</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.class"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Beast"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Beast</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.class"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Bird"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Bird</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.class"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Bug"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Bug</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.class"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="Dawn"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">Dawn</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <div className="px-5 mb-5">
                                                        <span className="text-sm text-primary-200 font-bold cursor-pointer hover:text-primary-500">
                                                            View All
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="last:border-b-2 first:border-none border-b-2 border-gray-700">
                                            <div>
                                                <div className="px-6 py-5 w-full flex justify-between text-left capitalize font-semibold tracking-wider">
                                                    <p>special collection japan</p>
                                                    <div className="flex gap-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="hidden">
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.specialCollectionJapan"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="False"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">False</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="relative flex items-start px-6 flex cursor-pointer text-md gap-1 mb-3.5 items-center">
                                                        <div className="flex items-center">
                                                            <input
                                                                name="metadata.specialCollectionJapan"
                                                                type="checkbox"
                                                                className="align-middle bg-transparent mt-1 focus:ring-primary-400 text-primary-400 border-gray-400 border-2 rounded h-5 w-5"
                                                                defaultValue="True"
                                                            />
                                                        </div>
                                                        <div className="text-gray-300 text-base ml-4">
                                                            <div className="text-gray-300">
                                                                <p className="text-white mt-1 text-sm">True</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div className="order-first mb-4 hidden md:block">
                                    <button
                                        role="button"
                                        className="cursor-pointer flex items-center font-body font-bold select-none relative whitespace-nowrap align-middle outline-0 justify-center w-full px-4 py-2 text-base rounded-lg border border-transparent shadow transition focus:outline-none hover:no-underline text-white hover:text-white active:text-white bg-[rgb(45,45,63)] hover:bg-[rgb(34,34,48)] active:bg-gray-800"
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <div className="py-4 mb-5 flex gap-3 px-3 hidden">
                                    <button
                                        role="button"
                                        className="cursor-pointer flex items-center font-body font-bold select-none relative whitespace-nowrap align-middle outline-0 justify-center w-full px-4 py-2 text-base rounded-lg border border-transparent shadow transition focus:outline-none hover:no-underline text-white hover:text-white active:text-white bg-[rgb(45,45,63)] hover:bg-[rgb(34,34,48)] active:bg-gray-800"
                                    >
                                        Clear All
                                    </button>
                                    <button
                                        role="button"
                                        className="cursor-pointer flex items-center font-body font-bold select-none relative whitespace-nowrap align-middle outline-0 justify-center w-full px-4 py-2 text-base rounded-lg border border-transparent shadow transition focus:outline-none hover:no-underline text-white hover:text-white active:text-white bg-primary-500 hover:bg-primary-600 active:bg-primary-700"
                                        type="submit"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {
                                    collection?.nfts.map((item, index) => (
                                        <div key={index} onClick={() => {
                                            setOpenBuyNFT(true);
                                            setselectedNFTIndex(index);
                                        }} className="cursor-pointer">
                                            <NFTCard {...item} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {!isUndefined(collection) && <RentNFT nftInfo={collection.nfts[selectedNFTIndex]} open={openBuyNFT} onClose={() => setOpenBuyNFT(false)} />}
        </main>
    )
}

function Landing({
    collection,
    chainInfo
}: {
    collection: Pick<CollectionInfo, 'img' | 'name' | 'contract'>;
    chainInfo: Pick<ChainInfo, 'name' | 'img'>
}) {
    return (
        <div className="relative pt-12">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#878070] to-secondary" />
            </div>
            <div className="px-5 md:px-10 max-w-[2560px] mx-auto">
                <div className="relative sm:rounded-2xl sm:overflow-hidden">
                    <div className="flex items-center relative">
                        <Image
                            src={collection.img}
                            width={120}
                            height={10}
                            alt={collection.name}
                            className="flex-0 rounded-lg self-start"
                        />
                        <div className="flex flex-col items-start gap-4 ml-5  font-bold">
                            <h1 className="text-4xl">{collection.name}</h1>
                            <div className="flex flex-col md:flex-row items-start gap-3">
                                <div className="flex gap-1 items-center bg-secondary/80 pr-3 py-2 rounded-3xl">
                                    <Image
                                        src={chainInfo.img}
                                        className="flex-none w-5 ml-3 mr-1"
                                        alt={chainInfo.name}
                                        width={20}
                                        height={20}
                                    />
                                    {chainInfo.name}
                                </div>
                                <div
                                    className="flex gap-1 items-center bg-secondary/80 pr-3 py-2 rounded-3xl !no-underline !text-white"
                                >
                                    <Image
                                        src={PolkadotImage}
                                        className="flex-none w-5 ml-3 mr-1"
                                        alt="LootRush wallet"
                                    />
                                    AssetHub Integrated
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Button className="hover:!text-text-primary bg-secondary/80 py-5 rounded-full text-[16px]">
                                    <GamePlatformIcon platform={GamePlatform.Web} />
                                    <Link href="https://axieinfinity.com" className="font-bold" target="_blank">
                                        Website
                                    </Link>
                                </Button>
                                <Button className="rounded-full py-5 bg-secondary/80">
                                    <HiddenCopyableText>{collection.contract}</HiddenCopyableText>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap md:absolute top-0 right-0 mt-4 md:mt-0">
                        <Link
                            className="flex items-center bg-secondary/50 hover:bg-secondary/80 gap-1 cursor-pointer focus:border-none active:border-none transition w-full md:w-auto justify-between h-12 px-4 pl-5 rounded-xl relative font-semibold [&>svg]:hover:translate-x-2"
                            href={"/my-listings/assets"}
                        >
                            List your assets
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                                className="w-6 h-6 transition"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3.75 12a.75.75 0 01.75-.75h13.19l-5.47-5.47a.75.75 0 011.06-1.06l6.75 6.75a.75.75 0 010 1.06l-6.75 6.75a.75.75 0 11-1.06-1.06l5.47-5.47H4.5a.75.75 0 01-.75-.75z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="relative mt-8 pt-4 border-b-2 border-gray-100/5">
                <div className="px-5 md:px-10 max-w-[2560px] mx-auto">
                    <div className="relative">
                        <nav className="mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                            <Link
                                className="whitespace-nowrap hover:no-underline py-4 px-1 border-b-2 font-bold relative text-white hover:text-white"
                                aria-current="page"
                                href="/collections/axie-infinity-axies"
                            >
                                Assets Available
                            </Link>
                            <Link
                                className="whitespace-nowrap hover:no-underline py-4 px-1 border-b-2 font-bold relative text-gray-400 hover:text-gray-100 border-none"
                                href="/collections/axie-infinity-axies/activities"
                            >
                                Activity
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}
