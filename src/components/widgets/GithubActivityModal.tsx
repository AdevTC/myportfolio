"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, Loader2, AlertCircle, ExternalLink, GitCommit, GitPullRequest, Star } from "lucide-react";
import { useFloatingComponents } from "@/context/FloatingComponentContext";
import { cn } from "@/lib/utils";

// --- Types ---
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

// Helper Component for truncated/expandable messages
const CommitMessage = ({ msg }: { msg: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <p
            onClick={() => setIsExpanded(!isExpanded)}
            title={msg}
            className={cn(
                "text-sm text-zinc-400 leading-relaxed font-mono bg-black/30 p-2 rounded-lg border border-white/5 cursor-pointer hover:bg-black/40 transition-colors",
                isExpanded ? "whitespace-pre-wrap break-words" : "truncate"
            )}
        >
            "{msg}"
        </p>
    );
};

export default function GithubActivityModal() {
    const { isWidgetOpen, closeWidget } = useFloatingComponents();
    const isOpen = isWidgetOpen("github");

    const [githubEvents, setGithubEvents] = useState<GithubEvent[]>([]);
    const [commitDetails, setCommitDetails] = useState<Record<string, CommitDetails>>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Initial Fetch when opened
    useEffect(() => {
        if (!isOpen) return;

        const fetchGithub = async () => {
            // 1. Check Cache
            const CACHE_KEY = "github_activity_modal_events";
            const CACHE_DURATION = 5 * 60 * 1000;
            const cached = localStorage.getItem(CACHE_KEY);

            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_DURATION) {
                    setGithubEvents(data);
                    return;
                }
            }

            setLoading(true);
            const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "AdevTC";
            try {
                const res = await fetch(`https://api.github.com/users/${username}/events?per_page=15`);
                if (!res.ok) {
                    if (res.status === 403) throw new Error("Rate limit exceeded");
                    throw new Error("GitHub Error");
                }
                const data = await res.json();
                setGithubEvents(data);
                setError(null);

                // 2. Save Cache
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data,
                    timestamp: Date.now()
                }));

            } catch (e: any) {
                console.error("GitHub Fetch Error:", e);
                // Fallback to cache without checking expiry
                if (cached) {
                    const { data } = JSON.parse(cached);
                    setGithubEvents(data);
                    setError(null);
                } else {
                    setGithubEvents([]);
                    setError(e.message === "Rate limit exceeded" ? "Límite de API excedido" : "Error al cargar actividad");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchGithub();
    }, [isOpen]);

    // Auto-fetch missing commit details
    useEffect(() => {
        if (!isOpen) return;
        githubEvents.forEach(event => {
            if (event.type === "PushEvent" && (!event.payload?.commits?.length) && event.payload?.head) {
                const sha = event.payload.head;
                if (!commitDetails[sha]) {
                    fetchCommitDetails(event.repo.url, sha);
                }
            }
        });
    }, [githubEvents, isOpen]);

    const fetchCommitDetails = async (repoUrl: string, sha: string) => {
        try {
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

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeWidget("github");
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [closeWidget]);

    const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "AdevTC";

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => closeWidget("github")}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-xl bg-[#0f121b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-[#24292e] rounded-xl text-white">
                                    <Github size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">GitHub Live</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        <p className="text-xs text-green-400 font-medium tracking-wide">Escuchando eventos...</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => closeWidget("github")}
                                className="p-2 rounded-full bg-white/5 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-0 bg-black/20">
                            {loading && githubEvents.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-zinc-500 gap-3">
                                    <Loader2 size={32} className="animate-spin text-primary" />
                                    <p className="text-sm">Conectando con GitHub...</p>
                                </div>
                            ) : githubEvents.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-zinc-500 gap-2">
                                    {error ? (
                                        <>
                                            <AlertCircle size={32} className="mb-2 opacity-50 text-red-400" />
                                            <p className="text-sm text-red-300">{error}</p>
                                        </>
                                    ) : (
                                        <>
                                            <Github size={32} className="mb-2 opacity-50" />
                                            <p className="text-sm">No hay actividad reciente</p>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {githubEvents.map((event) => {
                                        const headSha = event.payload?.head;
                                        const commitMsg = event.payload?.commits?.[0]?.message
                                            || (headSha && commitDetails[headSha]?.message);

                                        return (
                                            <div key={event.id} className="p-5 hover:bg-white/5 transition-colors group">
                                                <div className="flex gap-4">
                                                    {/* Timeline Line */}
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/50 group-hover:text-primary transition-colors text-zinc-400">
                                                            {event.type === "PushEvent" && <GitCommit size={14} />}
                                                            {event.type === "WatchEvent" && <Star size={14} />}
                                                            {event.type === "PullRequestEvent" && <GitPullRequest size={14} />}
                                                            {!["PushEvent", "WatchEvent", "PullRequestEvent"].includes(event.type) && <Github size={14} />}
                                                        </div>
                                                        <div className="w-px h-full bg-white/5 my-2 group-last:hidden" />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 border border-white/5 px-1.5 py-0.5 rounded bg-black/20">
                                                                {event.type.replace("Event", "")}
                                                            </span>
                                                            <span className="text-xs text-zinc-500 tabular-nums">{timeAgo(event.created_at)}</span>
                                                        </div>

                                                        <h4 className="text-sm font-bold text-white truncate mb-1">
                                                            {event.repo.name}
                                                        </h4>

                                                        {event.type === "PushEvent" ? (
                                                            commitMsg ? (
                                                                <CommitMessage msg={commitMsg} />
                                                            ) : (
                                                                <div className="flex items-center gap-2 text-xs text-zinc-600 italic mt-1">
                                                                    <Loader2 size={10} className="animate-spin" /> Cargando detalle...
                                                                </div>
                                                            )
                                                        ) : (
                                                            <p className="text-xs text-zinc-400">
                                                                {event.type === "WatchEvent" ? "Starred repository" : "Activity on repository"}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/10 bg-white/5">
                            <a
                                href={`https://github.com/${username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors border border-white/5 hover:border-white/20"
                            >
                                <Github size={18} />
                                Ver Perfil Completo
                                <ExternalLink size={14} className="opacity-50" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
