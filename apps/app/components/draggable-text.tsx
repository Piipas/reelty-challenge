"use client";

import { Type } from "lucide-react";
import { cn } from "@/lib/utils";

interface DraggableTextProps {
  textContent: string;
  startPosition: number;
  duration: number;
  isActive: boolean;
  totalClips: number;
  clipWidth: number;
  gap: number;
  onStartPositionChange?: (position: number) => void;
  onDurationChange?: (duration: number) => void;
  onActiveChange?: (active: boolean) => void;
  onClick?: () => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
}

const calculateXFromStartPosition = (position: number, clipWidth: number, gap: number) =>
  position * (clipWidth + gap);
const calculateWidthFromClipCount = (count: number, clipWidth: number, gap: number) =>
  clipWidth * count + gap * (count - 1) - 15;

export default function DraggableText({
  textContent,
  startPosition,
  duration,
  isActive,
  clipWidth,
  gap,
  onActiveChange,
  onClick,
}: DraggableTextProps) {
  const xPosition = calculateXFromStartPosition(startPosition, clipWidth, gap);
  const width = calculateWidthFromClipCount(duration, clipWidth, gap);

  if (!isActive || !textContent) return null;

  return (
    <div className="group flex items-center px-6">
      <div className="flex items-center" style={{ transform: `translateX(${xPosition}px)` }}>
        <div
          className={cn(
            "relative flex items-center gap-2 rounded-lg border-2 bg-white px-5 py-2 shadow-md cursor-move",
            isActive ? "border-[#8E2DF6] bg-white" : "border-[#F5F5F5] bg-[#F5F5F5]"
          )}
          style={{ width: `${width}px` }}
          onClick={onClick}
        >
          <div className="relative flex items-center gap-2 pl-2">
            <button
              className={cn(
                "flex size-8 items-center justify-center rounded-md border transition-colors",
                isActive ? "border-black bg-black text-white" : "border-[#E9E9E9] bg-white text-[#A3A3A3]"
              )}
              onClick={(e) => { e.stopPropagation(); onActiveChange?.(!isActive); }}
            >
              <Type size={16} className={isActive ? "text-white" : "text-[#A3A3A3]"} />
            </button>
            {isActive && textContent && <span className="text-sm whitespace-nowrap text-black">{textContent}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
