import { create } from "zustand";

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  // Check local storage or system preference on load
  const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const storedTheme = localStorage.getItem("theme");
  const initialDark = storedTheme === "dark" || (!storedTheme && isSystemDark);

  if (initialDark) {
    document.documentElement.classList.add("dark");
  }

  return {
    isDark: initialDark,
    toggleTheme: () => set((state) => {
      const newIsDark = !state.isDark;
      if (newIsDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return { isDark: newIsDark };
    }),
  };
});
