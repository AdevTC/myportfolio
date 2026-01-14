"use client";

import { useFloatingComponents, WidgetId } from "@/context/FloatingComponentContext";
import { MessageCircle, TerminalSquare, Gamepad2, Github, Activity, Download, Heart, Share2, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import LikeButton from "./LikeButton";
import DownloadCV from "./DownloadCV";
import ShareButton from "./ShareButton";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function MobileFootbar() {
    const { toggleWidget } = useFloatingComponents();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const tools = [
        { id: "github", label: "Git", icon: Github },
        { id: "ai", label: "IA", icon: MessageCircle },
        { id: "codeActivity", label: "Código", icon: Activity },
        { id: "terminal", label: "Term", icon: TerminalSquare },
        { id: "game", label: "Juego", icon: Gamepad2 },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] pb-safe-area">
            {/* Tools Menu Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-24 right-4 bg-[#0f121b]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 grid grid-cols-2 gap-4 w-64 z-50 pointer-events-auto"
                    >
                        {tools.map((tool) => (
                            <button
                                key={tool.id}
                                onClick={() => {
                                    toggleWidget(tool.id as any);
                                    setIsMenuOpen(false);
                                }}
                                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                            >
                                <tool.icon size={24} className="text-primary" />
                                <span className="text-xs font-medium text-zinc-300">{tool.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop for closing menu */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            <div className="relative z-50 bg-[#0f121b]/80 backdrop-blur-xl border-t border-white/10 px-6 py-3 pb-6 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar md:justify-center">

                {/* Like Button (First) */}
                <div className="flex flex-col items-center gap-1 min-w-[50px]">
                    <LikeButton variant="vertical" className="p-0 bg-transparent hover:bg-transparent" />
                </div>

                {/* Share */}
                <div className="flex flex-col items-center gap-1 min-w-[50px]">
                    <ShareButton className="text-zinc-400 hover:text-white p-0" variant="icon" />
                    <span className="text-[10px] font-medium text-zinc-400">Share</span>
                </div>

                {/* Download CV */}
                <div className="flex flex-col items-center gap-1 min-w-[50px]">
                    <DownloadCV variant="icon" className="text-zinc-400 hover:text-white p-0 bg-transparent hover:bg-transparent shadow-none" />
                    <span className="text-[10px] font-medium text-zinc-400">CV</span>
                </div>

                <div className="w-px h-8 bg-white/10 flex-shrink-0 mx-2" />

                {/* App Grid Menu (Tools + Git) */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={cn(
                        "flex flex-col items-center gap-1 min-w-[50px] transition-colors",
                        isMenuOpen ? "text-primary" : "text-zinc-400 hover:text-white"
                    )}
                >
                    <LayoutGrid size={24} />
                    <span className="text-[10px] font-medium">Menú</span>
                </button>
            </div>
        </div>
    );
}
