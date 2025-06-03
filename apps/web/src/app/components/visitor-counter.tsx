"use client";

import { Card, CardContent, CardHeader } from "@monorepo/ui/components/card";
import { Badge } from "@monorepo/ui/components/badge";
import { Button } from "@monorepo/ui/components/button";
import { Users, Plus, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { useLocale } from "../../providers/locale-provider";

const VisitorCounter = () => {
  const { t } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  const {
    data: visitorData,
    isLoading,
    error,
    refetch,
  } = trpc.getVisitorCount.useQuery();

  const incrementMutation = trpc.incrementVisitorCount.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    setMounted(true);

    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const handleIncrementVisit = () => {
    incrementMutation.mutate();
  };

  const handleRetry = () => {
    refetch();
  };

  const visitors = visitorData?.count ?? 0;
  const hasError = error || incrementMutation.error;
  const isIncrementing = incrementMutation.isPending;

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t("components.visitorCounter.title")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {hasError
                  ? t("components.visitorCounter.subtitleOffline")
                  : t("components.visitorCounter.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Badge
              variant="secondary"
              className={
                hasError
                  ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                  : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
              }
            >
              {hasError
                ? t("components.visitorCounter.offline")
                : t("components.visitorCounter.live")}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {hasError && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                  {t("components.visitorCounter.connectionFailed")}
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error?.message ||
                    incrementMutation.error?.message ||
                    "Unknown error"}
                </p>
              </div>
              <Button
                onClick={handleRetry}
                variant="outline"
                size="sm"
                className="ml-3 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                {t("components.visitorCounter.retry")}
              </Button>
            </div>
          </div>
        )}

        <div className="text-center p-6">
          <div className="inline-flex p-4 rounded-lg bg-blue-100 dark:bg-blue-900/50 mb-4">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <div className="w-20 h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {t("components.visitorCounter.loading")}
              </div>
            </div>
          ) : hasError ? (
            <div className="space-y-3">
              <div className="text-4xl font-bold text-slate-400 dark:text-slate-500 mb-2">
                --
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                {t("components.visitorCounter.unableToLoad")}
              </div>
            </div>
          ) : (
            <>
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {visitors.toLocaleString()}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                {t("components.visitorCounter.totalVisits")}
              </div>

              <Button
                onClick={handleIncrementVisit}
                disabled={isIncrementing || hasError !== null}
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isIncrementing ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                    {t("components.visitorCounter.loggingVisit")}
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3 mr-2" />
                    {t("components.visitorCounter.logMyVisit")}
                  </>
                )}
              </Button>
            </>
          )}

          {mounted && currentTime && (
            <div className="mt-4 text-xs text-slate-400 dark:text-slate-500">
              {t("components.visitorCounter.lastUpdated", {
                time: currentTime,
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitorCounter;
