import colors from '@/colors';
import { formatNumber, formatTime } from '@/utils/format';
import { useEffect, useRef } from 'react';
import {
  EntityId,
  IChartWidgetApi,
  ILineDataSourceApi,
  IOrderLineAdapter,
} from '../../../../public/assets/tradingview/charting_library';

type DrawlineParams = {
  line: IOrderLineAdapter | ILineDataSourceApi | null;
  chart: IChartWidgetApi;
  isUpdate: boolean;
  text: string;
  bodyBorderColor: string;
  bodyTextColor: string;
  extendLeft: boolean;
  lineColor: string;
  price: number;
  backgroundColor: string;
  textColor: string;
};

export const drawline = ({
  line,
  chart,
  isUpdate,
  text,
  bodyBorderColor,
  bodyTextColor,
  backgroundColor,
  textColor,
  extendLeft,
  lineColor,
  price,
}: DrawlineParams) => {
  if (isUpdate && line) return (line as IOrderLineAdapter).setText(text).setPrice(price);

  return chart
    .createOrderLine()
    .setText(text)
    .setBodyBorderColor(bodyBorderColor)
    .setBodyTextColor(bodyTextColor)
    .setBodyBackgroundColor(backgroundColor)
    .setBodyTextColor(textColor)
    .setExtendLeft(extendLeft)
    .setLineStyle(0)
    .setLineColor(lineColor)
    .setLineLength(100)
    .setQuantity('')
    .setPrice(price);
};

type DrawVerticalParam = {
  line: EntityId | null;
  chart: IChartWidgetApi;
  isUpdate: boolean;
  text: string;
  expiredAt: Date;
};

export const drawShapeVertical = ({
  line,
  chart,
  isUpdate,
  text,
  expiredAt
}: DrawVerticalParam) => {
  const _t_expired = expiredAt || new Date();
  const timer = new Date(_t_expired).getTime() / 1000;
  if (isUpdate && line) {
    const shape = chart.getShapeById(line);
    shape?.setPoints([
      {
        time: timer,
        channel: 'close',
      },
    ]);
    shape?.setProperties({
      text
    });
    // return shape;
    return null;
  }
  return chart.createShape(
    { time: timer, channel: 'close' },
    {
      shape: 'vertical_line',
      disableSelection: true,
      disableSave: true,
      disableUndo: true,
      text,
      overrides: {
        linewidth: 1,
        showLabel: true,
        showDistance: true,
        fontsize: 10,
        linecolor: '#666',
        textcolor: colors.support.white,
        backgroundColor: colors.background.primary,
        transparency: 20,
        showTime: false,
        bold: false,
        textOrientation: 'horizontal',
      },
    },
  );
};

export type InsuranceChartParams = {
  p_claim?: number;
  p_liquidation?: number;
  p_refund?: number;
  expiredAt?: Date;
  p_open?: number;
  p_close?: number;
};

