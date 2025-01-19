import prismaClient from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        
        const {

        } = body;

        const projectsWithToken = await prismaClient.project.findMany();
        console.log("Tokens: "+projectsWithToken)


        return NextResponse.json(
            { success: true, projects: projectsWithToken },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}