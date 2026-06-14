"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { doc, getDoc, updateDoc, increment, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

interface LikeButtonProps {
    variant?: "floating" | "minimal" | "vertical";
    className?: string;
}

export default function LikeButton({ variant = "floating", className }: LikeButtonProps) {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likeError, setLikeError] = useState<string | null>(null);
    const [showThanks, setShowThanks] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        // Listen to real-time updates
        const docRef = doc(db, "portfolio", "stats");
        const unsub = onSnapshot(docRef, (snap) => {
            if (snap.exists()) {
                setLikes(snap.data().likes || 0);
            } else {
                // Initialize if not exists
                setDoc(docRef, { likes: 0, views: 0 }, { merge: true });
            }
        });

        return () => unsub();
    }, []);

    // Listen to user changes to load their specific like status from localStorage
    useEffect(() => {
        if (!user) {
            setIsLiked(false);
            return;
        }

        const userKey = `portfolio_last_liked_time_${user.uid}`;
        const lastLikedTime = localStorage.getItem(userKey);
        if (lastLikedTime) {
            const timeDiff = Date.now() - parseInt(lastLikedTime, 10);
            if (timeDiff < 24 * 60 * 60 * 1000) {
                setIsLiked(true);
            } else {
                localStorage.removeItem(userKey);
                setIsLiked(false);
            }
        } else {
            setIsLiked(false);
        }
    }, [user]);

    const handleLike = async () => {
        if (!user) {
            triggerError("Inicia sesión para dar me gusta.");
            return;
        }

        const now = Date.now();
        const userKey = `portfolio_last_liked_time_${user.uid}`;

        // 1. Client-side check
        if (isLiked) {
            triggerError("Ya has dado me gusta hoy.");
            return;
        }

        try {
            // 2. Double-check on Firestore
            const likeDocRef = doc(db, "portfolio", "stats", "likes", user.uid);
            const likeDoc = await getDoc(likeDocRef);

            if (likeDoc.exists()) {
                const data = likeDoc.data();
                const lastLiked = data.likedAt?.toDate?.()?.getTime() || 0;
                if (now - lastLiked < 24 * 60 * 60 * 1000) {
                    setIsLiked(true);
                    localStorage.setItem(userKey, lastLiked.toString());
                    triggerError("Ya has dado me gusta hoy.");
                    return;
                }
            }

            // 3. Register like and increment counter
            await setDoc(likeDocRef, {
                likedAt: new Date(),
                userId: user.uid,
                email: user.email || "",
                name: user.displayName || ""
            });

            const docRef = doc(db, "portfolio", "stats");
            await updateDoc(docRef, {
                likes: increment(1)
            });

            // 4. Update UI & Confetti
            setIsLiked(true);
            localStorage.setItem(userKey, now.toString());

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.8, x: 0.9 }, // Bottom right
                colors: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
            });

            setShowThanks(true);
            setTimeout(() => setShowThanks(false), 3000);

        } catch (error) {
            console.error("Error updating likes:", error);
            triggerError("Error al registrar me gusta.");
        }
    };

    const triggerError = (msg: string) => {
        setLikeError(msg);
        setTimeout(() => setLikeError(null), 3000);
    };

    if (variant === "minimal") {
        return (
            <div className="relative flex items-center">
                <AnimatePresence>
                    {showThanks && (
                        <motion.span
                            key="thanks"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono rounded-lg whitespace-nowrap z-20"
                        >
                            ¡Gracias! 🎉
                        </motion.span>
                    )}
                    {likeError && (
                        <motion.span
                            key="error"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-mono rounded-lg whitespace-nowrap z-20"
                        >
                            {likeError}
                        </motion.span>
                    )}
                </AnimatePresence>
                <button
                    onClick={handleLike}
                    className={cn(
                        "flex items-center gap-2 p-2 rounded-lg transition-colors group/like", 
                        isLiked ? "text-red-500" : "text-white hover:bg-white/10",
                        className
                    )}
                >
                    <Heart size={20} fill={isLiked ? "currentColor" : "none"} className={cn("transition-transform duration-200 group-active/like:scale-125", isLiked ? "text-red-500" : "text-white")} />
                    <span className="text-sm font-bold">{likes}</span>
                </button>
            </div>
        );
    }

    if (variant === "vertical") {
        return (
            <div className="relative flex flex-col items-center">
                <AnimatePresence>
                    {showThanks && (
                        <motion.span
                            key="thanks"
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 5 }}
                            className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono rounded-lg whitespace-nowrap z-20"
                        >
                            ¡Gracias! 🎉
                        </motion.span>
                    )}
                    {likeError && (
                        <motion.span
                            key="error"
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 5 }}
                            className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-mono rounded-lg whitespace-nowrap z-20"
                        >
                            {likeError}
                        </motion.span>
                    )}
                </AnimatePresence>
                <button
                    onClick={handleLike}
                    className={cn(
                        "flex flex-col items-center gap-1 min-w-[50px] transition-colors group/like", 
                        isLiked ? "text-red-500" : "text-zinc-400 hover:text-white",
                        className
                    )}
                >
                    <Heart 
                        size={20} 
                        fill={isLiked ? "currentColor" : "none"} 
                        className={cn(
                            "transition-transform duration-200 group-active/like:scale-125",
                            isLiked ? "text-red-500 fill-red-500" : "text-zinc-400 group-hover/like:text-white"
                        )} 
                    />
                    <span className="text-[10px] font-medium">{likes > 999 ? '999+' : likes}</span>
                </button>
            </div>
        );
    }

    return (
        <div className={cn("fixed bottom-8 right-8 z-40 lg:hidden", className)}>
            <AnimatePresence>
                {showThanks && (
                    <motion.div
                        key="thanks"
                        initial={{ opacity: 0, y: 10, x: -20 }}
                        animate={{ opacity: 1, y: 0, x: -20 }}
                        exit={{ opacity: 0, y: 10, x: -20 }}
                        className="absolute bottom-full mb-3 right-0 whitespace-nowrap bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold py-1.5 px-3 rounded-full shadow-lg backdrop-blur-md"
                    >
                        ¡Gracias por el apoyo! 🎉
                    </motion.div>
                )}
                {likeError && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 10, x: -20 }}
                        animate={{ opacity: 1, y: 0, x: -20 }}
                        exit={{ opacity: 0, y: 10, x: -20 }}
                        className="absolute bottom-full mb-3 right-0 whitespace-nowrap bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold py-1.5 px-3 rounded-full shadow-lg backdrop-blur-md"
                    >
                        {likeError}
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
