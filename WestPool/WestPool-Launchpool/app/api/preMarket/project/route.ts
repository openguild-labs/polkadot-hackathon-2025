import prismaClient from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();

    const {
        tokenAddress,
    } = body;

    const projectTokenAddress = tokenAddress[0];

    try {
        const projet = await prismaClient.project.findFirst({
            where: {
                verifiedTokenAddress: projectTokenAddress,
            },
        });

        const projectId = projet?.id;
        console.log("projectId: ", projectId);

        if (!projectId) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, projectId: projectId });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { success: false, error: "Project not found" },
            { status: 404 }
        );
    }
}