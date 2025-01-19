"use client";

import Script from 'next/script';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';

type Props = {
  children: React.ReactNode;
};

export default function BuyCover({
  children,
}: Props) {
  return (
    <>
      <Script
        src="/assets/tradingview/datafeeds/udf/dist/bundle.js"
        // beforeInteractive
        onReady={() => { console.log('Ready'); }}
      />
      <HelmetProvider>
        {children}
      </HelmetProvider>
    </>
  );
}