export const useDrawing = (
  chart: IChartWidgetApi | null,
  chartReady: boolean,
  params: InsuranceChartParams,
) => {
  const linesRef = useRef<
    Record<keyof InsuranceChartParams, IOrderLineAdapter | EntityId | ILineDataSourceApi | null>
  >({
    expiredAt: null,
    p_claim: null,
    p_close: null,
    p_liquidation: null,
    p_open: null,
    p_refund: null,
  });
  const _renderTextRatio = (text: string, ratio?: number) => {
    if (!ratio) return text;
    return `${text} ${formatNumber(ratio)}%`;
  };

  const drawParams = (params: InsuranceChartParams) => {
    const lines = linesRef.current;
    if (!chart) return;

    if (params.p_claim) {
      let ratio: number | undefined;
      if (params.p_open) {
        ratio = Math.abs(
          ((params.p_open - params.p_claim) / params.p_open) * 100,
        );
      }
      const text = _renderTextRatio('Claim Price', ratio);

      // P-Claim
      lines.p_claim = drawline({
        line: lines.p_claim as IOrderLineAdapter,
        chart,
        isUpdate: !!lines.p_claim,
        text,
        bodyBorderColor: colors.positive.label,
        bodyTextColor: colors.positive.label,
        extendLeft: false,
        lineColor: colors.positive.label,
        price: params.p_claim,
        textColor: colors.typo.primary,
        backgroundColor: colors.positive.label
      });
    }

    // P-Open
    if (params.p_open) {
      let ratio: number | undefined;
      if (!params.p_open) {
        return;
      }
      const text = _renderTextRatio('Open Price');
      lines.p_open = drawline({
        line: lines.p_open as IOrderLineAdapter,
        chart,
        isUpdate: !!lines.p_open,
        text,
        bodyBorderColor: colors.positive.label,
        bodyTextColor: colors.positive.label,
        extendLeft: false,
        lineColor: colors.positive.label,
        price: params.p_open,
        textColor: colors.typo.primary,
        backgroundColor: colors.positive.label
      });
    }

    // P-Expire
    if (params.p_liquidation) {
      let ratio: number | undefined;
      if (params.p_open) {
        ratio = Math.abs(
          ((params.p_open - params.p_liquidation) / params.p_open) * 100,
        );
      }
      const text = _renderTextRatio('Liquid. price', ratio);
      lines.p_liquidation = drawline({
        line: lines.p_liquidation as IOrderLineAdapter,
        chart,
        isUpdate: !!lines.p_liquidation,
        text,
        bodyBorderColor: colors.negative.label,
        bodyTextColor: colors.negative.label,
        extendLeft: false,
        lineColor: colors.negative.label,
        price: params.p_liquidation,
        textColor: colors.typo.primary,
        backgroundColor: colors.negative.label,
      });
    }

    // P-Refund
    if (params.p_refund) {
      let ratio: number | undefined;
      if (params.p_open) {
        ratio = Math.abs(
          ((params.p_open - params.p_refund) / params.p_open) * 100,
        );
      }
      const text = _renderTextRatio('Refund Price', ratio);
      lines.p_refund = drawline({
        line: lines.p_refund as IOrderLineAdapter,
        chart,
        isUpdate: !!lines.p_refund,
        text,
        bodyBorderColor: colors.negative.label,
        bodyTextColor: colors.negative.label,
        extendLeft: false,
        lineColor: colors.negative.label,
        price: params.p_refund,
        textColor: colors.typo.primary,
        backgroundColor: colors.negative.label,
      });
    }

    // if (params.expiredAt) {
    //   const _expiredAt = params.expiredAt || new Date();
    //   const text = _renderTextRatio(`Expire time ${formatTime(_expiredAt, 'dd.MM')}`);

    //   try {
    //     lines.expiredAt = drawShapeVertical({
    //       line: lines.expiredAt as EntityId,
    //       chart,
    //       isUpdate: !!lines.expiredAt,
    //       text,
    //       expiredAt: _expiredAt,
    //     });
    //   } catch (error) {
    //     lines.expiredAt = null;
    //   }
    // }

    // P-Close
    if (params.p_close) {
      if (!params.p_close) return;
      const text = _renderTextRatio('Close Price');
      lines.p_close = drawline({
        line: lines.p_close as IOrderLineAdapter,
        chart,
        isUpdate: !!lines.p_close,
        text,
        bodyBorderColor: colors.divider.secondary,
        bodyTextColor: colors.divider.secondary,
        extendLeft: false,
        lineColor: colors.divider.secondary,
        price: params.p_close,
        textColor: colors.typo.primary,
        backgroundColor: colors.chart.close,
      });
    }
  };

  const drawing = () => {
    if (!chartReady || !chart) return;
    drawParams(params);
  };

  const clearLine = () => {
    if (!chart) return;
    Object.keys(params).forEach((key: string) => {
      if (linesRef.current[key as keyof InsuranceChartParams]) {
        (linesRef.current[key as keyof InsuranceChartParams] as IOrderLineAdapter).remove
          ? (linesRef.current[key as keyof InsuranceChartParams] as IOrderLineAdapter).remove()
          : chart.removeEntity(linesRef.current[key as keyof InsuranceChartParams] as EntityId);
      }
    });

    // reset info line
    linesRef.current = {
      expiredAt: null,
      p_claim: null,
      p_close: null,
      p_liquidation: null,
      p_open: null,
      p_refund: null,
    };
  };

  useEffect(() => {
    if (!chartReady || !chart) return;
    drawParams(params);
  }, [chart, chartReady, params.p_claim, params.p_open, params.p_liquidation]);

  return {
    drawing, clearLine
  };
};
