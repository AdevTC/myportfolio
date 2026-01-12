"use client";

import { useState } from "react";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import GithubHeatmap from "./GithubHeatmap";
import Section from "./ui/Section";

export default function CodeActivity() {
    const [selectedYear, setSelectedYear] = useState<number | "last">("last");
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <Section className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/20 text-primary rounded-xl">
                            <Activity size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold">Actividad de Código</h2>
                            <p className="text-muted-foreground">Historial de contribuciones en GitHub</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
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
                </div>

                {/* Heatmap Container */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 shadow-xl overflow-hidden relative group">
                    {/* Glow Effect */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10 group-hover:bg-primary/10 transition-colors" />

                    <div className="min-h-[200px] flex items-center justify-center">
                        <GithubHeatmap year={selectedYear} />
                    </div>
                </div>
            </div>
        </Section>
    );
}
