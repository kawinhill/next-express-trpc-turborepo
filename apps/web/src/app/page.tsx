"use client";

import { useLocale } from "../providers/locale-provider";
import ErrorTest from "./components/error-test";
import GetTest from "./components/get-test";
import { HomeContent } from "./components/home-content";
import LocaleSwitcher from "./components/locale-switcher";
import ServerStatus from "./components/server-status";
import { SimpleThemeToggle } from "./components/simple-theme-toggle";
import TRPCDemo from "./components/trpc-demo";
import VisitorCounter from "./components/visitor-counter";

export default function Home() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 bg-[size:20px_20px] opacity-50" />

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <SimpleThemeToggle />
        <LocaleSwitcher />
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HomeContent />

        <div className="grid gap-8 lg:gap-12 mt-12">
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                {t("systemStatus.title")}
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                {t("systemStatus.subtitle")}
              </p>
            </div>
            <ServerStatus />
          </section>

          <div className="grid lg:grid-cols-2 gap-8">
            <section className="space-y-6">
              <GetTest />
            </section>

            <section className="space-y-6">
              <TRPCDemo />
            </section>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <section className="space-y-6">
              <VisitorCounter />
            </section>

            <section className="space-y-6">
              <ErrorTest />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
