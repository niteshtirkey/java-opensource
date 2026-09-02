"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { undo, redo } from "@/store/editorSlice";
import { Undo2, Redo2, Layers, CheckCircle2, History } from "lucide-react";

export default function HistoryPanel() {
  const dispatch = useAppDispatch();
  const { historySnapshots, historyIndex, historyOperations, image } = useAppSelector(
    (state) => state.editor
  );

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historySnapshots.length - 1;

  return (
    <aside className="w-64 bg-zinc-900 border-l border-zinc-800 p-4 flex flex-col justify-between overflow-y-auto shrink-0 select-none">
      <div className="space-y-4">
        {/* Header with Active Undo/Redo Buttons */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-indigo-400" />
            History ({historyIndex + 1}/{historySnapshots.length})
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => dispatch(undo())}
              disabled={!canUndo}
              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                canUndo
                  ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700 hover:text-white"
                  : "bg-zinc-900 text-zinc-600 border-zinc-800/60 cursor-not-allowed opacity-40"
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => dispatch(redo())}
              disabled={!canRedo}
              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                canRedo
                  ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700 hover:text-white"
                  : "bg-zinc-900 text-zinc-600 border-zinc-800/60 cursor-not-allowed opacity-40"
              }`}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Live State Summary */}
        <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1.5 text-xs text-zinc-400">
          <div className="flex justify-between">
            <span>Dimensions:</span>
            <span className="text-zinc-200 font-mono">
              {image.width} × {image.height}px
            </span>
          </div>
          <div className="flex justify-between">
            <span>Rotation:</span>
            <span className="text-zinc-200 font-mono">{image.rotation}°</span>
          </div>
          <div className="flex justify-between">
            <span>Brightness:</span>
            <span className="text-zinc-200 font-mono">
              {Math.round(image.brightness * 100)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Filter:</span>
            <span className="text-indigo-400 font-medium capitalize">{image.filter}</span>
          </div>
          <div className="flex justify-between">
            <span>Text Layers:</span>
            <span className="text-zinc-200 font-mono">{image.textLayers.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Shapes:</span>
            <span className="text-zinc-200 font-mono">{image.shapeLayers.length}</span>
          </div>
        </div>

        {/* Operations Execution Queue */}
        <div className="space-y-2 mt-4">
          <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3" />
            Executed AI Steps ({historyOperations.length})
          </h4>
          {historyOperations.length === 0 ? (
            <p className="text-xs text-zinc-600 italic">No AI operations executed yet.</p>
          ) : (
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {historyOperations.map((op, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-lg border bg-zinc-950/60 border-zinc-800 text-zinc-200 text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium capitalize">
                      #{op.sequence_id} {op.action_type.replace("_", " ")}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono truncate">
                      {op.action_type === "resize" &&
                        `${op.parameters.target_width}x${op.parameters.target_height}`}
                      {op.action_type === "filter" && `filter: ${op.parameters.filter_name}`}
                      {op.action_type === "rotate" && `${op.parameters.rotation_degrees}°`}
                      {op.action_type === "adjust_brightness" &&
                        `intensity: ${op.parameters.intensity_level}`}
                      {op.action_type === "add_text" && `"${op.parameters.text}"`}
                      {op.action_type === "add_shape" && `${op.parameters.shape_type}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
