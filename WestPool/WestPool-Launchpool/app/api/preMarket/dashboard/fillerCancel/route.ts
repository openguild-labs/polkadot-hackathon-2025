import CreateOffer from "@/app/preMarket/createOffer/page";
import prismaClient from "@/prisma";
import { CreateOfferStatus, FillerOfferStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { offerId } = body;

    // console.log("Project ID: ", projectId);
    console.log("Offer ID: ", offerId);

    const updatedOffer = await prismaClient.offer.update({
      where: {
        id: offerId,
      },
      data: {
        creatorStatus: CreateOfferStatus.CanceledWithdraw,
        fillerStatus: FillerOfferStatus.Canceled,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}
