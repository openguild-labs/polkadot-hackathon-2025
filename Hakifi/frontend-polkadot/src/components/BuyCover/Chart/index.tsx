"use client";

import { IPairConfig } from "@/@type/insurance.type";
import { MarketPair } from "@/@type/pair.type";
import { useIsTablet } from "@/hooks/useMediaQuery";
import { cn } from "@/utils";
import { useRef, useState } from "react";
import Glosbe from "./Glosbe";

type ChartProps = {
  symbol: string;
  decimals?: { symbol: number; price: number; };
  isMobile?: boolean;
  pairConfig?: IPairConfig;
  isHistory?: boolean;
  onFullScreen?: (e: boolean) => void;
  className?: string;
  classContainer?: string;
  toolbar?: boolean;
  marketPairs: MarketPair[];
  fullScreen: boolean;
  setFullScreen: (expand: boolean) => void;
};

const Chart = ({
  symbol,
  onFullScreen,
  classContainer,
  fullScreen,
  setFullScreen
}: ChartProps) => {
  const isTablet = useIsTablet();
  const container = useRef<HTMLDivElement>(null);
  const [showChart, setShowChart] = useState(true);
  return (
    <div
      ref={container}
      data-tour="chart"
      className={cn(
        !isTablet && "min-h-[650px]",
        fullScreen && isTablet && "w-[100vh] h-[100vw] fixed z-[60]",
      )}>
      <div
        className={cn(
          fullScreen && isTablet && "w-[100vh] h-[100vw] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90",
          classContainer,
        )}>

        {
          showChart ? <Glosbe
            symbol={symbol}
            fullScreen={fullScreen}
            onFullScreen={(fullScreen: boolean) => setFullScreen(fullScreen)}
          /> : null
        }

      </div>
    </div>
  );
};

export default Chart;
