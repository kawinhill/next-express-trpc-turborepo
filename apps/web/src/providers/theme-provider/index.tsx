"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderContextType {
  setTheme: (theme: Theme) => void;
  theme: Theme;
}

const ThemeProviderContext = createContext<
  ThemeProviderContextType | undefined
>(undefined);

export function ThemeProvider({
  attribute: _attribute = "class",
  children,
  enableSystem: _enableSystem = true,
  ...props
}: {
  attribute?: string;
  children: ReactNode;
  enableSystem?: boolean;
}) {
  // Mark props as used
  const _props = props;
  const [theme, setThemeState] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Get theme from localStorage or default to system
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme && ["dark", "light", "system"].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Always provide the context, even when not mounted
  return (
    <ThemeProviderContext.Provider value={{ setTheme, theme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
