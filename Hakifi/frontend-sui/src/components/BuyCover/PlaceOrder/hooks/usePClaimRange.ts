import { PairDetail } from '@/@type/pair.type';
import { informula } from '@/lib/informula';
import useBuyCoverStore from '@/stores/buy-cover.store';
import { useEffect, useMemo, useState } from 'react';

const usePClaimRange = (pair: PairDetail) => {
  const [symbol, setSymbol] = useState<string | null>(null);
  useEffect(() => {
    setSymbol(pair.symbol);
    return () => {
      setSymbol(null);
    };
  }, [pair.symbol]);

  const [periodChangeRatio, side, p_open] = useBuyCoverStore((state) => [
    state.periodChangeRatio,
    state.side,
    state.p_open,
  ]);

  const range = useMemo(() => {
    if (!periodChangeRatio || !p_open || !symbol) return null;
    const result = informula.getDistancePClaim({
      side,
      signal: pair.signal,
      list_ratio_change: pair.config.listChangeRatios,
      p_market: p_open,
      period_change_ratio: periodChangeRatio
    });

    return {
      min: result.claim_price_min,
      max: result.claim_price_max,
    };
  }, [side, periodChangeRatio, p_open, symbol]);

  return range;
};

export default usePClaimRange;
