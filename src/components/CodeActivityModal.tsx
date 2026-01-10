"use client";

import { useState } from "react";
import { Activity, X, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GithubHeatmap from "./GithubHeatmap";
import { cn } from "@/lib/utils";

export default function CodeActivityModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState<number | "last">("last");
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // [2024, 2023, 2022, 2021, 2020]

    return (
        <>
            {/* Trigger Button - Left of Guestbook */}
            <div className="fixed bottom-8 right-52 z-40">
                <motion.button
                    onClick={() => setIsOpen(true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                    title="Actividad de Código"
                >
                    <Activity size={24} />
                </motion.button>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm flex items-center justify-center p-4"
                        >
                            {/* Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-4xl shadow-2xl relative overflow-hidden"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-primary/20 text-primary rounded-xl">
                                            <Activity size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">Actividad de Código</h2>
                                            <p className="text-sm text-muted-foreground">Historial de contribuciones en GitHub</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Filters */}
                                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                                    <button
                                        onClick={() => setSelectedYear("last")}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors border whitespace-nowrap",
                                            selectedYear === "last"
                                                ? "bg-primary text-white border-primary"
                                                : "bg-white/5 border-white/10 hover:bg-white/10"
                                        )}
                                    >
                                        Último Año
                                    </button>
                                    {years.map(year => (
                                        <button
                                            key={year}
                                            onClick={() => setSelectedYear(year)}
                                            className={cn(
                                                "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                                                selectedYear === year
                                                    ? "bg-primary text-white border-primary"
                                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                            )}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>

                                {/* Heatmap */}
                                <div className="bg-black/20 rounded-xl p-2 min-h-[200px] flex items-center justify-center">
                                    <GithubHeatmap year={selectedYear} />
                                </div>

                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
