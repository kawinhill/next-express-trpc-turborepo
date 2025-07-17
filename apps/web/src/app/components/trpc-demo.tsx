"use client";

import { Button } from "@monorepo/ui/components/button";
import { Card, CardContent, CardHeader } from "@monorepo/ui/components/card";
import { Input } from "@monorepo/ui/components/input";
import { Label } from "@monorepo/ui/components/label";
import { CheckCircle, Loader2, Send, XCircle, Zap } from "lucide-react";
import { useState } from "react";

import { useLocale } from "../../providers/locale-provider";
import { useErrorLocalization } from "../../utils/error-localization";
import { trpc } from "../../utils/trpc";

const TRPCDemo = () => {
  const { t } = useLocale();
  const { getLocalizedError } = useErrorLocalization();
  const [name, setName] = useState("");

  const {
    data: greeting,
    error,
    isLoading,
    refetch,
  } = trpc.hello.useQuery(
    { name: name || "World" },
    {
      enabled: false,
      retry: 2,
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const getStatusColor = () => {
    if (isLoading)
      return "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20";
    if (error)
      return "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20";
    return "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20";
  };

  const getStatusBadge = () => {
    const baseClasses =
      "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide flex-shrink-0";
    if (isLoading)
      return `${baseClasses} bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300`;
    if (error)
      return `${baseClasses} bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300`;
    return `${baseClasses} bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300`;
  };

  return (
    <Card
      className={`border-2 transition-all duration-300 ${getStatusColor()}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg flex-shrink-0">
              <Zap className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t("components.trpcDemo.title")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("components.trpcDemo.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            {isLoading && (
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            )}
            {!isLoading && !error && greeting && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            {error && <XCircle className="w-5 h-5 text-red-500" />}
            <span className={getStatusBadge()}>
              {isLoading
                ? t("components.trpcDemo.loading")
                : error
                  ? t("components.trpcDemo.failed")
                  : t("components.trpcDemo.connected")}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="name">
              {t("components.trpcDemo.enterName")}
            </Label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                disabled={isLoading}
                id="name"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                placeholder={t("components.trpcDemo.namePlaceholder")}
                type="text"
                value={name}
              />
              <Button
                className="px-4 py-2 flex items-center gap-2"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {t("components.trpcDemo.send")}
              </Button>
            </div>
          </div>
        </form>

        {isLoading && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>{t("components.trpcDemo.callingEndpoint")}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full animate-pulse"
                style={{ width: "70%" }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-700 dark:text-red-300 font-medium">
                {t("components.trpcDemo.callFailed")}
              </span>
            </div>

            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>{t("common.error")}:</strong> {getLocalizedError(error)}
              </p>
            </div>
          </div>
        )}

        {greeting && !isLoading && !error && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-700 dark:text-green-300 font-medium">
                {t("components.trpcDemo.responseReceived")}
              </span>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-lg text-green-700 dark:text-green-300 font-medium">
                {greeting.greeting}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {t("components.trpcDemo.timestamp")}:{" "}
                {new Date(greeting.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TRPCDemo;
