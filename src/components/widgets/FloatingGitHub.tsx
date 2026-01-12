"use client";

import { useEffect, useState } from "react";
import FloatingWindow from "../ui/FloatingWindow";
import { GitCommit, Star, GitPullRequest } from "lucide-react";

interface CommitMock {
    id: string;
    message: string;
    repo: string;
    time: string;
    type: "commit" | "star" | "pr";
}

const EVENTS: CommitMock[] = [
    { id: "1", message: "Refactor floating components architecture", repo: "portfolio-v2", time: "2 min ago", type: "commit" },
    { id: "2", message: "fix: dark mode toggle overlap", repo: "fantasya-app", time: "1 hour ago", type: "commit" },
    { id: "3", message: "Starred vercel/next.js", repo: "next.js", time: "3 hours ago", type: "star" },
    { id: "4", message: "feat: Add payment gateway integration", repo: "ecommerce-client", time: "Yesterday", type: "commit" },
    { id: "5", message: "Docs: Update API reference", repo: "fantasya-api", time: "2 days ago", type: "pr" },
];

export default function FloatingGitHub() {
    return (
        <FloatingWindow id="github" title="Actividad GitHub Live" width={450} height={350}>
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-xs text-green-400 font-medium uppercase tracking-wider">Escuchando eventos...</span>
                </div>

                <div className="space-y-0">
                    {EVENTS.map((event, i) => (
                        <div key={event.id} className="relative pl-6 pb-6 border-l border-white/10 last:pb-0 last:border-0 hover:border-primary/50 transition-colors group">
                            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#151b29] border border-white/20 group-hover:border-primary group-hover:bg-primary transition-all" />

                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-zinc-500 flex items-center gap-2">
                                    {event.repo} • {event.time}
                                </span>
                                <p className="text-sm text-zinc-300 font-medium group-hover:text-white transition-colors">
                                    {event.message}
                                </p>
                                <div className="flex items-center gap-1 text-[10px] bg-white/5 w-fit px-2 py-0.5 rounded text-zinc-400 mt-1">
                                    {event.type === "commit" && <GitCommit size={10} />}
                                    {event.type === "star" && <Star size={10} />}
                                    {event.type === "pr" && <GitPullRequest size={10} />}
                                    <span className="uppercase">{event.type}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </FloatingWindow>
    );
}
