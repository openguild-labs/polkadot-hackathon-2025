"use client";

import { Pair } from "@/@type/pair.type";
import { cn } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import TickerWrapper from "./TickerWrapper";

interface IFavoriteItem {
  pair: Pair;
  isFirst: boolean;
}
const FavoriteItem = ({ pair, isFirst }: IFavoriteItem) => {
  return (
    <Link href={`/buy-cover/${pair.symbol}`}>
      <div
        className={cn(
          "flex min-w-[200px] items-center gap-2 py-3 px-4",
        )}>
        <>
          <Image
            src={pair.token.attachment}
            width={24}
            height={24}
            alt="token logo"
            className="rounded-full"
          />
          <div>
            <div className="text-body-12">
              <span className="text-typo-primary">{pair.asset}</span> 
              <span className="text-typo-secondary"> / {pair.unit}</span>
            </div>
            <TickerWrapper
              jump
              symbol={pair.symbol}
              decimal={pair.token?.decimals}
              defaultLastPrice={pair.lastPrice}
              defaultPriceChangePercent={pair.priceChangePercent}
            />
          </div>
        </>
      </div>
    </Link>
  );
};

export default memo(FavoriteItem);
