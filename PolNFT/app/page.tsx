'use client';
import { GameAPI } from "@/api/gameAPI";
import ArrowDownIcon from "@/components/common/icons/ArrowDownIcon";
import GamePlatformIcon from "@/components/common/icons/GamePlatform";
import SubmitNFTIcon from "@/components/common/icons/SubmitNFTIcon";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import HomeGameEntry from "@/components/home/HomeGameEntry";
import { ChainInfo } from "@/interfaces/chain";
import { GamePlatform } from "@/interfaces/game";
import { randInt } from "@/utils/math";
import { Button, Typography } from "antd";
import { uniqueId } from "lodash";
import Image from "next/image";
import useSWR from "swr";

const { Text } = Typography;

const availableBlockchains: (Pick<ChainInfo, 'name' | 'img'>)[] = [{
    img: "https://parachains.info/images/parachains/1642419231_ajuna_logo.png",
    name: "Ajuna Network"
}, {
    img: "https://parachains.info/images/parachains/1649424653_bajun_network_logo_2.png",
    name: "Bajun Network"
}, {
    img: "https://parachains.info/images/parachains/1622122425_darwinia_crab.png",
    name: "Crab Network"
}, {
    img: "https://parachains.info/images/parachains/1667406145_darwinia_logo.jpg",
    name: "Darwinia"
}, {
    img: "https://parachains.info/images/parachains/1713531254_laos_logo2.png",
    name: "LAOS"
}, {
    name: 'Moonbeam',
    img: 'https://cryptologos.cc/logos/moonbeam-glmr-logo.png',
}, {
    name: 'Moonbase Alpha',
    img: 'https://astar.subscan.io/_next/image?url=%2Fchains%2Fastar%2Flogo-mini.png&w=256&q=75',
}, {
    name: 'Acala',
    img: 'https://avatars.githubusercontent.com/u/54881907?s=280&v=4',
}, {
    name: 'Phala',
    img: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/phala-network-pha-7151782-5795436.png?f=webp',
}, {
    name: 'Aleph Zero',
    img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/11976.png',
}, {
    img: "https://parachains.info/images/parachains/1659898704_aventus_logo.png",
    name: "Aventus Network"
}, {
    img: "https://parachains.info/images/parachains/1720056318_ava_protocol_logo.jpg",
    name: "Ava Protocol"
}];

const swrKey = uniqueId();

export default function Home() {
    const {
        data: games,
    } = useSWR(swrKey, GameAPI.getAllGames);
    return (
        <>
            {/* <Landing /> */}
            <section className="flex flex-col md:flex-row md:gap-6 px-5 md:px-10 pt-6 max-w-[1920px] mx-auto">
                <div className="bg-secondary/80 backdrop-blur-lg flex flex-col gap-8 w-full pb-2 md:w-[16rem] z-40 sticky top-[142px] md:top-[110px] md:overflow-auto md:h-[calc(100vh-180px)] scrollbar-none">
                    <Button className="flex items-center gap-2 py-5 hover:!text-text-hover">
                        <SubmitNFTIcon />
                        <p className="text-sm font-bold max-w-lg ">List a new collection</p>
                    </Button>
                    <SearchBar className="w-full" />
                    <div className="flex flex-col gap-6 pb-10">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center cursor-pointer">
                                <Text strong className="flex-1">Blockchain</Text>
                                <ArrowDownIcon />
                            </div>
                            {
                                availableBlockchains.map((chain) => (
                                    <div className="flex items-center gap-2 text-muted hover:text-text-primary cursor-pointer" key={chain.name}>
                                        <Image src={chain.img} alt="" width={25} height={25} className="rounded-full" />
                                        <Text className="flex-1 text-inherit">{chain.name}</Text>
                                        <Text className="text-inherit">{randInt(30, 100)}</Text>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center cursor-pointer">
                                <Text strong className="flex-1">Platform</Text>
                                <ArrowDownIcon />
                            </div>
                            {
                                [GamePlatform.Web, GamePlatform.Android, GamePlatform.Desktop, GamePlatform.iOS].map((platform) => (
                                    <div className="flex items-center gap-2 text-muted hover:text-text-primary cursor-pointer" key={platform}>
                                        <GamePlatformIcon platform={platform} />
                                        <Text className="flex-1 text-inherit">{platform}</Text>
                                        <Text className="text-inherit">{randInt(30, 100)}</Text>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex flex-col">
                    <div>
                        <div className="flex flex-row justify-between mb-4 items-start">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold">All games</h3>
                                <span className="text-muted text-sm md:text-md">300+ games</span>
                            </div>
                            <div className="flex justify-end">
                                <div className="relative" data-headlessui-state="">
                                    <button
                                        className="flex gap-2 items-center transition-all p-2 rounded-md hover:bg-[rgb(34,34,48)] text-sm border-2 bg-transparent border-transparent"
                                        id="headlessui-listbox-button-:rj:"
                                        type="button"
                                        aria-haspopup="listbox"
                                        aria-expanded="false"
                                        data-headlessui-state=""
                                    >
                                        <span className="font-bold">Sort by</span>
                                        <span>Most popular</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            aria-hidden="true"
                                            className="h-5 w-5 transition-all"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            className="grid grid-cols-2 items-start lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 flex-1 mb-4">
                            {
                                games?.map((game) => (
                                    <HomeGameEntry key={game.plug} {...game} />
                                ))
                            }
                        </div>
                    </div>
                    <p className="opacity-0 pt-10">Load more</p>
                </div>
            </section>

        </>
    );
}

function Landing() {
    return (
        <div className="bg-gradient-to-b from-secondary to-light-secondary py-10">
            <div className="px-5 md:px-10 max-w-[1920px] mx-auto">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col gap-8 md:gap-4 justify-center md:w-2/6">
                        <h1 className="text-4xl md:text-5xl">Rent all gaming NFTs</h1>
                        <div className="hidden md:flex flex-col gap-2 text-muted">
                            <div className="flex gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="w-6 h-6"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p>Rent individual NFTs or subscribe to 100,000+ NFTs</p>
                            </div>
                            <div className="flex gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="w-6 h-6"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p>Can't find an NFT? Subscribe and request it.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
