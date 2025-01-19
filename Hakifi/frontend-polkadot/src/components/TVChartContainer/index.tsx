import colors from '@/colors';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useTradingView } from '@/hooks/useTradingView';
import useChartStore from '@/stores/chart.store';
import { TRADING_VIEW_DEFAULTS } from '@/utils/constant';
import { TradingAPI } from 'nami-trading-price-service';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChartingLibraryWidgetOptions,
  EntityId,
  IBasicDataFeed,
  ResolutionString
} from '../../../public/assets/tradingview/charting_library';
import { CHART_VERSION } from './constantsTrading';

const applyOverrides = {
  'mainSeriesProperties.areaStyle.linecolor': colors.negative.DEFAULT,
  'mainSeriesProperties.areaStyle.linewidth': 1,
  'mainSeriesProperties.areaStyle.color1': '#000000',
  'mainSeriesProperties.areaStyle.color2': '#000000',

  'mainSeriesProperties.candleStyle.borderUpColor': colors.positive.DEFAULT,
  'mainSeriesProperties.candleStyle.borderDownColor': colors.negative.DEFAULT,
  'mainSeriesProperties.candleStyle.wickUpColor': colors.positive.DEFAULT,
  'mainSeriesProperties.candleStyle.wickDownColor': colors.negative.DEFAULT,
  'mainSeriesProperties.candleStyle.upColor': colors.positive.DEFAULT,
  'mainSeriesProperties.candleStyle.downColor': colors.negative.DEFAULT,

  'mainSeriesProperties.hollowCandleStyle.borderColor': colors.positive.DEFAULT,
  'mainSeriesProperties.hollowCandleStyle.borderDownColor': colors.negative.DEFAULT,
};

type StateIndi = {
  studies: string[];
  mainIndicator: { id?: EntityId | undefined; value: string; name?: string | undefined; } | null;
  subIndicator: { id?: EntityId | undefined; value: string; name?: string | undefined; } | null;
};

