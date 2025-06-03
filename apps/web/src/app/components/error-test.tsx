"use client";

import { Card, CardContent, CardHeader } from "@monorepo/ui/components/card";
import { Button } from "@monorepo/ui/components/button";
import { Label } from "@monorepo/ui/components/label";
import {
  Loader2,
  AlertTriangle,
  XCircle,
  Zap,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { useLocale } from "../../providers/locale-provider";
import {
  useErrorLocalization,
  ERROR_CODES,
} from "../../utils/error-localization";

const ErrorTest = () => {
  const { t } = useLocale();
  const { getLocalizedError, getErrorType } = useErrorLocalization();
  const [selectedErrorType, setSelectedErrorType] =
    useState<string>("GENERIC_ERROR");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { refetch, isLoading, error, isError } = trpc.testError.useQuery(
    { errorType: selectedErrorType },
    {
      enabled: false, // Don't auto-run
      retry: false, // Don't retry on error
    }
  );

  const handleTriggerError = () => {
    refetch();
  };

  const errorTypes = [
    "VALIDATION_ERROR",
    "NETWORK_ERROR",
    "SERVER_ERROR",
    "NOT_FOUND",
    "UNAUTHORIZED",
    "FORBIDDEN",
    "TOO_MANY_REQUESTS",
    "GENERIC_ERROR",
  ];

  const getStatusColor = () => {
    if (isLoading)
      return "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20";
    if (isError)
      return "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20";
    return "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20";
  };

  const handleErrorTypeSelect = (errorType: string) => {
    setSelectedErrorType(errorType);
    setIsDropdownOpen(false);
  };

  return (
    <Card
      className={`border-2 transition-all duration-300 ${getStatusColor()}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t("components.errorTest.title")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("components.errorTest.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            {isLoading && (
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            )}
            {isError && <XCircle className="w-5 h-5 text-red-500" />}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="errorType" className="text-sm font-medium">
              {t("components.errorTest.selectError")}
            </Label>
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full justify-between bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <span>{t(`errors.types.${selectedErrorType}`)}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </Button>

              {isDropdownOpen && (
                <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
                  <CardContent className="p-2">
                    {errorTypes.map((errorType) => (
                      <Button
                        key={errorType}
                        variant={
                          selectedErrorType === errorType ? "default" : "ghost"
                        }
                        size="sm"
                        onClick={() => handleErrorTypeSelect(errorType)}
                        className="w-full justify-start mb-1 last:mb-0"
                      >
                        {t(`errors.types.${errorType}`)}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Backdrop to close dropdown */}
              {isDropdownOpen && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
              )}
            </div>
          </div>

          <Button
            onClick={handleTriggerError}
            disabled={isLoading}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("components.errorTest.triggering")}
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                {t("components.errorTest.triggerError")}
              </>
            )}
          </Button>
        </div>

        {isError && error && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-700 dark:text-red-300 font-medium">
                {t("components.errorTest.errorOccurred")}
              </span>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {getErrorType(error)}
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  <strong>{t("common.error")}:</strong>{" "}
                  {getLocalizedError(error)}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  Raw error: {error.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {!isError && !isLoading && (
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t("components.errorTest.noError")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ErrorTest;
