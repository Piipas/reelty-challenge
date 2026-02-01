import { GAP_BETWEEN_CLIPS, getClipWidth, getConstrainedHeight, SAMPLE_VIDEOS } from "@/data/sample-videos";
import { closestCenter, DndContext, DragEndEvent, DragMoveEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToHorizontalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { FileVideo, Plus, PlusIcon, Type } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import DraggableText from "./draggable-text";
import { Button } from "./ui/button";
import { twMerge } from "tailwind-merge";
import VideoClipCard from "./video-clip-card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VideoForm } from "./video-form";

interface TimelineProps {
  zoomLevel: number;
  texts: any[];
  setTexts: Dispatch<SetStateAction<any[]>>;
  setTextInput: Dispatch<SetStateAction<string>>;
  setSelectedTextAnimation: Dispatch<SetStateAction<string | null>>;
  isTextOpen: boolean;
  setIsTextOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedAnimationData: Dispatch<SetStateAction<any>>;
  setEditingTextId: Dispatch<SetStateAction<string | null>>;
  textClipCount: number;
  setTextClipCount: Dispatch<SetStateAction<number>>;
  setTextStartPosition: Dispatch<SetStateAction<number>>;
  activeClips: typeof SAMPLE_VIDEOS;
  setActiveClips: Dispatch<SetStateAction<typeof SAMPLE_VIDEOS>>;
}

export function Timeline({
  zoomLevel,
  texts,
  setTexts,
  isTextOpen,
  setEditingTextId,
  setIsTextOpen,
  setSelectedAnimationData,
  setSelectedTextAnimation,
  setTextClipCount,
  setTextInput,
  textClipCount,
  setTextStartPosition,
  activeClips,
  setActiveClips,
}: TimelineProps) {
  const ratio: "portrait" | "landscape" = "portrait";
  const clipsScrollContainerRef = useRef<HTMLDivElement>(null);
  const textsScrollCantainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textDragStartRef = useRef(0);

  const [removedClips, setRemovedClips] = useState<typeof SAMPLE_VIDEOS>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [textPreviewStart, setTextPreviewStart] = useState(0);
  const maxTextStart = Math.max(0, activeClips.length - textClipCount);
  const [draggingClipId, setDraggingClipId] = useState<string | null>(null);
  const [clipDragOverId, setClipDragOverId] = useState<string | null>(null);

  const clipWidth = getClipWidth(ratio, zoomLevel);
  const constrainedHeight = getConstrainedHeight(ratio, zoomLevel);

  const handleTimelineScroll = () => {
    if (textsScrollCantainerRef.current && clipsScrollContainerRef.current) {
      textsScrollCantainerRef.current.scrollTop = clipsScrollContainerRef.current.scrollTop;
      textsScrollCantainerRef.current.scrollLeft = clipsScrollContainerRef.current.scrollLeft;
    }
  };

  const handleTextClick = (id?: string) => {
    if (id) {
      const t = texts.find((t) => t.id === id);
      if (t) {
        setTextInput(t.text);
        setSelectedTextAnimation(t.animation);
        setTextStartPosition(t.startPosition);
        setTextClipCount(t.duration);
        setEditingTextId(id);
        setSelectedAnimationData((t as any).animationData ?? null);
      }
    } else {
      setTextInput("");
      setSelectedTextAnimation(null);
      setTextStartPosition(0);
      setTextClipCount(1);
      setEditingTextId(null);
    }
    setIsTextOpen(true);
  };

  const handleRemoveClip = (id: string) => {
    const clip = activeClips.find((c) => c.id === id);
    if (clip) {
      setActiveClips(activeClips.filter((c) => c.id !== id));
      setRemovedClips([...removedClips, clip]);
    }
  };

  const handleAddClip = (id: string) => {
    const clip = removedClips.find((c) => c.id === id);
    if (clip) {
      setRemovedClips(removedClips.filter((c) => c.id !== id));
      setActiveClips([...activeClips, clip]);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggingClipId(null);
    setClipDragOverId(null);

    if (!over || active.id === over.id) return;

    setActiveClips((clips) => {
      const oldIndex = clips.findIndex((c) => c.id === active.id);
      const newIndex = clips.findIndex((c) => c.id === over.id);
      const newClips = arrayMove(clips, oldIndex, newIndex);

      setTexts((prevTexts) =>
        prevTexts.map((text) => {
          if (!text.startClipId) return text;

          const newPosition = newClips.findIndex((c) => c.id === text.startClipId);
          if (newPosition === -1) return text;

          return {
            ...text,
            startPosition: newPosition,
          };
        }),
      );

      return newClips;
    });
  };

  const handleClipDragStart = (event: DragEndEvent) => {
    setDraggingClipId(event.active.id as string);
  };

  const handleClipDragOver = (event: any) => {
    if (event.over) {
      setClipDragOverId(event.over.id as string);
    }
  };

  const getTextPreviewPosition = (text: (typeof texts)[0]) => {
    if (!draggingClipId || !clipDragOverId || !text.startClipId) {
      return text.startPosition;
    }

    if (text.startClipId === draggingClipId) {
      const overIndex = activeClips.findIndex((c) => c.id === clipDragOverId);
      return overIndex !== -1 ? overIndex : text.startPosition;
    }

    const oldIndex = activeClips.findIndex((c) => c.id === draggingClipId);
    const newIndex = activeClips.findIndex((c) => c.id === clipDragOverId);
    const textClipCurrentIndex = activeClips.findIndex((c) => c.id === text.startClipId);

    if (oldIndex === -1 || newIndex === -1 || textClipCurrentIndex === -1) {
      return text.startPosition;
    }

    const tempClips = [...activeClips];
    const moved = tempClips.splice(oldIndex, 1)[0];
    tempClips.splice(newIndex, 0, moved);
    const newPosition = tempClips.findIndex((c) => c.id === text.startClipId);

    return newPosition !== -1 ? newPosition : text.startPosition;
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col h-auto justify-end min-h-0 overflow-x-hidden overflow-y-auto rounded-3xl border border-[#F6F6F6] bg-white md:flex p-4 space-y-2"
    >
      <div className="flex gap-4 items-center">
        <Type className="text-gray-200" size={30} />
        <div ref={textsScrollCantainerRef} className="flex flex-col gap-0.5 bg-gray-200 p-4 rounded-lg w-full overflow-hidden">
          {texts.map((t, idx) => (
            <DndContext
              key={t.id}
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
              onDragStart={({ active }) => {
                if (active.id !== t.id) return;
                textDragStartRef.current = t.startPosition;
                setTextPreviewStart(t.startPosition);
              }}
              onDragMove={({ active, delta }: DragMoveEvent) => {
                if (active.id !== t.id) return;
                const rawDelta = delta.x / (clipWidth + GAP_BETWEEN_CLIPS);
                const deltaClips = Math.round(rawDelta);
                let nextStart = textDragStartRef.current + deltaClips;
                nextStart = Math.max(0, Math.min(maxTextStart, nextStart));
                setTextPreviewStart(nextStart);
              }}
              onDragEnd={({ active }) => {
                if (active.id !== t.id) return;
                const newStartClipId = activeClips[textPreviewStart]?.id;
                setTexts((prev) => prev.map((x) => (x.id === t.id ? { ...x, startPosition: textPreviewStart, startClipId: newStartClipId } : x)));
              }}
            >
              <div
                className="relative min-h-13 bg-gray-100 first:rounded-t-lg not-last:borer-b-black nth-last-4:rounded-b-lg"
                style={{ minWidth: `${clipWidth * activeClips.length + GAP_BETWEEN_CLIPS * (activeClips.length - 1)}px` }}
              >
                <DraggableText
                  id={t.id}
                  key={t.id}
                  textContent={t.text}
                  startPosition={getTextPreviewPosition(t)}
                  duration={t.duration}
                  isActive={t.isActive}
                  totalClips={activeClips.length}
                  clipWidth={clipWidth}
                  textWidth={(t.duration * clipWidth) / activeClips[idx].duration}
                  gap={GAP_BETWEEN_CLIPS}
                  onStartPositionChange={(pos) => {
                    const newStartClipId = activeClips[pos]?.id;
                    setTexts((prev) => prev.map((x) => (x.id === t.id ? { ...x, startPosition: pos, startClipId: newStartClipId } : x)));
                  }}
                  onClick={() => handleTextClick(t.id)}
                />
              </div>
            </DndContext>
          ))}

          <div className="inline-block align-middle w-full not-first:pt-2 relative">
            <Button variant="ghost" size="lg" onClick={() => handleTextClick()} className="w-full sticky">
              <PlusIcon size={30} className="w-6! h-6! text-gray-400" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <FileVideo className="text-gray-200" size={30} />
        <div ref={clipsScrollContainerRef} onScroll={handleTimelineScroll} className="overflow-x-auto w-full">
          <div
            className={twMerge("p-4 bg-gray-200 rounded-lg", isTextOpen && "opacity-10")}
            style={{ minWidth: `${clipWidth * activeClips.length + GAP_BETWEEN_CLIPS * (activeClips.length - 1) + GAP_BETWEEN_CLIPS * 2}px` }}
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleClipDragStart}
              onDragOver={handleClipDragOver}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToParentElement]}
            >
              <SortableContext items={activeClips.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
                <div className="flex w-full items-center gap-4">
                  {activeClips.map((video, index) => (
                    <VideoClipCard
                      key={video.id}
                      id={video.id}
                      videoUrl={video.url}
                      ratio={ratio}
                      height={constrainedHeight}
                      clipsCount={activeClips.length}
                      index={index}
                      isRemoved={false}
                      onRemove={handleRemoveClip}
                      onAdd={handleAddClip}
                    />
                  ))}
                  {activeClips.length < 6 && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant={"secondary"} className="aspect-9/16 h-auto" style={{ width: `${clipWidth}px` }}>
                          <Plus size={24} className="duration-300 text-gray-400" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Add a new video to the timeline.</DialogTitle>
                        <VideoForm setActiveClips={setActiveClips} setIsDialogOpen={setIsDialogOpen} />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
}
