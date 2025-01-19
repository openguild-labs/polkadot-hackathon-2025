import React, { useMemo } from "react";
import colors from "../../../colors";
import ChevronIcon from "./ChevronIcon";

const ArrowUpDownIcon = ({
  sort,
  ...props
}: { sort?: boolean | string } & React.SVGProps<SVGSVGElement>) => {
  const color = useMemo(() => {
    switch (sort) {
      case false:
        return {
          up: colors.typo.secondary,
          down: colors.typo.accent,
        };
      case true:
        return {
          up: colors.typo.accent,
          down: colors.typo.secondary,
        };

      default:
        return {
          up: colors.typo.secondary,
          down: colors.typo.secondary,
        };
    }
  }, [sort]);

  return (
    <div className=" flex flex-col -space-y-1.5">
      <ChevronIcon
        color={color.up}
        width={14}
        height={14}
        className="rotate-180"
      />
      <ChevronIcon color={color.down} width={14} height={14} />
    </div>
  );
};

export default ArrowUpDownIcon;
