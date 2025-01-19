import CreateOffer from "@/app/preMarket/createOffer/page";
import prismaClient from "@/prisma";
import { CreateOfferStatus, FillerOfferStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        const {
            userAddress,
            projectId,
            offerId,
        } = body;

        console.log("User Address: ", userAddress);
        console.log("Project ID: ", projectId);
        console.log("Offer ID: ", offerId);

        const getUser = await prismaClient.user.findFirst({
            where: {
                userAddress: userAddress,
            },
        });

        if (getUser === null) {
            const user = await prismaClient.user.create({
                data: {
                    userAddress: userAddress,
                },
            });
        }

        const updatedOffer = await prismaClient.offer.update({
            where: {
                id: offerId,
            },
            data: {
                fillerAddress: userAddress,
                filledTime: new Date(),
                creatorStatus: CreateOfferStatus.Pending,
                fillerStatus: FillerOfferStatus.Pending,
            },
        });

        return NextResponse.json(
            { success: true, },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }

}