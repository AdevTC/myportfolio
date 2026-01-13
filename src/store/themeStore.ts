import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PrimaryColor = 'purple' | 'blue' | 'emerald' | 'gold' | 'pink' | 'red' | 'orange' | 'teal' | 'indigo' | 'rose' | 'premium_gold' | 'silver';

interface ThemeState {
    isDarkMode: boolean;
    primaryColor: PrimaryColor;
    toggleDarkMode: () => void;
    setPrimaryColor: (color: PrimaryColor) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            isDarkMode: true, // Default to dark as requested
            primaryColor: 'purple',
            toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
            setPrimaryColor: (color) => set({ primaryColor: color }),
        }),
        {
            name: 'portfolio-theme',
        }
    )
);

export const THEME_COLORS: Record<PrimaryColor, string> = {
    purple: '#8b5cf6',
    blue: '#06b6d4',
    emerald: '#10b981',
    gold: '#f59e0b',
    pink: '#ec4899',
    red: '#ef4444',
    orange: '#f97316',
    teal: '#14b8a6',
    indigo: '#6366f1',
    rose: '#f43f5e',
    premium_gold: '#927043',
    silver: '#797f81',
};
