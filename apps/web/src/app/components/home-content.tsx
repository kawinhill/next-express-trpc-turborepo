"use client";

import { Badge } from "@monorepo/ui/components/badge";
import { Card, CardContent } from "@monorepo/ui/components/card";
import { Code2, Database, Layers, Rocket, Shield, Zap } from "lucide-react";

import { useLocale } from "../../providers/locale-provider";

export function HomeContent() {
  const { t } = useLocale();

  const features = [
    {
      bgColor: "bg-blue-100 dark:bg-blue-900/50",
      color: "text-blue-600 dark:text-blue-400",
      description: t("home.features.typeScriptDesc"),
      icon: Code2,
      title: t("home.features.typeScript"),
    },
    {
      bgColor: "bg-green-100 dark:bg-green-900/50",
      color: "text-green-600 dark:text-green-400",
      description: t("home.features.monorepoDesc"),
      icon: Layers,
      title: t("home.features.monorepo"),
    },
    {
      bgColor: "bg-purple-100 dark:bg-purple-900/50",
      color: "text-purple-600 dark:text-purple-400",
      description: t("home.features.trpcDesc"),
      icon: Zap,
      title: t("home.features.trpc"),
    },
    {
      bgColor: "bg-orange-100 dark:bg-orange-900/50",
      color: "text-orange-600 dark:text-orange-400",
      description: t("home.features.nextjsDesc"),
      icon: Rocket,
      title: t("home.features.nextjs"),
    },
    {
      bgColor: "bg-red-100 dark:bg-red-900/50",
      color: "text-red-600 dark:text-red-400",
      description: t("home.features.expressDesc"),
      icon: Shield,
      title: t("home.features.express"),
    },
    {
      bgColor: "bg-indigo-100 dark:bg-indigo-900/50",
      color: "text-indigo-600 dark:text-indigo-400",
      description: t("home.features.databaseDesc"),
      icon: Database,
      title: t("home.features.database"),
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
              className="border-2 hover:shadow-lg transition-all duration-300"
              key={index}
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
