"use client";

import { Type } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface StaticTextOverlayProps {
  textContent: string;
  startPosition: number;
  duration: number;
  isActive: boolean;
  totalClips: number;
  clipWidth: number;
  gap: number;
  onClick?: () => void;
  zoomLevel?: number;
}

export default function StaticTextOverlay({
  textContent,
  startPosition,
  duration,
  isActive,
  clipWidth,
  gap,
  onClick,
}: StaticTextOverlayProps) {
  const xPosition = startPosition * (clipWidth + gap);
  const width = clipWidth * duration + gap * (duration - 1) - 15;

  if (!isActive || !textContent) {
    return (
      <div className="group flex items-center px-6">
        <div className="flex items-center" style={{ transform: "translateX(0px)" }}>
          <div
            className={twMerge(
              "relative flex items-center gap-2 rounded-lg border-2 bg-white px-5 py-2 shadow transition-colors",
              "border-[#EDEDED] cursor-pointer hover:border-[#8E2DF6]"
            )}
            style={{ width: `${clipWidth}px` }}
            onClick={onClick}
          >
            <div className="relative flex items-center gap-2 pl-2">
              <button className="flex size-8 items-center justify-center rounded-md border border-[#E9E9E9] bg-[#F5F5F5] text-[#A3A3A3] transition-all hover:bg-white" onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
                <Type size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center px-6">
      <div className="flex items-center" style={{ transform: `translateX(${xPosition}px)` }}>
        <div
          className={twMerge(
            "relative flex items-center gap-2 rounded-lg border-2 bg-white px-5 py-2 shadow-md transition-colors",
            isActive ? "border-[#8E2DF6] bg-white cursor-move" : "border-[#F5F5F5] bg-[#F5F5F5]"
          )}
          style={{ width: `${width}px` }}
          onClick={onClick}
        >
          <div className="relative flex items-center gap-2 pl-5">
            <button
              className={twMerge(
                "flex size-8 items-center justify-center rounded-md border transition-all",
                isActive ? "border-black bg-black text-white hover:bg-black/90" : "border-[#E9E9E9] bg-white text-[#A3A3A3] hover:bg-[#F5F5F5]"
              )}
              onClick={(e) => { e.stopPropagation(); onClick?.(); }}
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
