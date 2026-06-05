import { create } from 'zustand';

const saved = localStorage.getItem('devboard-theme');
const initialDark = saved ? saved === 'dark' : true;

if (initialDark) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

interface ThemeStore {
  dark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  dark: initialDark,
  toggle: () => set((s) => {
    const next = !s.dark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('devboard-theme', next ? 'dark' : 'light');
    return { dark: next };
  }),
}));
