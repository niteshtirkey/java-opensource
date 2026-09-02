"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Wand2, ShieldCheck, Zap, Layers, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const handleStartSession = () => {
    const newSessionId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `session-${Date.now()}`;
    router.push(`/editor/${newSessionId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Navigation */}
      <header className="px-6 h-16 border-b border-zinc-800/80 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">Imgevio</span>
        </div>
        <button
          onClick={handleStartSession}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition cursor-pointer"
        >
          Open Studio
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
          <Wand2 className="w-3.5 h-3.5" />
          <span>Core AI Natural Language Image Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
          Edit images simply by <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
            describing what you want.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mb-10">
          Transform your creative workflow. Give conversational instructions like{" "}
          <span className="text-zinc-200 font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            &quot;Resize to 1024x768 and apply sepia filter&quot;
          </span>{" "}
          and let Imgevio parse and execute the operations instantly.
        </p>

        <button
          onClick={handleStartSession}
          className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition shadow-xl shadow-indigo-600/20 hover:scale-[1.02] cursor-pointer"
        >
          <span>Start Editing Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 text-left w-full">
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <Zap className="w-5 h-5 text-indigo-400 mb-3" />
            <h3 className="font-semibold text-sm text-zinc-100 mb-1">Instant Multi-Step Parsing</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Processes chained natural language commands into sequential execution pipelines automatically.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mb-3" />
            <h3 className="font-semibold text-sm text-zinc-100 mb-1">Built-in Guardrails</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Zero-trust security layer protecting against prompt injection and resource exhaustion attacks.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <Layers className="w-5 h-5 text-purple-400 mb-3" />
            <h3 className="font-semibold text-sm text-zinc-100 mb-1">Redux Session History</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Full layer stack tracking with one-click undo/redo and live canvas rendering.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
