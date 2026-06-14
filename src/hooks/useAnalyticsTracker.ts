"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";

// Helper to generate a simple unique ID
function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Helper to get device info
function getDeviceInfo() {
    if (typeof window === "undefined") return "Unknown";
    const ua = window.navigator.userAgent;
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("SamsungBrowser")) return "Samsung Browser";
    if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
    if (ua.includes("Trident")) return "Internet Explorer";
    if (ua.includes("Edge") || ua.includes("Edg")) return "Edge";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    return "Browser/Device";
}

export function useAnalyticsTracker() {
    const pathname = usePathname();
    const { user } = useAuth();
    
    const sessionIdRef = useRef<string | null>(null);
    const visitorIdRef = useRef<string | null>(null);
    const currentPathnameRef = useRef<string>(pathname);

    // Initialize visitorId and sessionId
    useEffect(() => {
        if (typeof window === "undefined") return;

        // Visitor ID persists across visits (Unique User tracking)
        let visitorId = localStorage.getItem("portfolio_visitor_id");
        if (!visitorId) {
            visitorId = "visitor_" + generateId();
            localStorage.setItem("portfolio_visitor_id", visitorId);
        }
        visitorIdRef.current = visitorId;

        // Session ID is unique per tab open
        sessionIdRef.current = "session_" + generateId();

        // Create initial session document in Firestore
        const sessionDocRef = doc(db, "sessions", sessionIdRef.current);
        const device = getDeviceInfo();

        setDoc(sessionDocRef, {
            sessionId: sessionIdRef.current,
            visitorId: visitorId,
            userId: user?.uid || "anonymous",
            email: user?.email || "anonymous",
            name: user?.displayName || "anonymous",
            device: device,
            pagesVisited: [pathname],
            startedAt: new Date(),
            lastActive: new Date(),
            duration: 0
        }).catch(err => console.error("Error creating analytics session:", err));

    }, []); // Run once on mount

    // Track path changes
    useEffect(() => {
        if (!sessionIdRef.current) return;
        currentPathnameRef.current = pathname;

        const sessionDocRef = doc(db, "sessions", sessionIdRef.current);
        setDoc(sessionDocRef, {
            pagesVisited: arrayUnion(pathname),
            lastActive: new Date()
        }, { merge: true }).catch(err => console.error("Error updating pages in analytics:", err));
    }, [pathname]);

    // Track user identity changes (e.g. logging in)
    useEffect(() => {
        if (!sessionIdRef.current) return;

        const sessionDocRef = doc(db, "sessions", sessionIdRef.current);
        setDoc(sessionDocRef, {
            userId: user?.uid || "anonymous",
            email: user?.email || "anonymous",
            name: user?.displayName || "anonymous",
            lastActive: new Date()
        }, { merge: true }).catch(err => console.error("Error updating auth in analytics:", err));
    }, [user]);

    // Track active stay duration (Interval of 15 seconds)
    useEffect(() => {
        if (typeof window === "undefined") return;

        const interval = setInterval(() => {
            if (!sessionIdRef.current) return;
            
            // Only count if page is active/focused
            if (document.visibilityState === "visible") {
                const sessionDocRef = doc(db, "sessions", sessionIdRef.current);
                setDoc(sessionDocRef, {
                    duration: increment(15),
                    lastActive: new Date()
                }, { merge: true }).catch(err => console.error("Error updating duration in analytics:", err));
            }
        }, 15000);

        // Beforeunload last-ditch update
        const handleBeforeUnload = () => {
            if (!sessionIdRef.current) return;
            
            // Fast synchronous-like update attempts
            const sessionDocRef = doc(db, "sessions", sessionIdRef.current);
            setDoc(sessionDocRef, {
                lastActive: new Date()
            }, { merge: true }).catch(err => console.error("Error on unload update:", err));
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            clearInterval(interval);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);
}
