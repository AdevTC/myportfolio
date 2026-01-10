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
                getDoc(docRef).then((snap) => {
                    if (snap.exists()) {
                        updateDoc(docRef, { views: increment(1) });
                    } else {
                        setDoc(docRef, { views: 1, likes: 0 });
                    }
                });

                sessionStorage.setItem("view_counted", "true");
            }
        }
    }, []);

    return null;
}
