"use client";

import { useEffect, useRef } from "react";
import { doc, updateDoc, increment, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ViewCounter() {
    const initialized = useRef(false);

    useEffect(() => {
        // Prevent double count in React Strict Mode (dev)
        if (initialized.current) return;
        initialized.current = true;

        if (typeof window !== "undefined") {
            const viewedSession = sessionStorage.getItem("view_counted");
            if (!viewedSession) {
                const docRef = doc(db, "portfolio", "stats");

                // Increment view
                // Increment view safely using setDoc with merge: true for initialization
                // or specific update logic.
                // Better approach:
                getDoc(docRef).then((snap) => {
                    if (snap.exists()) {
                        updateDoc(docRef, { views: increment(1) });
                    } else {
                        // If it doesn't exist, create it with initial values.
                        // WARNING: This assumes it TRULY doesn't exist.
                        // If there was a glitch, we might lose data.
                        // But if it doesn't exist, we must create it.
                        setDoc(docRef, { views: 1, likes: 0, clicks: 0 }, { merge: true });
                    }
                }).catch(err => console.error("Error updating views:", err));

                sessionStorage.setItem("view_counted", "true");
            }
        }
    }, []);

    return null;
}
