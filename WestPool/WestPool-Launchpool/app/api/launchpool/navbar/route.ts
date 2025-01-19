import prismaClient from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();
    console.log(body);
    const {
        userAddress
    } = body;

    try {
        const project = await prismaClient.project.findMany({
            where: {
                projectOwnerAddress: userAddress
            }
        });
        console.log(project);
        if (project.length === 0) {
            return NextResponse.json({ success: true, isOwner: false }, { status: 200 })
        }

        return NextResponse.json({ success: true, isOwner: true }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: error }, { status: 500 })
    }
}