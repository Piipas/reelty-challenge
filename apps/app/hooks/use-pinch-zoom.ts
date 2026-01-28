import { useCallback, useEffect, useRef, useState } from "react";

interface PinchZoomOptions {
  minZoom?: number;
  maxZoom?: number;
  sensitivity?: number;
  onZoomChange?: (zoom: number) => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

interface PinchZoomReturn {
  zoom: number;
  isZooming: boolean;
  setZoom: (zoom: number) => void;
}

export const usePinchZoom = ({
  minZoom = 0.33,
  maxZoom = 2.22,
  sensitivity = 0.01,
  onZoomChange,
  containerRef,
}: PinchZoomOptions = {}): PinchZoomReturn => {
  const [zoom, setZoom] = useState(1.0);
  const [isZooming, setIsZooming] = useState(false);
  const lastWheelTimeRef = useRef<number>(0);
  const zoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        const now = Date.now();
        if (now - lastWheelTimeRef.current < 16) return;
        lastWheelTimeRef.current = now;
        setIsZooming(true);
        if (zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
        const zoomDelta = -event.deltaY * sensitivity;
        const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom + zoomDelta));
        setZoom(newZoom);
        onZoomChange?.(newZoom);
        zoomTimeoutRef.current = setTimeout(() => setIsZooming(false), 150);
      }
    },
    [zoom, minZoom, maxZoom, sensitivity, onZoomChange]
  );

  const handleZoomChange = useCallback(
    (newZoom: number) => {
      const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
      setZoom(clampedZoom);
      onZoomChange?.(clampedZoom);
    },
    [minZoom, maxZoom, onZoomChange]
  );

  useEffect(() => {
    if (!containerRef?.current) return;
    const container = containerRef.current;
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
    };
  }, [handleWheel, containerRef]);

  return { zoom, isZooming, setZoom: handleZoomChange };
};
