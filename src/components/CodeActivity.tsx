"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import GithubHeatmap from "./GithubHeatmap";
import GithubRecentActivity from "./GithubRecentActivity";
import { cn } from "@/lib/utils";

const YEARS = [
    { label: "Último Año", value: "last" },
    { label: "2026", value: 2026 },
    { label: "2025", value: 2025 },
    { label: "2024", value: 2024 },
    { label: "2023", value: 2023 },
    { label: "2022", value: 2022 },
];

export default function CodeActivity() {
    const [selectedYear, setSelectedYear] = useState<number | "last">("last");

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                    >
                        <div className="p-3 bg-primary/10 rounded-xl text-primary">
                            <Activity size={32} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold text-white tracking-tight">Actividad de Código</h2>
                            <p className="text-zinc-400">Historial de contribuciones en GitHub</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="flex flex-wrap gap-2"
                    >
                        {YEARS.map((year) => (
                            <button
                                key={year.label}
                                onClick={() => setSelectedYear(year.value as number | "last")}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-bold transition-all border",
                                    selectedYear === year.value
                                        ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                                        : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white"
                                )}
                            >
                                {year.label}
                            </button>
                        ))}
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="group relative"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                    <div className="relative p-6 bg-[#0f121b]/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-x-auto custom-scrollbar">
                        <div className="min-w-[800px]">
                            <GithubHeatmap year={selectedYear} />
                        </div>
                    </div>
                </motion.div>

                <GithubRecentActivity />
            </div>
        </section>
    );
}
