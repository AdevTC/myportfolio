"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import DownloadCV from "./DownloadCV";

export default function Hero() {
    const [text, setText] = useState("");
    const fullText = "Ingeniero de Software | SAP Cloud & BTP Developer | Full Stack Integrator";
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(50);
    const [shineKey, setShineKey] = useState(0);

    const triggerShine = () => {
        setShineKey(prev => prev + 1);
    };

    useEffect(() => {
        const handleType = () => {
            // Simple typewriter logic implementation
            const i = loopNum % 1; // Just one text for now, but keeping logic expandable
            const fullTextStr = fullText;

            setText(isDeleting
                ? fullTextStr.substring(0, text.length - 1)
                : fullTextStr.substring(0, text.length + 1)
            );

            if (!isDeleting && text === fullTextStr) {
                setTimeout(() => setIsDeleting(true), 2000); // Pause at end
            } else if (isDeleting && text === "") {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleType, isDeleting ? 30 : 50);
        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum]);

    return (
        <section className="min-h-screen flex flex-col justify-center relative pt-20 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[100px] -z-10 animate-blob" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -z-10 animate-blob animation-delay-2000" />

            <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                {/* Left Column: Text & CTAs */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl"
                >
                    <h2 className="text-xl md:text-2xl font-medium text-primary mb-4">
                        Hola, soy
                    </h2>
                    <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold tracking-tight mb-6 text-white">
                        Adrián Tomás Cerdá
                    </h1>

                    <div className="h-24 md:h-28">
                        <p className="text-xl md:text-3xl xl:text-4xl text-muted-foreground font-light leading-relaxed">
                            {text}
                            <span className="animate-pulse text-primary font-bold">|</span>
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 mt-8 w-full">
                        <a
                            href="/projects"
                            className="group relative w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-full font-bold overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/50 flex justify-center items-center"
                        >
                            <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative flex items-center gap-2">
                                Ver Proyectos <ArrowRight size={20} />
                            </span>
                        </a>

                        <div className="flex gap-4 w-full sm:w-auto justify-center">
                            <a
                                href="mailto:adriantomascv@gmail.com"
                                className="flex-1 sm:flex-none justify-center px-8 py-4 border border-white/20 hover:bg-white/5 rounded-full font-bold transition-all hover:border-white/50 flex items-center gap-2"
                            >
                                Contactar <MailIcon />
                            </a>

                            <DownloadCV
                                variant="outline"
                                label="CV"
                                className="flex-1 sm:flex-none justify-center px-8 py-4"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Profile Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex justify-center items-center relative shrink-0 group/img"
                >
                    {/* Glow behind image matching theme color */}
                    <div 
                        style={{ backgroundColor: "color-mix(in srgb, var(--primary) 20%, transparent)" }}
                        className="absolute inset-0 rounded-full blur-3xl scale-95 animate-pulse duration-[8s] transition-all duration-500 group-hover/img:scale-110 group-hover/img:bg-primary/30" 
                    />

                    {/* Animated Floating Container */}
                    <motion.div
                        animate={{ y: [-8, 8, -8] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        whileHover={{ scale: 1.05, rotate: 1.5 }}
                        onMouseEnter={triggerShine}
                        onClick={triggerShine}
                        style={{ 
                            backgroundColor: "color-mix(in srgb, var(--primary) 12%, transparent)",
                            borderColor: "color-mix(in srgb, var(--primary) 20%, transparent)"
                        }}
                        className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] rounded-full border p-2.5 backdrop-blur-xl shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-primary/50 cursor-pointer"
                    >
                        <img
                            src="/brand/FOTILLO.png"
                            alt="Adrián Tomás Cerdá"
                            className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover/img:scale-105"
                        />

                        {/* Haz de Luz (Shine/Sweep Effect) - Disparado en hover y clic (móvil/escritorio) */}
                        {shineKey > 0 && (
                            <motion.div 
                                key={shineKey}
                                style={{
                                    background: "linear-gradient(120deg, transparent 30%, color-mix(in srgb, var(--primary) 45%, transparent) 50%, transparent 70%)"
                                }}
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="absolute inset-0 w-full h-full pointer-events-none"
                            />
                        )}
                    </motion.div>
                </motion.div>
            </div>

            <motion.div
                className="mt-16 mb-24 md:mb-0 md:absolute md:bottom-10 md:left-1/2 md:-translate-x-1/2 text-muted-foreground flex flex-col items-center gap-2 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 2, duration: 2, repeat: Infinity }}
            >
                <span className="text-xs uppercase tracking-widest text-white/30">Scroll Down</span>
                <ChevronDown size={24} />
            </motion.div>
        </section>
    );
}

function MailIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
    )
}
