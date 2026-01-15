"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";
import { useThemeStore, THEME_COLORS, ORDERED_KEY_COLORS } from "@/store/themeStore";

export default function ThemeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { primaryColor, isSequencing, setPrimaryColor } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Sequence Mode Logic
    useEffect(() => {
        if (!isSequencing) return;

        const interval = setInterval(() => {
            const currentIndex = ORDERED_KEY_COLORS.indexOf(primaryColor);
            const nextIndex = (currentIndex + 1) % ORDERED_KEY_COLORS.length;
            setPrimaryColor(ORDERED_KEY_COLORS[nextIndex]);
        }, 5000); // 5 seconds as requested

        return () => clearInterval(interval);
    }, [isSequencing, primaryColor, setPrimaryColor]);

    // Theme Application with Smooth Transition
    useEffect(() => {
        if (!mounted) return;
        const root = document.documentElement;

        // Force Dark Mode initialization
        if (!root.getAttribute("data-theme")) {
            root.setAttribute("data-theme", "dark");
            root.classList.add("dark");
        }

        const targetColor = THEME_COLORS[primaryColor];
        const currentColor = root.style.getPropertyValue("--primary").trim() || targetColor;

        // If it's the very first render (or hydration), set instantly to avoid flash
        // Checking if currentColor is empty might help, but looking at previous logic is safer.
        // Actually, just animate. If source == target, it does nothing.

        const controls = animate(currentColor, targetColor, {
            duration: isSequencing ? 1.5 : 0.3, // Slow fade for sequence, snappy for clicks
            ease: "easeInOut",
            onUpdate: (value) => root.style.setProperty("--primary", value),
        });

        return () => controls.stop();
    }, [primaryColor, mounted, isSequencing]);

    // Prevent hydration mismatch by rendering nothing until mounted
    // or just render children but without theme applied instantly (might cause flicker)
    // For standard "no flicker", Next.js recommends script injection, but standard useEffect is fine for MVP.
    if (!mounted) {
        return <>{children}</>;
    }

    return <>{children}</>;
}
