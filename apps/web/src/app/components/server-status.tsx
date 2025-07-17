"use client";

import { Badge } from "@monorepo/ui/components/badge";
import { Card, CardContent, CardHeader } from "@monorepo/ui/components/card";
import {
  CheckCircle,
  Database,
  Loader2,
  Server,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

import { getApiUrl } from "../../config";
import { useLocale } from "../../providers/locale-provider";
import { trpc } from "../../utils/trpc";

interface StatusCheck {
  icon: React.ComponentType<{ className?: string }>;
  message?: string;
  name: string;
  responseTime?: number;
  status: "error" | "loading" | "success";
}

const ServerStatus = () => {
  const { t } = useLocale();

  const [checks, setChecks] = useState<StatusCheck[]>([
    { icon: Server, name: t("systemStatus.apiServer.name"), status: "loading" },
    { icon: Zap, name: t("systemStatus.trpcEndpoint.name"), status: "loading" },
    {
      icon: Database,
      name: t("systemStatus.database.name"),
      status: "loading",
    },
  ]);

  const utils = trpc.useUtils();

  useEffect(() => {
    const runChecks = async () => {
      const updatedChecks = [...checks];

      // API Server Check
      try {
        const startTime = Date.now();
        const response = await fetch(getApiUrl("test"));
        const endTime = Date.now();

        if (response.ok && updatedChecks[0]) {
          updatedChecks[0] = {
            icon: updatedChecks[0].icon,
            message: t("systemStatus.apiServer.responding"),
            name: updatedChecks[0].name,
            responseTime: endTime - startTime,
            status: "success",
          };
        } else if (updatedChecks[0]) {
          updatedChecks[0] = {
            icon: updatedChecks[0].icon,
            message: `HTTP ${response.status}`,
            name: updatedChecks[0].name,
            status: "error",
          };
        }
      } catch (error) {
        if (updatedChecks[0]) {
          updatedChecks[0] = {
            icon: updatedChecks[0].icon,
            message: t("systemStatus.apiServer.connectionFailed"),
            name: updatedChecks[0].name,
            status: "error",
          };
        }
      }

      // tRPC Check
      try {
        const startTime = Date.now();
        const result = await utils.hello.fetch({ name: "Health Check" });
        const endTime = Date.now();

        if (result && result.greeting && updatedChecks[1]) {
          updatedChecks[1] = {
            icon: updatedChecks[1].icon,
            message: t("systemStatus.trpcEndpoint.responding"),
            name: updatedChecks[1].name,
            responseTime: endTime - startTime,
            status: "success",
          };
        } else if (updatedChecks[1]) {
          updatedChecks[1] = {
            icon: updatedChecks[1].icon,
            message: t("systemStatus.trpcEndpoint.invalidResponse"),
            name: updatedChecks[1].name,
            status: "error",
          };
        }
      } catch (error) {
        if (updatedChecks[1]) {
          updatedChecks[1] = {
            icon: updatedChecks[1].icon,
            message:
              error instanceof Error
                ? error.message
                : t("systemStatus.trpcEndpoint.unavailable"),
            name: updatedChecks[1].name,
            status: "error",
          };
        }
      }

      // Database Check
      try {
        const startTime = Date.now();
        const result = await utils.getVisitorCount.fetch();
        const endTime = Date.now();

        if (result && typeof result.count === "number" && updatedChecks[2]) {
          updatedChecks[2] = {
            icon: updatedChecks[2].icon,
            message: t("systemStatus.database.connected"),
            name: updatedChecks[2].name,
            responseTime: endTime - startTime,
            status: "success",
          };
        } else if (updatedChecks[2]) {
          updatedChecks[2] = {
            icon: updatedChecks[2].icon,
            message: t("systemStatus.database.invalidResponse"),
            name: updatedChecks[2].name,
            status: "error",
          };
        }
      } catch (error) {
        if (updatedChecks[2]) {
          updatedChecks[2] = {
            icon: updatedChecks[2].icon,
            message:
              error instanceof Error
                ? error.message
                : t("systemStatus.database.unreachable"),
            name: updatedChecks[2].name,
            status: "error",
          };
        }
      }

      setChecks(updatedChecks);
    };

    runChecks();
  }, [utils, t]);

  const getOverallStatus = () => {
    const hasError = checks.some((check) => check.status === "error");
    const isLoading = checks.some((check) => check.status === "loading");

    if (isLoading) return "loading";
    if (hasError) return "error";
    return "success";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "loading":
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "error":
        return (
          <Badge
            className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
            variant="secondary"
          >
            {t("systemStatus.status.offline")}
          </Badge>
        );
      case "loading":
        return (
          <Badge
            className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
            variant="secondary"
          >
            {t("systemStatus.status.checking")}
          </Badge>
        );
      case "success":
        return (
          <Badge
            className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
            variant="secondary"
          >
            {t("systemStatus.status.online")}
          </Badge>
        );
      default:
        return null;
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {checks.map((check, index) => {
        const IconComponent = check.icon;
        return (
          <Card className="border-2 transition-all duration-300" key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <IconComponent className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {check.name}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(check.status)}
                  {getStatusBadge(check.status)}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {check.message || t("systemStatus.status.checkingStatus")}
                </p>
                {check.responseTime !== undefined && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t("systemStatus.status.responseTime", {
                      time: check.responseTime,
                    })}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ServerStatus;
