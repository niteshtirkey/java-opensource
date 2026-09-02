"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSelectedLayerId,
  updateTextLayer,
  updateCropPosition,
} from "@/store/editorSlice";

export default function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const { image, selectedLayerId, cropState, zoom } = useAppSelector(
    (state) => state.editor
  );

  const [draggingMode, setDraggingMode] = useState<"none" | "text" | "crop">("none");
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Render Canvas + Active Crop Overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image.url) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image.url;

    img.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // Combined CSS Filter String
      let filterCss = "";
      if (image.filter === "grayscale") filterCss += "grayscale(100%) ";
      else if (image.filter === "sepia") filterCss += "sepia(100%) ";
      else if (image.filter === "vintage") filterCss += "sepia(50%) hue-rotate(-30deg) contrast(120%) ";
      else if (image.filter === "blur") filterCss += "blur(4px) ";
      else if (image.filter === "invert") filterCss += "invert(100%) ";
      else if (image.filter === "black_and_white") filterCss += "grayscale(100%) contrast(200%) ";
      else if (image.filter === "oil_painting" || image.filter === "comic") filterCss += "contrast(180%) saturate(200%) ";
      else if (image.filter === "pencil_sketch") filterCss += "grayscale(100%) contrast(300%) ";
      else if (image.filter === "pop_art") filterCss += "saturate(300%) contrast(150%) hue-rotate(90deg) ";
      else if (image.filter === "neon") filterCss += "drop-shadow(0 0 10px #6366f1) contrast(150%) ";

      if (image.brightness !== 1.0) filterCss += `brightness(${Math.round(image.brightness * 100)}%) `;
      if (image.contrast !== 1.0) filterCss += `contrast(${Math.round(image.contrast * 100)}%) `;
      if (image.saturation !== 1.0) filterCss += `saturate(${Math.round(image.saturation * 100)}%) `;

      ctx.filter = filterCss.trim() || "none";

      // Rotation & Flip Matrix
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((image.rotation * Math.PI) / 180);
      ctx.scale(
        image.flipHorizontal ? -1 : 1,
        image.flipVertical ? -1 : 1
      );

      ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
      ctx.restore();

      // Render Text Layers
      image.textLayers.forEach((textLayer) => {
        ctx.save();
        ctx.font = `bold ${textLayer.fontSize || 32}px sans-serif`;
        ctx.fillStyle = textLayer.color || "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 6;
        ctx.fillText(textLayer.text, textLayer.x, textLayer.y);

        if (selectedLayerId === textLayer.id) {
          const metrics = ctx.measureText(textLayer.text);
          const w = metrics.width + 20;
          const h = (textLayer.fontSize || 32) + 16;
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(textLayer.x - w / 2, textLayer.y - h / 2, w, h);
        }
        ctx.restore();
      });

      // Render Interactive Crop Overlay Box
      if (cropState.isActive) {
        ctx.save();
        // Dim outside area
        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Clear crop cutout window
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

        // Draw crop outline & guide lines
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([]);

        if (cropState.type === "rect") {
          ctx.strokeRect(cropState.x, cropState.y, cropState.width, cropState.height);
          // Rule of thirds grid lines
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
    };
  }, [image, selectedLayerId, cropState]);

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

    // 1. If Crop Box is Active, check if dragging crop box
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

    // 2. Check Text Layers
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

      if (draggingMode === "crop") {
        const maxX = image.width - cropState.width;
        const maxY = image.height - cropState.height;
        const newX = Math.max(0, Math.min(maxX, Math.round(x - dragOffset.x)));
        const newY = Math.max(0, Math.min(maxY, Math.round(y - dragOffset.y)));
        dispatch(updateCropPosition({ x: newX, y: newY }));
      } else if (draggingMode === "text" && selectedLayerId) {
        dispatch(
          updateTextLayer({
            id: selectedLayerId,
            x: Math.round(x - dragOffset.x),
            y: Math.round(y - dragOffset.y),
          })
        );
      }
    },
    [draggingMode, dragOffset, dispatch, cropState, image, selectedLayerId]
  );

  const handleMouseUp = () => {
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
          className={`block max-w-none transition-all duration-300 ${
            cropState.isActive ? "cursor-move" : "cursor-default"
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
