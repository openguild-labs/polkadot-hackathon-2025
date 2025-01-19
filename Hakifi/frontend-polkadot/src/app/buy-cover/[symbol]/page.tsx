import { InsurancePlan } from '@/@type/insurance.type';
import { getInsurancePlanApi } from '@/apis/insurance.api';
import { getAllMarketPair, getPairDetail } from '@/apis/pair.api';
import BuyCoverPage from '@/components/BuyCover';
import { handleRequest } from '@/utils/helper';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const Introduction = dynamic(() => import('@/components/BuyCover/Introduction'), { ssr: false });

async function getData(symbol: string) {
  try {
    const pair = await getPairDetail(symbol);

    if (!pair || !pair.config) {
      return null;
    }

    return pair;
  } catch (error) {
    console.error(error);

    return null;
  }
}

const getMarketPairs = async () => {
  const [err, response] = await handleRequest(getAllMarketPair());
  if (err) {
    console.log(err);
    return null;
  }
  return response;
};

const getInsurancePlan = async () => {
  const [err, response] = await handleRequest<InsurancePlan[]>(getInsurancePlanApi());
  if (err) {
    console.log("Error get insurance plan", err.message);
    return [];
  }

  return response;
};

type Props = {
  params: { symbol: string; };
};

// set dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol } = params;

  return {
    title: `${symbol.substring(0, 4)}/${symbol.slice(-4)} | Hakifi insurance`,
  };
}

async function BuyCover({
  params: { symbol },
}: {
  params: { symbol: string; };
}) {
  const pair = await getData(symbol);
  const marketPairs = await getMarketPairs();
  const plans = await getInsurancePlan();
  if (!pair) return notFound();

  return <>
    <Introduction />
    <BuyCoverPage symbol={symbol} pair={pair} marketPairs={marketPairs} plans={plans}/>
  </>;
}

export default BuyCover;