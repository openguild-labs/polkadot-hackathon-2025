import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { projectId } = body;

    console.log("Request body:", body);
    console.log("Project ID:", projectId);

    const launchpoolData = await prismaClient.project.findMany({
      where: { id: projectId },
    });

    return NextResponse.json(
      //trả về dạng json, nếu muốn trả về chuỗi thì bỏ json đi
      { success: true, data: launchpoolData },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}
