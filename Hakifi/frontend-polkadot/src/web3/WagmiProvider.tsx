"use client";
import React from 'react'
import { WagmiConfig } from 'wagmi';

import wagmiConfig from './wagmiConfig';

type Props = {
    children?: React.ReactNode;
};

const WagmiProvider = ({ children }: Props) => {
    return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
};

export default WagmiProvider;
