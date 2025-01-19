import {
  ChartingLibraryWidgetOptions,
  IChartWidgetApi,
  IChartingLibraryWidget,
  StudyOverrides,
  widget as Widget,
} from "../../public/assets/tradingview/charting_library";
import { useEffect, useRef, useState } from "react";

type useTradingViewType = {
  widgetOptions: ChartingLibraryWidgetOptions;
  depsArr: any[];
  applyOverrides?: StudyOverrides;
};

export const useTradingView = ({
  widgetOptions,
  depsArr,
  applyOverrides,
}: useTradingViewType) => {
  const widgetRef = useRef<IChartingLibraryWidget | null>(null);
  const chartRef = useRef<IChartWidgetApi | null>(null);
  const [chartReady, setChartReady] = useState(false);

  // on mount
  useEffect(() => {
    const chartInit = (config: ChartingLibraryWidgetOptions) => {
      setChartReady(false);
      const tvWidget = new Widget(config);

      widgetRef.current = tvWidget;

      tvWidget.onChartReady(() => {
        tvWidget?.applyOverrides(applyOverrides || {});

        setChartReady(true);
        chartRef.current = tvWidget.chart();
      });
    };
    widgetRef.current = null;
    chartRef.current = null;
    chartInit(widgetOptions);

    // componentWillUnmount
    return () => {
      if (!!widgetRef.current) {
        widgetRef.current.remove();
        widgetRef.current = null;
      }

      if (!!chartRef.current) {
        chartRef.current = null;
      }
    };
  }, depsArr);

  return { chartReady, chart: chartRef.current, widget: widgetRef.current };
};
