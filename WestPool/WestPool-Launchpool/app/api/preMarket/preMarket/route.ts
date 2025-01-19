import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const preMarketData = await prismaClient.project.findMany();

    // const preMarketData = await prismaClient.offer.findMany({
    //   include: {
    //     project: true,
    //   },
    // });

    // Test =))
    // const tokenData = await prismaClient.project.findMany();
    // const responseData = preMarketData.map((offer) => ({
    //   id: offer.id,
    //   collateral: offer.collateral,
    //   projectName: offer.project.projectName,
    // }));

    return NextResponse.json(
      { success: true, data: preMarketData },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}
