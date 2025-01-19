"use client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BlockchainPuzzle from "./BlockchainPuzzle";
import MoveHeader from "@/components/MoveHeader";

export default function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <MoveHeader />
        <div className="max-w-7xl mx-auto px-6 pt-24">
          <h1 className="text-4xl font-bold">MOVE Smart Contract Platform</h1>
        </div>
        <BlockchainPuzzle />
      </div>
    </DndProvider>
  );
}
