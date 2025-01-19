import { PrismaClient } from "@prisma/client/extension";

export const updateLaunchPoolNumberOfParticipantsWithCondition = (prismaClient: PrismaClient) => async (userInDB: any, userAddress: string) => {
    if (userInDB === null) {
        userInDB = await prismaClient.user.create({
            data: {
                userAddress: userAddress,
            },
        });
        
        const launchPool = await prismaClient.launchPool.findFirst();

        if (!launchPool) {
            await prismaClient.launchPool.create({
                data: {
                    totalProject: 0,
                    uniqueParticipants: 1,
                    totalTx: 0,
                }
            })
        } else {
            await prismaClient.launchPool.update({
                where: {
                    id: launchPool.id,
                },
                data: {
                    uniqueParticipants: {increment: 1}
                }
            })
        }
    }
}

export const updateLaunchPoolTotalProjetWithCondition = (prismaClient: PrismaClient) => async (projectInDB: any) => {
    if (projectInDB === null) {
        const launchPool = await prismaClient.launchPool.findFirst();

        if (!launchPool) {
            await prismaClient.launchPool.create({
                data: {
                    totalProject: 1,
                    uniqueParticipants: 0,
                    totalTx: 0,
                }
            })
        } else {
            await prismaClient.launchPool.update({
                where: {
                    id: launchPool.id,
                },
                data: {
                    totalProject: {increment: 1}
                }
            })
        }
    }
}

export const updateLaunchPoolTotalTxWithCondition = (prismaClient: PrismaClient) => async () => {
    const launchPool = await prismaClient.launchPool.findFirst();

    if (!launchPool) {
        await prismaClient.launchPool.create({
            data: {
                totalProject: 0,
                uniqueParticipants: 0,
                totalTx: 1,
            }
        })
    } else {
        await prismaClient.launchPool.update({
            where: {
                id: launchPool.id,
            },
            data: {
                totalTx: {increment: 1}
            }
        })
    }
}