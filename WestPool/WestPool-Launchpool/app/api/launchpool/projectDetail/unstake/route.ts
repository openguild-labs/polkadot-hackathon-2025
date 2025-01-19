import prismaClient from "@/prisma";
import { StakeType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const {
      userAddress,
      projectId,
      txHash,
    } = body;

    const realProjectId = projectId.projectId.toString();
    console.log("Real ProjectId: ", realProjectId);


    
    // console.log("Prisma Client: ", prismaClient);
    console.log("User Address: ", userAddress);
    console.log("Project ID: ", projectId);
    console.log("Transaction Hash: ", txHash);

    const createdStake = await prismaClient.investedProject.create({
      data: {
        projectId: realProjectId,
        userAddress: userAddress,
        stakeType: StakeType.Unstake,
        txHash
      },
    });

    // if (!createdStake) {
    //   throw new Error("Failed to create stake event");
    // }


    return NextResponse.json(
      { success: true, },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}
