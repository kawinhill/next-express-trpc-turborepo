"use client";

import type { GetTestResponse } from "@monorepo/types";
import { Card, CardContent, CardHeader } from "@monorepo/ui/components/card";
import { cn } from "@monorepo/utils/styles";
import { Loader2, CheckCircle, XCircle, Zap, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getApiUrl } from "../../config";
import { useLocale } from "../../providers/locale-provider";

interface ApiResponse {
  success: boolean;
  data?: GetTestResponse;
  error?: {
    message: string;
    details?: any;
  };
  timestamp: string;
}

const GetTest = () => {
  const { t } = useLocale();
  const [test, setTest] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        setError(null);

        const startTime = Date.now();
        const apiUrl = getApiUrl("test");
        const response = await fetch(apiUrl);
        const endTime = Date.now();

        setResponseTime(endTime - startTime);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (!result.success) {
          throw new Error(result.error?.message || "API request failed");
        }

        setTimeout(() => {
          setTest(result.data?.message || "No message received");
          setLoading(false);
        }, 1000);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchTest();
  }, []);

  const getStatusColor = () => {
    if (loading)
      return "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20";
    if (error)
      return "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20";
    return "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20";
  };

  const getStatusBadge = () => {
    const baseClasses =
      "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide flex-shrink-0";
    if (loading)
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
                {t("components.apiTest.title")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("components.apiTest.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            {loading && (
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            )}
            {!loading && !error && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            {error && <XCircle className="w-5 h-5 text-red-500" />}
            <span className={getStatusBadge()}>
              {loading
                ? t("components.apiTest.testing")
                : error
                  ? t("components.apiTest.failed")
                  : t("components.apiTest.success")}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {loading ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>{t("components.apiTest.testingConnection")}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full animate-pulse"
                style={{ width: "60%" }}
              />
            </div>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-700 dark:text-red-300 font-medium">
                {t("components.apiTest.connectionFailed")}
              </span>
            </div>

            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>{t("common.error")}:</strong> {error}
              </p>
            </div>

            <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg border">
              <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                {t("components.apiTest.failed")}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                API Status
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-700 dark:text-green-300 font-medium">
                {t("components.apiTest.connectionSuccessful")}
              </span>
            </div>

            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300">
                <strong>{t("components.apiTest.response")}:</strong> {test}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg border">
                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                  {responseTime}ms
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  {t("components.apiTest.responseTime")}
                </div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg border">
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  200 OK
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {t("components.apiTest.httpStatus")}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GetTest;
