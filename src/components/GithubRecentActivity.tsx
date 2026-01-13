"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GitCommit, Star, GitPullRequest, Github, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// GitHub Types
interface GithubEvent {
    id: string;
    type: string;
    repo: { name: string };
    created_at: string;
    payload?: { commits?: { message: string }[] };
}

export default function GithubRecentActivity() {
    const [githubEvents, setGithubEvents] = useState<GithubEvent[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Initial Fetch
    useEffect(() => {
        const fetchGithub = async () => {
            const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "AdevTC";
            try {
                // Fetch more events for the homepage view
                const res = await fetch(`https://api.github.com/users/${username}/events?per_page=12`);

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

    if (githubEvents.length === 0) {
        return null;
    }

    return (
        <div className="mt-8">
            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-xl font-bold text-white mb-6 flex items-center gap-2"
            >
                <Github size={20} className="text-primary" />
                Actividad Reciente
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {githubEvents.map((event, i) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/30 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className={cn(
                                "text-[10px] uppercase font-bold px-2 py-1 rounded bg-black/20",
                                event.type === "PushEvent" ? "text-green-400" :
                                    event.type === "WatchEvent" ? "text-yellow-400" :
                                        "text-blue-400"
                            )}>
                                {event.type.replace("Event", "")}
                            </span>
                            <span className="text-xs text-zinc-500">{timeAgo(event.created_at)}</span>
                        </div>

                        <p className="text-sm text-zinc-300 font-medium truncate mb-1">
                            {event.repo.name}
                        </p>

                        {event.payload?.commits?.[0] && (
                            <p className="text-xs text-zinc-500 line-clamp-2">
                                "{event.payload.commits[0].message}"
                            </p>
                        )}

                        <div className="mt-3 flex gap-2">
                            {event.type === "PushEvent" && <GitCommit size={14} className="text-green-400" />}
                            {event.type === "WatchEvent" && <Star size={14} className="text-yellow-400" />}
                            {event.type === "PullRequestEvent" && <GitPullRequest size={14} className="text-blue-400" />}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
