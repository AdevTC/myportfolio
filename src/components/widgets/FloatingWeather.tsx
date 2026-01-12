"use client";

import { useState, useEffect } from "react";
import FloatingWindow from "../ui/FloatingWindow";
import { CloudSun, CloudRain, Sun, Wifi, Loader2 } from "lucide-react";

export default function FloatingWeather() {
    const [loading, setLoading] = useState(true);
    const [temp, setTemp] = useState(0);
    const [location, setLocation] = useState("Localizando...");
    const [condition, setCondition] = useState("unknown");

    useEffect(() => {
        // Mock Data for now as per plan
        const timer = setTimeout(() => {
            setTemp(22);
            setLocation("Madrid, ES");
            setCondition("sunny");
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const recommendation = temp > 20
        ? "Buen día para programar en la terraza ☀️"
        : "Perfecto para un café y código ☕";

    return (
        <FloatingWindow id="weather" title="Clima Local" width={300} height={200}>
            {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-2 text-zinc-500">
                    <Loader2 className="animate-spin" />
                    <span className="text-xs">Consultando satélites...</span>
                </div>
            ) : (
                <div className="flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-4xl font-bold text-white">{temp}°</h2>
                            <p className="text-zinc-400 text-sm flex items-center gap-2">
                                <Wifi size={12} className="text-green-500" /> {location}
                            </p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-full">
                            {condition === "sunny" ? <Sun className="text-yellow-400" size={32} /> : <CloudRain className="text-blue-400" />}
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-xs text-zinc-300 font-medium">
                            {recommendation}
                        </p>
                    </div>
                </div>
            )}
        </FloatingWindow>
    );
}
