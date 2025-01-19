import { PrismaClient } from '@prisma/client';
import Binance from 'binance-api-node';

const prisma = new PrismaClient();

async function main() {
  const binance = Binance();

  const data = await binance.futuresExchangeInfo();

  //   const pairs = await prisma.pair.findMany();
  for (const symbol of data.symbols) {
    try {
      const pair = await prisma.pair.update({
        where: { symbol: symbol.symbol },
        data: {
          pricePrecision: symbol.pricePrecision,
          quantityPrecision: symbol.quantityPrecision,
          baseAssetPrecision: symbol.baseAssetPrecision,
          quotePrecision: symbol.quotePrecision,
        },
      });
    } catch (error) {}
  }
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
