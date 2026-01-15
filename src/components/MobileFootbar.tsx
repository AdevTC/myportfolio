"use client";

import { useFloatingComponents, WidgetId } from "@/context/FloatingComponentContext";
import { MessageCircle, TerminalSquare, Gamepad2, Github, Activity, Download, Heart, Share2, LayoutGrid, Eye, MessageSquare, Star, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import DownloadCV from "./DownloadCV";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePortfolioStats } from "@/hooks/usePortfolioStats";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function MobileFootbar() {
    const { toggleWidget, isWidgetOpen } = useFloatingComponents();
    const { views, comments, rating, clicks } = usePortfolioStats();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleClickCounter = async () => {
        const ref = doc(db, "portfolio", "stats");
        updateDoc(ref, { clicks: increment(1) }).catch(console.error);
    };

    // Shared class for grid items in the menu
    const menuItemClass = "flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 active:scale-95 duration-75";

    // Stat Item component for the bar
    const StatItem = ({ icon: Icon, value, label }: { icon: any, value: string | number, label: string }) => (
        <div className="flex flex-col items-center justify-center gap-1 flex-1 min-w-0" title={label}>
            <Icon size={20} className="text-zinc-400" />
            <span className="text-[10px] font-bold text-zinc-400 truncate w-full text-center">{value}</span>
        </div>
    );

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] pb-safe-area">
            {/* Tools Menu Dropdown (Bottom Sheet style) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 100 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 50) setIsMenuOpen(false);
                        }}
                        className="absolute bottom-20 left-4 right-4 bg-[#0f121b]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-4 grid grid-cols-3 gap-3 z-50 pointer-events-auto max-h-[70vh] overflow-y-auto"
                    >
                        {/* 1. Share */}
                        <ShareButton className={menuItemClass} variant="custom">
                            <Share2 size={24} className="text-zinc-400 group-hover:text-white" />
                            <span className="text-xs font-medium text-zinc-300">Compartir</span>
                        </ShareButton>

                        {/* 2. CV */}
                        <DownloadCV className={menuItemClass} variant="custom">
                            <Download size={24} className="text-zinc-400 group-hover:text-white" />
                            <span className="text-xs font-medium text-zinc-300">CV</span>
                        </DownloadCV>

                        {/* 3. Widgets */}
                        {[
                            { id: "github", label: "GitHub", icon: Github },
                            { id: "codeActivity", label: "Código", icon: Activity }
                        ].map((item) => {
                            const isOpen = isWidgetOpen(item.id as WidgetId);
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        toggleWidget(item.id as WidgetId);
                                        setIsMenuOpen(false);
                                    }}
                                    className={cn(menuItemClass, isOpen && "bg-primary/10 border-primary/20")}
                                >
                                    <item.icon size={24} className={cn("text-zinc-400", isOpen && "text-primary")} />
                                    <span className={cn("text-xs font-medium text-zinc-300", isOpen && "text-primary")}>{item.label}</span>
                                </button>
                            )
                        })}

                        {/* Drag Handle Indicator */}
                        <div className="col-span-3 flex justify-center mt-2 opacity-20">
                            <div className="w-12 h-1 bg-white rounded-full" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm top-[-100vh]"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Main Bar */}
            <div className="relative z-50 bg-[#0f121b]/90 backdrop-blur-xl border-t border-white/10 px-2 py-2 pb-6 flex items-center justify-between w-full h-[70px]">

                {/* 1. Like */}
                <div className="flex-1 flex justify-center">
                    <LikeButton variant="vertical" className="p-0 bg-transparent hover:bg-transparent shadow-none scale-90" />
                </div>

                {/* 2. Stats */}
                <StatItem icon={Eye} value={views} label="Visitas" />
                <StatItem icon={MessageSquare} value={comments} label="Comentarios" />
                <StatItem icon={Star} value={rating.toFixed(1)} label="Rating" />

                {/* 3. Click Counter */}
                <button
                    onClick={handleClickCounter}
                    className="flex flex-col items-center justify-center gap-1 flex-1 min-w-0 active:scale-90 transition-transform"
                >
                    <MousePointer2 size={20} className="text-zinc-400" />
                    <span className="text-[10px] font-bold text-zinc-400">{clicks}</span>
                </button>

                {/* Divider */}
                <div className="w-px h-8 bg-white/10 mx-1" />

                {/* 4. Tools Trigger */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 flex-1 min-w-0 transition-colors",
                        isMenuOpen ? "text-primary" : "text-zinc-400 hover:text-white"
                    )}
                >
                    <LayoutGrid size={20} />
                    <span className="text-[10px] font-bold">Menú</span>
                </button>
            </div>
        </div>
    );
}
