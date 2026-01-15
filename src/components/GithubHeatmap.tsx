"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useThemeStore, PrimaryColor } from "@/store/themeStore";

// Define prop types explicitly to help TS
type CalendarProps = {
    data: any[];
    colorScheme: 'dark' | 'light';
    theme: any;
    labels: any;
    blockSize: number;
    blockMargin: number;
    fontSize: number;
    renderBlock?: (block: React.ReactNode, activity: any) => React.ReactElement;
}

// Cast the dynamic import to a component accepting these props
const GitHubCalendar = dynamic<CalendarProps>(() => import("react-activity-calendar").then((mod: any) => mod.ActivityCalendar) as any, { ssr: false });

// Define palettes for each primary color
// Format: [Level0 (empty), Level1, Level2, Level3, Level4]
const HEATMAP_THEMES: Record<PrimaryColor, { light: string[]; dark: string[] }> = {
    purple: {
        light: ["#f1f5f9", "#e9d5ff", "#c084fc", "#a855f7", "#7e22ce"],
        dark: ["#1e293b", "#581c87", "#7e22ce", "#a855f7", "#d8b4fe"],
    },
    blue: {
        light: ["#f1f5f9", "#cffafe", "#67e8f9", "#22d3ee", "#0891b2"],
        dark: ["#1e293b", "#164e63", "#0891b2", "#22d3ee", "#67e8f9"],
    },
    emerald: {
        light: ["#f1f5f9", "#d1fae5", "#6ee7b7", "#34d399", "#059669"],
        dark: ["#1e293b", "#064e3b", "#059669", "#34d399", "#6ee7b7"],
    },
    gold: {
        light: ["#f1f5f9", "#fef3c7", "#fcd34d", "#fbbf24", "#d97706"],
        dark: ["#1e293b", "#78350f", "#d97706", "#fbbf24", "#fcd34d"],
    },
    pink: {
        light: ["#f1f5f9", "#fce7f3", "#f9a8d4", "#f472b6", "#db2777"],
        dark: ["#1e293b", "#831843", "#db2777", "#f472b6", "#f9a8d4"],
    },
    red: {
        light: ["#f1f5f9", "#fee2e2", "#fca5a5", "#f87171", "#dc2626"],
        dark: ["#1e293b", "#7f1d1d", "#dc2626", "#f87171", "#fca5a5"],
    },
    orange: {
        light: ["#f1f5f9", "#ffedd5", "#fdba74", "#fb923c", "#ea580c"],
        dark: ["#1e293b", "#7c2d12", "#ea580c", "#fb923c", "#fdba74"],
    },
    teal: {
        light: ["#f1f5f9", "#ccfbf1", "#5eead4", "#2dd4bf", "#0d9488"],
        dark: ["#1e293b", "#134e4a", "#0d9488", "#2dd4bf", "#5eead4"],
    },
    indigo: {
        light: ["#f1f5f9", "#e0e7ff", "#818cf8", "#6366f1", "#4338ca"],
        dark: ["#1e293b", "#312e81", "#4338ca", "#6366f1", "#818cf8"],
    },
    rose: {
        light: ["#f1f5f9", "#ffe4e6", "#fda4af", "#fb7185", "#e11d48"],
        dark: ["#1e293b", "#881337", "#e11d48", "#fb7185", "#fda4af"],
    },
    premium_gold: {
        light: ["#f1f5f9", "#e8e0d5", "#c6b39a", "#a88e6e", "#927043"],
        dark: ["#1e293b", "#4a3822", "#6e5433", "#927043", "#b08d5e"],
    },
    silver: {
        light: ["#f1f5f9", "#e2e4e5", "#c0c4c5", "#9da4a6", "#797f81"],
        dark: ["#1e293b", "#3d4041", "#5a6061", "#797f81", "#9ba1a2"],
    },
    cyan: {
        light: ["#f1f5f9", "#cffafe", "#67e8f9", "#22d3ee", "#06b6d4"],
        dark: ["#1e293b", "#155e75", "#0891b2", "#06b6d4", "#22d3ee"],
    },
    lime: {
        light: ["#f1f5f9", "#ecfccb", "#bef264", "#84cc16", "#4d7c0f"],
        dark: ["#1e293b", "#365314", "#4d7c0f", "#84cc16", "#bef264"],
    },
    magenta: {
        light: ["#f1f5f9", "#fae8ff", "#e879f9", "#d946ef", "#a21caf"],
        dark: ["#1e293b", "#701a75", "#a21caf", "#d946ef", "#e879f9"],
    },
    violet: {
        light: ["#f1f5f9", "#ede9fe", "#8b5cf6", "#7c3aed", "#5b21b6"],
        dark: ["#1e293b", "#4c1d95", "#5b21b6", "#7c3aed", "#8b5cf6"],
    },
};

interface GithubHeatmapProps {
    year?: number | "last";
}

export default function GithubHeatmap({ year = "last" }: GithubHeatmapProps) {
    const { primaryColor } = useThemeStore();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`https://github-contributions-api.jogruber.de/v4/AdevTC?y=${year}`)
            .then((response) => response.json())
            .then((activity) => {
                if (activity?.contributions) {
                    setData(activity.contributions);
                }
            })
            .catch((e) => console.error("Error fetching github activity", e))
            .finally(() => setLoading(false));
    }, [year]);

    if (loading) {
        return <div className="w-full h-32 flex items-center justify-center text-muted-foreground animate-pulse">Cargando actividad...</div>;
    }

    return (
        <div className="w-full overflow-x-auto p-6 glass rounded-2xl border border-white/5 flex justify-center">
            <div className="min-w-[600px]">
                <GitHubCalendar
                    data={data}
                    colorScheme='dark'
                    theme={HEATMAP_THEMES[primaryColor]}
                    labels={{
                        totalCount: `{{count}} contribuciones en ${year === 'last' ? 'el último año' : year}`,
                    }}
                    blockSize={12}
                    blockMargin={4}
                    renderBlock={(block, activity) => {
                        return React.cloneElement(block as React.ReactElement, {
                            title: `${activity.count} contribuciones el ${activity.date}`,
                        });
                    }}
                    fontSize={12}
                />
            </div>
        </div>
    );
}
