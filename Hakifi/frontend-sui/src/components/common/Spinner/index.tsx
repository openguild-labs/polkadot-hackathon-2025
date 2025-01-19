import clsx from "clsx";
import React from "react";
import styles from "./Spinner.module.scss";

interface ILoadingProps {
  size: "small" | "large" | "xs";
  className?: string;
}

const Spinner = ({ size = "large", className }: ILoadingProps) => {
  const indexes = Array.from({ length: 5 }, (_, index) => index);
  return (
    <div
      className={clsx(
        styles.loader,
        {
          "w-[calc(4rem-30px)] h-[calc(4rem-30px)] ": size === "xs",
          "w-[calc(5rem-30px)] h-[calc(5rem-30px)] ": size === "small",
          "w-[calc(7rem-40px)] h-[calc(7rem-40px)] ": size === "large",
        },
        className
      )}
    >
      {indexes.map((index) => (
        <div
          className={styles.orbe}
          key={index}
          style={{ "--index": index } as any}
        ></div>
      ))}
    </div>
  );
};

export default Spinner;
