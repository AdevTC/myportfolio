"use client";

import { useState, useEffect } from "react";
import FloatingWindow from "../ui/FloatingWindow";
import { Clock, Coffee, Moon, Sun } from "lucide-react";

export default function DevStatus() {
    const [time, setTime] = useState(new Date());
    const [status, setStatus] = useState("Enfocado 👨‍💻");

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = time.getHours();
    const isNight = hours < 6 || hours > 22;

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        // In real app, sync this to Supabase
    };

    return (
        <FloatingWindow id="status" title="Estado del Desarrollador" width={300} height={200}>
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="bg-white/5 px-6 py-2 rounded-2xl border border-white/10">
                    <span className="text-4xl font-mono font-bold text-white tracking-widest">
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Hora Local</p>
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <span className="text-sm text-zinc-400">Estado Actual:</span>
                    <div className="text-lg font-bold text-primary animate-pulse">{status}</div>
                </div>

                <div className="flex gap-2 mt-2">
                    <button onClick={() => handleStatusChange("Enfocado 👨‍💻")} className="p-2 hover:bg-white/5 rounded-lg text-2xl" title="Focus">👨‍💻</button>
                    <button onClick={() => handleStatusChange("Café ☕")} className="p-2 hover:bg-white/5 rounded-lg text-2xl" title="Break">☕</button>
                    <button onClick={() => handleStatusChange("OFF 😴")} className="p-2 hover:bg-white/5 rounded-lg text-2xl" title="Sleep">😴</button>
                </div>
            </div>
        </FloatingWindow>
    );
}
