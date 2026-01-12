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

            <div className="max-w-7xl mx-auto px-6 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-xl md:text-2xl font-medium text-primary mb-4">
                        Hola, soy
                    </h2>
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-6">
                        Adrián Tomás Cerdá
                    </h1>

                    <div className="h-20 md:h-24">
                        <p className="text-xl md:text-4xl text-muted-foreground font-light">
                            {text}
                            <span className="animate-pulse">|</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-6 mt-8">
                        <a
                            href="/projects"
                            className="group relative px-8 py-4 bg-primary text-white rounded-full font-bold overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/50"
                        >
                            <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative flex items-center gap-2">
                                Ver Proyectos <ArrowRight size={20} />
                            </span>
                        </a>

                        <a
                            href="mailto:adriantomascv@gmail.com"
                            className="px-8 py-4 border border-white/20 hover:bg-white/5 rounded-full font-bold transition-all hover:border-white/50 flex items-center gap-2"
                        >
                            Contactar <MailIcon />
                        </a>

                        <DownloadCV variant="outline" label="Descargar CV" className="px-8 py-4" />
                    </div>
                </motion.div>
            </div>

            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground flex flex-col items-center gap-2"
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
