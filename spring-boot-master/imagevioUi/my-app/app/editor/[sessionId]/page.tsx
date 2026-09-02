"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setSessionId } from "@/store/editorSlice";
import CanvasEditor from "@/components/CanvasEditor";
import Toolbox from "@/components/Toolbox";
import HistoryPanel from "@/components/HistoryPanel";
import CommandBar from "@/components/CommandBar";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function EditorPage() {
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (sessionId) {
      dispatch(setSessionId(sessionId));
    }
  }, [sessionId, dispatch]);

  return (
    <div className="flex flex-col h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Top Navbar */}
      <header className="h-14 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">Imgevio Studio</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-zinc-500 bg-zinc-950 px-2.5 py-1 rounded-full border border-zinc-800">
            Session: {sessionId ? sessionId.slice(0, 8) : "demo"}...
          </span>
        </div>
      </header>

      {/* Main Workspace: Left Sidebar + Center Canvas + Right History */}
      <div className="flex flex-1 overflow-hidden">
        <Toolbox />
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <CanvasEditor />
          <CommandBar />
        </main>
        <HistoryPanel />
      </div>
    </div>
  );
}
