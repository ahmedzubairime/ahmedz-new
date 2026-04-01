import { getRoles } from "@/app/actions/admin";
import { getLocale } from "next-intl/server";
import { SidebarIcon } from "@/components/SidebarIcon";
import { Suspense } from "react";
import { StatsCardSkeleton } from "@/components/ui/Skeletons";

async function RolesWrapper({ locale }: { locale: string }) {
    const roles = await getRoles();

    return (
        <div className="space-y-6">
            <p className="text-sm font-medium text-zinc-500">
                {locale === "ar"
                    ? `${roles.length} أدوار في النظام`
                    : `${roles.length} roles in the system`}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {roles.map((role: any) => (
                    <div
                        key={role.id}
                        className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/60 p-5 backdrop-blur-xl transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 dark:border-white/10 dark:bg-zinc-900/60"
                    >
                        {/* System badge */}
                        {role.is_system && (
                            <span className="absolute end-3 top-3 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                {locale === "ar" ? "نظام" : "System"}
                            </span>
                        )}

                        {/* Icon + Name */}
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                                <SidebarIcon name="shield" className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                                    {locale === "ar" ? role.name_ar : role.name_en}
                                </h3>
                                <p className="text-xs text-zinc-500 font-mono">
                                    {role.id}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        {(role.description_en || role.description_ar) && (
                            <p className="mt-4 line-clamp-2 text-sm font-medium text-zinc-500">
                                {locale === "ar" ? role.description_ar : role.description_en}
                            </p>
                        )}

                        {/* Stats */}
                        <div className="mt-5 flex gap-4 border-t border-zinc-200/50 pt-4 dark:border-white/5">
                            <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded-md">
                                <SidebarIcon name="users" className="size-3.5 text-zinc-400" />
                                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                    {role.user_count}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded-md">
                                <SidebarIcon name="key" className="size-3.5 text-zinc-400" />
                                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                    {role.permission_count}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default async function RolesPage() {
    const locale = await getLocale();

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {locale === "ar" ? "الأدوار" : "Roles"}
                </h1>
            </div>

            <Suspense fallback={
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                </div>
            }>
                {/* @ts-ignore */}
                <RolesWrapper locale={locale} />
            </Suspense>
        </div>
    );
}
