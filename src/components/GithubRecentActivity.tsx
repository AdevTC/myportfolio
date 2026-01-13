"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCommit, Star, GitPullRequest, Github, AlertCircle, Loader2, ChevronLeft, ChevronRight, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

// GitHub Types
interface GithubEvent {
    id: string;
    type: string;
    repo: { name: string; url: string };
    created_at: string;
    payload?: {
        head?: string;
        commits?: { sha: string; message: string; url: string }[];
        pull_request?: { title: string; html_url: string; commits: number; additions: number; deletions: number; changed_files: number };
    };
}

interface CommitDetails {
    message: string;
    stats: {
        total: number;
        additions: number;
        deletions: number;
    };
    files: {
        filename: string;
        status: string;
        additions: number;
        deletions: number;
    }[];
}

export default function GithubRecentActivity() {
    const [githubEvents, setGithubEvents] = useState<GithubEvent[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
    const [commitDetails, setCommitDetails] = useState<Record<string, CommitDetails | null>>({});
    const [loadingDetails, setLoadingDetails] = useState<string | null>(null);
    // GitHub typically returns max 300 events or 90 days. We don't know total pages, 
    // but if we get fewer items than requested, we hit the end.
    const [hasMore, setHasMore] = useState(true);

    const fetchGithub = async (pageNum: number, size: number) => {
        const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "AdevTC";
        setLoading(true);

        try {
            const res = await fetch(`https://api.github.com/users/${username}/events?per_page=${size}&page=${pageNum}`);

            if (!res.ok) {
                if (res.status === 403) throw new Error("Rate limit exceeded");
                throw new Error("GitHub Error");
            }

            const data = await res.json();

            // If we got fewer items than page size, we've likely hit the end or rate limit boundaries (empty)
            if (data.length < size) setHasMore(false);
            else setHasMore(true);

            setGithubEvents(data);
            setError(null);
        } catch (e: any) {
            console.error("GitHub Fetch Error:", e);
            setGithubEvents([]);
            setError(e.message === "Rate limit exceeded" ? "Límite de API excedido" : "Error al cargar actividad");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1); // Reset to page 1 on mount or significant change? No, just initial.
        fetchGithub(1, pageSize);
    }, []); // Only mount

    // Re-fetch when page or pageSize changes
    useEffect(() => {
        fetchGithub(page, pageSize);
    }, [page, pageSize]);

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setPage(1); // Reset to first page when changing density
    };

    const handleNextPage = () => {
        if (hasMore) setPage(p => p + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(p => p - 1);
    };

    const handleExpand = async (event: GithubEvent) => {
        if (expandedEventId === event.id) {
            setExpandedEventId(null);
            return;
        }

        setExpandedEventId(event.id);

        // Fetch details if not already cached and it's a push event
        if (event.type === "PushEvent") {
            const commitSha = event.payload?.commits?.[0]?.sha || event.payload?.head;
            if (commitSha && (!commitDetails[commitSha] || !commitDetails[commitSha].message)) {
                setLoadingDetails(commitSha);
                try {
                    // We need to fetch the repo URL to get the commits endpoint correctly
                    // API URL from event.repo.url usually works e.g. https://api.github.com/repos/user/repo
                    const res = await fetch(`${event.repo.url}/commits/${commitSha}`);
                    if (res.ok) {
                        const data = await res.json();
                        setCommitDetails(prev => ({
                            ...prev,
                            [commitSha]: {
                                message: data.commit.message,
                                stats: data.stats,
                                files: data.files
                            }
                        }));
                    }
                } catch (e) {
                    console.error("Error fetching commit details", e);
                } finally {
                    setLoadingDetails(null);
                }
            }
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

    if (error) {
        return (
            <div className="flex items-center justify-center p-8 border border-white/5 bg-white/5 rounded-2xl">
                <AlertCircle className="text-red-400 mr-2" size={20} />
                <span className="text-red-300 text-sm">{error}</span>
            </div>
        );
    }

    if (loading && githubEvents.length === 0) {
        return <div className="p-8 text-center text-zinc-500 animate-pulse">Cargando historial...</div>;
    }

    return (
        <div className="mt-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-white flex items-center gap-3"
                >
                    <div className="p-2 bg-primary/20 rounded-lg text-primary">
                        <Github size={24} />
                    </div>
                    <span>Historial de Actividad</span>
                </motion.h3>

                {/* Controls */}
                <div className="flex items-center gap-4 text-sm bg-white/5 p-2 rounded-lg border border-white/5 self-start md:self-auto">
                    <span className="text-zinc-500 hidden sm:inline">Mostrar:</span>
                    <div className="flex items-center gap-1">
                        {[5, 10, 20, 50, 100].map(s => (
                            <button
                                key={s}
                                onClick={() => handlePageSizeChange(s)}
                                className={cn(
                                    "px-3 py-1 rounded-md transition-all",
                                    pageSize === s ? "bg-primary/20 text-primary font-bold" : "text-zinc-400 hover:bg-white/10"
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {githubEvents.map((event, i) => (
                    <motion.div
                        key={`${event.id}-${i}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className={cn(
                            "rounded-xl border bg-black/20 overflow-hidden transition-all duration-300",
                            expandedEventId === event.id
                                ? "bg-white/5 border-primary/30 shadow-lg ring-1 ring-primary/20"
                                : "border-white/5 hover:bg-white/5 hover:border-white/10"
                        )}
                    >
                        {/* Event Summary Card */}
                        <div
                            onClick={() => handleExpand(event)}
                            className="p-5 cursor-pointer flex flex-col md:flex-row gap-4 md:items-center justify-between"
                        >
                            <div className="flex items-start gap-4">
                                <div className={cn(
                                    "mt-1 p-2 rounded-lg flex-shrink-0",
                                    event.type === "PushEvent" ? "bg-emerald-500/10 text-emerald-400" :
                                        event.type === "WatchEvent" ? "bg-amber-500/10 text-amber-400" :
                                            event.type === "PullRequestEvent" ? "bg-blue-500/10 text-blue-400" :
                                                "bg-zinc-500/10 text-zinc-400"
                                )}>
                                    {event.type === "PushEvent" && <GitCommit size={20} />}
                                    {event.type === "WatchEvent" && <Star size={20} />}
                                    {event.type === "PullRequestEvent" && <GitPullRequest size={20} />}
                                    {event.type !== "PushEvent" && event.type !== "WatchEvent" && event.type !== "PullRequestEvent" && <Github size={20} />}
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className={cn(
                                            "text-xs uppercase font-bold px-2 py-0.5 rounded-full tracking-wider",
                                            event.type === "PushEvent" ? "bg-emerald-500/10 text-emerald-400" :
                                                event.type === "WatchEvent" ? "bg-amber-500/10 text-amber-400" :
                                                    "bg-blue-500/10 text-blue-400"
                                        )}>
                                            {event.type.replace("Event", "")}
                                        </span>
                                        <span className="text-sm font-semibold text-zinc-200">
                                            {event.repo.name}
                                        </span>
                                        <span className="text-xs text-zinc-500">• {timeAgo(event.created_at)}</span>
                                    </div>

                                    {event.payload?.commits?.[0] && (
                                        <p className="text-sm text-zinc-400 line-clamp-1 italic">
                                            "{event.payload.commits[0].message}"
                                        </p>
                                    )}
                                    {event.type === "PullRequestEvent" && event.payload?.pull_request && (
                                        <p className="text-sm text-zinc-400 line-clamp-1 italic">
                                            "{event.payload.pull_request.title}"
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-zinc-500 pl-14 md:pl-0">
                                {event.payload?.commits && (
                                    <span className="flex items-center gap-1">
                                        {event.payload.commits.length} commits
                                    </span>
                                )}
                                <span className={cn("transition-transform duration-300", expandedEventId === event.id ? "rotate-90" : "rotate-0")}>
                                    ▶
                                </span>
                            </div>
                        </div>

                        {/* Expanded Details */}
                        <AnimatePresence>
                            {expandedEventId === event.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden bg-black/40 border-t border-white/5"
                                >
                                    <div className="p-5 pl-16">
                                        {event.type === "PushEvent" ? (
                                            <div>
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-bold text-white mb-1">Commit Details</h4>
                                                    {event.payload?.commits?.[0] ? (
                                                        <p className="text-zinc-400 text-sm font-mono">{event.payload.commits[0].sha.substring(0, 7)} — {event.payload.commits[0].message}</p>
                                                    ) : event.payload?.head && commitDetails[event.payload.head]?.message ? (
                                                        <p className="text-zinc-400 text-sm font-mono">{event.payload.head.substring(0, 7)} — {commitDetails[event.payload.head]!.message}</p>
                                                    ) : event.payload?.head ? (
                                                        <p className="text-zinc-400 text-sm font-mono">Commit: {event.payload.head.substring(0, 7)}</p>
                                                    ) : (
                                                        <p className="text-zinc-500 text-sm italic">Cargando detalles...</p>
                                                    )}
                                                </div>

                                                {(() => {
                                                    const sha = event.payload?.commits?.[0]?.sha || event.payload?.head;
                                                    if (!sha) return null;

                                                    if (loadingDetails === sha) {
                                                        return (
                                                            <div className="flex items-center gap-2 text-zinc-500 text-sm">
                                                                <Loader2 className="animate-spin" size={14} /> Cargando archivos...
                                                            </div>
                                                        );
                                                    }

                                                    const details = commitDetails[sha];
                                                    if (details) {
                                                        return (
                                                            <div className="space-y-4">
                                                                <div className="flex gap-4 text-sm">
                                                                    <span className="text-emerald-400">+{details.stats.additions} líneas</span>
                                                                    <span className="text-red-400">-{details.stats.deletions} líneas</span>
                                                                </div>

                                                                <div className="space-y-1">
                                                                    {details.files.map((file: any, idx: number) => (
                                                                        <div key={idx} className="flex items-center justify-between text-xs bg-white/5 p-2 rounded">
                                                                            <span className="text-zinc-300 font-mono truncate max-w-[300px]">{file.filename}</span>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-emerald-500">+{file.additions}</span>
                                                                                <span className="text-red-500">-{file.deletions}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    }

                                                    // Use stopPropagation to prevent toggling the expand
                                                    return (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleExpand(event); }}
                                                            className="text-xs text-primary underline"
                                                        >
                                                            Reintentar carga
                                                        </button>
                                                    );
                                                })()}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-zinc-500">No hay detalles adicionales disponibles para este evento.</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                <div className="text-zinc-500 text-sm pl-2">
                    Página <span className="text-white font-mono font-bold mx-1">{page}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1 || loading}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={!hasMore || loading}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
