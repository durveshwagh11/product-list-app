import { create } from "zustand";

// theme goes on <html> so body, modals and dropdowns all pick it up
const applyTheme = (theme) => document.documentElement.setAttribute("data-theme", theme);

const initialTheme = localStorage.getItem("preferred-theme") || "midnight";
applyTheme(initialTheme);

export const useThemeStore = create((set) => ({
  theme: initialTheme,
  setTheme: (theme) => {
    localStorage.setItem("preferred-theme", theme);
    applyTheme(theme);
    set({ theme });
  },
}));
