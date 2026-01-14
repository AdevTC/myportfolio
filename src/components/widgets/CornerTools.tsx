"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Github, Code, Wind, Droplets, MapPin, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Mock Data/Interfaces ---



// GitHub Types
// Expanded GitHub Types for robustness
interface GithubEvent {
    id: string;
    type: string;
    repo: { name: string; url: string };
    created_at: string;
    payload?: {
        head?: string;
        commits?: { sha: string; message: string }[]
    };
}

interface CommitDetails {
    message: string;
}

export default function CornerTools() {
    const [isOpen, setIsOpen] = useState(false);
    const [githubEvents, setGithubEvents] = useState<GithubEvent[]>([]);
    const [commitDetails, setCommitDetails] = useState<Record<string, CommitDetails>>({});
    const [error, setError] = useState<string | null>(null);

    // Initial Fetch
    useEffect(() => {
        const fetchGithub = async () => {
            const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "AdevTC";
            try {
                const res = await fetch(`https://api.github.com/users/${username}/events?per_page=5`);
                if (!res.ok) {
                    if (res.status === 403) throw new Error("Rate limit exceeded");
                    throw new Error("GitHub Error");
                }
                const data = await res.json();
                setGithubEvents(data);
                setError(null);
            } catch (e: any) {
                console.error("GitHub Fetch Error:", e);
                setGithubEvents([]);
                setError(e.message === "Rate limit exceeded" ? "Límite de API excedido" : "Error al cargar actividad");
            }
        };

        fetchGithub();
    }, []);

    // Auto-fetch missing commit details
    useEffect(() => {
        githubEvents.forEach(event => {
            if (event.type === "PushEvent" && (!event.payload?.commits?.length) && event.payload?.head) {
                const sha = event.payload.head;
                if (!commitDetails[sha]) {
                    fetchCommitDetails(event.repo.url, sha);
                }
            }
        });
    }, [githubEvents]);

    const fetchCommitDetails = async (repoUrl: string, sha: string) => {
        try {
            // Ensure we use the API URL correctly
            const res = await fetch(`${repoUrl}/commits/${sha}`);
            if (res.ok) {
                const data = await res.json();
                setCommitDetails(prev => ({
                    ...prev,
                    [sha]: { message: data.commit.message }
                }));
            }
        } catch (e) {
            console.error("Error fetching detail", e);
        }
    };

    // Helper to format time
    const timeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    return (
        <div
            className="fixed top-24 right-6 z-50 flex flex-col items-end gap-4"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10, transformOrigin: "top right" }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="w-[320px] bg-[#0f121b]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden origin-top-right"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-2 p-4 border-b border-white/10 bg-white/5">
                            <Github size={16} className="text-white" />
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Actividad Reciente</span>
                        </div>

                        {/* Content Body */}
                        <div className="p-4 h-[300px]">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col"
                            >
                                <div className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2 space-y-3">
                                    {githubEvents.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                                            {error ? (
                                                <>
                                                    <AlertCircle size={32} className="mb-2 opacity-50 text-red-400" />
                                                    <p className="text-xs text-red-300">{error}</p>
                                                </>
                                            ) : (
                                                <>
                                                    <Github size={32} className="mb-2 opacity-50" />
                                                    <p className="text-xs">No hay actividad reciente</p>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        githubEvents.map(event => {
                                            const headSha = event.payload?.head;
                                            const commitMsg = event.payload?.commits?.[0]?.message
                                                || (headSha && commitDetails[headSha]?.message);

                                            return (
                                                <div key={event.id} className="relative pl-4 border-l border-white/10 py-1">
                                                    <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-[#151b29] border border-white/20" />
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-[10px] uppercase font-bold text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">
                                                            {event.type.replace("Event", "")}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-600">{timeAgo(event.created_at)}</span>
                                                    </div>
                                                    <p className="text-xs text-zinc-300 font-medium mt-1 truncate">
                                                        {event.repo.name}
                                                    </p>
                                                    {event.type === "PushEvent" ? (
                                                        commitMsg ? (
                                                            <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                                                                "{commitMsg}"
                                                            </p>
                                                        ) : (
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <Loader2 size={10} className="animate-spin text-zinc-600" />
                                                                <span className="text-[10px] text-zinc-600 italic">Cargando...</span>
                                                            </div>
                                                        )
                                                    ) : null}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                <div className="pt-3 mt-2 border-t border-white/5">
                                    <a
                                        href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME || "AdevTC"}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full text-center py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white transition-colors"
                                    >
                                        Ver GitHub
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trigger Pill */}
            <motion.div
                className={cn(
                    "flex items-center gap-3 px-4 py-3 bg-[#0f121b]/80 backdrop-blur-md border border-white/10 rounded-full shadow-lg cursor-pointer hover:bg-white/10 transition-colors",
                    isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
            >
                {/* GitHub */}
                <div className="flex items-center justify-center gap-2 px-1">
                    <Github size={18} className="text-white" />
                    <span className="text-xs font-bold text-white">GitHub</span>
                </div>
            </motion.div>
        </div>
    );
}
