"use client";

import React, { useEffect, useState } from "react";
import Footer from "./Footer";

type Props = {
  children?: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    mounted && <div className="flex min-h-screen flex-col">
      <div className="max-w-full flex-1 bg-support-black lg:mt-0">{children}</div>
      <Footer />
    </div>
  );
};

export default MainLayout;

