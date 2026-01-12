"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Github, Code, Wind, Droplets, MapPin, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Mock Data/Interfaces ---

// Weather Types
interface WeatherData {
    temp: number;
    description: string;
    city: string;
    humidity: number;
    wind: number;
    condition: "sunny" | "cloudy" | "rain";
}

// GitHub Types
interface GithubEvent {
    id: string;
    type: string;
    repo: { name: string };
    created_at: string;
    payload?: { commits?: { message: string }[] };
}

// WakaTime Types
interface WakaLanguage {
    name: string;
    percent: number;
    color?: string;
}

const WAKA_COLORS = [
    "bg-blue-500", "bg-yellow-400", "bg-purple-500", "bg-pink-500", "bg-cyan-400", "bg-green-500"
];

export default function CornerTools() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"weather" | "github" | "coding">("weather");

    // State
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [githubEvents, setGithubEvents] = useState<GithubEvent[]>([]);

    // WakaTime State
    const [codingStats, setCodingStats] = useState<WakaLanguage[]>([]);
    const [codingTotal, setCodingTotal] = useState("0h 0m");
    const [codingLoading, setCodingLoading] = useState(false);
    const [codingError, setCodingError] = useState("");

    // Initial Fetch (Mock or Real)
    useEffect(() => {
        // --- fetch Weather ---
        const fetchWeather = async () => {
            const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;

            if (!apiKey) {
                // Mock
                setWeather({
                    temp: 24,
                    description: "Cielos Despejados",
                    city: "Madrid (Simulado)",
                    humidity: 65,
                    wind: 3.2,
                    condition: "sunny"
                });
                return;
            }

            try {
                // Hardcoded Madrid for stability/speed in demo, ideally use navigator.geolocation
                const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Madrid&units=metric&lang=es&appid=${apiKey}`);
                const data = await res.json();

                if (data.cod !== 200) throw new Error("Weather Error");

                setWeather({
                    temp: Math.round(data.main.temp),
                    description: data.weather[0].description,
                    city: data.name,
                    humidity: data.main.humidity,
                    wind: data.wind.speed,
                    condition: data.weather[0].main.toLowerCase().includes("rain") ? "rain" : "sunny"
                });
            } catch (e) {
                console.error("Weather Fetch Error", e);
                // Fallback Mock
                setWeather({
                    temp: 22,
                    description: "Parcialmente Nublado",
                    city: "Madrid",
                    humidity: 50,
                    wind: 10,
                    condition: "cloudy"
                });
            }
        };

        // --- fetch GitHub ---
        const fetchGithub = async () => {
            const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "AdevTC";
            try {
                const res = await fetch(`https://api.github.com/users/${username}/events?per_page=5`);
                if (!res.ok) throw new Error("GitHub Error");
                const data = await res.json();
                setGithubEvents(data);
            } catch (e) {
                console.error(e);
                setGithubEvents([]); // Empty state will show "No active data"
            }
        };

        // --- fetch WakaTime ---
        const fetchWakaTime = async () => {
            setCodingLoading(true);
            const user = process.env.NEXT_PUBLIC_WAKATIME_USER;
            if (!user) {
                setCodingError("No User configured");
                setCodingLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/wakatime?user=${user}`);
                if (!res.ok) throw new Error(`API Error: ${res.status}`);

                const data = await res.json();

                // Debug log
                console.log("WakaTime Raw Data:", data);

                if (!data || !data.data) {
                    setCodingError("Invalid Data format");
                    return;
                }

                const languages = data.data.languages.slice(0, 5).map((l: any, i: number) => ({
                    name: l.name,
                    percent: l.percent,
                    color: WAKA_COLORS[i % WAKA_COLORS.length]
                }));

                setCodingStats(languages);
                setCodingTotal(data.data.human_readable_total || "0s");

            } catch (err: any) {
                console.error("WakaTime Fetch Error:", err);
                setCodingError(err.message || "Error de conexión");
            } finally {
                setCodingLoading(false);
            }
        };

        fetchWeather();
        fetchGithub();
        fetchWakaTime();
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
                        {/* Tabs Header */}
                        <div className="flex p-1 gap-1 bg-black/20 m-2 rounded-xl">
                            <button
                                onClick={() => setActiveTab("weather")}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all",
                                    activeTab === "weather" ? "bg-white text-black shadow" : "text-zinc-500 hover:text-white"
                                )}
                            >
                                <Cloud size={14} /> Clima
                            </button>
                            <button
                                onClick={() => setActiveTab("github")}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all",
                                    activeTab === "github" ? "bg-white text-black shadow" : "text-zinc-500 hover:text-white"
                                )}
                            >
                                <Github size={14} /> GitHub
                            </button>
                            <button
                                onClick={() => setActiveTab("coding")}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all",
                                    activeTab === "coding" ? "bg-white text-black shadow" : "text-zinc-500 hover:text-white"
                                )}
                            >
                                <Code size={14} /> Code
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="p-4 h-[300px]">
                            {activeTab === "weather" && weather && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col h-full justify-between"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                                            <MapPin size={14} />
                                            {weather.city}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-6xl font-bold text-white tracking-tighter">{weather.temp}°</span>
                                            <div className="text-sm font-medium text-zinc-300">
                                                <p className="capitalize">{weather.description}</p>
                                                <p className="text-zinc-500">Sensación {weather.temp}°</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white/5 rounded-2xl p-3 flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/20 rounded-full text-blue-400"><Wind size={18} /></div>
                                            <div>
                                                <p className="text-xs text-zinc-400">Viento</p>
                                                <p className="font-bold text-white">{weather.wind} m/s</p>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-3 flex items-center gap-3">
                                            <div className="p-2 bg-purple-500/20 rounded-full text-purple-400"><Droplets size={18} /></div>
                                            <div>
                                                <p className="text-xs text-zinc-400">Humedad</p>
                                                <p className="font-bold text-white">{weather.humidity}%</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mt-2">
                                        <h4 className="text-xs font-bold text-zinc-300 mb-1 flex items-center gap-2">
                                            Recomendación
                                        </h4>
                                        <p className="text-xs text-zinc-500">
                                            {weather.temp > 25
                                                ? "Hace calor. ¡Hidrátate y busca un sitio fresco!"
                                                : "Temperatura ideal para un sprint de código intenso."}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "github" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex flex-col"
                                >
                                    <div className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2 space-y-3">
                                        {githubEvents.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                                                <Github size={32} className="mb-2 opacity-50" />
                                                <p className="text-xs">No hay actividad reciente</p>
                                            </div>
                                        ) : (
                                            githubEvents.map(event => (
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
                                                    {event.payload?.commits?.[0] && (
                                                        <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2">
                                                            "{event.payload.commits[0].message}"
                                                        </p>
                                                    )}
                                                </div>
                                            ))
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
                            )}

                            {activeTab === "coding" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex flex-col"
                                >
                                    {codingLoading ? (
                                        <div className="h-full flex items-center justify-center text-zinc-500">
                                            <Loader2 className="animate-spin" />
                                        </div>
                                    ) : codingError ? (
                                        <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-2 text-center">
                                            <AlertCircle className="text-red-400" />
                                            <p className="text-xs text-red-300">{codingError}</p>
                                            <p className="text-[10px] text-zinc-600 px-4">
                                                Asegúrate de que "Display coding activity publicly" está activado en WakaTime.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 pt-2">
                                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                                <div>
                                                    <span className="text-3xl font-bold text-white">{codingTotal}</span>
                                                    <p className="text-xs text-zinc-400">Total (Últimos 7 días)</p>
                                                </div>
                                                <Code className="text-zinc-600 mb-1" size={20} />
                                            </div>

                                            <div className="space-y-3 overflow-y-auto max-h-[180px] pr-2 custom-scrollbar">
                                                {codingStats.map(stat => (
                                                    <div key={stat.name} className="space-y-1">
                                                        <div className="flex justify-between text-xs text-zinc-300">
                                                            <span>{stat.name}</span>
                                                            <span>{stat.percent.toFixed(1)}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${stat.percent}%` }}
                                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                                                className={`h-full rounded-full ${stat.color || "bg-zinc-500"}`}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
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
                {/* Weather */}
                <div className="flex items-center gap-2 pr-3 border-r border-white/10">
                    <Cloud size={16} className="text-blue-400" />
                    <span className="text-xs font-bold text-white">{weather?.temp || "--"}°</span>
                </div>

                {/* GitHub */}
                <div className="flex items-center justify-center px-1 pr-3 border-r border-white/10">
                    <Github size={16} className="text-zinc-400" />
                </div>

                {/* Code */}
                <div className="flex items-center gap-2">
                    <Code size={16} className="text-purple-400" />
                    <span className="text-xs font-medium text-zinc-400">{codingTotal !== "0h 0m" && codingTotal !== "0s" ? codingTotal : "0s"}</span>
                </div>
            </motion.div>
        </div>
    );
}
