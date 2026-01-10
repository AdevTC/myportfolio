"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useThemeStore } from "@/store/themeStore";

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

const theme = {
    light: ["#f1f5f9", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed"],
    dark: ["#1e293b", "#4c1d95", "#6d28d9", "#8b5cf6", "#a78bfa"],
};

interface GithubHeatmapProps {
    year?: number | "last";
}

export default function GithubHeatmap({ year = "last" }: GithubHeatmapProps) {
    const { isDarkMode } = useThemeStore();
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
                    colorScheme={isDarkMode ? 'dark' : 'light'}
                    theme={theme}
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
