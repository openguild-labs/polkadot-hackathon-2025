'use client';

import React from 'react';
import PolkaHeader from '@/components/PolkaHeader';
import BlockchainPuzzle from './BlockchainPuzzle';

export default function PolkaPage() {
  return (
    <main className="min-h-screen bg-background">
      <PolkaHeader />
      <div className="max-w-7xl mx-auto px-6 pt-24">
        <h1 className="text-4xl font-bold">Polkadot Smart Contract Platform</h1>
      </div>
      <BlockchainPuzzle />
    </main>
  );
}
