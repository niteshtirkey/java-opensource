"use client";

import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setRotation,
  setBrightness,
  setContrast,
  setSaturation,
  setFilter,
  setOverlayEffect,
  setZoom,
  setImageUrl,
  startCrop,
  updateCropSize,
  cancelCrop,
  applyCrop,
  toggleFlipHorizontal,
  addTextLayer,
  updateTextLayer,
  addSticker,
  setActiveMode,
  setBrushSettings,
  clearBrushStrokes,
  applySocialPreset,
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
  Brush,
  Sparkles,
  Smile,
  Layers,
  Sun,
  Flame,
  Crown,
  ShieldCheck,
  Tv,
} from "lucide-react";
import { OverlayEffect } from "@/types/editor";

export default function Toolbox() {
  const dispatch = useAppDispatch();
  const {
    image,
    zoom,
    selectedLayerId,
    cropState,
    activeMode,
    brushSettings,
  } = useAppSelector((state) => state.editor);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [customText, setCustomText] = useState("");
  const [activeTab, setActiveTab] = useState<"tools" | "brush" | "stickers" | "adjust" | "filters">("tools");

  const selectedTextLayer = image.textLayers.find((t) => t.id === selectedLayerId);
  const selectedSticker = image.stickers.find((s) => s.id === selectedLayerId);

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
    link.href = canvas.toDataURL(`image/${format}`, 0.95);
    link.click();
  };

  const handleAddText = () => {
    if (!customText.trim()) return;
    dispatch(
      addTextLayer({
        text: customText.trim(),
        x: image.width / 2,
        y: image.height / 2,
        fontSize: 38,
        color: "#ffffff",
        strokeColor: "#000000",
        strokeWidth: 2,
        shadowBlur: 8,
        shadowColor: "rgba(0,0,0,0.8)",
      })
    );
    setCustomText("");
  };

  const handleConfirmCrop = () => {
    if (!image.url || !cropState.isActive) return;
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const cropCanvas = document.createElement("canvas");
    cropCanvas.width = cropState.width;
    cropCanvas.height = cropState.height;
    const cropCtx = cropCanvas.getContext("2d");
    if (!cropCtx) return;

    cropCtx.drawImage(
      canvas,
      cropState.x,
      cropState.y,
      cropState.width,
      cropState.height,
      0,
      0,
      cropState.width,
      cropState.height
    );

    dispatch(
      applyCrop({
        newUrl: cropCanvas.toDataURL("image/png"),
        width: cropState.width,
        height: cropState.height,
      })
    );
  };

  return (
    <aside className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full select-none text-zinc-100">
      {/* Header & Quick Action Buttons */}
      <div className="p-3 border-b border-zinc-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Studio Controls
          </span>
          <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded font-mono">
            {image.width} × {image.height}px
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg border border-zinc-700 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            Upload Image
          </button>
          <button
            onClick={() => handleDownload("png")}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg shadow-sm transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export PNG
          </button>
        </div>
      </div>

      {/* 5-Tab Creative Navigation */}
      <div className="flex border-b border-zinc-800 bg-zinc-950/50 p-1 gap-1">
        {[
          { id: "tools", label: "Tools", icon: Layers },
          { id: "brush", label: "Brush", icon: Brush },
          { id: "stickers", label: "Stickers", icon: Smile },
          { id: "adjust", label: "Adjust", icon: Sliders },
          { id: "filters", label: "FX", icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === "brush") dispatch(setActiveMode("brush"));
                else if (activeMode === "brush") dispatch(setActiveMode("select"));
              }}
              className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 text-[10px] font-medium rounded-md transition cursor-pointer ${
                activeTab === tab.id
                  ? "bg-zinc-800 text-indigo-400 font-semibold shadow"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab Panels */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* TAB 1: TOOLS (Social Presets, Crop, Typography, Orientation) */}
        {activeTab === "tools" && (
          <div className="space-y-4">
            {/* Social Media Aspect Ratio Presets */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-indigo-400" />
                Social Media Canvas Presets
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => dispatch(applySocialPreset("ig_post"))}
                  className="p-2 bg-zinc-800/80 hover:bg-zinc-700 text-left rounded-lg border border-zinc-700 text-xs transition cursor-pointer"
                >
                  <div className="font-semibold text-zinc-200">Instagram Post</div>
                  <div className="text-[10px] text-zinc-400 font-mono">1080 × 1080 (1:1)</div>
                </button>
                <button
                  onClick={() => dispatch(applySocialPreset("ig_story"))}
                  className="p-2 bg-zinc-800/80 hover:bg-zinc-700 text-left rounded-lg border border-zinc-700 text-xs transition cursor-pointer"
                >
                  <div className="font-semibold text-zinc-200">Reels / Story</div>
                  <div className="text-[10px] text-zinc-400 font-mono">1080 × 1920 (9:16)</div>
                </button>
                <button
                  onClick={() => dispatch(applySocialPreset("yt_thumb"))}
                  className="p-2 bg-zinc-800/80 hover:bg-zinc-700 text-left rounded-lg border border-zinc-700 text-xs transition cursor-pointer"
                >
                  <div className="font-semibold text-zinc-200">YouTube Thumb</div>
                  <div className="text-[10px] text-zinc-400 font-mono">1280 × 720 (16:9)</div>
                </button>
                <button
                  onClick={() => dispatch(applySocialPreset("cinema_wide"))}
                  className="p-2 bg-zinc-800/80 hover:bg-zinc-700 text-left rounded-lg border border-zinc-700 text-xs transition cursor-pointer"
                >
                  <div className="font-semibold text-zinc-200">Cinematic Wide</div>
                  <div className="text-[10px] text-zinc-400 font-mono">1920 × 816 (21:9)</div>
                </button>
              </div>
            </div>

            {/* Interactive Crop Controls */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Crop className="w-3.5 h-3.5 text-indigo-400" />
                Precision Crop
              </h3>
              {!cropState.isActive ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => dispatch(startCrop("rect"))}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-lg border border-zinc-700 transition cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 text-indigo-400" />
                    Rectangle
                  </button>
                  <button
                    onClick={() => dispatch(startCrop("circle"))}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-lg border border-zinc-700 transition cursor-pointer"
                  >
                    <Circle className="w-3.5 h-3.5 text-indigo-400" />
                    Avatar Circle
                  </button>
                </div>
              ) : (
                <div className="space-y-2 bg-zinc-950 p-2.5 rounded-xl border border-indigo-500/50">
                  <div className="flex justify-between items-center text-xs text-indigo-300">
                    <span className="capitalize font-medium">{cropState.type} Crop Active</span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {cropState.width} × {cropState.height}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleConfirmCrop}
                      className="flex items-center justify-center gap-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Apply
                    </button>
                    <button
                      onClick={() => dispatch(cancelCrop())}
                      className="flex items-center justify-center gap-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg transition cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Typography Engine */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-indigo-400" />
                Add & Style Text
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter text..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddText()}
                  className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleAddText}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition cursor-pointer"
                >
                  Add
                </button>
              </div>

              {selectedTextLayer && (
                <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2.5">
                  <div className="flex justify-between items-center text-[11px] text-zinc-300">
                    <span className="font-semibold text-indigo-300">Selected Text Layer</span>
                    <button
                      onClick={() => dispatch(deleteLayer(selectedTextLayer.id))}
                      className="text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                      <span>Font Size</span>
                      <span className="font-mono">{selectedTextLayer.fontSize}px</span>
                    </div>
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
                      className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400">Color:</span>
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
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                    />
                    <label className="flex items-center gap-1.5 text-[11px] text-zinc-300 cursor-pointer ml-auto">
                      <input
                        type="checkbox"
                        checked={!!selectedTextLayer.backgroundPill}
                        onChange={(e) =>
                          dispatch(
                            updateTextLayer({
                              id: selectedTextLayer.id,
                              backgroundPill: e.target.checked,
                            })
                          )
                        }
                        className="accent-indigo-500"
                      />
                      Background Pill
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Orientation */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
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

        {/* TAB 2: BRUSH STUDIO */}
        {activeTab === "brush" && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Brush className="w-3.5 h-3.5 text-indigo-400" />
              Brush Types
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "neon", label: "Neon Glow", desc: "Luminous aura stroke" },
                { id: "sparkle", label: "Magic Sparkle", desc: "Glitter & Star scatter" },
                { id: "marker", label: "Smooth Marker", desc: "Semi-translucent ink" },
                { id: "glow", label: "Laser Glow", desc: "Solid bright core" },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => dispatch(setBrushSettings({ type: b.id as any }))}
                  className={`p-2 rounded-lg border text-left transition cursor-pointer ${
                    brushSettings.type === b.id
                      ? "bg-indigo-600/30 border-indigo-500 text-indigo-200"
                      : "bg-zinc-800/60 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  <div className="text-xs font-semibold">{b.label}</div>
                  <div className="text-[10px] text-zinc-400">{b.desc}</div>
                </button>
              ))}
            </div>

            <div className="space-y-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <div>
                <div className="flex justify-between text-[11px] text-zinc-300 mb-1">
                  <span>Brush Size</span>
                  <span className="font-mono text-indigo-400">{brushSettings.size}px</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="60"
                  value={brushSettings.size}
                  onChange={(e) => dispatch(setBrushSettings({ size: parseInt(e.target.value) }))}
                  className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-300">Color Palette:</span>
                <div className="flex items-center gap-1.5">
                  {["#6366f1", "#f43f5e", "#10b981", "#facc15", "#38bdf8", "#ffffff"].map((c) => (
                    <button
                      key={c}
                      onClick={() => dispatch(setBrushSettings({ color: c }))}
                      style={{ backgroundColor: c }}
                      className={`w-5 h-5 rounded-full border transition ${
                        brushSettings.color === c ? "ring-2 ring-white scale-110" : "border-zinc-600"
                      }`}
                    />
                  ))}
                  <input
                    type="color"
                    value={brushSettings.color}
                    onChange={(e) => dispatch(setBrushSettings({ color: e.target.value }))}
                    className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                  />
                </div>
              </div>

              <button
                onClick={() => dispatch(clearBrushStrokes())}
                className="w-full py-1.5 bg-zinc-800 hover:bg-red-950/50 text-zinc-400 hover:text-red-400 text-xs rounded-lg border border-zinc-700 transition cursor-pointer"
              >
                Clear Brush Strokes
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: STICKERS & BADGES */}
        {activeTab === "stickers" && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-indigo-400" />
              Procedural Badges & Stickers
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "neon_heart", label: "Neon Heart", icon: Flame },
                { id: "golden_crown", label: "Golden Crown", icon: Crown },
                { id: "verified_badge", label: "Verified Shield", icon: ShieldCheck },
                { id: "sparkle_star", label: "Sparkle Star", icon: Sparkles },
                { id: "fire_flame", label: "Cyber Flame", icon: Flame },
                { id: "cyber_badge", label: "Cyber Hexagon", icon: ShieldCheck },
                { id: "polaroid_frame", label: "Polaroid Frame", icon: Square },
              ].map((st) => {
                const Icon = st.icon;
                return (
                  <button
                    key={st.id}
                    onClick={() => dispatch(addSticker({ stickerKey: st.id }))}
                    className="p-2.5 bg-zinc-800/80 hover:bg-zinc-700 text-left rounded-lg border border-zinc-700 text-xs transition cursor-pointer flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="font-medium text-zinc-200">{st.label}</span>
                  </button>
                );
              })}
            </div>

            {selectedSticker && (
              <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2 mt-4">
                <div className="flex justify-between items-center text-[11px] text-indigo-300">
                  <span className="font-semibold">Selected Sticker</span>
                  <button
                    onClick={() => dispatch(deleteLayer(selectedSticker.id))}
                    className="text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                    <span>Sticker Size</span>
                    <span className="font-mono">{selectedSticker.size}px</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="300"
                    value={selectedSticker.size}
                    onChange={(e) =>
                      dispatch(
                        updateSticker({
                          id: selectedSticker.id,
                          size: parseInt(e.target.value),
                        })
                      )
                    }
                    className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ADJUST & ATMOSPHERIC FX */}
        {activeTab === "adjust" && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              Color Grading
            </h3>

            <div className="space-y-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
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

            {/* Atmospheric Overlays */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Atmospheric Overlays
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "none", label: "None" },
                  { id: "golden_hour", label: "Golden Hour" },
                  { id: "film_dust", label: "Film Dust" },
                  { id: "cyber_glitch", label: "Cyber Glitch" },
                  { id: "prism_rainbow", label: "Prism Rainbow" },
                ].map((eff) => (
                  <button
                    key={eff.id}
                    onClick={() => dispatch(setOverlayEffect(eff.id as OverlayEffect))}
                    className={`py-2 px-2 text-[11px] rounded-lg font-medium border transition cursor-pointer ${
                      image.overlayEffect === eff.id
                        ? "bg-amber-600/30 text-amber-300 border-amber-500"
                        : "bg-zinc-800/60 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
                    }`}
                  >
                    {eff.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FILTERS */}
        {activeTab === "filters" && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              Artistic Presets
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

      {/* Footer Zoom & Reset Controls */}
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
