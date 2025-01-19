import prismaClient from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();
    console.log(body);
    const {
        userAddress
    } = body;
    try {
        // const project = await prismaClient.project.findMany({
        //     where: {
        //         invested: {
        //             some: {
        //                 user: {
        //                     userAddress: userAddress,
        //                 }
        //             }
        //         }
        //     }
        // });
        const investedProjects = await prismaClient.investedProject.findMany({
            where: {
                user: {
                    userAddress: userAddress,
                }
            }
        });

        const project = [];
        for (let i = 0; i < investedProjects.length; i++) {
            const projectDetails = await prismaClient.project.findUnique({
                where: {
                    id: investedProjects[i].projectId
                }
            });
            project.push(projectDetails);
        }

        for (let i = 0; i < project.length; i++) {
            console.log("Project Name: " + project[i]?.projectName);
        }

        console.log("This is Project " + project);

        return NextResponse.json({ success: true, projects: project }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: error }, { status: 500 })
    }
}