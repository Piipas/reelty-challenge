"use client";

import { useRef } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { twMerge } from "tailwind-merge";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface VideoClipCardProps {
  id: string;
  videoUrl: string;
  ratio: "portrait" | "landscape";
  height: number;
  index: number;
  isRemoved?: boolean;
  onRemove?: (id: string) => void;
  onAdd?: (id: string) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
}

export default function VideoClipCard({ id, videoUrl, ratio, height, isRemoved = false, onRemove, onAdd, onMouseDown }: VideoClipCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isRemoved && onAdd) onAdd(id);
    else if (!isRemoved && onRemove) onRemove(id);
  };

  return (
    <div ref={setNodeRef} style={style} className={twMerge("select-none", isDragging && "shadow-3xl")} {...attributes} {...listeners}>
      <div
        className={cn("relative rounded-xl bg-black/5", ratio === "landscape" ? "aspect-video" : "aspect-9/16")}
        style={{ height: `${height}px` }}
        onClick={() => isRemoved && onAdd?.(id)}
      >
        <div
          className={twMerge("relative size-full rounded-xl bg-black/20 cursor-grab active:cursor-grabbing select-none", !isRemoved && "cursor-move")}
          onMouseDown={onMouseDown}
        >
          <div className={twMerge("relative size-full overflow-hidden rounded-xl duration-300", isRemoved && "cursor-pointer opacity-50 hover:opacity-70")}>
            <video ref={videoRef} src={videoUrl} className="size-full object-cover" muted preload="metadata" disablePictureInPicture />
          </div>
          <button
            type="button"
            className="absolute -top-2 -right-2 z-30 flex size-6 items-center justify-center rounded-md border-2 border-[#EDEDED] bg-black text-white duration-200 hover:scale-[1.1] hover:transform"
            onClick={handleButtonClick}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {isRemoved ? <Plus size={12} strokeWidth={2.5} /> : <Minus size={12} strokeWidth={2.5} />}
          </button>
        </div>
      </div>
    </div>
  );
}
