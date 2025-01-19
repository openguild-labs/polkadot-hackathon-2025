import React from 'react';
import { useDrag } from 'react-dnd';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface BlockchainActionProps {
  name: string;
  description: string;
  code: string;
}

export const BlockchainAction: React.FC<BlockchainActionProps> = ({ name, description, code }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'action',
    item: { name, code },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Card ref={drag} className={`mb-4 cursor-move ${isDragging ? 'opacity-50' : ''}`}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
};

