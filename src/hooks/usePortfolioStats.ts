"use client";

import { useEffect, useState } from "react";
import { doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function usePortfolioStats() {
    const [stats, setStats] = useState({
        views: 0,
        likes: 0,
        clicks: 0,
        comments: 0,
        rating: 0,
        loading: true
    });

    useEffect(() => {
        // 1. Listen to global stats (Views & Likes)
        const statsUnsub = onSnapshot(doc(db, "portfolio", "stats"), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setStats(prev => ({
                    ...prev,
                    views: data.views || 0,
                    likes: data.likes || 0,
                    clicks: data.clicks || 0,
                }));
            }
        });

        // 2. Listen to Comments (Muro)
        const commentsUnsub = onSnapshot(collection(db, "comments"), (snapshot) => {
            const commentsCount = snapshot.size;
            let totalRating = 0;
            let ratedCount = 0;

            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.rating) {
                    totalRating += data.rating;
                    ratedCount++;
                }
            });

            const avgRating = ratedCount > 0 ? (totalRating / ratedCount) : 5; // Default to 5 if no ratings

            setStats(prev => ({
                ...prev,
                comments: commentsCount,
                rating: Number(avgRating.toFixed(1)),
                loading: false
            }));
        });

        return () => {
            statsUnsub();
            commentsUnsub();
        };
    }, []);

    return stats;
}
