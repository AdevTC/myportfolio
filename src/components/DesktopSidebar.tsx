"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight, ChevronLeft,
    Github, Activity, TerminalSquare, Gamepad2,
    Eye, MessageSquare, Star as StarIcon, Heart, Share2, MousePointer2,
    LayoutGrid, Download, Minus
} from "lucide-react";
import { useFloatingComponents, WidgetId } from "@/context/FloatingComponentContext";
import { usePortfolioStats } from "@/hooks/usePortfolioStats";
import { cn } from "@/lib/utils";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DesktopSidebar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false); // New state for minimize
    const { toggleWidget, isWidgetOpen } = useFloatingComponents();
    const { views, comments, rating, clicks } = usePortfolioStats();

    const handleClickCounter = async () => {
        const ref = doc(db, "portfolio", "stats");
        updateDoc(ref, { clicks: increment(1) }).catch(console.error);
    };

    // Shared class
    const itemClass = "w-full flex items-center gap-3 p-3 rounded-xl transition-all relative group cursor-pointer hover:bg-white/10 hover:border-white/10 border border-transparent";

    // Update StatItem to allow onClick
    const StatItem = ({ icon: Icon, value, label, subLabel, onClick }: { icon: any, value: string | number, label: string, subLabel?: string, onClick?: () => void }) => {
        if (!isExpanded) {
            return (
                <div
                    onClick={onClick}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 w-full py-2 hover:bg-white/5 rounded-xl transition-colors relative group/stat",
                        onClick ? "cursor-pointer active:scale-95" : "cursor-default"
                    )}
                    title={label}
                >
                    <Icon size={20} className="text-zinc-400 group-hover/stat:text-primary transition-colors" />
                    <span className="text-[10px] font-medium text-zinc-400 group-hover/stat:text-white transition-colors">{value}</span>
                </div>
            )
        }
        return (
            <div
                onClick={onClick}
                className={cn(
                    "flex items-center gap-3 p-2 rounded-xl text-zinc-400 select-none hover:bg-white/5 transition-colors w-full",
                    onClick ? "cursor-pointer active:scale-95" : "cursor-default"
                )}
            >
                <Icon size={20} className="group-hover:text-primary transition-colors" />
                <div className="flex flex-col leading-none">
                    <span className="text-sm font-bold text-white">{value}</span>
                    <span className="text-[10px] text-zinc-500">{subLabel || label}</span>
                </div>
            </div>
        )
    }

    const ClicksItem = () => {
        if (!isExpanded) {
            return (
                <button
                    onClick={handleClickCounter}
                    className="flex flex-col items-center justify-center gap-1 w-full py-2 hover:bg-white/5 rounded-xl transition-colors relative group/click"
                    title="Click Counter"
                >
                    <MousePointer2 size={20} className="text-zinc-400 group-hover/click:text-primary transition-colors" />
                    <span className="text-[10px] font-medium text-zinc-400 group-hover/click:text-white transition-colors">{clicks}</span>
                </button>
            )
        }
        return (
            <button
                onClick={handleClickCounter}
                className="flex items-center gap-3 p-2 rounded-xl text-zinc-400 select-none hover:bg-white/5 transition-colors w-full text-left active:scale-95 duration-75"
            >
                <MousePointer2 size={20} className="group-hover:text-primary transition-colors" />
                <div className="flex flex-col leading-none">
                    <span className="text-sm font-bold text-white">{clicks}</span>
                    <span className="text-[10px] text-zinc-500">Clics Totales</span>
                </div>
            </button>
        )
    }

    return (
        <div className={cn(
            "hidden lg:flex fixed z-50 flex-col items-start gap-4 transition-all duration-500 ease-in-out",
            isMinimized ? "left-6 top-24 translate-y-0" : "left-6 top-1/2 -translate-y-1/2"
        )}>
            {/* Minimal Toggle Button (Visible when minimized) */}
            <AnimatePresence>
                {isMinimized && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setIsMinimized(false)}
                        className="w-10 h-10 rounded-xl bg-[#0f121b]/90 backdrop-blur-xl border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-primary/50 transition-all shadow-lg"
                        title="Restaurar Panel"
                    >
                        <LayoutGrid size={20} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Main Panel (Hidden when minimized) */}
            <AnimatePresence>
                {!isMinimized && (
                    <motion.div
                        className="bg-[#0f121b]/90 backdrop-blur-xl border rounded-2xl overflow-visible flex flex-col relative group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            width: isExpanded ? 240 : 64,
                        }}
                        exit={{ opacity: 0, x: -20, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{
                            borderColor: "color-mix(in srgb, var(--primary), transparent 60%)",
                            boxShadow: "0 0 20px -5px color-mix(in srgb, var(--primary), transparent 80%)"
                        }}
                    >
                        {/* Minimize Action (Absolute Top-Right) */}
                        <button
                            onClick={() => {
                                setIsExpanded(false); // Collapse first
                                setIsMinimized(true); // Then minimize
                            }}
                            className="absolute -top-3 -right-3 w-6 h-6 bg-[#0f121b] border border-white/10 rounded-full flex items-center justify-center text-zinc-500 hover:text-white hover:border-primary hover:bg-primary z-50 transition-all shadow-lg"
                            title="Minimizar panel"
                        >
                            <Minus size={14} />
                        </button>

                        {/* Hover Detection Area for Minimize Button Visibility */}
                        <div className="absolute inset-0 z-[-1] group" />

                        {/* Header / Toggle */}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="h-16 w-full flex items-center justify-center hover:bg-white/5 transition-colors border-b border-white/5 relative shrink-0 group"
                        >
                            {isExpanded ? <ChevronLeft className="text-zinc-400" /> : <ChevronRight className="text-zinc-400" />}
                        </button>

                        {/* 1. Live Stats Section (Fixed) */}
                        <div className="flex flex-col gap-1 p-2 border-b border-white/5 items-center w-full">
                            <div className={cn("flex w-full transition-colors rounded-xl", isExpanded ? "hover:bg-white/5" : "justify-center")}>
                                {isExpanded ? (
                                    <div className="flex items-center gap-3 p-2 w-full">
                                        <LikeButton variant="minimal" className="p-0 bg-transparent shadow-none" />
                                        <span className="text-[10px] text-zinc-500 ml-auto">Likes</span>
                                    </div>
                                ) : (
                                    <div className="w-full flex justify-center py-1">
                                        <LikeButton variant="vertical" className="p-0 bg-transparent shadow-none" />
                                    </div>
                                )}
                            </div>

                            <StatItem icon={Eye} value={views.toLocaleString()} label="Visitas" subLabel="Visitas Totales" />
                            <StatItem icon={MessageSquare} value={comments.toLocaleString()} label="Comentarios" onClick={() => toggleWidget("comments")} />
                            <StatItem icon={StarIcon} value={`${rating.toFixed(1)}/5.0`} label="Valoración" />
                            <ClicksItem />
                        </div>

                        {/* 2. Tools Trigger & Menu */}
                        <div className="p-2 w-full relative group/tools"
                            onMouseEnter={() => setIsToolsOpen(true)}
                            onMouseLeave={() => setIsToolsOpen(false)}
                        >
                            <button
                                className={cn(
                                    "w-full flex items-center justify-center gap-3 p-3 rounded-xl transition-all relative text-zinc-400 hover:bg-white/5 hover:text-white",
                                    isExpanded ? "justify-start" : "justify-center",
                                    isToolsOpen && "bg-white/5 text-white"
                                )}
                            >
                                <LayoutGrid size={20} />
                                {isExpanded && <span className="text-sm font-medium">Herramientas</span>}
                            </button>

                            {/* Sub-Menu / Grid */}
                            <AnimatePresence>
                                {isToolsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: -10, scale: 0.95 }}
                                        className="absolute left-full bottom-0 ml-4 w-64 p-3 bg-[#0f121b]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 grid grid-cols-2 gap-2"
                                    >
                                        {/* Share */}
                                        <ShareButton className={itemClass} variant="custom">
                                            <div className="flex flex-col items-center justify-center w-full gap-2 text-zinc-400 group-hover:text-white">
                                                <Share2 size={24} />
                                                <span className="text-xs font-medium">Compartir</span>
                                            </div>
                                        </ShareButton>

                                        {/* CV */}
                                        <a
                                            href="/cv.pdf"
                                            download="CV_Adrian_Tomas_Cerda.pdf"
                                            className={itemClass}
                                        >
                                            <div className="flex flex-col items-center justify-center w-full gap-2 text-zinc-400 group-hover:text-white">
                                                <Download size={24} />
                                                <span className="text-xs font-medium">CV</span>
                                            </div>
                                        </a>

                                        {/* Widgets */}
                                        {[
                                            { id: "github", label: "GitHub", icon: Github },
                                            { id: "codeActivity", label: "Code", icon: Activity },
                                            { id: "terminal", label: "Terminal", icon: TerminalSquare },
                                            { id: "game", label: "Minigame", icon: Gamepad2 }
                                        ].map((item) => {
                                            const isOpen = isWidgetOpen(item.id as WidgetId);
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => toggleWidget(item.id as WidgetId)}
                                                    className={cn(itemClass, isOpen && "bg-primary/10 border-primary/20")}
                                                >
                                                    <div className="flex flex-col items-center justify-center w-full gap-2 text-zinc-400 group-hover:text-white">
                                                        <item.icon size={24} className={isOpen ? "text-primary" : ""} />
                                                        <span className={cn("text-xs font-medium", isOpen && "text-primary")}>{item.label}</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
