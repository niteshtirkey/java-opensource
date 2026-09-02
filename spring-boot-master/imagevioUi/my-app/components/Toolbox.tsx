"use client";

import React, { useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setRotation,
  setBrightness,
  setFilter,
  setZoom,
  setImageUrl,
  resetImage,
} from "@/store/editorSlice";
import {
  RotateCw,
  Sun,
  Palette,
  ZoomIn,
  ZoomOut,
  Upload,
  RotateCcw,
  Download,
} from "lucide-react";

export default function Toolbox() {
  const dispatch = useAppDispatch();
  const { image, zoom } = useAppSelector((state) => state.editor);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        dispatch(
          setImageUrl({
            url,
            name: file.name,
            width: img.naturalWidth || 800,
            height: img.naturalHeight || 600,
          })
        );
      };
      img.src = url;
    }
  };

  const handleDownload = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `edited_${image.name || "image.png"}`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-4 flex flex-col justify-between overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            File Actions
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg border border-zinc-700 transition"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition shadow"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>

        {/* Rotation */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5 text-zinc-400" />
            Rotation ({image.rotation}°)
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {[90, 180, 270].map((deg) => (
              <button
                key={deg}
                onClick={() => dispatch(setRotation((image.rotation + deg) % 360))}
                className="py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded border border-zinc-700 transition"
              >
                +{deg}°
              </button>
            ))}
          </div>
        </div>

        {/* Brightness */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-zinc-400" />
            Brightness ({Math.round(image.brightness * 100)}%)
          </h3>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.05"
            value={image.brightness}
            onChange={(e) => dispatch(setBrightness(parseFloat(e.target.value)))}
            className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Filters */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-zinc-400" />
            Filters
          </h3>
          <div className="grid grid-cols-2 gap-1.5">
            {["none", "grayscale", "sepia", "vintage", "blur", "invert"].map(
              (f) => (
                <button
                  key={f}
                  onClick={() => dispatch(setFilter(f))}
                  className={`py-1.5 px-2.5 text-xs rounded font-medium capitalize border transition ${
                    image.filter === f
                      ? "bg-indigo-600/20 text-indigo-400 border-indigo-500"
                      : "bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
                  }`}
                >
                  {f}
                </button>
              )
            )}
          </div>
        </div>

        {/* Zoom */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Zoom ({Math.round(zoom * 100)}%)
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(setZoom(zoom - 0.1))}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 transition"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              min="0.2"
              max="2"
              step="0.1"
              value={zoom}
              onChange={(e) => dispatch(setZoom(parseFloat(e.target.value)))}
              className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <button
              onClick={() => dispatch(setZoom(zoom + 0.1))}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 transition"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => dispatch(resetImage())}
        className="mt-6 flex items-center justify-center gap-1.5 w-full py-2 bg-zinc-800/60 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 text-xs rounded-lg border border-zinc-700/60 transition"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset Image
      </button>
    </aside>
  );
}
