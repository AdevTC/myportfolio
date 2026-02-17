"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Prevent scrolling while loading
        document.body.style.overflow = "hidden";

        // Wait for 1 second then hide preloader
        const timer = setTimeout(() => {
            setIsLoading(false);
            document.body.style.overflow = "";
        }, 1000);

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = "";
        };
    }, []);

    if (!isLoading) return null;

    return (
        <AnimatePresence>
            <motion.div
                key="preloader"
                className="fixed inset-0 z-[9999] bg-gradient-to-br from-gray-900 to-black flex items-center justify-center overflow-hidden"
                exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-32 h-32 md:w-40 md:h-40"
                >
                    <Image
                        src="/brand/logo.png"
                        alt="Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
