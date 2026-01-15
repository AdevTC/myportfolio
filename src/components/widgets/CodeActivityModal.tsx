"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Activity } from "lucide-react";
import { useFloatingComponents } from "@/context/FloatingComponentContext";
import GithubHeatmap from "../GithubHeatmap";
import { cn } from "@/lib/utils";

const YEARS = [
    { label: "Último Año", value: "last" },
    { label: "2026", value: 2026 },
    { label: "2025", value: 2025 },
    { label: "2024", value: 2024 },
    { label: "2023", value: 2023 },
    { label: "2022", value: 2022 },
];

export default function CodeActivityModal() {
    const { isWidgetOpen, closeWidget } = useFloatingComponents();
    const isOpen = isWidgetOpen("codeActivity");
    const [selectedYear, setSelectedYear] = useState<number | "last">("last");

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeWidget("codeActivity");
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [closeWidget]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => closeWidget("codeActivity")}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-5xl bg-[#0f121b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex md:items-end flex-col md:flex-row justify-between gap-6 p-8 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/20 rounded-xl text-primary">
                                    <Activity size={32} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white">Actividad de Código</h2>
                                    <p className="text-zinc-400">Vista detallada de contribuciones</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pr-12">
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
                            </div>

                            <button
                                onClick={() => closeWidget("codeActivity")}
                                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 flex flex-col items-center justify-center bg-black/20 overflow-x-hidden">
                            <div className="w-full overflow-x-auto custom-scrollbar pb-4">
                                <div className="min-w-[800px]">
                                    <GithubHeatmap year={selectedYear} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
