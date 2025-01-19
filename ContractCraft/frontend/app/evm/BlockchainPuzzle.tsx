import {
  getAvailableTechnologies,
  getBlocksByTechnology,
} from "@/constants/evm";
import { Folder, RotateCcw } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import PuzzlePiece from "@/components/PuzzlePiece";
import TransactionFlowVisualizer from "./TrasnactionFlowVisualiser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";

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
        <div
          ref={scrollRef}
          className="flex gap-6 px-12 min-h-[300px] justify-center items-center"
        >
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
  const technologies = getAvailableTechnologies();

  return (
    <Card className="bg-black/30 backdrop-blur-md border border-primary/30 rounded-xl shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-primary font-bold text-2xl">
          Available Pieces
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={technologies[0]} className="w-full">
          <TabsList className="w-full grid grid-cols-4 gap-4 bg-transparent">
            {technologies.map((tech) => (
              <TabsTrigger
                key={tech}
                value={tech}
                className={cn(
                  "border border-primary/30 rounded-xl",
                  "bg-black/30 backdrop-blur-sm",
                  "hover:bg-primary/20",
                  "transition-all duration-200",
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
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
              className="mt-6 border border-primary/30 rounded-xl p-4 bg-black/20 backdrop-blur-sm min-h-[200px]"
            >
              <ScrollableArea>
                <div className="flex items-center justify-center gap-6 h-full">
                  {getBlocksByTechnology(tech).map((block) => (
                    <div key={block.id} className="flex-shrink-0">
                      <PuzzlePiece
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
const BlockchainPuzzle: React.FC = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-black relative p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground/90 font-medium text-lg mt-[70px]">
            Drag and drop blocks to create your blockchain flow
          </p>
        </div>

        {/* Available Pieces with Scroll Buttons */}
        <AvailablePieces onDragStart={handleDragStart} />
        {/* Building Area with Scroll Buttons */}
        <Card
          className="bg-black/30 backdrop-blur-md border border-primary/30 rounded-xl shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-primary font-bold text-2xl">
              Your Chain
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={resetChain}
              className={cn(
                "bg-black/30 backdrop-blur-sm border border-primary/30",
                "hover:bg-primary/20",
                "transition-all duration-200",
                "text-primary font-bold"
              )}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Chain
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-black rounded-lg p-2">
              <ScrollableArea className="p-4">
                {chainBlocks.length === 0 ? (
                  <div className="flex items-center justify-center h-48 text-gray-500 font-medium w-full">
                    Drag blocks here to build your chain
                  </div>
                ) : (
                  <div className="flex items-center gap-6">
                    {chainBlocks.map((block, index) => (
                      <div
                        className="relative group transition-transform hover:translate-y-[-2px]"
                        key={`chain-${block.id}-${index}`}
                      >
                        <PuzzlePiece
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

export default BlockchainPuzzle;
