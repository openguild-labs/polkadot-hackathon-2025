import {
  getMoveBlocksByTechnology,
  BlockType
} from "@/constants/movepaths";
import { Folder, RotateCcw } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import MovePuzzlePiece from "./MovePuzzlePiece";
import TransactionFlowVisualizer from "./TransactionFlowVisualizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const ScrollButtons: React.FC<{
  scrollRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
}> = ({ scrollRef, containerRef }) => {
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current && containerRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        setShowControls(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [scrollRef, containerRef]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!showControls) return null;

  return (
    <>
      <button
        onClick={() => scroll("left")}
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 z-10",
          "w-8 h-8 flex items-center justify-center",
          "bg-white border-2 border-black rounded-lg",
          "shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
          "hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
          "hover:translate-y-[-2px]",
          "transition-all duration-200",
          "disabled:opacity-50"
        )}
      >
        ←
      </button>
      <button
        onClick={() => scroll("right")}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 z-10",
          "w-8 h-8 flex items-center justify-center",
          "bg-white border-2 border-black rounded-lg",
          "shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
          "hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
          "hover:translate-y-[-2px]",
          "transition-all duration-200",
          "disabled:opacity-50"
        )}
      >
        →
      </button>
    </>
  );
};

const ScrollableArea: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative">
      <ScrollButtons scrollRef={scrollRef} containerRef={containerRef} />
      <ScrollArea
        className={cn("w-full whitespace-nowrap rounded-lg ", className)}
      >
        <div ref={scrollRef} className="flex gap-6 px-12 min-h-[300px] justify-center items-center">
          {children}
        </div>
        <ScrollBar orientation="horizontal" className="bg-gray-200" />
      </ScrollArea>
    </div>
  );
};

const AvailablePieces: React.FC<{
  onDragStart: (block: BlockType) => () => void;
}> = ({ onDragStart }) => {
  const technologies = ["Move Basics", "Resources", "Modules", "Scripts", "Testing"];

  return (
    <Card className="bg-purple-900/30 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/5 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-purple-400 font-bold text-2xl">
          Supra Move Components
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={technologies[0]} className="w-full">
          <TabsList className="w-full grid grid-cols-5 gap-4 bg-transparent">
            {technologies.map((tech) => (
              <TabsTrigger
                key={tech}
                value={tech}
                className={cn(
                  "border border-purple-500/30 rounded-xl",
                  "bg-purple-900/30 backdrop-blur-sm",
                  "hover:bg-purple-500/20",
                  "transition-all duration-200",
                  "data-[state=active]:bg-purple-500 data-[state=active]:text-purple-50",
                  "flex items-center gap-2",
                  "p-2"
                )}
              >
                <Folder size={16} />
                {tech}
              </TabsTrigger>
            ))}
          </TabsList>
          {technologies.map((tech) => (
            <TabsContent
              key={tech}
              value={tech}
              className="mt-6 border border-purple-500/30 rounded-xl p-4 bg-purple-900/20 backdrop-blur-sm min-h-[200px]"
            >
              <ScrollableArea>
                <div className="flex items-center justify-center gap-6 h-full">
                  {getMoveBlocksByTechnology(tech)?.map((block) => (
                    <div key={block.id} className="flex-shrink-0">
                      <MovePuzzlePiece
                        block={block}
                        onDragStart={onDragStart(block)}
                      />
                    </div>
                  ))}
                </div>
              </ScrollableArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

const MoveBlockchainPuzzle: React.FC = () => {
  const [chainBlocks, setChainBlocks] = useState<BlockType[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<BlockType | null>(null);
  const [blockValues, setBlockValues] = useState<
    Record<string, Record<string, string>>
  >({});

  const resetChain = () => {
    setChainBlocks([]);
    setBlockValues({});
  };

  const handleValueChange = (blockId: string, key: string, value: string) => {
    setBlockValues((prev) => ({
      ...prev,
      [blockId]: {
        ...(prev[blockId] || {}),
        [key]: value,
      },
    }));
  };

  const removeBlock = (index: number) => {
    setChainBlocks((prev) => {
      const newBlocks = prev.filter((_, i) => i !== index);
      const newValues = { ...blockValues };
      for (let i = index; i < prev.length; i++) {
        delete newValues[`chain-${i}`];
      }
      setBlockValues(newValues);
      return newBlocks;
    });
  };

  const isCompatibleWithChain = (block: BlockType): boolean => {
    if (chainBlocks.length === 0) return true;
    const lastBlock = chainBlocks[chainBlocks.length - 1];
    return lastBlock.compatibleWith.includes(block.id);
  };

  const handleDragStart = (block: BlockType) => () => {
    setDraggedBlock(block);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedBlock && isCompatibleWithChain(draggedBlock)) {
      setChainBlocks((prev) => [...prev, draggedBlock]);
    }
    setDraggedBlock(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 via-purple-900/10 to-black relative p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <p className="text-purple-300/90 font-medium text-lg mt-[70px]">
            Build your Supra Move smart contract by dragging and dropping components
          </p>
        </div>

        <AvailablePieces onDragStart={handleDragStart} />
        
        <Card
          className="bg-purple-900/30 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/5 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-purple-400 font-bold text-2xl">
              Your Move Contract
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={resetChain}
              className={cn(
                "bg-purple-900/30 backdrop-blur-sm border border-purple-500/30",
                "hover:bg-purple-500/20",
                "transition-all duration-200",
                "text-purple-400 font-bold"
              )}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Contract
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-purple-500/30 rounded-lg p-2">
              <ScrollableArea className="p-4">
                {chainBlocks.length === 0 ? (
                  <div className="flex items-center justify-center h-48 text-purple-300/50 font-medium w-full">
                    Drag Move components here to build your smart contract
                  </div>
                ) : (
                  <div className="flex items-center gap-6">
                    {chainBlocks.map((block, index) => (
                      <div
                        className="relative group transition-transform hover:translate-y-[-2px]"
                        key={`chain-${block.id}-${index}`}
                      >
                        <MovePuzzlePiece
                          block={block}
                          isChainPiece={true}
                          isCompatible={
                            index === 0 ||
                            chainBlocks[index - 1].compatibleWith.includes(
                              block.id
                            )
                          }
                          position={
                            index === 0
                              ? "first"
                              : index === chainBlocks.length - 1
                              ? "last"
                              : "middle"
                          }
                          values={blockValues[`chain-${index}`] || {}}
                          onValueChange={(key, value) =>
                            handleValueChange(`chain-${index}`, key, value)
                          }
                          onRemove={() => removeBlock(index)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollableArea>
            </div>
          </CardContent>
        </Card>

        {chainBlocks.length > 0 && (
          <TransactionFlowVisualizer
            blocks={chainBlocks}
            values={blockValues}
          />
        )}
      </div>
    </div>
  );
};

export default MoveBlockchainPuzzle; 