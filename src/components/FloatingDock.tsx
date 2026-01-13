"use client";

import { motion } from "framer-motion";
import {
    CloudSun,
    Github,
    Bot,
    TerminalSquare,
    BarChart3,
    Clock,
    Atom,
    Gamepad2
} from "lucide-react";
import { useFloatingComponents } from "@/context/FloatingComponentContext";
import { cn } from "@/lib/utils";

const DOCK_ITEMS = [
    { id: "weather", icon: CloudSun, label: "Clima" },
    { id: "github", icon: Github, label: "GitHub" },
    { id: "ai", icon: Bot, label: "IA Assistant" },
    { id: "terminal", icon: TerminalSquare, label: "Terminal" },
    { id: "skills", icon: Atom, label: "Skills" },
    { id: "game", icon: Gamepad2, label: "Jugar" },
] as const;

export default function FloatingDock() {
    const { toggleWidget, isWidgetOpen, isWidgetMinimized } = useFloatingComponents();

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-end gap-2 p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
            >
                {DOCK_ITEMS.map((item) => {
                    const isOpen = isWidgetOpen(item.id);
                    const isMinimized = isWidgetMinimized(item.id);

                    return (
                        <button
                            key={item.id}
                            onClick={() => toggleWidget(item.id)}
                            className="group relative flex flex-col items-center gap-1"
                        >
                            {/* Tooltip */}
                            <span className="absolute -top-10 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {item.label}
                            </span>

                            {/* Indicator Dot */}
                            {isOpen && (
                                <span className={cn(
                                    "absolute -bottom-1 w-1 h-1 rounded-full",
                                    isMinimized ? "bg-yellow-500" : "bg-primary"
                                )} />
                            )}

                            {/* Icon */}
                            <motion.div
                                whileHover={{ scale: 1.2, y: -5 }}
                                whileTap={{ scale: 0.9 }}
                                className={cn(
                                    "p-3 rounded-xl transition-colors",
                                    isOpen && !isMinimized ? "bg-white/10 text-primary" : "text-zinc-400 hover:text-white"
                                )}
                            >
                                <item.icon size={24} />
                            </motion.div>
                        </button>
                    );
                })}
            </motion.div>
        </div>
    );
}
