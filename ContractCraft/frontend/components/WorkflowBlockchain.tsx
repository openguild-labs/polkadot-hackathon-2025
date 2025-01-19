import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { BlockchainAction } from './BlockchainAction';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Copy, Code } from 'lucide-react'

const actions = [
  { name: 'Approve', description: 'Approve spending of tokens', code: 'useApprove()' },
  { name: 'Transfer', description: 'Transfer tokens', code: 'useTransfer()' },
  { name: 'Transfer From', description: 'Transfer tokens from another address', code: 'useTransferFrom()' },
  { name: 'Check Allowance', description: 'Check token allowance', code: 'useAllowance(owner, spender)' },
  { name: 'Check Balance', description: 'Check token balance', code: 'useBalanceOf(address)' },
  { name: 'Get Total Supply', description: 'Get total token supply', code: 'useTotalSupply()' },
  { name: 'Get Decimals', description: 'Get token decimals', code: 'useDecimals()' },
  { name: 'Get Token Name', description: 'Get token name', code: 'useTokenName()' },
  { name: 'Get Token Symbol', description: 'Get token symbol', code: 'useTokenSymbol()' },
];

export const BlockchainWorkflow: React.FC = () => {
  const [workflow, setWorkflow] = useState<{ name: string; code: string }[]>([]);

  const [, drop] = useDrop(() => ({
    accept: 'action',
    drop: (item: { name: string; code: string }) => {
      setWorkflow((prev) => [...prev, item]);
    },
  }));

  const generateContractCode = () => {
    return `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
        _mint(msg.sender, initialSupply);
    }

    // Add custom functions here based on the workflow
    ${workflow.map(action => `// ${action.name}`).join('\n')}
}
    `.trim();
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-100 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Available Actions</h2>
        {actions.map((action) => (
          <BlockchainAction key={action.name} {...action} />
        ))}
      </div>
      <div ref={drop} className="w-1/2 p-4 bg-white overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Workflow</h2>
        {workflow.map((action, index) => (
          <Card key={index} className="mb-4">
            <CardContent>
              <p>{action.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="w-1/4 p-4 bg-gray-200">
        <h2 className="text-xl font-bold mb-4">Actions</h2>
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="w-full mb-2">
              <Copy className="mr-2 h-4 w-4" /> Copy Workflow Code
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Workflow Code</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <pre className="bg-gray-100 p-4 rounded">
                {workflow.map(action => action.code).join('\n')}
              </pre>
            </div>
          </DrawerContent>
        </Drawer>
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="w-full">
              <Code className="mr-2 h-4 w-4" /> Generate Contract Code
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Generated Contract Code</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <pre className="bg-gray-100 p-4 rounded">
                {generateContractCode()}
              </pre>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

