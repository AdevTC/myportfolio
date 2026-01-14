"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    ChevronRight, ChevronLeft,
    Github, Activity, TerminalSquare, Gamepad2,
    Eye, MessageSquare, Star as StarIcon, Heart, Share2, MousePointer2
} from "lucide-react";
import { useFloatingComponents, WidgetId } from "@/context/FloatingComponentContext";
import { usePortfolioStats } from "@/hooks/usePortfolioStats";
import { cn } from "@/lib/utils";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import DownloadCV from "./DownloadCV";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DesktopSidebar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const { toggleWidget, isWidgetOpen } = useFloatingComponents();
    const { views, comments, rating, clicks } = usePortfolioStats();

    const menuItems = [
        { id: "github", label: "GitHub Live", icon: Github },
        { id: "codeActivity", label: "Coding Activity", icon: Activity },
        { id: "terminal", label: "Terminal", icon: TerminalSquare },
        { id: "game", label: "Minigame", icon: Gamepad2 },
    ];

    const handleClickCounter = async () => {
        // "Infinite clicks" - fire and forget
        const ref = doc(db, "portfolio", "stats");
        // No await needed for UI responsiveness if we trust optimistic or just don't block
        updateDoc(ref, { clicks: increment(1) }).catch(console.error);
    };

    // Shared class for all sidebar items to ensure consistency
    const itemClass = "flex items-center gap-3 p-3 rounded-xl transition-all relative group w-full cursor-pointer hover:bg-white/5 justify-start";
    const collapsedClass = "justify-center p-2";

    // Helper to render stats in collapsed (icon + tiny number) vs expanded (icon + label + value)
    const StatItem = ({ icon: Icon, value, label, subLabel }: { icon: any, value: string | number, label: string, subLabel?: string }) => {
        if (!isExpanded) {
            return (
                <div className="flex flex-col items-center justify-center gap-1 w-full py-2 hover:bg-white/5 rounded-xl transition-colors cursor-default relative group/stat" title={label}>
                    <Icon size={20} className="text-zinc-400 group-hover/stat:text-white transition-colors" />
                    <span className="text-[10px] font-medium text-zinc-400 group-hover/stat:text-white transition-colors">{value}</span>
                </div>
            )
        }
        return (
            <div className="flex items-center gap-3 p-2 rounded-xl text-zinc-400 select-none hover:bg-white/5 transition-colors w-full cursor-default">
                <Icon size={20} />
                <div className="flex flex-col leading-none">
                    <span className="text-sm font-bold text-white">{value}</span>
                    <span className="text-[10px] text-zinc-500">{subLabel || label}</span>
                </div>
            </div>
        )
    }

    // New Clicks Button Item
    const ClicksItem = () => {
        if (!isExpanded) {
            return (
                <button
                    onClick={handleClickCounter}
                    className="flex flex-col items-center justify-center gap-1 w-full py-2 hover:bg-white/5 rounded-xl transition-colors relative group/click"
                    title="Click Counter"
                >
                    <MousePointer2 size={20} className="text-zinc-400 group-hover/click:text-white transition-colors" />
                    <span className="text-[10px] font-medium text-zinc-400 group-hover/click:text-white transition-colors">{clicks}</span>
                </button>
            )
        }
        return (
            <button
                onClick={handleClickCounter}
                className="flex items-center gap-3 p-2 rounded-xl text-zinc-400 select-none hover:bg-white/5 transition-colors w-full text-left active:scale-95 duration-75"
            >
                <MousePointer2 size={20} />
                <div className="flex flex-col leading-none">
                    <span className="text-sm font-bold text-white">{clicks}</span>
                    <span className="text-[10px] text-zinc-500">Clics Totales</span>
                </div>
            </button>
        )
    }

    return (
        <div className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col items-start gap-4">
            <motion.div
                className="bg-[#0f121b]/90 backdrop-blur-xl border rounded-2xl overflow-hidden flex flex-col transition-colors duration-300"
                initial={{ width: 64 }}
                style={{
                    borderColor: "color-mix(in srgb, var(--primary), transparent 60%)",
                    boxShadow: "0 0 20px -5px color-mix(in srgb, var(--primary), transparent 80%)"
                }}
                animate={{
                    width: isExpanded ? 240 : 64,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {/* Header / Toggle */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="h-16 w-full flex items-center justify-center hover:bg-white/5 transition-colors border-b border-white/5 relative shrink-0"
                >
                    {isExpanded ? <ChevronLeft className="text-zinc-400" /> : <ChevronRight className="text-zinc-400" />}
                </button>

                {/* 1. Live Stats Section (Top) */}
                <div className="flex flex-col gap-1 p-2 border-b border-white/5 items-center w-full">

                    {/* Like Button */}
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
                    <StatItem icon={MessageSquare} value={comments.toLocaleString()} label="Comentarios" />
                    <StatItem icon={StarIcon} value={`${rating.toFixed(1)}/5.0`} label="Valoración" />
                    <ClicksItem />
                </div>

                {/* 2. Main Actions (Share, CV) */}
                <div className="flex flex-col gap-1 p-2 border-b border-white/5 w-full">
                    {/* Share Button matched EXACTLY to menu items style */}
                    <ShareButton
                        className={cn(
                            itemClass,
                            !isExpanded && collapsedClass
                        )}
                        variant="custom"
                    >
                        <Share2 size={20} className="text-zinc-400 group-hover:text-white" />
                        {isExpanded && <span className="text-sm font-medium text-zinc-400 group-hover:text-white whitespace-nowrap">Compartir</span>}
                    </ShareButton>



                    {/* Note: DownloadCV might structure itself differently. 
                        To be safe, let's wrap it or ensure DownloadCV accepts specific class overrides nicely.
                        Looking at DownloadCV code:
                        It renders an <a> tag with some base classes. 
                        Let's use a cleaner approach: pass `isExpanded` to a wrapper or rely on `variant='ghost'` or similar if available, or just Custom styling.
                        Actually, DownloadCV component has variants. Let's just use it as a trigger.
                        Better yet, let's just make a raw <a> tag here if DownloadCV is too opinionated, 
                        OR use the existing DownloadCV with `variant="icon"` for collapsed and `variant="ghost"` for expanded?
                        Let's try to mimic the `itemClass` structure manually.
                    */}
                    <a
                        href="/cv.pdf"
                        download="CV_Adrian_Tomas_Cerda.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            itemClass,
                            !isExpanded && collapsedClass
                        )}
                        title={!isExpanded ? "Descargar CV" : undefined}
                    >
                        {/* We use Download icon for consistency */}
                        {/* Import Download from lucide-react (not imported yet, need to add import) */}
                        {/* actually we haven't imported Download, let's add it */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-download text-zinc-400 group-hover:text-white"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                        {isExpanded && <span className="text-sm font-medium text-zinc-400 group-hover:text-white whitespace-nowrap">Descargar CV</span>}
                    </a>
                </div>

                {/* 3. Widget Tools */}
                <div className="flex flex-col gap-1 p-2 w-full">
                    {menuItems.map((item) => {
                        const isOpen = isWidgetOpen(item.id as WidgetId);
                        return (
                            <button
                                key={item.id}
                                onClick={() => toggleWidget(item.id as WidgetId)}
                                className={cn(
                                    itemClass,
                                    !isExpanded && collapsedClass
                                )}
                                style={
                                    isOpen
                                        ? {
                                            backgroundColor: "color-mix(in srgb, var(--primary), transparent 85%)",
                                            color: "var(--primary)",
                                            borderLeft: "2px solid var(--primary)"
                                        }
                                        : {
                                            borderLeft: "2px solid transparent"
                                        }
                                }
                                title={!isExpanded ? item.label : undefined}
                            >
                                <item.icon size={20} className={cn(isOpen ? "" : "text-zinc-400 group-hover:text-white")} />
                                {isExpanded && <span className={cn("text-sm font-medium whitespace-nowrap", isOpen ? "" : "text-zinc-400 group-hover:text-white")}>{item.label}</span>}
                                {isOpen && !isExpanded && (
                                    <span className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-primary" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
