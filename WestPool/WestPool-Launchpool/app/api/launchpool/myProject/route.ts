import prismaClient from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();
    console.log(body);
    const {
        projectOwnerAddress
    } = body;

    try {
        const project = await prismaClient.project.findMany({
            where: {
                projectOwnerAddress: projectOwnerAddress
            }
        });

        return NextResponse.json({ success: true, projects: project }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: error }, { status: 500 })
    }
}