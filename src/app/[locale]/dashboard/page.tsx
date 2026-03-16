import { useTranslations } from "next-intl";

export default function DashboardPage() {
    const t = useTranslations("dashboard");

    const stats = [
        { key: "totalViews", value: "24.5K", change: "+12.5%", up: true },
        { key: "totalPosts", value: "148", change: "+3.2%", up: true },
        { key: "totalUsers", value: "2,890", change: "+8.1%", up: true },
        { key: "activeNow", value: "34", change: "-2.4%", up: false },
    ] as const;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {t("title")}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400">{t("welcome")}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.key}
                        className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            {t(`stats.${stat.key}`)}
                        </p>
                        <div className="mt-2 flex items-end justify-between">
                            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                                {stat.value}
                            </p>
                            <span
                                className={`text-sm font-medium ${stat.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                            >
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Placeholder */}
            <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {t("recentActivity")}
                    </h2>
                </div>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 size-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-2xl text-zinc-400">
                        ◻
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400">{t("noActivity")}</p>
                </div>
            </div>
        </div>
    );
}
