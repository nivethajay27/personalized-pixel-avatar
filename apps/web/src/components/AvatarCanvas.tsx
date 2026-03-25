import { useEffect, useRef } from "react";
import { renderAvatarPixels } from "@pixel/avatar-engine";
import type { AvatarConfig } from "@pixel/shared-types";

interface AvatarCanvasProps {
  config: AvatarConfig;
  size?: number;
  scale?: number;
  className?: string;
}

export function AvatarCanvas({ config, size = 16, scale = 18, className }: AvatarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const width = size * scale;
    canvas.width = width;
    canvas.height = width;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.imageSmoothingEnabled = false;
    const pixels = renderAvatarPixels(config, size);
    const imageData = new ImageData(new Uint8ClampedArray(pixels), size, size);

    const offscreen = document.createElement("canvas");
    offscreen.width = size;
    offscreen.height = size;
    const offscreenContext = offscreen.getContext("2d");
    if (!offscreenContext) {
      return;
    }

    offscreenContext.putImageData(imageData, 0, 0);
    context.clearRect(0, 0, width, width);
    context.drawImage(offscreen, 0, 0, width, width);
  }, [config, scale, size]);

  return <canvas ref={canvasRef} className={className ?? "avatar-canvas"} aria-label="Avatar preview" />;
}
