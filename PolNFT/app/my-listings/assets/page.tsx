'use client';
import SearchBar from "@/components/common/SearchBar/SearchBar";
import {listedNFTSelector} from "@/redux/nftSelector";
import Image from "next/image";
import {useDispatch, useSelector} from "react-redux";
import {NFTStatus} from "@/interfaces/nft";
import NFTStatusText from "@/components/common/nft/NFTStatusText";
import {Button} from "antd";
import {useWriteContract} from "wagmi";
import {polftRentAbi} from "@/utils/abi";
import {nftActions} from "@/redux/nft/nftSlice";

export default function MyListingsAssetsPage() {
    const listedNFTs = useSelector(listedNFTSelector);
    const dispatch = useDispatch();

    const {
        data: txHash,
        writeContractAsync
    } = useWriteContract();

    return (
        <div>
            <Statistic />
            <nav className="flex max-w-7xl mx-auto flex-col my-8" aria-label="Tabs">
                <div className="w-full mt-4 flex gap-4 flex-row  max-w-full overflow-auto" />
            </nav>
            <div className="flex flex-col">
                <h2 className="text-2xl font-bold">Listed NFTs</h2>
                <div className="w-full mt-4 flex gap-2 flex-wrap md:flex-nowrap">
                    <SearchBar className="flex-1" />

                </div>
                <div className="w-full flex justify-between items-center mt-2 font-bold">
                    <p>{listedNFTs.length} NFTs</p>
                    <div className="relative">
                        <button
                            role="button"
                            className="cursor-pointer flex items-center font-body font-bold select-none relative whitespace-nowrap align-middle outline-0 justify-center w-auto px-3 py-2 text-sm leading-4 rounded-lg border border-transparent transition bg-opacity-0 hover:bg-opacity-20 active:bg-opacity-30 focus:outline-none hover:no-underline text-white hover:text-white active:text-white bg-gray-400"
                            id="headlessui-listbox-button-:rcv:"
                            aria-haspopup="listbox"
                            aria-expanded="false"
                            data-headlessui-state=""
                            type="button"
                        >
                            <p className="leading-6 font-body text-base mb-0 flex items-center gap-2">
                                <b>Sort by</b> Newest
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="w-4 h-4"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </p>
                        </button>
                    </div>
                </div>
                {listedNFTs.length > 0 &&
                    <table className="w-full min-w-full table-fixed">
                        <thead>
                            <tr>
                                <th className="px-2 py-3.5 text-left text-sm uppercase font-normal text-gray-400 select-none w-[20rem]">
                                    Item
                                </th>
                                {/* <th className="px-2 py-3.5 text-left text-sm uppercase font-normal text-gray-400 select-none w-[10rem]">
                                    Token ID
                                </th> */}
                                <th className="px-2 py-3.5 text-left text-sm uppercase font-normal text-gray-400 select-none w-[10rem]">
                                    Collection
                                </th>
                                <th className="px-2 py-3.5 text-left text-sm uppercase font-normal text-gray-400 select-none w-[10rem]">
                                    Listing date
                                </th>
                                <th className="px-2 py-3.5 text-left text-sm uppercase font-normal text-gray-400 select-none w-[10rem]">
                                    Daily price
                                </th>
                                <th className="px-2 py-3.5 text-left text-sm uppercase font-normal text-gray-400 select-none w-[10rem]">
                                    Total fees
                                </th>
                                <th className="px-2 py-3.5 text-left text-sm uppercase font-normal text-gray-400 select-none w-[10rem]">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                listedNFTs.map((nft) => (
                                    <tr key={nft.tokenId} className="border-t border-t-gray-500 relative cursor-pointer hover:bg-[rgb(34,34,48)] !py-5 font-bold">
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <Image src={nft.img} alt="" width={80} height={80}/>
                                                <span>{nft.name}</span>
                                            </div>
                                        </td>
                                        {/* <td>
                                            <span>{nft.tokenId}</span>
                                        </td> */}
                                        <td>
                                            <span>{nft.collection}</span>
                                        </td>
                                        <td>
                                            <span>{nft.listingDate}</span>
                                        </td>
                                        <td>
                                            <span>${nft.feePerDay.toFixed(2)}</span>
                                        </td>
                                        <td>
                                            <span className="text-[rgb(61,255,185)]">+${nft.totalFees.toFixed(4)}</span>
                                        </td>
                                        <td>
                                            {
                                                nft.status === NFTStatus.AVAILABLE ?
                                                    <NFTStatusText status={nft.status} />
                                                 :
                                                 <Button type={"primary"} className={"font-bold"} onClick={handleClaim}>Claim</Button>
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                }
            </div>
        </div>
    )

    async function handleClaim() {
        console.log(listedNFTs[listedNFTs.length-1].tokenId)
        await writeContractAsync(
            {
                abi: polftRentAbi,
                functionName: 'claimCollateral',
                address: '0x1b54ff158684402D9a8E15C11b3076ADDAF695Fd',
                args: [
                    ['0xFA0bF8c359e83191b017Bb8f8383BBF915F6Ad39'],
                    [listedNFTs[listedNFTs.length-1].tokenId],
                    [listedNFTs[listedNFTs.length-1].tokenId - 2]
                ]
            }
        )
        dispatch(nftActions.updateListedNFT({
            id: 0,
            data: {
                totalFees: 0.3
            }
        }))
    }
}

function Statistic() {
    const listedNFTs = useSelector(listedNFTSelector);
    return (
        <div className="flex gap-4 pb-8 overflow-auto mt-4">
            <div className="bg-light-secondary rounded-md p-4 flex flex-col justify-around h-32 select-none relative min-w-[180px] w-1/4">
                <div className="flex flex-row items-center justify-between">
                    <p className="uppercase text-xs tracking-wider flex items-center gap-2 text-[rgb(255,213,102)]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                            className="h-4 w-4"
                        >
                            <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                            <path
                                fillRule="evenodd"
                                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Total income
                    </p>
                </div>
                <p className="text-2xl font-bold">${(listedNFTs.length < 1 ? 0 : listedNFTs[0].totalFees).toFixed(4)}</p>
            </div>
            <div className="bg-light-secondary rounded-md p-4 flex flex-col justify-around h-32 select-none relative min-w-[180px] w-1/4">
                <div className="flex flex-row items-center justify-between">
                    <p className="uppercase text-xs tracking-wider flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                            className="h-4 w-4"
                        >
                            <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
                        </svg>
                        Total rentals
                    </p>
                </div>
                <p className="text-2xl font-bold">{listedNFTs.length} rentals</p>
                <p className="text-sm text-gray-400">{listedNFTs.length} this week</p>
            </div>
            <div className="bg-light-secondary rounded-md p-4 flex flex-col justify-around h-32 select-none relative min-w-[180px] w-1/4">
                <div className="flex flex-row items-center justify-between">
                    <p className="uppercase text-xs tracking-wider flex items-center gap-2 text-[rgb(17,218,244)]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                            className="h-4 w-4"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Available to rent
                    </p>
                </div>
                <p className="text-2xl font-bold">{listedNFTs.length} NFTs</p>
                <p className="text-sm text-gray-400" />
            </div>
            <div className="bg-light-secondary rounded-md p-4 flex flex-col justify-around h-32 select-none relative min-w-[180px] w-1/4">
                <div className="flex flex-row items-center justify-between">
                    <p className="uppercase text-xs tracking-wider flex items-center gap-2 text-[rgb(61,255,185)]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                            className="h-4 w-4"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Rented
                    </p>
                </div>
                <p className="text-2xl font-bold">0 NFTs</p>
                <p className="text-sm text-gray-400" />
            </div>
        </div>
    )
}
