"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, ArrowRight } from "lucide-react";
import { useState } from "react";

interface MeetingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MeetingModal({ isOpen, onClose }: MeetingModalProps) {
    // TODO: REPLACE THIS URL WITH YOUR REAL CALENDAR LINK (Cal.com, Calendly, etc.)
    const CALENDAR_URL = "https://cal.com/adrian-tomas-cerda-3nxv6f";

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4 sm:px-6 py-4 sm:py-0">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-5xl h-full max-h-[90vh] sm:max-h-[85vh] bg-[#0f121b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#0f121b]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Calendar className="text-primary" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">Agendar Reunión</h3>
                                    <p className="text-xs text-muted-foreground hidden sm:block">Selecciona un horario disponible</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Calendar Iframe */}
                        <div className="flex-1 w-full bg-white overflow-hidden relative">
                            {/* Fallback / Config Warning (Visible underneath iframe, or if iframe fails) */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-zinc-500 z-0">
                                <Calendar size={48} className="mb-4 opacity-20" />
                                <p className="font-medium">Cargando Calendario...</p>
                                <p className="text-sm mt-2 opacity-60">Si no carga, verifica la URL en MeetingModal.tsx</p>
                            </div>

                            <iframe
                                src={CALENDAR_URL}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                title="Agenda una reunión"
                                className="w-full h-full relative z-10"
                                allow="camera; microphone; autoplay; fullscreen"
                            ></iframe>
                        </div>

                        {/* Footer (Optional) */}
                        <div className="p-3 border-t border-white/5 bg-[#0f121b] flex justify-end">
                            <button
                                onClick={onClose}
                                className="text-xs text-muted-foreground hover:text-white transition-colors"
                            >
                                Cerrar ventana
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
