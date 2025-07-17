"use client";

import { Button } from "@monorepo/ui/components/button";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { useTheme } from "../../providers/theme-provider";

export function SimpleThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem]" />;
      case "light":
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
      case "system":
        return <Monitor className="h-[1.2rem] w-[1.2rem]" />;
      default:
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  const getTooltip = () => {
    switch (theme) {
      case "dark":
        return "Switch to system mode";
      case "light":
        return "Switch to dark mode";
      case "system":
        return "Switch to light mode";
      default:
        return "Toggle theme";
    }
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        className="transition-all duration-200"
        disabled
        size="icon"
        variant="outline"
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    );
  }

  return (
    <Button
      className="transition-all duration-200"
      onClick={cycleTheme}
      size="icon"
      title={getTooltip()}
      variant="outline"
    >
      {getIcon()}
      <span className="sr-only">{getTooltip()}</span>
    </Button>
  );
}
