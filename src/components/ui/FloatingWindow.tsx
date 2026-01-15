"use client";

import { motion, useDragControls } from "framer-motion";
import { X, Minus } from "lucide-react";
import { useFloatingComponents, WidgetId } from "@/context/FloatingComponentContext";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

interface FloatingWindowProps {
    id: WidgetId;
    title: string;
    children: React.ReactNode;
    width?: number;
    height?: number;
    className?: string;
    contentClassName?: string;
}

export default function FloatingWindow({
    id,
    title,
    children,
    width = 400,
    height = 300,
    className,
    contentClassName
}: FloatingWindowProps) {
    const { closeWidget, minimizeWidget, isWidgetMinimized } = useFloatingComponents();
    const constraintsRef = useRef(null);
    const [size, setSize] = useState({ width, height });
    const dragControls = useDragControls();

    // Handle minimization visibility
    const isMinimized = isWidgetMinimized(id);

    // Resizing Logic
    const handleResize = (e: React.PointerEvent) => {
        e.preventDefault(); // Prevent text selection
        e.stopPropagation(); // Stop event bubbling

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = size.width;
        const startHeight = size.height;

        const onPointerMove = (moveEvent: PointerEvent) => {
            const newWidth = Math.max(300, startWidth + (moveEvent.clientX - startX));
            const newHeight = Math.max(200, startHeight + (moveEvent.clientY - startY));
            setSize({ width: newWidth, height: newHeight });
        };

        const onPointerUp = () => {
            document.removeEventListener("pointermove", onPointerMove);
            document.removeEventListener("pointerup", onPointerUp);
        };

        document.addEventListener("pointermove", onPointerMove);
        document.addEventListener("pointerup", onPointerUp);
    };

    return (
        <motion.div
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={isMinimized ? { opacity: 0, scale: 0.8, pointerEvents: "none" } : { scale: 1, opacity: 1, y: 0, pointerEvents: "auto" }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className={cn(
                "fixed top-24 left-10 md:left-24 z-40 bg-[#0f121b]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-opacity duration-300",
                className
            )}
            style={{
                width: size.width,
                height: size.height,
                display: isMinimized ? 'none' : 'flex' // Ensure it's hidden from layout but kept in DOM?
                // Actually, if we use display: none, Framer Motion animate prop might conflict. 
                // Better to use visibility: hidden or opacity: 0 + pointer-events: none for "hiding" while animating.
                // But user wants "minimize button minimizes truly... saving what was written".
                // If we use display: none, it might not animate out.
                // Re-reading: "minimize truly... saving what was written". 
                // Hiding via generic CSS display: none is safest for performance if animation isn't critical on minimize.
                // Let's use the `animate` prop for smooth hide, then `style={{ display: isMinimized ? 'none' : 'flex' }}` 
                // might cut it off.
                // Let's rely on `animate` handles opacity/pointerEvents. 
                // But to allow "clicking through", we need pointer-events: none.
            }}
            onAnimationComplete={() => {
                // optional cleanup
            }}
        >
            {/* Title Bar - Drag Handle */}
            <div
                className="h-10 bg-white/5 border-b border-white/5 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing shrink-0"
                onPointerDown={(e) => {
                    dragControls.start(e);
                }}
            >
                <span className="text-sm font-medium text-zinc-300">{title}</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); minimizeWidget(id); }}
                        className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors"
                    >
                        <Minus size={14} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); closeWidget(id); }}
                        className="p-1 hover:bg-red-500/20 rounded text-zinc-400 hover:text-red-500 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className={cn("flex-1 overflow-auto custom-scrollbar p-4 relative group", contentClassName)} onPointerDown={(e) => e.stopPropagation()}>
                {children}
            </div>

            {/* Resize Handle */}
            <div
                className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-end justify-end p-1 z-50 hover:bg-white/5"
                onPointerDown={handleResize}
            >
                <div className="w-2 h-2 bg-white/20 rounded-bl-sm" />
            </div>
        </motion.div>
    );
}