export const useChart = (symbol: string, isDetail: boolean = false) => {
  const container_id = isDetail ? TRADING_VIEW_DEFAULTS.CONTAINER_ID_SPOT_DETAIL : TRADING_VIEW_DEFAULTS.CONTAINER_ID_SPOT;
  const containerRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const [intervalChart, setIntervalChart] = useState('1D');

  const chartCofig = useChartStore((state) => state.chartConfig);
  const chartKey = useMemo(() => {
    return `nami-insurance-${CHART_VERSION}`;
  }, []);

  const isMobile = useIsMobile();

  const saveChart = async (isServer?: boolean) => {
    try {
      if (widget) {
        widget.save((data) => {
          const currentData = JSON.parse(localStorage.getItem(chartKey) || '{}');
          const _store = JSON.stringify(Object.assign(currentData, data));
          localStorage.setItem(chartKey, _store);

          /**
           * Handle when save to server
           */
          // if (isServer) saveChartToServer(_store);
        });
      }
    } catch (err) {
      // console.error('Save chart error', err)
    }
  };

  const handleActiveTime = (value: ResolutionString) => {
    if (widget && symbol && value) {
      widget.setSymbol(symbol, value, () => {
        saveChart(true);
      });

      setIntervalChart(value);
    }
  };

  useEffect(() => {
    handleActiveTime(intervalChart as ResolutionString);
  }, [intervalChart]);

  const studyOverrides = {
    // volume bars up to down
    'volume.volume.color.0': colors.negative.DEFAULT,
    'volume.volume.color.1': colors.positive.DEFAULT,
    // 'showLabelsOnPriceScale': false,
    'volume.volume ma.color': colors.negative.DEFAULT,
    'volume.volume ma.linewidth': 1,
    'volume.volume ma.visible': false,
  };

  const timeFrames = [
    { text: '15m', resolution: '15' as ResolutionString },
    { text: '30m', resolution: '30' as ResolutionString },
    { text: '1h', resolution: '60' as ResolutionString },
    { text: '3h', resolution: '120' as ResolutionString },
    {
      text: '1d',
      resolution: 'D' as ResolutionString,
      description: '1 day',
    },
    {
      text: '3d',
      resolution: 'D' as ResolutionString,
      description: '3 days',
    },
    {
      text: '1w',
      resolution: 'W' as ResolutionString,
      description: '1 week',
    },
    {
      text: '1M',
      resolution: 'M' as ResolutionString,
      description: '1 month',
    },
  ];
  const enabled_features: string[] = ['move_logo_to_main_pane'];
  const disabled_features: string[] = [
    // refer: supported list https://github.com/tradingview/charting_library/wiki/Featuresets
    'symbol_info',
    'header_widget_dom_node',
    'header_symbol_search',
    'symbol_search_hot_key',
    'main_series_scale_menu',
    'volume_force_overlay',
    'use_localstorage_for_settings',
    'compare_symbol',
    'display_market_status',
    // 'go_to_date',
    'source_selection_markers',
    'popup_hints',
    'header_widget',
    'timeframes_toolbar',
  ];

  const datafeed = useMemo(() => {
    const tradingAPI = new TradingAPI(chartCofig);
    const datafeed = tradingAPI.getDatafeed() as IBasicDataFeed;

    return datafeed;
  }, [chartCofig, symbol, searchParams]);

  const widgetOptions: ChartingLibraryWidgetOptions = {
    symbol: symbol as string, //
    datafeed,
    library_path: '/assets/tradingview/charting_library/',
    fullscreen: false,
    autosize: true,
    container: containerRef.current ? containerRef.current : '',
    container_id: container_id as string,
    theme: "Dark",
    // from defaults
    interval: intervalChart as ResolutionString,
    charts_storage_api_version: '1.1',
    client_id: 'tradingview.com',
    user_id: 'public_user_id',
    custom_css_url: '/assets/tradingview/custom_chart.css?version=1.1',

    // features
    enabled_features,
    disabled_features,

    locale: 'en',
    preset: isMobile ? 'mobile' : undefined,

    // overrides
    studies_overrides: studyOverrides,
    overrides: {
      'mainSeriesProperties.priceAxisProperties.autoScale': true,
      'paneProperties.background': colors.background.tertiary,
      // 'paneProperties.vertGridProperties.color': colors.chart.ver,
      // 'paneProperties.horzGridProperties.color': colors.chart.hoz,
      'scalesProperties.lineColor': colors.divider.secondary,
      'scalesProperties.textColor': colors.typo.secondary,
      'scalesProperties.fontSize': 12,
      'scalesProperties.fontWeight': 600,
    },
    time_frames: timeFrames,
    loading_screen: { foregroundColor: '#111314', backgroundColor: '#111314' },
  };

  const depsArr = [isMobile, symbol];

  const { chartReady, widget, chart } = useTradingView({
    widgetOptions: widgetOptions,
    depsArr: depsArr,
    applyOverrides: applyOverrides,
  });

  const [indicator, manageIndicator] = useState<StateIndi>({
    studies: [],
    mainIndicator: null,
    subIndicator: null,
  });

  const createIndicator = async (value: string) => {
    if (widget) return await widget.activeChart().createStudy(value, false, false, undefined, { showLabelsOnPriceScale: true });
    return null;
  };

  const handleChangeIndicator = async (type: string, value: string) => {
    if (!widget) return;
    const indicatorStateKey = type === 'main' ? 'mainIndicator' : 'subIndicator';
    const studyId = indicator[indicatorStateKey]?.id;
    if (studyId) {
      widget?.activeChart().removeEntity(studyId);
    }
    if (value) {
      const id = await createIndicator(value);
      if (id) {
        manageIndicator({
          ...indicator,
          [indicatorStateKey]: {
            id,
            name: value,
          },
        });
      }
    } else {
      manageIndicator({
        ...indicator,
        [indicatorStateKey]: null,
      });
    }
  };

  const handleShowIndicator = () => {
    widget?.activeChart().executeActionById('insertIndicator');
  };

  return {
    setIntervalChart,
    container_id,
    containerRef,
    chartReady,
    widget,
    chart,
    // indicator
    indicator,
    handleChangeIndicator,
    handleShowIndicator
  };
};
