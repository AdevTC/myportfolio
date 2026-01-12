"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, TerminalSquare, BarChart3, Gamepad2, ChevronDown } from "lucide-react";
import { useFloatingComponents } from "@/context/FloatingComponentContext";

export default function TopLeftMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { toggleWidget } = useFloatingComponents();

    const menuItems = [
        { id: "terminal", label: "Terminal", icon: TerminalSquare, color: "text-green-400" },
        { id: "game", label: "Juego Secreto", icon: Gamepad2, color: "text-purple-400" },
    ] as const;

    return (
        <div className="fixed top-24 left-6 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[#0f121b]/80 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
            >
                <Grid size={18} className="text-zinc-400 group-hover:text-white transition-colors" />
                <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Aplicaciones</span>
                <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-[#0f121b]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col p-1"
                    >
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    toggleWidget(item.id);
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-left"
                            >
                                <item.icon size={16} className={item.color} />
                                <span className="text-sm text-zinc-300 font-medium">{item.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
