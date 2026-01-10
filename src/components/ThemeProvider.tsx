"use client";

import { useEffect, useState } from "react";
import { useThemeStore, THEME_COLORS } from "@/store/themeStore";

export default function ThemeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isDarkMode, primaryColor } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const root = document.documentElement;
        // Set Dark Mode
        if (isDarkMode) {
            root.setAttribute("data-theme", "dark");
            root.classList.add("dark");
        } else {
            root.setAttribute("data-theme", "light");
            root.classList.remove("dark");
        }

        // Set Primary Color Variable
        const colorValue = THEME_COLORS[primaryColor];
        root.style.setProperty("--primary", colorValue);
    }, [isDarkMode, primaryColor, mounted]);

    // Prevent hydration mismatch by rendering nothing until mounted
    // or just render children but without theme applied instantly (might cause flicker)
    // For standard "no flicker", Next.js recommends script injection, but standard useEffect is fine for MVP.
    if (!mounted) {
        return <>{children}</>;
    }

    return <>{children}</>;
}
