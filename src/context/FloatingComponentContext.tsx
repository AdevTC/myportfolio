"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type WidgetId =
    | "github"
    | "ai"
    | "terminal"
    | "skills"
    | "game"
    | "codeActivity";

interface FloatingComponentContextType {
    openWidgets: WidgetId[];
    minimizedWidgets: WidgetId[];
    toggleWidget: (id: WidgetId) => void;
    closeWidget: (id: WidgetId) => void;
    minimizeWidget: (id: WidgetId) => void;
    isWidgetOpen: (id: WidgetId) => boolean;
    isWidgetMinimized: (id: WidgetId) => boolean;
}

const FloatingComponentContext = createContext<FloatingComponentContextType | undefined>(undefined);

export function FloatingComponentProvider({ children }: { children: ReactNode }) {
    const [openWidgets, setOpenWidgets] = useState<WidgetId[]>([]);
    const [minimizedWidgets, setMinimizedWidgets] = useState<WidgetId[]>([]);

    const toggleWidget = (id: WidgetId) => {
        if (openWidgets.includes(id)) {
            if (minimizedWidgets.includes(id)) {
                // Restore
                setMinimizedWidgets(prev => prev.filter(w => w !== id));
            } else {
                // Minimize (or close? Mac dock usually minimizes on click if active, or focuses. Let's minimize)
                // Actually user said "minimize automatically". Let's standard toggle: Open <-> Close for simplicity first, 
                // or Open <-> Minimize. Let's do: If open & active -> Minimize. If minimized -> Restore. If closed -> Open.
                // For now, simple toggle: Open/Close.
                // Wait, user asked for "minimized automatically".
                // Let's implement valid "Window" behavior.
                setMinimizedWidgets(prev => [...prev, id]);
            }
        } else {
            setOpenWidgets(prev => [...prev, id]);
            setMinimizedWidgets(prev => prev.filter(w => w !== id));
        }
    };

    const closeWidget = (id: WidgetId) => {
        setOpenWidgets(prev => prev.filter(w => w !== id));
        setMinimizedWidgets(prev => prev.filter(w => w !== id));
    };

    const minimizeWidget = (id: WidgetId) => {
        if (!minimizedWidgets.includes(id)) {
            setMinimizedWidgets(prev => [...prev, id]);
        }
    };

    const isWidgetOpen = (id: WidgetId) => openWidgets.includes(id);
    const isWidgetMinimized = (id: WidgetId) => minimizedWidgets.includes(id);

    return (
        <FloatingComponentContext.Provider value={{
            openWidgets,
            minimizedWidgets,
            toggleWidget,
            closeWidget,
            minimizeWidget,
            isWidgetOpen,
            isWidgetMinimized
        }}>
            {children}
        </FloatingComponentContext.Provider>
    );
}

export function useFloatingComponents() {
    const context = useContext(FloatingComponentContext);
    if (context === undefined) {
        throw new Error("useFloatingComponents must be used within a FloatingComponentProvider");
    }
    return context;
}
