"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSelectedLayerId,
  updateTextLayer,
  updateSticker,
  addBrushStroke,
  updateCropPosition,
} from "@/store/editorSlice";
import {
  drawSticker,
  drawAtmosphericOverlay,
  drawBrushStrokes,
} from "@/utils/canvasRenderer";
import { BrushPoint } from "@/types/editor";

export default function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cachedImgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const dispatch = useAppDispatch();
  const {
    image,
    selectedLayerId,
    cropState,
    zoom,
    activeMode,
    brushSettings,
  } = useAppSelector((state) => state.editor);

  const [draggingMode, setDraggingMode] = useState<"none" | "text" | "sticker" | "crop" | "drawing">("none");
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentStrokePoints, setCurrentStrokePoints] = useState<BrushPoint[]>([]);

  // 1. High-Performance Multi-Layer Canvas Drawing Function
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = cachedImgRef.current;
    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Layer 1: Base Image & Visual Adjustments / Filters
    let filterCss = "";
    switch (image.filter) {
      case "grayscale": filterCss += "grayscale(100%) "; break;
      case "sepia": filterCss += "sepia(100%) "; break;
      case "vintage": filterCss += "sepia(50%) hue-rotate(-30deg) contrast(120%) "; break;
      case "blur": filterCss += "blur(4px) "; break;
      case "invert": filterCss += "invert(100%) "; break;
      case "black_and_white": filterCss += "grayscale(100%) contrast(200%) "; break;
      case "oil_painting":
      case "comic": filterCss += "contrast(180%) saturate(200%) "; break;
      case "pencil_sketch": filterCss += "grayscale(100%) contrast(300%) "; break;
      case "pop_art": filterCss += "saturate(300%) contrast(150%) hue-rotate(90deg) "; break;
      case "neon": filterCss += "drop-shadow(0 0 10px #6366f1) contrast(150%) "; break;
      default: break;
    }

    if (image.brightness !== 1.0) filterCss += `brightness(${Math.round(image.brightness * 100)}%) `;
    if (image.contrast !== 1.0) filterCss += `contrast(${Math.round(image.contrast * 100)}%) `;
    if (image.saturation !== 1.0) filterCss += `saturate(${Math.round(image.saturation * 100)}%) `;

    ctx.filter = filterCss.trim() || "none";

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((image.rotation * Math.PI) / 180);
    ctx.scale(image.flipHorizontal ? -1 : 1, image.flipVertical ? -1 : 1);
    ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.restore();

    // Layer 2: Custom Atmospheric Overlays
    if (image.overlayEffect && image.overlayEffect !== "none") {
      drawAtmosphericOverlay(ctx, canvas.width, canvas.height, image.overlayEffect);
    }

    // Layer 3: Brush Strokes Studio
    if (image.brushStrokes && image.brushStrokes.length > 0) {
      drawBrushStrokes(ctx, image.brushStrokes);
    }

    // Layer 3.5: Active In-Progress Freehand Drawing
    if (currentStrokePoints.length > 1) {
      drawBrushStrokes(ctx, [
        {
          id: "current-drawing",
          type: brushSettings.type,
          color: brushSettings.color,
          size: brushSettings.size,
          opacity: brushSettings.opacity,
          points: currentStrokePoints,
        },
      ]);
    }

    // Layer 4: Procedural Vector Stickers
    if (image.stickers && image.stickers.length > 0) {
      image.stickers.forEach((sticker) => {
        drawSticker(ctx, sticker, selectedLayerId === sticker.id);
      });
    }

    // Layer 5: Advanced Typography Layers
    image.textLayers.forEach((textLayer) => {
      ctx.save();
      const fontName = textLayer.fontFamily || "sans-serif";
      const fontSize = textLayer.fontSize || 32;
      ctx.font = `bold ${fontSize}px ${fontName}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const metrics = ctx.measureText(textLayer.text);
      const textWidth = metrics.width;
      const textHeight = fontSize;

      // Background Pill
      if (textLayer.backgroundPill) {
        ctx.fillStyle = textLayer.pillColor || "rgba(0, 0, 0, 0.75)";
        const padX = 14;
        const padY = 8;
        const pillRadius = 8;
        const rx = textLayer.x - textWidth / 2 - padX;
        const ry = textLayer.y - textHeight / 2 - padY;
        const rw = textWidth + padX * 2;
        const rh = textHeight + padY * 2;

        ctx.beginPath();
        ctx.roundRect(rx, ry, rw, rh, pillRadius);
        ctx.fill();
      }

      // Drop Shadow / Glow
      if (textLayer.shadowBlur && textLayer.shadowBlur > 0) {
        ctx.shadowColor = textLayer.shadowColor || "rgba(0,0,0,0.8)";
        ctx.shadowBlur = textLayer.shadowBlur;
      }

      // Text Outline / Stroke
      if (textLayer.strokeWidth && textLayer.strokeWidth > 0) {
        ctx.strokeStyle = textLayer.strokeColor || "#000000";
        ctx.lineWidth = textLayer.strokeWidth;
        ctx.strokeText(textLayer.text, textLayer.x, textLayer.y);
      }

      // Text Fill
      ctx.fillStyle = textLayer.color || "#ffffff";
      ctx.fillText(textLayer.text, textLayer.x, textLayer.y);

      // Selected Layer Outline
      if (selectedLayerId === textLayer.id) {
        const w = textWidth + 24;
        const h = fontSize + 18;
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(textLayer.x - w / 2, textLayer.y - h / 2, w, h);
      }
      ctx.restore();
    });

    // Layer 6: Interactive Crop Overlay Box
    if (cropState.isActive) {
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = "destination-out";
      if (cropState.type === "rect") {
        ctx.fillRect(cropState.x, cropState.y, cropState.width, cropState.height);
      } else if (cropState.type === "circle") {
        ctx.beginPath();
        ctx.arc(
          cropState.x + cropState.width / 2,
          cropState.y + cropState.height / 2,
          cropState.width / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([]);

      if (cropState.type === "rect") {
        ctx.strokeRect(cropState.x, cropState.y, cropState.width, cropState.height);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cropState.x + cropState.width / 3, cropState.y);
        ctx.lineTo(cropState.x + cropState.width / 3, cropState.y + cropState.height);
        ctx.moveTo(cropState.x + (2 * cropState.width) / 3, cropState.y);
        ctx.lineTo(cropState.x + (2 * cropState.width) / 3, cropState.y + cropState.height);
        ctx.moveTo(cropState.x, cropState.y + cropState.height / 3);
        ctx.lineTo(cropState.x + cropState.width, cropState.y + cropState.height / 3);
        ctx.moveTo(cropState.x, cropState.y + (2 * cropState.height) / 3);
        ctx.lineTo(cropState.x + cropState.width, cropState.y + (2 * cropState.height) / 3);
        ctx.stroke();
      } else if (cropState.type === "circle") {
        ctx.beginPath();
        ctx.arc(
          cropState.x + cropState.width / 2,
          cropState.y + cropState.height / 2,
          cropState.width / 2,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }
      ctx.restore();
    }
  }, [image, selectedLayerId, cropState, brushSettings, currentStrokePoints]);

  // Load & Cache Base Image
  useEffect(() => {
    if (!image.url) return;

    if (cachedImgRef.current && cachedImgRef.current.src === image.url) {
      renderCanvas();
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image.url;
    img.onload = () => {
      cachedImgRef.current = img;
      renderCanvas();
    };
  }, [image.url, renderCanvas]);

  // Trigger Instant Redraw
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);

    // 1. Brush Mode Active: Start Freehand Stroke
    if (activeMode === "brush") {
      setDraggingMode("drawing");
      setCurrentStrokePoints([{ x: Math.round(x), y: Math.round(y) }]);
      return;
    }

    // 2. Crop Mode Active
    if (cropState.isActive) {
      if (
        x >= cropState.x &&
        x <= cropState.x + cropState.width &&
        y >= cropState.y &&
        y <= cropState.y + cropState.height
      ) {
        setDraggingMode("crop");
        setDragOffset({ x: x - cropState.x, y: y - cropState.y });
        return;
      }
    }

    // 3. Check Stickers Layer Hit
    for (let i = image.stickers.length - 1; i >= 0; i--) {
      const s = image.stickers[i];
      const half = s.size / 2;
      if (x >= s.x - half && x <= s.x + half && y >= s.y - half && y <= s.y + half) {
        dispatch(setSelectedLayerId(s.id));
        setDraggingMode("sticker");
        setDragOffset({ x: x - s.x, y: y - s.y });
        return;
      }
    }

    // 4. Check Text Layer Hit
    for (let i = image.textLayers.length - 1; i >= 0; i--) {
      const t = image.textLayers[i];
      const approxW = t.text.length * (t.fontSize * 0.6);
      const approxH = t.fontSize * 1.2;
      if (
        x >= t.x - approxW / 2 &&
        x <= t.x + approxW / 2 &&
        y >= t.y - approxH / 2 &&
        y <= t.y + approxH / 2
      ) {
        dispatch(setSelectedLayerId(t.id));
        setDraggingMode("text");
        setDragOffset({ x: x - t.x, y: y - t.y });
        return;
      }
    }

    dispatch(setSelectedLayerId(null));
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (draggingMode === "none") return;
      const { x, y } = getCanvasCoords(e);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        if (draggingMode === "drawing") {
          setCurrentStrokePoints((prev) => [...prev, { x: Math.round(x), y: Math.round(y) }]);
        } else if (draggingMode === "crop") {
          const maxX = image.width - cropState.width;
          const maxY = image.height - cropState.height;
          const newX = Math.max(0, Math.min(maxX, Math.round(x - dragOffset.x)));
          const newY = Math.max(0, Math.min(maxY, Math.round(y - dragOffset.y)));
          dispatch(updateCropPosition({ x: newX, y: newY }));
        } else if (draggingMode === "sticker" && selectedLayerId) {
          dispatch(
            updateSticker({
              id: selectedLayerId,
              x: Math.round(x - dragOffset.x),
              y: Math.round(y - dragOffset.y),
            })
          );
        } else if (draggingMode === "text" && selectedLayerId) {
          dispatch(
            updateTextLayer({
              id: selectedLayerId,
              x: Math.round(x - dragOffset.x),
              y: Math.round(y - dragOffset.y),
            })
          );
        }
      });
    },
    [draggingMode, dragOffset, dispatch, cropState, image.width, image.height, selectedLayerId]
  );

  const handleMouseUp = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (draggingMode === "drawing" && currentStrokePoints.length > 1) {
      dispatch(
        addBrushStroke({
          id: `stroke-${Date.now()}`,
          type: brushSettings.type,
          color: brushSettings.color,
          size: brushSettings.size,
          opacity: brushSettings.opacity,
          points: currentStrokePoints,
        })
      );
      setCurrentStrokePoints([]);
    }

    setDraggingMode("none");
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center p-8 bg-zinc-950 overflow-auto relative select-none"
    >
      <div
        className="relative shadow-2xl transition-transform duration-200 border border-zinc-800 rounded-lg overflow-hidden bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px]"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`block max-w-none ${
            activeMode === "brush"
              ? "cursor-crosshair"
              : cropState.isActive
              ? "cursor-move"
              : "cursor-default"
          }`}
          style={{
            maxWidth: "100%",
            maxHeight: "75vh",
          }}
        />
      </div>
    </div>
  );
}


