import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { StatsCardSkeleton, TableSkeleton } from "@/components/ui/Skeletons";

// Separate async component for the stats block
async function DashboardStats({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: "dashboard" });
    
    // In a real app, this would fetch from a database
    // await new Promise(resolve => setTimeout(resolve, 800)); // Simulating DB call

    const stats = [
        { key: "totalViews", value: "24.5K", change: "+12.5%", up: true },
        { key: "totalPosts", value: "148", change: "+3.2%", up: true },
        { key: "totalUsers", value: "2,890", change: "+8.1%", up: true },
        { key: "activeNow", value: "34", change: "-2.4%", up: false },
    ] as const;

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <div
                    key={stat.key}
                    className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:border-white/10 dark:bg-zinc-900/60"
                >
                    <div className="absolute -right-6 -top-6 size-24 rounded-full bg-gradient-to-br from-[var(--brand-primary)]/10 to-transparent blur-2xl" />
                    <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        {t(`stats.${stat.key}`)}
                    </p>
                    <div className="mt-4 flex items-end justify-between">
                        <p className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {stat.value}
                        </p>
                        <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                            stat.up 
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                                : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                        }`}>
                            {stat.up ? "↑" : "↓"} {stat.change}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Separate async component for recent activity
async function RecentActivity({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: "dashboard" });
    // await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating DB call

    return (
        <div className="rounded-2xl border border-white/40 bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
            <div className="border-b border-zinc-200/50 px-6 py-5 dark:border-white/5">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {t("recentActivity")}
                </h2>
            </div>
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-zinc-100/50 text-3xl text-zinc-400 shadow-inner dark:bg-zinc-800/50">
                    ✨
                </div>
                <p className="text-base font-medium text-zinc-600 dark:text-zinc-400">
                    {t("noActivity")}
                </p>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
                    {locale === "ar" ? "كل شيء هادئ في الوقت الحالي." : "Things are quiet right now."}
                </p>
            </div>
        </div>
    );
}

// Main Page component is sync to render instantly
export default async function DashboardPage() {
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: "dashboard" });

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Page Header (Renders Instantly) */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {t("title")}
                </h1>
                <p className="text-base font-medium text-zinc-500 dark:text-zinc-400">
                    {t("welcome")}
                </p>
            </div>

            {/* Stats Grid wrapped in Suspense */}
            <Suspense fallback={
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                </div>
            }>
                {/* @ts-ignore - Async Server Component */}
                <DashboardStats locale={locale} />
            </Suspense>

            {/* Recent Activity wrapped in Suspense */}
            <Suspense fallback={<TableSkeleton rowCount={3} />}>
                {/* @ts-ignore - Async Server Component */}
                <RecentActivity locale={locale} />
            </Suspense>
        </div>
    );
}
