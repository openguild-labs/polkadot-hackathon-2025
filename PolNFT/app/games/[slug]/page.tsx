'use client';
import { GameAPI } from "@/api/gameAPI";
import GameCategoryTag from "@/components/common/GameCategoryTag";
import GamePlatformIcon from "@/components/common/icons/GamePlatform";
import { GameCategory, GamePlatform } from "@/interfaces/game";
import { isUndefined, uniqueId } from "lodash";
import Image from "next/image";
import Link from "next/link"
import React from "react";
import useSWR from "swr";

const swrKey: string = uniqueId();

export default function GamePage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = React.use(params);
    const {
        data,
        isLoading
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } = useSWR([swrKey, slug], ([_, slug]) => GameAPI.getGameBySlug(slug));

    console.log(data);
    return (
        isUndefined(data) || isLoading ?
            <div>Loading...</div> :
            <div className="bg-secondary">
                <Landing {...data} />
                <div className="max-w-7xl mx-auto px-6 mt-14 mb-8 font-bold">
                    <h3 className="text-xl md:text-3xl mb-4 font-bold">Collections</h3>
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full min-w-full table-fixed">
                            <thead>
                                <tr>
                                    <th className="px-2 py-3.5 text-left text-sm uppercase font-normal text-gray-400 select-none w-[20rem]">
                                        Collection
                                    </th>
                                    <th className="px-2 py-3.5 text-left text-sm uppercase font-normal text-gray-400 select-none w-[10rem]">
                                        Floor Price
                                    </th>
                                    <th className="px-2 py-3.5 text-left text-sm uppercase font-normal text-gray-400 select-none w-[10rem]">
                                        Items Available
                                    </th>
                                    <th className="px-2 py-3.5 text-left text-sm uppercase font-normal text-gray-400 select-none w-[10rem]">
                                        Total Items
                                    </th>
                                    <th className="px-2 py-3.5 text-left text-sm uppercase font-normal text-gray-400 select-none w-[10rem]">
                                        Blockchain
                                    </th>
                                    <th className="px-2 py-3.5 text-left text-sm uppercase font-normal text-gray-400 select-none w-[10rem]">
                                        Open Offers
                                    </th>
                                    <th className="px-2 py-3.5 text-left text-sm uppercase font-normal text-gray-400 select-none" />
                                </tr>
                            </thead>
                            <tbody className="">
                                <tr className="border-t border-t-gray-500 relative cursor-pointer hover:bg-[rgb(34,34,48)]">
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-axies"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src="https://lootrush-website-assets.s3.us-east-1.amazonaws.com/images/games/axie-infinity-axies/Card.png"
                                                    alt="Axie Infinity: Axies"
                                                    className="w-10"
                                                />
                                                <span className="text-md">Axie Infinity: Axies</span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-axies"
                                        >
                                            $0.0110
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-axies"
                                        >
                                            28,840
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-axies"
                                        >
                                            54,954
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-axies"
                                        >
                                            Moonbase Alpha
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-axies"
                                        >
                                            2
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-axies"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                aria-hidden="true"
                                                className="h-6"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </Link>
                                    </td>
                                </tr>
                                <tr className="border-t border-t-gray-500 relative cursor-pointer hover:bg-[rgb(34,34,48)]">
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-runes"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src="https://lootrush-website-assets.s3.us-east-1.amazonaws.com/images/games/axie-infinity-runes/Card.png"
                                                    alt="Axie Infinity: Runes"
                                                    className="w-10"
                                                />
                                                <span className="text-md">Axie Infinity: Runes</span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-runes"
                                        >
                                            $0.0001
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-runes"
                                        >
                                            8
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-runes"
                                        >
                                            8
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-runes"
                                        >
                                            Moonbase Alpha
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-runes"
                                        >
                                            0
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-runes"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                aria-hidden="true"
                                                className="h-6"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </Link>
                                    </td>
                                </tr>
                                <tr className="border-t border-t-gray-500 relative cursor-pointer hover:bg-[rgb(34,34,48)]">
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-lands"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src="https://lootrush-website-assets.s3.us-east-1.amazonaws.com/images/games/axie-infinity-lands/Card.png"
                                                    alt="Axie Infinity: Lands"
                                                    className="w-10"
                                                />
                                                <span className="text-md">Axie Infinity: Lands</span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-lands"
                                        >
                                            $0.4939
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-lands"
                                        >
                                            1
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-lands"
                                        >
                                            16,920
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-lands"
                                        >
                                            Moonbase Alpha
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-lands"
                                        >
                                            3
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-lands"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                aria-hidden="true"
                                                className="h-6"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </Link>
                                    </td>
                                </tr>
                                <tr className="border-t border-t-gray-500 relative cursor-pointer hover:bg-[rgb(34,34,48)]">
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-charms"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src="https://lootrush-website-assets.s3.us-east-1.amazonaws.com/images/games/axie-infinity-charms/Card.png"
                                                    alt="Axie Infinity: Charms"
                                                    className="w-10"
                                                />
                                                <span className="text-md">Axie Infinity: Charms</span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-charms"
                                        >
                                            $0.1100
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-charms"
                                        >
                                            1
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-charms"
                                        >
                                            1
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-charms"
                                        >
                                            Moonbase Alpha
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-charms"
                                        >
                                            0
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-charms"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                aria-hidden="true"
                                                className="h-6"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </Link>
                                    </td>
                                </tr>
                                <tr className="border-t border-t-gray-500 relative cursor-pointer hover:bg-[rgb(34,34,48)]">
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-items"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src="https://lootrush-website-assets.s3.us-east-1.amazonaws.com/images/games/axie-infinity-items/Card.png"
                                                    alt="Axie Infinity: Items"
                                                    className="w-10"
                                                />
                                                <span className="text-md">Axie Infinity: Items</span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-items"
                                        >
                                            $0.0001
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-items"
                                        >
                                            1
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-items"
                                        >
                                            44,322
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-items"
                                        >
                                            Moonbase Alpha
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-items"
                                        >
                                            0
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-items"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                aria-hidden="true"
                                                className="h-6"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </Link>
                                    </td>
                                </tr>
                                <tr className="border-t border-t-gray-500 relative cursor-pointer hover:bg-[rgb(34,34,48)]">
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-accessories"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src="https://lootrush-website-assets.s3.us-east-1.amazonaws.com/images/games/axie-infinity-accessories/Card.png"
                                                    alt="Axie Infinity: Accessories"
                                                    className="w-10"
                                                />
                                                <span className="text-md">Axie Infinity: Accessories</span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-accessories"
                                        >
                                            $0.0000
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-accessories"
                                        >
                                            0
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-accessories"
                                        >
                                            43,000
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-accessories"
                                        >
                                            Moonbase Alpha
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-accessories"
                                        >
                                            0
                                        </Link>
                                    </td>
                                    <td className="text-sm animate-fade-in">
                                        <Link
                                            className="text-inherit hover:text-inherit hover:no-underline flex-1 py-4 px-2 flex"
                                            href="/collections/axie-infinity-accessories"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                aria-hidden="true"
                                                className="h-6"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
    )
}

function Landing({
    categories,
    name,
    platforms,
    img
}: {
    categories: GameCategory[]
    name: string,
    platforms: GamePlatform[],
    img: string
}) {
    return (
        <div className="relative text-left">
            <Image
                src={img}
                alt={name}
                className="absolute inset-0 w-full h-full object-cover"
                width={100}
                height={100}
            />
            <div className="bg-gradient-to-r from-secondary via-secondary/80 to-secondary/70 backdrop-blur-lg py-[6rem]">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex flex-col gap-2 relative text-lg">
                        <Link
                            className="flex items-center gap-2 text-muted/50 hover:text-white hover:no-underline mb-2 transition"
                            href="/"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                                className="h-5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            All Games
                        </Link>
                        <h3 className="text-3xl md:text-5xl font-bold">{name}</h3>
                        <div>
                            <span className="flex gap-2 items-center mt-2 overflow-x-auto scrollbar-hide">
                                {categories?.map((category) => (
                                    <GameCategoryTag key={category} category={category} />
                                ))}
                                {
                                    platforms?.map((platform) => (
                                       <GamePlatformIcon key={platform} platform={platform} />
                                    ))
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

