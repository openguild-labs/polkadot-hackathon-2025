import { NFTInfo } from "@/interfaces/nft";
import Image from "next/image";
import { Button, Input, Modal, Typography } from "antd";
import { ModalProps } from "antd/lib/modal";
import { useState } from "react";
import {useDispatch} from "react-redux";
import {useAccount, useWriteContract} from "wagmi";
import {erc20Abi} from "viem";
import {MAX_INTEGER_BIGINT} from "@ethereumjs/util";
import {polftRentAbi} from "@/utils/abi";
const { Text } = Typography;

export default function RentNFT(props: {
    nftInfo: NFTInfo,
} & ModalProps) {
    const {
        nftInfo: {
            name,
            img,
            feePerDay,
            tokenId
        },
        ...modalProps
    } = props;
    const gasFee = 0.0068;

    const dispatch = useDispatch();

    const walletAccount = useAccount();
    const {
        data: txHash,
        writeContractAsync
    } = useWriteContract();


    const [openModal, setOpenModal] = useState(false);
    const [rentalDays, setRentalDays] = useState(1);


    const handleChangeRentalDays = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: inputValue } = e.target;
        setRentalDays(Number(inputValue));
    };



    return (
        <Modal
            open={openModal}
            width={1000}
            destroyOnClose
            footer={[]}
            closeIcon={null}
            {...modalProps}
        >
            <div className="flex flex-1 relative md:inline-block transform shadow-lg transition-all md:align-middle md:w-full md:max-w-6xl">
                <div className="absolute top-2 right-2">
                    <button
                        role="button"
                        className="cursor-pointer flex items-center font-body font-bold select-none relative whitespace-nowrap align-middle outline-0 justify-center w-auto p-2 rounded-lg border border-transparent shadow transition focus:outline-none hover:no-underline text-white hover:text-white active:text-white bg-gray-600 hover:bg-secondary active:bg-gray-800"
                        onClick={props.onClose}
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
                    </button>
                </div>
                <div className="text-left overflow-hidden rounded-xl hover:no-underline bg-secondary flex-1">
                    <div className="md:grid grid-cols-[10fr_5fr]">
                        <div className="flex flex-col p-6 bg-light-secondary justify-start min-w-full">
                            <h4 className="break-words max-w-sm font-bold text-2xl">{name}</h4>
                            <Text className="text-thin text-base">Token ID: <Text
                                className="text-muted">{tokenId}</Text></Text>
                            <Text className="text-[#44C174]">Delivery in less than 1min</Text>
                            <div translate="no" className="flex flex-col gap-2 mt-5">
                                <div
                                    className="m-0 text-base flex flex-col justify-center"
                                    data-nft-id="de5877a0-5b14-4d41-9cf1-3eb59fc39a36"
                                    data-service-fee="1.1"
                                >
                                    <div>
                                        <span className="relative">
                                            <span className="ml-1 text-muted">${feePerDay}/day</span>
                                        </span>

                                    </div>
                                </div>

                            </div>
                            <div className="flex items-center mt-5 text-lg">
                                Rent within
                                <Input onChange={handleChangeRentalDays}
                                       className="w-[100px] mx-2 border-2 border-primary bg-secondary" max={1000}
                                       placeholder="amount" defaultValue={1}/>
                                days
                            </div>
                            <div className="w-full border-t-2 mt-5 p-5 border-gray-600">
                                <div className="flex justify-between">
                                    <h3 className="text-sm font-body">Item price</h3>
                                    <h3 className="text-sm font-body text-right">{parseFloat((feePerDay * rentalDays).toFixed(6))} USD</h3>
                                </div>
                                <div className="flex justify-between">
                                    <h3 className="text-sm font-normal">Gas fee</h3>
                                    <h3 className="text-sm font-body text-right">${gasFee} USD</h3>
                                </div>

                                <div className="flex justify-between mt-3 font-bold">
                                    <h3 className="text-xl font-body">Total</h3>
                                    <h3 className="text-xl font-body text-right">${parseFloat((gasFee + feePerDay * rentalDays).toFixed(6))} USD</h3>
                                </div>
                                <Button className="w-full mt-5 py-5" type="primary" onClick={handleRent}>
                                    <Text strong className="text-xl">Rent</Text>
                                </Button>
                            </div>

                        </div>
                        <div className="md:order-first">
                            <h2 className="pt-6 px-10 pb-6 text-3xl font-bold">NFT</h2>
                            <div className="md:grid grid-cols-2">
                                <div>
                                    <Image
                                        className="w-full animate-fade-in"
                                        alt={name}
                                        src={img}
                                        width={300}
                                        height={300}
                                    />
                                </div>
                                <div className="flex-grow p-6">
                                    <div
                                        data-trait-type="hp"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Hp</div>
                                        <div className="text-right pl-10 text-white/70">44</div>
                                    </div>
                                    <div
                                        data-trait-type="speed"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Speed</div>
                                        <div className="text-right pl-10 text-white/70">44</div>
                                    </div>
                                    <div
                                        data-trait-type="skill"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Skill</div>
                                        <div className="text-right pl-10 text-white/70">31</div>
                                    </div>
                                    <div
                                        data-trait-type="morale"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Morale</div>
                                        <div className="text-right pl-10 text-white/70">45</div>
                                    </div>
                                    <div
                                        data-trait-type="class"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Class</div>
                                        <div className="text-right pl-10 text-white/70">Reptile</div>
                                    </div>
                                    <div
                                        data-trait-type="stage"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Stage</div>
                                        <div className="text-right pl-10 text-white/70">4</div>
                                    </div>
                                    <div
                                        data-trait-type="purity"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Purity</div>
                                        <div className="text-right pl-10 text-white/70">21</div>
                                    </div>
                                    <div
                                        data-trait-type="pureness"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Pureness</div>
                                        <div className="text-right pl-10 text-white/70">1</div>
                                    </div>
                                    <div
                                        data-trait-type="back.name"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Back Name</div>
                                        <div className="text-right pl-10 text-white/70">Hero</div>
                                    </div>
                                    <div
                                        data-trait-type="body.name"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Body Name</div>
                                        <div className="text-right pl-10 text-white/70">Normal</div>
                                    </div>
                                    <div
                                        data-trait-type="ears.name"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Ears Name</div>
                                        <div className="text-right pl-10 text-white/70">Innocent</div>
                                    </div>
                                    <div
                                        data-trait-type="eyes.name"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Eyes Name</div>
                                        <div className="text-right pl-10 text-white/70">Robin</div>
                                    </div>
                                    <div
                                        data-trait-type="horn.name"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Horn Name</div>
                                        <div className="text-right pl-10 text-white/70">Clamshell</div>
                                    </div>
                                    <div
                                        data-trait-type="tail.name"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Tail Name</div>
                                        <div className="text-right pl-10 text-white/70">Tiny</div>
                                    </div>
                                    <div
                                        data-trait-type="mouth.name"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Mouth Name</div>
                                        <div className="text-right pl-10 text-white/70">Square</div>
                                    </div>
                                    <div
                                        data-trait-type="specialCollection.xmas"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Special Collection Xmas</div>
                                        <div className="text-right pl-10 text-white/70">False</div>
                                    </div>
                                    <div
                                        data-trait-type="specialCollection.japan"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Special Collection Japan</div>
                                        <div className="text-right pl-10 text-white/70">False</div>
                                    </div>
                                    <div
                                        data-trait-type="specialCollection.shiny"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Special Collection Shiny</div>
                                        <div className="text-right pl-10 text-white/70">False</div>
                                    </div>
                                    <div
                                        data-trait-type="specialCollection.mystic"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Special Collection Mystic</div>
                                        <div className="text-right pl-10 text-white/70">False</div>
                                    </div>
                                    <div
                                        data-trait-type="specialCollection.summer"
                                        className="flex justify-between overflow-auto scrollbar-hide pb-2 pt-2 border-t border-gray-600/50 first:border-none text-md"
                                    >
                                        <div className="font-medium pr-10">Special Collection Summer</div>
                                        <div className="text-right pl-10 text-white/70">False</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>

    )

    async function handleRent() {
        let txHash = await writeContractAsync({
            abi: erc20Abi,
            address: '0x571C02E1F981EEd9b241be144949a8E85C2fa683',
            args: ['0x1b54ff158684402D9a8E15C11b3076ADDAF695Fd', MAX_INTEGER_BIGINT],
            functionName: "approve"
        });

        console.log(txHash);
        await writeContractAsync({
            abi: polftRentAbi,
            functionName: "rent",
            address: '0x1b54ff158684402D9a8E15C11b3076ADDAF695Fd',
            args: [
                ['0xFA0bF8c359e83191b017Bb8f8383BBF915F6Ad39'],
                [tokenId],
                [tokenId - 2],
                [Math.floor(rentalDays * 86400)]
            ]
        });
        console.log("Rent ok");
        setOpenModal(false);
    }
}
