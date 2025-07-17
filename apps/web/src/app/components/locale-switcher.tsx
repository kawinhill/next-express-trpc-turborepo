"use client";

import { Button } from "@monorepo/ui/components/button";
import { Card, CardContent } from "@monorepo/ui/components/card";
import { ChevronDown, Globe } from "lucide-react";
import { useState } from "react";

import { useLocale } from "../../providers/locale-provider";

const LocaleSwitcher = () => {
  const { locale, setLocale, t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const locales = [
    { code: "en", name: t("locale.english") },
    { code: "th", name: t("locale.thai") },
  ] as const;

  const currentLocale = locales.find((l) => l.code === locale) || locales[0];

  const handleLocaleChange = (newLocale: "en" | "th") => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        className="flex items-center gap-2 min-w-[120px]"
        onClick={() => setIsOpen(!isOpen)}
        size="sm"
        variant="outline"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLocale.name}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>

      {isOpen && (
        <Card className="absolute top-full right-0 mt-2 w-48 z-50 shadow-lg">
          <CardContent className="p-2">
            {locales.map((loc) => (
              <Button
                className="w-full justify-start gap-3 mb-1 last:mb-0"
                key={loc.code}
                onClick={() => handleLocaleChange(loc.code)}
                size="sm"
                variant={locale === loc.code ? "default" : "ghost"}
              >
                <span>{loc.name}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default LocaleSwitcher;
