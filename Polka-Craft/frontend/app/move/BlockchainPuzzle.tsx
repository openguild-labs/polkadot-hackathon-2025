import {
  getAvailableTechnologies,
  getBlocksByTechnology,
} from "@/constants/supra";
import { Folder, RotateCcw, Code } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import PuzzlePiece from "@/components/PuzzlePiece";
import TransactionFlowVisualizer from "./TrasnactionFlowVisualiser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import confetti from "canvas-confetti";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

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
        className={cn("w-full whitespace-nowrap rounded-lg", className)}
      >
        <div
          ref={scrollRef}
          className="flex gap-4 px-8 py-6 min-h-[200px] justify-center items-center"
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
    <Card className="bg-black/30 backdrop-blur-md border border-primary/30 rounded-xl shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 p-4">
      <CardHeader className="pb-4">
        <CardTitle className="text-primary font-bold text-xl">
          Available Pieces
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={technologies[0]} className="w-full">
          <TabsList className="w-full grid grid-cols-4 gap-2 bg-transparent">
            {technologies.map((tech) => (
              <TabsTrigger
                key={tech}
                value={tech}
                className={cn(
                  "border border-primary/30 rounded-lg",
                  "bg-black/30 backdrop-blur-sm",
                  "hover:bg-primary/20",
                  "transition-all duration-200",
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  "flex items-center gap-1.5",
                  "px-3 py-2 text-sm",
                  "text-primary",
                  "font-medium"
                )}
              >
                <Folder size={12} />
                {tech}
              </TabsTrigger>
            ))}
          </TabsList>
          {technologies.map((tech) => (
            <TabsContent
              key={tech}
              value={tech}
              className="mt-4 border border-primary/30 rounded-xl p-4 bg-black/20 backdrop-blur-sm min-h-[250px]"
            >
              <ScrollableArea>
                <div className="flex items-center justify-center gap-4 h-full">
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

const ContractDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  contract: string | null;
}> = ({ isOpen, onClose, contract }) => {
  if (!contract) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generated Smart Contract</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <SyntaxHighlighter
            language="rust"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: "0.5rem",
              background: "rgba(0, 0, 0, 0.2)",
            }}
            showLineNumbers
          >
            {contract}
          </SyntaxHighlighter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const BlockchainPuzzle: React.FC = () => {
  const [chainBlocks, setChainBlocks] = useState<BlockType[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<BlockType | null>(null);
  const [blockValues, setBlockValues] = useState<
    Record<string, Record<string, string>>
  >({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContract, setGeneratedContract] = useState<string | null>(
    null
  );
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);

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

  const generateContract = async () => {
    if (chainBlocks.length === 0) return;

    setIsGenerating(true);
    try {
      const workflowDescription = chainBlocks
        .map((block, index) => {
          const values = blockValues[`chain-${index}`] || {};
          return `${block.name} ${Object.entries(values)
            .map(([key, value]) => `with ${key}: ${value}`)
            .join(", ")}`;
        })
        .join(" -> ");

      const prompt = `Generate an Move! smart contract that implements the following workflow: ${workflowDescription}`;

      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: "move",
          prompt,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate contract");
      }

      const data = await response.json();
      setGeneratedContract(data.code);
      setIsContractDialogOpen(true);

      const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
      const end = Date.now() + 3 * 1000;

      const frame = () => {
        if (Date.now() > end) return;

        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
          colors: colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
          colors: colors,
        });

        requestAnimationFrame(frame);
      };

      frame();
    } catch (error) {
      console.error("Error generating contract:", error);
      alert("Failed to generate contract. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-black relative p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <p className="text-muted-foreground/90 font-medium text-base mt-[50px]">
            Drag and drop blocks to create your blockchain flow
          </p>
        </div>

        <AvailablePieces onDragStart={handleDragStart} />

        <Card
          className="bg-black/30 backdrop-blur-md border border-primary/30 rounded-xl shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-primary font-bold text-xl">
              Your Chain
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generateContract}
                disabled={chainBlocks.length === 0 || isGenerating}
                className={cn(
                  "bg-black/30 backdrop-blur-sm border border-primary/30",
                  "hover:bg-primary/20",
                  "transition-all duration-200",
                  "text-primary font-medium text-sm",
                  "px-4 py-2",
                  "h-auto"
                )}
              >
                <Code className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Contract"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetChain}
                className={cn(
                  "bg-black/30 backdrop-blur-sm border border-primary/30",
                  "hover:bg-primary/20",
                  "transition-all duration-200",
                  "text-primary font-medium text-sm"
                )}
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Reset Chain
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border border-primary/30 rounded-lg p-2">
              <ScrollableArea className="p-3">
                {chainBlocks.length === 0 ? (
                  <div className="flex items-center justify-center h-36 text-primary/70 font-medium text-sm w-full">
                    Drag blocks here to build your chain
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
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

        <ContractDialog
          isOpen={isContractDialogOpen}
          onClose={() => setIsContractDialogOpen(false)}
          contract={generatedContract}
        />
      </div>
    </div>
  );
};

export default BlockchainPuzzle;
