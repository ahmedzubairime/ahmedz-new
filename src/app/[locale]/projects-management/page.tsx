import { useTranslations } from "next-intl";

export default function ProjectsPage() {
    const t = useTranslations("projects");

    const stats = [
        { key: "totalProjects", value: "12" },
        { key: "activeTasks", value: "34" },
        { key: "teamMembers", value: "8" },
        { key: "completed", value: "67%" },
    ] as const;

    const columns = ["todo", "inProgress", "review", "done"] as const;
    const columnColors = {
        todo: "border-t-zinc-400",
        inProgress: "border-t-blue-500",
        review: "border-t-amber-500",
        done: "border-t-emerald-500",
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {t("title")}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400">{t("subtitle")}</p>
            </div>

            {/* Stats Row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.key}
                        className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            {t(`stats.${stat.key}`)}
                        </p>
                        <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Kanban Board */}
            <div className="grid gap-4 lg:grid-cols-4">
                {columns.map((col) => (
                    <div key={col} className="flex flex-col">
                        <div
                            className={`rounded-xl border border-t-4 ${columnColors[col]} border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900`}
                        >
                            <div className="flex items-center justify-between px-4 py-3">
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                    {t(`columns.${col}`)}
                                </h3>
                                <span className="flex size-6 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                    {col === "todo" ? 3 : col === "inProgress" ? 2 : col === "review" ? 1 : 4}
                                </span>
                            </div>
                            <div className="space-y-2 p-3 pt-0">
                                {Array.from({ length: col === "todo" ? 3 : col === "done" ? 4 : col === "inProgress" ? 2 : 1 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800"
                                    >
                                        <div className="mb-2 h-3 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
                                        <div className="h-2 w-1/2 rounded bg-zinc-100 dark:bg-zinc-700/50" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
