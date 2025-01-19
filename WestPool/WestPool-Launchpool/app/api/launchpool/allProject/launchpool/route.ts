import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const launchpoolTotalData = await prismaClient.launchPool.findMany();

    return NextResponse.json(
      { success: true, data: launchpoolTotalData },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}
