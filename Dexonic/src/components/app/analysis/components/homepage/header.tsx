'use client';

import Image from 'next/image';
import Link from 'next/link';

import binance from '@/public/img/binance.svg';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
export default function Header() {
    return (
        <Select>
            <div className="grid pb-10 pt-10 text-foreground">
                <div className="mx-3 grid grid-cols-2 gap-3">
                    <div
                        className="space-y-2 rounded-md border border-[#3C61E9] bg-[#000000] p-2 text-center"
                        style={{
                            boxShadow:
                                '0 0 10px 2px rgba(0, 0, 255, 0.7), 0 0 10px 5px rgba(0, 0, 255, 0.5)',
                            transition: 'box-shadow 0.3s ease',
                        }}
                    >
                        <p className="text-white">Centralized Exchange</p>
                        <SelectTrigger className="flex items-center border border-[#282828] bg-black">
                            <Image className="ml-7" src={binance} alt="binance" width={100} />
                            {/* <Image src={binance} alt="Binance" className="" /> */}
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Binance</SelectItem>
                            <SelectItem value="2">BingX</SelectItem>
                            <SelectItem value="3">...</SelectItem>
                        </SelectContent>
                    </div>
                    <div className="space-y-2 rounded-md border border-[#282828] bg-[#000000] p-2 text-center">
                        <p className="text-white">Decentrialized Exchange</p>
                        <div className="grid grid-cols-3 gap-2">
                            <Select>
                                <SelectTrigger className="col-span-2 border border-[#282828] bg-black">
                                    <span className="flex items-center rounded-md border border-[#282828] bg-black px-2 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                        {/* <Image src={binance} alt="Binance" className="bg-black" /> */}
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Binance</SelectItem>
                                    <SelectItem value="2">BingX</SelectItem>
                                    <SelectItem value="3">...</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger className="border-[#282828] bg-black">
                                    <span className="flex items-center rounded-md border border-[#282828] bg-black px-2 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                        {/* <Image src={binance} alt="Binance" className="" /> */}
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Binance</SelectItem>
                                    <SelectItem value="2">BingX</SelectItem>
                                    <SelectItem value="3">...</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        </Select>
    );
}
