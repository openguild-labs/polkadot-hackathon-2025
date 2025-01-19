import { X } from "lucide-react";
import BlockInput from "./BlockInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { blocks } from "@/constants/paths";
interface PuzzlePieceProps {
  block: BlockType;
  isChainPiece?: boolean;
  isCompatible?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  position?: "first" | "middle" | "last";
  values?: Record<string, string>;
  onValueChange?: (key: string, value: string) => void;
  onRemove?: () => void;
  chainBlocks?: BlockType[];
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({
  block,
  isChainPiece = false,
  isCompatible = true,
  onClick,
  onDragStart,
  position = "middle",
  values = {},
  onValueChange,
  onRemove,
  chainBlocks = [],
}) => {
  const baseHeight = 180;
  const inputHeight =
    isChainPiece && block.inputs ? block.inputs.length * 70 : 0;
  const totalHeight = baseHeight + inputHeight;
  const baseWidth = 240;
  const totalWidth = isChainPiece && block.inputs ? 280 : baseWidth;

  // Fixed compatibility check
  const canBeAddedToChain = () => {
    if (chainBlocks.length === 0) return true;
    const lastBlock = chainBlocks[chainBlocks.length - 1];
    return lastBlock.compatibleWith.includes(block.id);
  };

  const isGreyedOut =
    !isChainPiece && chainBlocks.length > 0 && !canBeAddedToChain();

  // Get compatible blocks for tooltip
  const getCompatibleBlocks = () => {
    if (chainBlocks.length === 0) return "Can be used as first block";
    const lastBlock = chainBlocks[chainBlocks.length - 1];
    const compatibleBlockNames = blocks
      .filter((b) => lastBlock.compatibleWith.includes(b.id))
      .map((b) => b.name)
      .join(", ");
    return `Current chain expects: ${compatibleBlockNames}`;
  };

  console.log(totalHeight,baseHeight);
  const PieceContent = () => (
    <div
      className={cn(
        "relative",
        "transition-transform duration-300",
        !isChainPiece && !isGreyedOut && "hover:translate-y-[-4px]"
      )}
    >
      <svg
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        height={isChainPiece ? totalHeight : baseHeight}
        viewBox={`0 0 ${totalWidth} ${isChainPiece ? totalHeight : baseHeight}`}
        className={cn(
          "filter",
          isGreyedOut
            ? "drop-shadow-[2px_2px_0_rgba(0,0,0,0.2)]"
            : "drop-shadow-[4px_4px_0_rgba(0,0,0,1)]",
          "transition-all duration-300"
        )}
      >
        <defs>
          <path
            id="piece-first"
            d={`
                M 40 0
                H 180
                C 180 0, 200 0, 200 20
                V 60
                C 200 70, 220 70, 220 80
                C 220 90, 200 90, 200 100
                V 140
                C 200 160, 180 160, 180 160
                H 40
                C 40 160, 20 160, 20 140
                V 20
                C 20 0, 40 0, 40 0
                Z
              `}
          />

          <path
            id="piece-middle"
            d={`
                M 40 0
                H 180
                C 180 0, 200 0, 200 20
                V 60
                C 200 70, 220 70, 220 80
                C 220 90, 200 90, 200 100
                V 140
                C 200 160, 180 160, 180 160
                H 40
                C 40 160, 20 160, 20 140
                V 100
                C 20 90, 0 90, 0 80
                C 0 70, 20 70, 20 60
                V 20
                C 20 0, 40 0, 40 0
                Z
              `}
          />

          <path
            id="piece-last"
            d={`
                M 40 0
                H 180
                C 180 0, 200 0, 200 20
                V 140
                C 200 160, 180 160, 180 160
                H 40
                C 40 160, 20 160, 20 140
                V 100
                C 20 90, 0 90, 0 80
                C 0 70, 20 70, 20 60
                V 20
                C 20 0, 40 0, 40 0
                Z
              `}
          />
        </defs>

        {/* Main shape with stroke */}
        <use
          href={`#piece-${position}`}
          className={cn(
            "stroke-2",
            isGreyedOut
              ? "fill-foreground/10 stroke-primary/30"
              : "fill-foreground/10 stroke-primary/80 backdrop-blur-md"
          )}
          transform={
            isChainPiece
              ? `translate(20, 0) scale(${totalWidth / baseWidth}, ${
                  totalHeight / 180
                })`
              : undefined
          }
        />

        <foreignObject
          x={isChainPiece ? "40" : "40"}
          y={isChainPiece ? "20" : "30"}
          width={isChainPiece ? totalWidth - 80 : baseWidth - 80}
          height={isChainPiece ? totalHeight - 120 : baseHeight - 60}
        >
          <div className="w-full h-full flex flex-col items-center justify-center">
            <block.icon
              size={16}
              className={cn(
                "mb-2",
                isGreyedOut ? "text-primary/30" : "text-primary"
              )}
            />
            <span
              className={cn(
                "font-bold text-sm mb-4 text-center",
                isGreyedOut ? "text-primary/30" : "text-primary"
              )}
            >
              {block.name}
            </span>

            {block.inputs && isChainPiece && (
              <div className="w-full space-y-4">
                {block.inputs.map((input, idx) => (
                  <div key={idx} className="w-full px-4">
                    <label className="text-xs font-semibold mb-1.5 block text-muted-foreground">
                      {input.label}
                    </label>
                    <div className="relative">
                      <BlockInput
                        input={input}
                        value={values[input.label] || ""}
                        onChange={(value) =>
                          onValueChange?.(input.label, value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </foreignObject>
      </svg>

      {/* Show incompatible indicator with tooltip for non-chain pieces */}
      {!isChainPiece && isGreyedOut && (
        <div className="absolute -top-2 -right-2 bg-black/80 text-primary-foreground text-xs px-2 py-1 rounded-full border border-primary/30 shadow-lg shadow-primary/20">
          Not Compatible
        </div>
      )}

      {isChainPiece && onRemove && (
        <Button
          size="icon"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={cn(
            "absolute -top-2 -right-2 rounded-full h-6 w-6 p-0",
            "border border-primary/30",
            "bg-black/80 text-primary-foreground",
            "shadow-lg shadow-primary/20",
            "hover:bg-primary/20",
            "hover:scale-110",
            "transition-all duration-200",
            "opacity-0 group-hover:opacity-100"
          )}
        >
          <X size={12} />
        </Button>
      )}
    </div>
  );

  // Wrap with tooltip for non-chain pieces
  if (!isChainPiece) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            draggable={!isChainPiece}
            onDragStart={onDragStart}
            onClick={onClick}
            className={cn(
              "relative w-full min-w-[250px]",
              isChainPiece ? "max-w-[280px]" : "max-w-[240px]",
              "transition-all duration-300",
              !isChainPiece &&
                !isGreyedOut &&
                "cursor-grab active:cursor-grabbing hover:scale-105",
              !isCompatible && isChainPiece && "opacity-50",
              isGreyedOut && "opacity-50"
            )}
          >
            <PieceContent />
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="bg-black/80 text-primary-foreground border border-primary/30 p-2 text-xs font-medium shadow-lg shadow-primary/20"
          >
            {getCompatibleBlocks()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  // Return without tooltip for chain pieces
  return (
    <div
      draggable={!isChainPiece}
      onDragStart={onDragStart}
      onClick={onClick}
      className={cn(
        "relative w-full",
        isChainPiece ? "max-w-[280px]" : "max-w-[240px]",
        "transition-all duration-300",
        !isChainPiece &&
          !isGreyedOut &&
          "cursor-grab active:cursor-grabbing hover:scale-105",
        !isCompatible && isChainPiece && "opacity-50",
        isGreyedOut && "opacity-50"
      )}
    >
      <PieceContent />
    </div>
  );
};

export default PuzzlePiece;
