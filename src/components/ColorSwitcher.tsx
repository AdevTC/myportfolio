"use client";

import { useThemeStore, THEME_COLORS, ORDERED_KEY_COLORS } from "@/store/themeStore";
import { Palette, Play, Pause, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ColorSwitcher() {
    const { primaryColor, setPrimaryColor, isSequencing, toggleSequencing } = useThemeStore();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex items-center gap-4">
            {/* Color Palette Toggle - Hover Interaction */}
            <div
                className="relative"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                <div
                    className={cn(
                        "p-2 rounded-full transition-colors cursor-pointer",
                        isOpen ? "bg-white/10" : "hover:bg-white/10"
                    )}
                    aria-label="Change Color Theme"
                >
                    <Palette size={20} style={{ color: THEME_COLORS[primaryColor] }} />
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="absolute right-0 mt-2 p-4 rounded-2xl glass shadow-xl border border-white/10 z-50 min-w-[280px]"
                        >
                            <div className="flex flex-col gap-4">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Colores</span>

                                    {/* Sequence Mode Toggle */}
                                    <button
                                        onClick={toggleSequencing}
                                        className={cn(
                                            "flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold transition-all border",
                                            isSequencing
                                                ? "bg-primary/20 text-primary border-primary/50 animate-pulse"
                                                : "bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10"
                                        )}
                                        title="Cambiar color cada 5s"
                                    >
                                        {isSequencing ? <Pause size={10} /> : <Play size={10} />}
                                        {isSequencing ? "Secuencia ON" : "Secuencia"}
                                    </button>
                                </div>

                                {/* Grid */}
                                <div className="grid grid-cols-6 gap-2 justify-items-center">
                                    {ORDERED_KEY_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setPrimaryColor(color)}
                                            className={cn(
                                                "w-6 h-6 rounded-full transition-transform hover:scale-125 relative group",
                                                primaryColor === color ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#0f121b]" : ""
                                            )}
                                            style={{ backgroundColor: THEME_COLORS[color] }}
                                            title={color}
                                        >
                                            {primaryColor === color && (
                                                <motion.div
                                                    layoutId="activeColor"
                                                    className="absolute inset-0 rounded-full bg-white/30"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="text-[10px] text-zinc-500 text-center pt-1 italic">
                                    Elige tu estilo visual
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
