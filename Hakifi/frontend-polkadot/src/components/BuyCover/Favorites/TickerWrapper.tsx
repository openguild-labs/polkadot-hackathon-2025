
import { Skeleton } from "@/components/common/Skeleton";
import usePrevious from "@/hooks/usePrevious";
import { Ticker, useTickerSocket } from "@/hooks/useTickerSocket";
import { cn } from "@/utils";
import { formatNumber } from "@/utils/format";
import { ReactElement, ReactNode, memo, useMemo, useState } from "react";

export const PricePrevious = memo(
  ({
    price,
    decimal = 2,
    suffix,
    className = "",
  }: {
    price: number;
    decimal: number;
    suffix?: ReactNode;
    className?: string;
  }) => {
    const previous = usePrevious(price);
    return (
      <div
        className={cn(
          "text-body-12 text-typo-primary",
          // previous < price ? "text-positive-label" : "text-negative-label",
          className,
        )}>
        {formatNumber(price, decimal)}
        {suffix && suffix}
      </div>
    );
  },
);

type TickerWrapperProps = {
  className?: string;
  labelclassName?: string;
  jump?: boolean;
  fieldName?: "lastPrice" | "highPrice" | "lowPrice";
  suffix?: any;
  symbol: string;
  decimal?: number;
  showPercent?: boolean;
  normal?: boolean;
  defaultLastPrice?: number;
  defaultPriceChangePercent?: number;
};

const TickerWrapper = memo(
  ({
    normal = true,
    className,
    labelclassName,
    fieldName = "lastPrice",
    suffix,
    jump = false,
    showPercent = true,
    symbol,
    decimal = 2,
    defaultLastPrice = 0,
    defaultPriceChangePercent = 0,
  }: TickerWrapperProps): ReactElement => {
    const [ticker, setTicker] = useState<Ticker | null>(null);

    useTickerSocket(symbol, setTicker);
    const value: number =
      Number(ticker?.[fieldName as "lastPrice" | "highPrice" | "lowPrice"]) ||
      defaultLastPrice ||
      0;

    const priceChangePercent = useMemo(
      () => ticker?.priceChangePercent || defaultPriceChangePercent,
      [ticker],
    );
    const negative = useMemo(
      () => (priceChangePercent || 0) < 0,
      [priceChangePercent],
    );

    const render = () => {
      if (!value) return "-";
      //   if (fieldName === "fundingTime")
      //     return (
      //       <Countdown
      //         date={value as any}
      //         renderer={({ hours, minutes, seconds }) =>
      //           `${formatZero(hours)}:${formatZero(minutes)}:${formatZero(
      //             seconds,
      //           )}`
      //         }
      //       />
      //     );
      //   if (fieldName === "fundingRate") return formatNumber(value * 100, 8);
      if (jump) return <PricePrevious price={value} decimal={decimal ?? 2} className={labelclassName} />;
      return formatNumber(value, decimal);
    };

    if (!value) return <Skeleton className={cn("h-6 w-10")} />;
    return (
      <section className="flex items-center gap-1">
        {render()} {suffix && <span className="">{suffix}</span>}
        {showPercent ? (
          <div
            className={cn(
              "!text-body-12 flex items-end",
              (!negative ? "text-positive" : "text-negative-label"),
              className,
            )}>
            {negative ? "-" : "+"}
            {priceChangePercent
              ? formatNumber(Math.abs(priceChangePercent), 2)
              : "-"}
            %
          </div>
        ) : null}
      </section>
    );
  },
);

export default TickerWrapper;
