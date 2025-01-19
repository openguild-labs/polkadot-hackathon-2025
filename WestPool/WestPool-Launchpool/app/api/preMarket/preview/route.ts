import prismaClient from "@/prisma";
import { CreateOfferStatus, FillerOfferStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  console.log(body);

  const {
    role,
    pricePerToken,
    amount,
    selectedNetwork,
    // selectedToken,
    collateral,
    // selectedCollateralToken,
    tokenAddress,
    creatorAddress,
  } = body;

  console.log("Role: " + role);
  console.log("PricePerToken: " + pricePerToken);
  console.log("Amount: " + amount);
  console.log("SelectedNetwork: " + selectedNetwork);
  // console.log("SelectedToken: "+selectedToken);
  console.log("Collateral: " + collateral);
  // console.log("SelectedCollateralToken: "+selectedCollateralToken55);
  console.log("TokenAddress: " + tokenAddress[0]);
  console.log("CreatorAddress: " + creatorAddress);

  try {
    const getProject = await prismaClient.project.findFirst({
      where: {
        verifiedTokenAddress: tokenAddress[0],
      },
    });
    console.log("Project: " + getProject);
    const projectId = getProject?.id;
    console.log("ProjectId: " + projectId);

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // const createdDateTime = new Date().toISOString();
    // const creatorStatus = CreateOfferStatus.Open
    // const fillerStatus = FillerOfferStatus.NotYet
    const offer = await prismaClient.offer.create({
      data: {
        pricePerToken: pricePerToken,
        amount: amount,
        collateral: collateral,
        tokenPreTokenAddress: tokenAddress[0],
        tokenCollateralAddress: tokenAddress[1],
        offerType: role,
        startDate: new Date().toISOString(),
        filledTime: new Date().toISOString(),
        creatorStatus: CreateOfferStatus.Open,
        fillerStatus: FillerOfferStatus.NotYet,
        creatorAddress: creatorAddress,
        fillerAddress: "",
        projectId: projectId,
        txHash: "",
      },
    });

    // const project = await prismaClient.project.findUnique({
    //   where: {
    //     id: projectId,
    //   },
    // });
    // update launchpool number of project
    const updateLaunchPool = await prismaClient.launchPool.update({
      data: {
        totalTx: {
          increment: 1,
        },
      },
      where: {
        id: "1",
      },
    });

    return NextResponse.json(
      { success: true, offer: offer, project: projectId },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
