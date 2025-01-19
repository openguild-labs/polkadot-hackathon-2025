import CoinListWrapper from "@/components/common/Accordion/CoinItem";
import Button from "@/components/common/Button";
import { formatNumber } from "@/utils/format";
import { useWallet } from "@suiet/wallet-kit";
import Image from "next/image";

type Props = {
  listCoin: {
    _id: string;
    assets: string;
    nameAsset: string;
    category: string;
    minQCover: number;
    maxQCover: number;
    minMarginRate: number;
    maxMarginRate: number;
    minPriceGapRatio: number;
    maxPriceGapRatio: number;
    minPeriod: number;
    maxPeriod: number;
    totalMarginOpen: number;
    totalMarginLimit: number;
  }[];
};

export default function CoinListPolicy({ listCoin }: Props) {
  const { account } = useWallet();
  return (
    <div className="space-y-3">
      {listCoin.map((coin) => {
        return (
          <CoinListWrapper
            key={coin._id}
            labelClassName="w-[300px]"
            content={
              <section>
                <div className="grid grid-cols-2 text-body-12 gap-y-3">
                  <p className="text-typo-secondary text-start">Category</p>
                  <p className="text-typo-accent text-end">{coin.category}</p>
                  <p className="text-typo-secondary text-start">
                    Min/Max Q-Cover
                  </p>
                  <p className="text-support-white text-end">
                    {formatNumber(coin.minQCover, 2)}/
                    {formatNumber(coin.maxQCover, 2)}
                  </p>
                  <p className="text-typo-secondary text-start">
                    Min/Max Margin Rate
                  </p>
                  <p className="text-support-white text-end">
                    {formatNumber(coin.minMarginRate, 2)}%/
                    {formatNumber(coin.maxMarginRate, 2)}%
                  </p>
                  <div className=" col-span-2 flex items-center justify-between">
                    <p className="text-typo-secondary text-start">
                      Min/Max Price Gap Ratio
                    </p>
                    <p className="text-support-white text-end">
                      {formatNumber(coin.minPriceGapRatio, 2)}%/
                      {formatNumber(coin.maxPriceGapRatio, 2)}%
                    </p>
                  </div>
                  <p className="text-typo-secondary text-start">
                    Min/Max Period
                  </p>
                  <p className="text-support-white text-end">
                    {formatNumber(coin.minPeriod, 2)} Hours/
                    {formatNumber(coin.maxPeriod, 2)} Days
                  </p>
                  <p className="text-typo-secondary text-start">
                    Total Margin Open/Limit
                  </p>
                  <p className="text-support-white text-end">
                    {formatNumber(coin.totalMarginOpen, 2)} USDT/
                    {formatNumber(coin.totalMarginLimit, 2)} USDT
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mt-5 justify-center"
                // onClick={handleOnSuccessNotification}
                >
                  Buy cover
                </Button>
              </section>
            }
          >
            <section className="flex items-center justify-between w-full">
              <div className="flex items-center gap-x-3">
                <div className="flex items-center">
                  <Image
                    src={account?.icon || '/assets/images/wallets/metamask.svg'}
                    width={24}
                    height={24}
                    alt="logo"
                  />
                  <div className="ml-1 text-body-12 flex flex-col items-start">
                    <p>{coin.assets}</p>
                    <p>{coin.nameAsset}</p>
                  </div>
                </div>
              </div>
            </section>
          </CoinListWrapper>
        );
      })}
    </div>
  );
}
