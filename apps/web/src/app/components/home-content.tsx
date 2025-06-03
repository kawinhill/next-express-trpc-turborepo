"use client";

import { useLocale } from "../../providers/locale-provider";
import { Badge } from "@monorepo/ui/components/badge";
import { Card, CardContent } from "@monorepo/ui/components/card";
import { Zap, Shield, Code2, Layers, Rocket, Database } from "lucide-react";

export function HomeContent() {
  const { t } = useLocale();

  const features = [
    {
      icon: Code2,
      title: t("home.features.typeScript"),
      description: t("home.features.typeScriptDesc"),
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/50",
    },
    {
      icon: Layers,
      title: t("home.features.monorepo"),
      description: t("home.features.monorepoDesc"),
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/50",
    },
    {
      icon: Zap,
      title: t("home.features.trpc"),
      description: t("home.features.trpcDesc"),
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/50",
    },
    {
      icon: Rocket,
      title: t("home.features.nextjs"),
      description: t("home.features.nextjsDesc"),
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/50",
    },
    {
      icon: Shield,
      title: t("home.features.express"),
      description: t("home.features.expressDesc"),
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/50",
    },
    {
      icon: Database,
      title: t("home.features.database"),
      description: t("home.features.databaseDesc"),
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
          {t("home.title")
            .split("\n")
            .map((line, index) => (
              <div key={index}>{line}</div>
            ))}
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
          {t("home.subtitle")}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card
              key={index}
              className="border-2 hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
