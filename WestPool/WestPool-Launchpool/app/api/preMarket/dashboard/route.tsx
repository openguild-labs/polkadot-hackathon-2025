import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";
import { OfferType } from "@prisma/client";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        const { userAdress } = body;

        const preMarketDataBuy = await prismaClient.offer.findMany({
            where: {
                fillerAddress: userAdress,
                // offerType: OfferType.Buy,
            },
            include: {
                project: true,
                users: true,
            },
        });

        const preMarketDataSell = await prismaClient.offer.findMany({
            where: {
                creatorAddress: userAdress,
                // offerType: OfferType.Sell,
            },
            include: {
                project: true,
                users: true,
            },
        });

        // Gộp hai mảng và thêm trường phân biệt
        const unifiedData = [
            ...preMarketDataBuy.map((item) => ({
                ...item,
            })),
            ...preMarketDataSell.map((item) => ({
                ...item,
            })),
        ];

        // Trả về JSON chuẩn
        return NextResponse.json(
            { success: true, data: unifiedData },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}
