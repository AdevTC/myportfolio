"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { doc, getDoc, updateDoc, increment, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface LikeButtonProps {
    variant?: "floating" | "minimal" | "vertical";
    className?: string;
}

export default function LikeButton({ variant = "floating", className }: LikeButtonProps) {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        // Listen to real-time updates
        const docRef = doc(db, "portfolio", "stats");
        const unsub = onSnapshot(docRef, (snap) => {
            if (snap.exists()) {
                setLikes(snap.data().likes || 0);
            } else {
                // Initialize if not exists
                setDoc(docRef, { likes: 0, views: 0 });
            }
        });

        // Check local storage for liked state
        const alreadyLiked = localStorage.getItem("portfolio_liked") === "true";
        setIsLiked(alreadyLiked);

        return () => unsub();
    }, []);

    const handleLike = async () => {
        if (isLiked) return;

        try {
            setIsLiked(true);
            localStorage.setItem("portfolio_liked", "true");

            // Optimistic UI update handled by listener or local state if fast enough
            // but we rely on listener for consistency

            // Confetti Explosion
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.8, x: 0.9 }, // Bottom right
                colors: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
            });

            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 3000);

            // Update Firestore
            const docRef = doc(db, "portfolio", "stats");
            await updateDoc(docRef, {
                likes: increment(1)
            });

        } catch (error) {
            console.error("Error updating likes:", error);
            setIsLiked(false); // Revert on error
        }
    };

    if (variant === "minimal") {
        return (
            <button
                onClick={handleLike}
                className={cn("flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors", className)}
            >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "text-red-500" : "text-white"} />
                <span className="text-sm font-bold text-white">{likes}</span>
            </button>
        );
    }

    if (variant === "vertical") {
        return (
            <button
                onClick={handleLike}
                className={cn("flex flex-col items-center gap-1 min-w-[50px] text-zinc-400 hover:text-white transition-colors", className)}
            >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "text-red-500" : "text-zinc-400 hover:text-white"} />
                <span className="text-[10px] font-medium text-zinc-400">{likes > 999 ? '999+' : likes}</span>
            </button>
        );
    }

    return (
        <div className={cn("fixed bottom-8 right-8 z-40 lg:hidden", className)}>
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, x: -20 }}
                        animate={{ opacity: 1, y: 0, x: -20 }}
                        exit={{ opacity: 0, y: 10, x: -20 }}
                        className="absolute bottom-full mb-3 right-0 whitespace-nowrap bg-white text-black text-xs font-bold py-1 px-3 rounded-full shadow-lg"
                    >
                        ¡Gracias por el apoyo! 🎉
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={handleLike}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                    "p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-2",
                    isLiked ? "bg-red-500 text-white shadow-red-500/50" : "bg-primary text-white shadow-primary/50"
                )}
            >
                <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
                <span className="font-bold">{likes}</span>
            </motion.button>
        </div>
    );
}
