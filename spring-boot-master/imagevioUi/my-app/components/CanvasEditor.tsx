"use client";

import React, { useRef, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

export default function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageState = useAppSelector((state) => state.editor.image);
  const zoom = useAppSelector((state) => state.editor.zoom);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageState.url) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageState.url;

    img.onload = () => {
      canvas.width = imageState.width;
      canvas.height = imageState.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // Apply Filter
      let filterCss = "";
      if (imageState.filter === "grayscale") filterCss += "grayscale(100%) ";
      else if (imageState.filter === "sepia") filterCss += "sepia(100%) ";
      else if (imageState.filter === "vintage") filterCss += "sepia(50%) hue-rotate(-30deg) contrast(120%) ";
      else if (imageState.filter === "blur") filterCss += "blur(4px) ";
      else if (imageState.filter === "invert") filterCss += "invert(100%) ";
      else if (imageState.filter === "black_and_white") filterCss += "grayscale(100%) contrast(200%) ";

      if (imageState.brightness !== 1.0) {
        filterCss += `brightness(${Math.round(imageState.brightness * 100)}%) `;
      }

      ctx.filter = filterCss.trim() || "none";

      // Translate & Rotate around center
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((imageState.rotation * Math.PI) / 180);
      ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

      ctx.restore();
    };
  }, [imageState]);

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-zinc-950 overflow-auto relative select-none">
      <div
        className="relative shadow-2xl transition-transform duration-200 border border-zinc-800 rounded-lg overflow-hidden bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px]"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        <canvas
          ref={canvasRef}
          className="block max-w-none transition-all duration-300"
          style={{
            maxWidth: "100%",
            maxHeight: "75vh",
          }}
        />
      </div>
    </div>
  );
}
