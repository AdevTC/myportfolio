"use client";

import { motion } from "framer-motion";
import { X, Minus } from "lucide-react";
import { useFloatingComponents } from "@/context/FloatingComponentContext";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface FloatingWindowProps {
    id: "weather" | "github" | "ai" | "terminal" | "stats" | "status" | "skills" | "game";
    title: string;
    children: React.ReactNode;
    width?: number;
    height?: number;
    className?: string;
}

export default function FloatingWindow({
    id,
    title,
    children,
    width = 400,
    height = 300,
    className
}: FloatingWindowProps) {
    const { closeWidget, minimizeWidget } = useFloatingComponents();
    const constraintsRef = useRef(null);

    return (
        <motion.div
            drag
            dragMomentum={false}
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className={cn(
                "fixed top-24 left-10 md:left-24 z-40 bg-[#0f121b]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden",
                className
            )}
            style={{ width, height }}
        >
            {/* Title Bar */}
            <div className="h-10 bg-white/5 border-b border-white/5 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing">
                <span className="text-sm font-medium text-zinc-300">{title}</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => minimizeWidget(id)}
                        className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors"
                    >
                        <Minus size={14} />
                    </button>
                    <button
                        onClick={() => closeWidget(id)}
                        className="p-1 hover:bg-red-500/20 rounded text-zinc-400 hover:text-red-500 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto custom-scrollbar p-4 relative group">
                {children}
            </div>
        </motion.div>
    );
}
