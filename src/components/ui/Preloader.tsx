"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Terminal, Fingerprint, Scan, Focus, Aperture } from "lucide-react";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [variant, setVariant] = useState<number>(0);
    const [text, setText] = useState("");

    // Cyber Text
    const fullText = "System.initialize({ portfolio: true });";

    // Scroll Lock Effect - DEPENDS ON isLoading
    useEffect(() => {
        if (isLoading) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isLoading]);

    // Animation Logic
    useEffect(() => {
        // 1. Pick a random variant (1 to 5)
        const v = Math.floor(Math.random() * 5) + 1;
        setVariant(v);

        let timer: NodeJS.Timeout;
        const finish = (delay: number) => {
            timer = setTimeout(() => {
                setIsLoading(false);
            }, delay);
        };

        if (v === 1) { // Cyber Terminal
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < fullText.length) {
                    setText(fullText.substring(0, i + 1));
                    i++;
                } else {
                    clearInterval(typingInterval);
                    finish(800);
                }
            }, 40);
            return () => {
                clearInterval(typingInterval);
                if (timer) clearTimeout(timer);
            };
        } else {
            finish(2500);
            return () => {
                if (timer) clearTimeout(timer);
            };
        }
    }, []);

    if (!isLoading) return null;

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <>
                    {/* VARIANT 1: CYBER TERMINAL */}
                    {variant === 1 && (
                        <motion.div
                            key="v1"
                            className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden font-mono"
                            exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                        >
                            <div className="relative z-10 flex flex-col items-center gap-6">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-24 h-24 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-primary/20 blur-xl opacity-50" />
                                    <Code2 size={48} className="text-white relative z-10" />
                                </motion.div>
                                <div className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                                    <span className="text-primary">{">"}</span>
                                    {text}
                                    <span className="w-3 h-6 bg-primary animate-pulse" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* VARIANT 2: MINIMAL PULSE */}
                    {variant === 2 && (
                        <motion.div
                            key="v2"
                            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)", transition: { duration: 0.8 } }}
                        >
                            <div className="relative">
                                {/* Expanding Rings */}
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute inset-0 border border-white/20 rounded-full"
                                        initial={{ width: 100, height: 100, opacity: 0, left: "50%", top: "50%", x: "-50%", y: "-50%" }}
                                        animate={{
                                            width: 500, height: 500, opacity: [0, 0.5, 0],
                                        }}
                                        transition={{
                                            duration: 2,
                                            delay: i * 0.4,
                                            repeat: Infinity,
                                            ease: "easeOut"
                                        }}
                                    />
                                ))}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className="w-24 h-24 bg-white rounded-full flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(255,255,255,0.5)]"
                                >
                                    <span className="text-black font-bold text-2xl tracking-tighter">AT</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* VARIANT 3: TECH SCANNER */}
                    {variant === 3 && (
                        <motion.div
                            key="v3"
                            className="fixed inset-0 z-[9999] bg-[#020202] flex items-center justify-center overflow-hidden"
                            exit={{ x: "100%", transition: { duration: 0.5, ease: "anticipate" } }}
                        >
                            <div className="relative w-full max-w-sm h-64 border-x border-green-500/20 flex items-center justify-center">
                                {/* Scanning Line */}
                                <motion.div
                                    className="absolute top-0 left-0 right-0 h-1 bg-green-500 shadow-[0_0_20px_#22c55e]"
                                    animate={{ top: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                                />

                                <div className="flex flex-col items-center gap-4 text-green-500">
                                    <Scan size={64} />
                                    <div className="font-mono text-sm tracking-[0.3em] animate-pulse">
                                        INITIALIZING_BIO_LINK
                                    </div>
                                    <div className="flex gap-1 h-2">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-8 h-full bg-green-500/50"
                                                animate={{ opacity: [0.2, 1, 0.2] }}
                                                transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* VARIANT 4: CURTAIN REVEAL */}
                    {variant === 4 && (
                        <div key="v4" className="fixed inset-0 z-[9999] flex overflow-hidden pointer-events-none">
                            <motion.div
                                className="flex-1 bg-[#0a0a0a] flex items-center justify-end pr-2 border-r border-white/10"
                                exit={{ x: "-100%", transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }}
                            >
                                <motion.span
                                    className="text-8xl font-black text-white/5 overflow-hidden whitespace-nowrap"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    ADRI
                                </motion.span>
                            </motion.div>
                            <motion.div
                                className="flex-1 bg-[#0a0a0a] flex items-center justify-start pl-2 border-l border-white/10"
                                exit={{ x: "100%", transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }}
                            >
                                <motion.span
                                    className="text-8xl font-black text-white/5 overflow-hidden whitespace-nowrap"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    TOMÁS
                                </motion.span>
                            </motion.div>

                            <motion.div
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                            >
                                <div className="w-[1px] h-32 bg-white/50" />
                            </motion.div>
                        </div>
                    )}

                    {/* VARIANT 5: FOCUS BLUR */}
                    {variant === 5 && (
                        <motion.div
                            key="v5"
                            className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden"
                            exit={{ opacity: 0, transition: { duration: 1 } }}
                        >
                            <motion.div
                                initial={{ filter: "blur(20px)", opacity: 0, letterSpacing: "20px" }}
                                animate={{ filter: "blur(0px)", opacity: 1, letterSpacing: "5px" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="text-black text-4xl md:text-6xl font-light uppercase tracking-widest flex flex-col items-center gap-4"
                            >
                                <Aperture size={40} className="mb-4 animate-spin-slow" />
                                <span>Portfolio</span>
                                <span className="text-sm font-bold tracking-[0.5em] mt-2">2026</span>
                            </motion.div>
                        </motion.div>
                    )}
                </>
            )}
        </AnimatePresence>
    );
}

// Add custom spin for variant 5 if needed or use standard animate-spin
