import {
  BaseUnit,
  InsuranceSide,
  InsuranceState,
  PrismaClient,
} from '@prisma/client';
import { readFileSync } from 'fs';

const prisma = new PrismaClient();

async function main() {
  const tokensFromFile = JSON.parse(
    readFileSync('prisma/seed/data/tokens.json', 'utf8'),
  );
  const tokensFromDb = await prisma.token.findMany();

  const tokenSymbolsFromDb = new Map(
    tokensFromDb.map((token) => [token.symbol, token]),
  );

  for (const tokenData of tokensFromFile) {
    const existingToken = tokenSymbolsFromDb.get(tokenData.symbol);

    if (existingToken) {
      const isDifferent = Object.keys(tokenData).some(
        (key) =>
          tokenData[key] !== existingToken[key as keyof typeof existingToken],
      );
      if (isDifferent) {
        await prisma.token.update({
          where: { symbol: tokenData.symbol },
          data: tokenData,
        });
      }
    } else {
      await prisma.token.create({
        data: tokenData,
      });
    }
  }

  const allTokens = await prisma.token.findMany({
    select: {
      symbol: true,
    },
  });

  const tagsFromFile = JSON.parse(
    readFileSync('prisma/seed/data/tags.json', 'utf8'),
  );

  const tagsFromDb = await prisma.tag.findMany();
  const tagIdFromDb = new Map(tagsFromDb.map((tag) => [tag.id, tag]));

  for (const tagData of tagsFromFile) {
    const existingTag = tagIdFromDb.get(tagData.id);

    if (!existingTag) {
      await prisma.tag.create({
        data: tagData,
      });
    } else {
      const isDifferent = Object.keys(tagData).some(
        (key) => tagData[key] !== existingTag[key as keyof typeof existingTag],
      );
      if (isDifferent) {
        await prisma.tag.update({
          where: { id: tagData.id },
          data: tagData,
        });
      }
    }
  }

  let allPairs = await prisma.pair.findMany();

  if (!allPairs.length) {
    const pairs = allTokens
      .filter((token) => token.symbol !== BaseUnit.USDT)
      .map((token) => ({
        asset: token.symbol,
        unit: BaseUnit.USDT,
        symbol: `${token.symbol}${BaseUnit.USDT}`,
        pricePrecision: 0,
        quantityPrecision: 0,
        baseAssetPrecision: 0,
        quotePrecision: 0,
      }));

    await prisma.pair.createMany({
      data: pairs,
    });

    allPairs = await prisma.pair.findMany();
  }

  const result: any = await prisma.insurance.aggregateRaw({
    pipeline: [
      {
        $match: {
          state: {
            $nin: [InsuranceState.PENDING, InsuranceState.INVALID],
          },
        },
      },
      {
        $group: {
          _id: {
            asset: '$asset',
            unit: '$unit',
          },
          totalContract: {
            $sum: 1,
          },
          margin: {
            $sum: '$margin',
          },
          q_covered: {
            $sum: '$q_covered',
          },
          claimed: {
            $sum: {
              $cond: [
                {
                  $in: [
                    '$state',
                    [InsuranceState.CLAIMED, InsuranceState.CLAIM_WAITING],
                  ],
                },
                '$q_claim',
                0,
              ],
            },
          },
          refunded: {
            $sum: {
              $cond: [
                {
                  $in: [
                    '$state',
                    [InsuranceState.REFUNDED, InsuranceState.REFUND_WAITING],
                  ],
                },
                '$margin',
                0,
              ],
            },
          },
          totalBull: {
            $sum: {
              $cond: [
                {
                  $eq: ['$side', InsuranceSide.BULL],
                },
                1,
                0,
              ],
            },
          },
          totalBear: {
            $sum: {
              $cond: [
                {
                  $eq: ['$side', InsuranceSide.BEAR],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $addFields: {
          payback: {
            $add: ['$claimed', '$refunded'],
          },
        },
      },
    ],
  });

  for (const item of result) {
    const symbol = `${item._id.asset}${item._id.unit}`;
    await prisma.pairMarketStat.upsert({
      where: {
        symbol,
      },
      create: {
        symbol,
        asset: item._id.asset,
        unit: item._id.unit,
        totalContract: item.totalContract,
        margin: item.margin,
        q_covered: item.q_covered,
        claimed: item.claimed,
        refunded: item.refunded,
        totalBull: item.totalBull,
        totalBear: item.totalBear,
        payback: item.payback,
      },
      update: {
        totalContract: item.totalContract,
        margin: item.margin,
        q_covered: item.q_covered,
        claimed: item.claimed,
        refunded: item.refunded,
        totalBull: item.totalBull,
        totalBear: item.totalBear,
        payback: item.payback,
      },
    });
  }

  // Update PNL Insurances
  const insurances = await prisma.insurance.findMany();
  for (const insurance of insurances) {
    let pnlUser = 0;
    switch (insurance.state) {
      case InsuranceState.CLAIMED:
      case InsuranceState.CLAIM_WAITING:
        pnlUser = insurance.q_claim - insurance.margin;
        break;
      case InsuranceState.LIQUIDATED:
      case InsuranceState.EXPIRED:
        pnlUser = -insurance.margin;
        break;
      default:
        break;
    }

    await prisma.insurance.update({
      where: {
        id: insurance.id,
      },
      data: {
        pnlUser,
        pnlProject: -pnlUser,
      },
    });
  }

  // const pairMarketSymbols = result.map(
  //   (item) => `${item._id.asset}${item._id.unit}`,
  // );

  // await prisma.pairMarketStat.createMany({
  //   data: allPairs
  //     .filter((pair) => !pairMarketSymbols.includes(pair.symbol))
  //     .map((pair) => ({
  //       symbol: pair.symbol,
  //       asset: pair.asset,
  //       unit: pair.unit,
  //       totalContract: 0,
  //       margin: 0,
  //       q_covered: 0,
  //       claimed: 0,
  //       refunded: 0,
  //       totalBull: 0,
  //       totalBear: 0,
  //       payback: 0,
  //     })),
  // });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
