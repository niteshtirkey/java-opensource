"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { applyOperations, setErrorMessage, setLoading } from "@/store/editorSlice";
import { sendPromptCommand } from "@/services/apiService";
import { Sparkles, Send, Loader2, AlertCircle } from "lucide-react";

export default function CommandBar() {
  const [prompt, setPrompt] = useState("");
  const dispatch = useAppDispatch();
  const { sessionId, isLoading, errorMessage } = useAppSelector((state) => state.editor);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const query = prompt.trim();
    setPrompt("");
    dispatch(setErrorMessage(null));
    dispatch(setLoading({ isLoading: true, message: "Processing instructions..." }));

    try {
      const result = await sendPromptCommand(query, sessionId);

      if (result.session_status === "blocked") {
        dispatch(setErrorMessage(result.error_message || "Command blocked by security guardrails."));
      } else if (result.parsed_operations && result.parsed_operations.length > 0) {
        dispatch(applyOperations(result.parsed_operations));
      } else {
        dispatch(setErrorMessage("No supported actions detected in your prompt."));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to execute prompt";
      dispatch(setErrorMessage(msg));
    } finally {
      dispatch(setLoading({ isLoading: false }));
    }
  };

  return (
    <div className="w-full bg-zinc-900 border-t border-zinc-800 p-4">
      <div className="max-w-4xl mx-auto space-y-2">
        {errorMessage && (
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/50 border border-red-800/60 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative flex items-center">
          <div className="absolute left-3.5 flex items-center pointer-events-none text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            placeholder='Try: "Resize to 1024x768 and rotate 90 degrees and apply sepia filter"'
            className="w-full bg-zinc-950 text-zinc-100 text-sm pl-10 pr-28 py-3 rounded-xl border border-zinc-700/60 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
          />

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="absolute right-2 flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Run</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
