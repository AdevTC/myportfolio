"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export type StatusType = "success" | "error" | "warning";

interface StatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: StatusType;
    title: string;
    message: string;
    autoCloseDuration?: number;
}

export default function StatusModal({
    isOpen,
    onClose,
    type,
    title,
    message,
    autoCloseDuration = 5000
}: StatusModalProps) {

    // Auto-close functionality
    useEffect(() => {
        if (isOpen && autoCloseDuration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDuration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, autoCloseDuration, onClose]);

    // Configuration based on type
    const config = {
        success: {
            icon: CheckCircle2,
            color: "text-green-500",
            bg: "bg-green-500/10",
            border: "border-green-500/20",
            glow: "shadow-green-500/10"
        },
        error: {
            icon: XCircle,
            color: "text-red-500",
            bg: "bg-red-500/10",
            border: "border-red-500/20",
            glow: "shadow-red-500/10"
        },
        warning: {
            icon: AlertTriangle,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            border: "border-yellow-500/20",
            glow: "shadow-yellow-500/10"
        }
    };

    const currentConfig = config[type];
    const Icon = currentConfig.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 pointer-events-none">
                    {/* Minimal Backdrop - clickable to dismiss */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={cn(
                            "relative w-full max-w-sm bg-[#0f121b] border rounded-2xl p-6 shadow-2xl pointer-events-auto overflow-hidden",
                            currentConfig.border,
                            currentConfig.glow
                        )}
                    >
                        {/* Background Decoration */}
                        <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 opacity-20 pointer-events-none", currentConfig.bg.replace('/10', '/50'))} />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex flex-col items-center text-center relative z-10">
                            {/* Icon Wrapper */}
                            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110", currentConfig.bg)}>
                                <Icon size={32} className={currentConfig.color} />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">{message}</p>

                            {/* Action Button */}
                            <button
                                onClick={onClose}
                                className={cn(
                                    "mt-6 w-full py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95",
                                    "bg-white/5 hover:bg-white/10 text-white border border-white/5"
                                )}
                            >
                                Entendido
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
