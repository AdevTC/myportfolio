"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, MessageCircle, Activity, TerminalSquare, Gamepad2, X } from "lucide-react";
import { WidgetId, useFloatingComponents } from "@/context/FloatingComponentContext";

export default function FABMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { toggleWidget } = useFloatingComponents();

    const menuItems: { id: WidgetId; label: string; icon: any; color: string }[] = [
        { id: "codeActivity", label: "Actividad Código", icon: Activity, color: "bg-purple-500" },
        { id: "terminal", label: "Terminal", icon: TerminalSquare, color: "bg-green-500" },
        { id: "game", label: "Minijuego", icon: Gamepad2, color: "bg-amber-500" },
    ];

    return (
        <div className="fixed bottom-24 right-8 z-40 flex flex-col items-end gap-3">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="flex flex-col gap-3 mb-2"
                    >
                        {menuItems.map((item, index) => (
                            <motion.button
                                key={item.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => {
                                    toggleWidget(item.id);
                                    setIsOpen(false);
                                }}
                                className="flex items-center justify-end gap-3 group"
                            >
                                <span className="bg-white px-2 py-1 rounded-md text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-zinc-800">
                                    {item.label}
                                </span>
                                <div className={`p-3 rounded-full text-white shadow-lg ${item.color} hover:brightness-110 transition-all`}>
                                    <item.icon size={20} />
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white text-black rounded-full shadow-2xl hover:bg-zinc-200 transition-colors border-2 border-transparent hover:border-zinc-300"
            >
                {isOpen ? <X size={20} /> : <MoreVertical size={20} />}
            </motion.button>
        </div>
    );
}
