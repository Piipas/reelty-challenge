"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePinchZoom } from "@/hooks/use-pinch-zoom";
import { SAMPLE_VIDEOS } from "@/data/sample-videos";
import Magnifier from "./magnifier";
import TextDock from "./text-dock";
import { RenderButton } from "./render-button";
import { Timeline } from "./timeline";
import { Text } from "@/lib/types";
import { prepareTexts } from "../lib/utils";
import { PreviewPlayer } from "./preview-player";

export default function tchVideoEditor() {
  const ratio: "portrait" | "landscape" = "landscape";
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const containerRef = useRef<HTMLDivElement>(null);

  const [texts, setTexts] = useState<Text[]>([]);
  const [textInput, setTextInput] = useState("");
  const [selectedTextAnimation, setSelectedTextAnimation] = useState<string | null>(null);
  const [isTextOpen, setIsTextOpen] = useState(false);
  const [selectedAnimationData, setSelectedAnimationData] = useState<any>(null);

  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [textStartPosition, setTextStartPosition] = useState(0);
  const [textClipCount, setTextClipCount] = useState(1);

  const [activeClips, setActiveClips] = useState<typeof SAMPLE_VIDEOS>(SAMPLE_VIDEOS);

  const handleZoomChange = useCallback((newZoom: number) => setZoomLevel(newZoom), []);
  const { setZoom: setPinchZoom } = usePinchZoom({
    minZoom: 0.33,
    maxZoom: 2.22,
    sensitivity: 0.08,
    onZoomChange: handleZoomChange,
    containerRef,
  });

  useEffect(() => {
    setPinchZoom(zoomLevel);
  }, [zoomLevel, setPinchZoom]);

  const handleApplyText = () => {
    if (textInput && selectedTextAnimation) {
      const startClipId = activeClips[textStartPosition]?.id;

      if (editingTextId) {
        setTexts((prev) =>
          prev.map((t) =>
            t.id === editingTextId
              ? {
                  ...t,
                  text: textInput,
                  animation: selectedTextAnimation,
                  animationData: selectedAnimationData,
                  startPosition: textStartPosition,
                  duration: textClipCount,
                  startClipId,
                }
              : t,
          ),
        );
      } else {
        setTexts((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            text: textInput,
            animation: selectedTextAnimation,
            animationData: selectedAnimationData,
            isActive: true,
            startPosition: textStartPosition,
            duration: textClipCount,
            startClipId,
          },
        ]);
      }
      setIsTextOpen(false);
      setTextInput("");
      setSelectedTextAnimation(null);
      setEditingTextId(null);
      setTextStartPosition(0);
      setTextClipCount(1);
    }
  };

  const handleResetText = () => {
    setTextInput("");
    setSelectedTextAnimation(null);
    setEditingTextId(null);
    setTextStartPosition(0);
    setTextClipCount(1);
    setSelectedAnimationData(null);
  };

  return (
    <div className="flex h-full max-h-full flex-col overflow-hidden">
      <div className="shrink-0 p-6 md:px-8 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <p className="text-lg font-medium">Edit</p>
            </div>
            <div className="size-1.5 rounded-full bg-[#D9D9D9]" />
            <div className="flex items-center space-x-1">
              <p className="line-clamp-1">Video Editor</p>
            </div>
          </div>
          <div className="hidden md:flex">
            <Magnifier onZoomChange={handleZoomChange} initialZoom={zoomLevel} ratio={ratio} isLoading={false} externalZoom={zoomLevel} />
          </div>
        </div>
      </div>

      <TextDock
        isOpen={isTextOpen}
        setIsOpen={setIsTextOpen}
        textInput={textInput}
        setTextInput={setTextInput}
        selectedTextAnimation={selectedTextAnimation}
        setSelectedTextAnimation={setSelectedTextAnimation}
        onApplyText={handleApplyText}
        onReset={handleResetText}
        hasAppliedText={!!editingTextId || textInput.length > 0}
        setSelectedAnimationData={setSelectedAnimationData}
      />

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden gap-4">
        <div className="flex-1 min-h-0 overflow-hidden">
          <PreviewPlayer clips={activeClips} texts={prepareTexts(texts, activeClips)} />
        </div>
        <div className="shrink-0 max-h-4/6 overflow-auto">
          <Timeline
            zoomLevel={zoomLevel}
            texts={texts}
            setTexts={setTexts}
            isTextOpen={isTextOpen}
            setIsTextOpen={setIsTextOpen}
            setEditingTextId={setEditingTextId}
            setSelectedAnimationData={setSelectedAnimationData}
            setSelectedTextAnimation={setSelectedTextAnimation}
            setTextClipCount={setTextClipCount}
            setTextInput={setTextInput}
            textClipCount={textClipCount}
            setTextStartPosition={setTextStartPosition}
            activeClips={activeClips}
            setActiveClips={setActiveClips}
          />
        </div>
      </div>

      <div className="shrink-0 p-6 md:px-8 md:py-4">
        <RenderButton clips={activeClips} ratio={ratio} texts={prepareTexts(texts, activeClips)} />
      </div>
    </div>
  );
}
