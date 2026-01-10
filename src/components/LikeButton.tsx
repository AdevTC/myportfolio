"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { doc, getDoc, updateDoc, increment, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LikeButton() {
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

    return (
        <div className="fixed bottom-8 right-8 z-40">
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
