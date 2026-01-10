"use client";

import { useThemeStore, THEME_COLORS, PrimaryColor } from "@/store/themeStore";
import { Moon, Sun, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ColorSwitcher() {
    const { isDarkMode, toggleDarkMode, primaryColor, setPrimaryColor } = useThemeStore();
    const [isOpen, setIsOpen] = useState(false);

    // Toggle palette menu
    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Toggle Dark Mode"
            >
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Color Palette Toggle */}
            <div className="relative">
                <button
                    onClick={toggleMenu}
                    className={cn(
                        "p-2 rounded-full hover:bg-white/10 transition-colors",
                        isOpen && "bg-white/10"
                    )}
                    aria-label="Change Color Theme"
                >
                    <Palette size={20} style={{ color: THEME_COLORS[primaryColor] }} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="absolute right-0 mt-2 p-3 rounded-xl glass shadow-xl grid grid-cols-5 gap-3 z-50 min-w-[220px] justify-items-center"
                        >
                            {(Object.keys(THEME_COLORS) as PrimaryColor[]).map((color) => (
                                <button
                                    key={color}
                                    onClick={() => {
                                        setPrimaryColor(color);
                                        // Optional: close on select, or keep open
                                    }}
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                                        primaryColor === color ? "border-white scale-110" : "border-transparent"
                                    )}
                                    style={{ backgroundColor: THEME_COLORS[color] }}
                                    title={color}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
