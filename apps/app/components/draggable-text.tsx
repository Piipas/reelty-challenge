"use client";

import { Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";
import { twMerge } from "tailwind-merge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DraggableTextProps {
  id: string;
  textContent: string;
  startPosition: number;
  duration: number;
  isActive: boolean;
  totalClips: number;
  clipWidth: number;
  textWidth: number;
  gap: number;
  onStartPositionChange?: (position: number) => void;
  onDurationChange?: (duration: number) => void;
  onActiveChange?: (active: boolean) => void;
  onClick?: () => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
}

const calculateXFromStartPosition = (position: number, clipWidth: number, gap: number) => position * (clipWidth + gap);
const calculateWidthFromClipCount = (count: number, clipWidth: number, gap: number) => clipWidth * count + gap * (count - 1);

export default function DraggableText({
  id,
  textContent,
  startPosition,
  duration,
  isActive,
  totalClips,
  clipWidth,
  textWidth,
  gap,
  onActiveChange,
  onClick,
}: DraggableTextProps) {
  const xPosition = calculateXFromStartPosition(startPosition, clipWidth, gap);
  const width = calculateWidthFromClipCount(duration, clipWidth, gap);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled: !isActive,
  });

  const style = {
    left: xPosition,
    transform: CSS.Transform.toString(transform),
    width: textWidth,
  };

  if (!isActive || !textContent) return null;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="absolute top-0 cursor-grab active:cursor-grabbing select-none overflow-hidden"
      style={style}
      onClick={onClick}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("relative flex items-center gap-2 rounded-lg border bg-white py-2 shadow-md cursor-move", "border-black bg-white")}>
            <div className="relative flex items-center gap-2 pl-2">
              <button
                className={cn(
                  "flex size-8 items-center justify-center rounded-md border transition-colors",
                  isActive ? "border-black bg-black text-white" : "border-[#E9E9E9] bg-white text-[#A3A3A3]",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onActiveChange?.(!isActive);
                }}
              >
                <Type size={16} className={isActive ? "text-white" : "text-[#A3A3A3]"} />
              </button>
              {isActive && textContent && <span className="text-sm whitespace-nowrap text-black">{textContent}</span>}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>{textContent}</TooltipContent>
      </Tooltip>
    </div>
  );
}
