import Button from "@/components/common/Button";
import DataTable from "@/components/common/DataTable";
import { formatNumber } from "@/utils/format";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

type Policy = {
  _id: string;
  assets: string;
  isHot: boolean;
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
};

const dataSample = [
  {
    _id: "abgur14j1n123",
    assets: "BTC / USDT",
    isHot: true,
    category: "Layer 1",
    minQCover: 2,
    maxQCover: 10,
    minMarginRate: 5,
    maxMarginRate: 10,
    minPriceGapRatio: 3,
    maxPriceGapRatio: 38,
    minPeriod: 1,
    maxPeriod: 24,
    totalMarginOpen: 0,
    totalMarginLimit: 1000,
  },
];

export default function TablePolicy() {
  const columns: ColumnDef<Policy>[] = useMemo(
    () => [
      {
        accessorKey: "assets",
        header: "Loại tài sản",
        cell: (props) => {
          return (
            <div className="flex items-center gap-x-2">
              <img />
              <span>{props.row.original.assets}</span>
              {props.row.original.isHot && (
                <div className="font-saira text-typo-primary text-xs font-medium bg-negative-label py-0.5 px-1 rounded-sm">
                  Hot
                </div>
              )}
            </div>
          );
        },
        meta: {
          width: 200,
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: (props) => {
          return (
            <div className="text-typo-accent">
              {props.row.original.category}
            </div>
          );
        },
      },
      {
        accessorKey: "qCover",
        header: "Min/Max Q-Cover",
        cell: (props) => {
          return `${formatNumber(
            props.row.original.minQCover,
            2
          )}/${formatNumber(props.row.original.maxQCover, 2)}`;
        },
      },
      {
        accessorKey: "marginRate",
        header: "Min/Max Margin Rate",
        cell: (props) => {
          return `${formatNumber(
            props.row.original.minMarginRate,
            2
          )}%/${formatNumber(props.row.original.maxMarginRate, 2)}%`;
        },
      },
      {
        accessorKey: "priceGapRatio",
        header: "Min/Max Price Gap Ratio",
        cell: (props) => {
          return `${formatNumber(
            props.row.original.minPriceGapRatio,
            2
          )}/${formatNumber(props.row.original.maxPriceGapRatio, 2)}`;
        },
      },
      {
        accessorKey: "period",
        header: "Min/Max Period",
        cell: (props) => {
          return `${formatNumber(
            props.row.original.minPeriod,
            2
          )}/${formatNumber(props.row.original.maxPeriod, 2)}`;
        },
      },
      {
        accessorKey: "totalMargin",
        header: "Total Margin Open/Limit",
        cell: (props) => {
          return `${formatNumber(
            props.row.original.totalMarginOpen,
            2
          )}/${formatNumber(props.row.original.totalMarginLimit, 2)}`;
        },
      },
      {
        accessorKey: "action",
        header: "",
        cell: () => (
          <Button variant="primary" size="md">
            Buy cover
          </Button>
        ),
      },
    ],
    []
  );

  return <DataTable columns={columns} data={dataSample} />;
}
