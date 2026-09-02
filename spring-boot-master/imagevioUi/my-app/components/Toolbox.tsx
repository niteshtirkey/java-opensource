"use client";

import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setRotation,
  setBrightness,
  setContrast,
  setSaturation,
  setFilter,
  setZoom,
  setImageUrl,
  startCrop,
  updateCropSize,
  cancelCrop,
  applyCrop,
  toggleFlipHorizontal,
  addTextLayer,
  updateTextLayer,
  deleteLayer,
  resetImage,
} from "@/store/editorSlice";
import {
  RotateCw,
  Palette,
  ZoomIn,
  ZoomOut,
  Upload,
  RotateCcw,
  Download,
  FlipHorizontal,
  Type,
  Crop,
  Sliders,
  Trash2,
  Square,
  Circle,
  Check,
  X,
} from "lucide-react";

export default function Toolbox() {
  const dispatch = useAppDispatch();
  const { image, zoom, selectedLayerId, cropState } = useAppSelector(
    (state) => state.editor
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [customText, setCustomText] = useState("");
  const [activeTab, setActiveTab] = useState<"tools" | "adjust" | "filters">("tools");

  const selectedTextLayer = image.textLayers.find((t) => t.id === selectedLayerId);

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

  const handleDownload = (format: "png" | "jpeg" = "png") => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `edited_${image.name ? image.name.split(".")[0] : "image"}.${format}`;
    link.href = canvas.toDataURL(`image/${format}`, 0.92);
    link.click();
  };

  const handleAddText = () => {
    if (!customText.trim()) return;
    dispatch(
      addTextLayer({
        text: customText.trim(),
        x: image.width / 2,
        y: image.height / 2,
        fontSize: 36,
        color: "#ffffff",
      })
    );
    setCustomText("");
  };

  const handleConfirmCrop = () => {
    if (!image.url || !cropState.isActive) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image.url;

    img.onload = () => {
      const offCanvas = document.createElement("canvas");
      offCanvas.width = cropState.width;
      offCanvas.height = cropState.height;
      const ctx = offCanvas.getContext("2d");
      if (!ctx) return;

      if (cropState.type === "circle") {
        ctx.beginPath();
        ctx.arc(
          cropState.width / 2,
          cropState.height / 2,
          cropState.width / 2,
          0,
          Math.PI * 2
        );
        ctx.closePath();
        ctx.clip();
      }

      ctx.drawImage(
        img,
        cropState.x,
        cropState.y,
        cropState.width,
        cropState.height,
        0,
        0,
        cropState.width,
        cropState.height
      );

      const newUrl = offCanvas.toDataURL("image/png");
      dispatch(
        applyCrop({
          newUrl,
          width: cropState.width,
          height: cropState.height,
        })
      );
    };
  };

  return (
    <aside className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full select-none shrink-0">
      {/* Top Fixed Header */}
      <div className="p-3 border-b border-zinc-800 space-y-2.5">
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg border border-zinc-700 transition cursor-pointer"
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
            onClick={() => handleDownload("png")}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition shadow cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export PNG
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 p-1 bg-zinc-950 rounded-lg border border-zinc-800 text-[11px] font-medium">
          <button
            onClick={() => setActiveTab("tools")}
            className={`py-1 rounded-md transition cursor-pointer ${
              activeTab === "tools"
                ? "bg-indigo-600 text-white shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Tools
          </button>
          <button
            onClick={() => setActiveTab("adjust")}
            className={`py-1 rounded-md transition cursor-pointer ${
              activeTab === "adjust"
                ? "bg-indigo-600 text-white shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Adjust
          </button>
          <button
            onClick={() => setActiveTab("filters")}
            className={`py-1 rounded-md transition cursor-pointer ${
              activeTab === "filters"
                ? "bg-indigo-600 text-white shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Filters
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* ACTIVE CROP CONTROL PANEL */}
        {cropState.isActive && (
          <div className="p-3.5 bg-indigo-950/60 border border-indigo-500/60 rounded-xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wide flex items-center gap-1.5">
                <Crop className="w-3.5 h-3.5" />
                {cropState.type === "circle" ? "Circle Crop" : "Rectangle Crop"}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {cropState.width} × {cropState.height}px
              </span>
            </div>

            <p className="text-[11px] text-zinc-300">
              Drag the crop box directly on the canvas to reposition.
            </p>

            <div>
              <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                <span>Crop Window Size</span>
                <span>{cropState.width}px</span>
              </div>
              <input
                type="range"
                min="60"
                max={Math.min(image.width, image.height)}
                value={cropState.width}
                onChange={(e) => {
                  const size = parseInt(e.target.value);
                  dispatch(updateCropSize({ width: size, height: size }));
                }}
                className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleConfirmCrop}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition cursor-pointer shadow"
              >
                <Check className="w-3.5 h-3.5" />
                Apply Crop
              </button>
              <button
                onClick={() => dispatch(cancelCrop())}
                className="py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Selected Layer Inspector Banner */}
        {selectedLayerId && selectedTextLayer && (
          <div className="p-3 bg-indigo-950/50 border border-indigo-500/50 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wide">
                Active Text Layer
              </span>
              <button
                onClick={() => dispatch(deleteLayer(selectedLayerId))}
                className="p-1 text-red-400 hover:bg-red-950/60 rounded transition cursor-pointer"
                title="Delete Layer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <input
                type="text"
                value={selectedTextLayer.text}
                onChange={(e) =>
                  dispatch(
                    updateTextLayer({
                      id: selectedTextLayer.id,
                      text: e.target.value,
                    })
                  )
                }
                className="w-full bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-indigo-500"
              />
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <span className="text-[10px] text-zinc-400 block mb-1">
                    Size: {selectedTextLayer.fontSize}px
                  </span>
                  <input
                    type="range"
                    min="14"
                    max="120"
                    value={selectedTextLayer.fontSize}
                    onChange={(e) =>
                      dispatch(
                        updateTextLayer({
                          id: selectedTextLayer.id,
                          fontSize: parseInt(e.target.value),
                        })
                      )
                    }
                    className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block mb-1">Color</span>
                  <input
                    type="color"
                    value={selectedTextLayer.color}
                    onChange={(e) =>
                      dispatch(
                        updateTextLayer({
                          id: selectedTextLayer.id,
                          color: e.target.value,
                        })
                      )
                    }
                    className="w-8 h-7 rounded cursor-pointer border-0 bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: TOOLS */}
        {activeTab === "tools" && (
          <div className="space-y-4">
            {/* Add Text */}
            <div>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-indigo-400" />
                Add Text
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Enter text..."
                  className="flex-1 bg-zinc-950 text-xs px-2.5 py-1.5 rounded-lg border border-zinc-800 text-zinc-200 focus:outline-none focus:border-indigo-500"
                  onKeyDown={(e) => e.key === "Enter" && handleAddText()}
                />
                <button
                  onClick={handleAddText}
                  disabled={!customText.trim()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Shape Cropping Controls */}
            <div>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Crop className="w-3.5 h-3.5 text-pink-400" />
                Interactive Shape Crop
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => dispatch(startCrop("rect"))}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs rounded-lg border transition cursor-pointer ${
                    cropState.isActive && cropState.type === "rect"
                      ? "bg-indigo-600 text-white border-indigo-500 shadow"
                      : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border-zinc-700/80"
                  }`}
                >
                  <Square className="w-3.5 h-3.5 text-indigo-400" />
                  Rectangle Box
                </button>
                <button
                  onClick={() => dispatch(startCrop("circle"))}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs rounded-lg border transition cursor-pointer ${
                    cropState.isActive && cropState.type === "circle"
                      ? "bg-indigo-600 text-white border-indigo-500 shadow"
                      : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border-zinc-700/80"
                  }`}
                >
                  <Circle className="w-3.5 h-3.5 text-pink-400" />
                  Circle Mask
                </button>
              </div>
            </div>

            {/* Orientation */}
            <div>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                Orientation ({image.rotation}°)
              </h3>
              <div className="grid grid-cols-4 gap-1.5">
                {[90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => dispatch(setRotation((image.rotation + deg) % 360))}
                    className="py-1.5 px-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg border border-zinc-700 transition cursor-pointer"
                  >
                    +{deg}°
                  </button>
                ))}
                <button
                  onClick={() => dispatch(toggleFlipHorizontal())}
                  className={`py-1.5 rounded-lg border transition flex items-center justify-center cursor-pointer ${
                    image.flipHorizontal
                      ? "bg-indigo-600 text-white border-indigo-500"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
                  }`}
                  title="Flip Horizontal"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADJUST */}
        {activeTab === "adjust" && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              Color Grading
            </h3>

            <div className="space-y-3 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
              <div>
                <div className="flex justify-between text-[11px] text-zinc-300 mb-1">
                  <span>Brightness</span>
                  <span className="font-mono text-zinc-400">{Math.round(image.brightness * 100)}%</span>
                </div>
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

              <div>
                <div className="flex justify-between text-[11px] text-zinc-300 mb-1">
                  <span>Contrast</span>
                  <span className="font-mono text-zinc-400">{Math.round(image.contrast * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.05"
                  value={image.contrast}
                  onChange={(e) => dispatch(setContrast(parseFloat(e.target.value)))}
                  className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-zinc-300 mb-1">
                  <span>Saturation</span>
                  <span className="font-mono text-zinc-400">{Math.round(image.saturation * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="3.0"
                  step="0.1"
                  value={image.saturation}
                  onChange={(e) => dispatch(setSaturation(parseFloat(e.target.value)))}
                  className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FILTERS */}
        {activeTab === "filters" && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              Presets & Effects
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                "none",
                "grayscale",
                "sepia",
                "vintage",
                "blur",
                "invert",
                "oil_painting",
                "pencil_sketch",
                "pop_art",
                "comic",
                "neon",
                "black_and_white",
              ].map((f) => (
                <button
                  key={f}
                  onClick={() => dispatch(setFilter(f))}
                  className={`py-2 px-2 text-[11px] rounded-lg font-medium capitalize border transition cursor-pointer ${
                    image.filter === f
                      ? "bg-indigo-600/30 text-indigo-300 border-indigo-500"
                      : "bg-zinc-800/60 text-zinc-300 border-zinc-700/60 hover:bg-zinc-700/80"
                  }`}
                >
                  {f.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Fixed Footer */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-900/90 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => dispatch(setZoom(zoom - 0.1))}
            className="p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-zinc-700 transition cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="range"
              min="0.2"
              max="2"
              step="0.1"
              value={zoom}
              onChange={(e) => dispatch(setZoom(parseFloat(e.target.value)))}
              className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] font-mono text-zinc-400 w-8 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <button
            onClick={() => dispatch(setZoom(zoom + 0.1))}
            className="p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-zinc-700 transition cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={() => dispatch(resetImage())}
          className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-zinc-800/60 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 text-xs rounded-lg border border-zinc-700/60 transition cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>
    </aside>
  );
}
