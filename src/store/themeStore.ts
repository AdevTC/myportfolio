import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PrimaryColor = 'purple' | 'blue' | 'emerald' | 'gold' | 'pink' | 'red' | 'orange' | 'teal' | 'indigo' | 'rose' | 'premium_gold' | 'silver' | 'cyan' | 'lime' | 'magenta' | 'violet';

interface ThemeState {
    primaryColor: PrimaryColor;
    isSequencing: boolean;
    setPrimaryColor: (color: PrimaryColor) => void;
    toggleSequencing: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            primaryColor: 'gold', // Default to gold as requested
            isSequencing: false,
            setPrimaryColor: (color) => set({ primaryColor: color }),
            toggleSequencing: () => set((state) => ({ isSequencing: !state.isSequencing })),
        }),
        {
            name: 'portfolio-theme',
        }
    )
);

export const THEME_COLORS: Record<PrimaryColor, string> = {
    // Light/Bright
    cyan: '#06b6d4', // Cyan is bright
    teal: '#14b8a6',
    emerald: '#10b981',
    lime: '#84cc16',
    gold: '#f59e0b',
    orange: '#f97316',

    // Mid/Vibrant
    red: '#ef4444',
    rose: '#f43f5e',
    pink: '#ec4899',
    magenta: '#d946ef',
    purple: '#8b5cf6',
    violet: '#7c3aed',
    indigo: '#6366f1',
    blue: '#3b82f6', // Changed from cyan hex to actual blue

    // Premium/Darker
    premium_gold: '#927043',
    silver: '#797f81',
};

// Manually sorted from "Light/Bright" to "Dark/Deep" visually, or spectral order
export const ORDERED_KEY_COLORS: PrimaryColor[] = [
    'cyan', 'teal', 'emerald', 'lime', 'gold', 'orange', 'red', 'rose', 'pink', 'magenta', 'purple', 'violet', 'indigo', 'blue', 'premium_gold', 'silver'
];
