"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { undo, redo } from "@/store/editorSlice";
import { Undo2, Redo2, Layers, CheckCircle2 } from "lucide-react";

export default function HistoryPanel() {
  const dispatch = useAppDispatch();
  const { history, historyIndex, image } = useAppSelector((state) => state.editor);

  return (
    <aside className="w-64 bg-zinc-900 border-l border-zinc-800 p-4 flex flex-col justify-between overflow-y-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            Layer History
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => dispatch(undo())}
              disabled={historyIndex < 0}
              className="p-1 hover:bg-zinc-800 disabled:opacity-30 text-zinc-300 rounded transition cursor-pointer disabled:cursor-not-allowed"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => dispatch(redo())}
              disabled={historyIndex >= history.length - 1}
              className="p-1 hover:bg-zinc-800 disabled:opacity-30 text-zinc-300 rounded transition cursor-pointer disabled:cursor-not-allowed"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Image Metadata Summary */}
        <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-1 text-xs text-zinc-400">
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
            <span>Active Filter:</span>
            <span className="text-zinc-200 capitalize">{image.filter}</span>
          </div>
        </div>

        {/* Operations list */}
        <div className="space-y-2 mt-4">
          <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Pipeline Steps ({history.length})
          </h4>
          {history.length === 0 ? (
            <p className="text-xs text-zinc-600 italic">No AI operations executed yet.</p>
          ) : (
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {history.map((op, idx) => {
                const isActive = idx <= historyIndex;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 p-2 rounded-lg border text-xs transition ${
                      isActive
                        ? "bg-zinc-800/80 border-zinc-700 text-zinc-200"
                        : "bg-zinc-950/40 border-zinc-900 text-zinc-600"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                        isActive ? "text-indigo-400" : "text-zinc-700"
                      }`}
                    />
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
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
