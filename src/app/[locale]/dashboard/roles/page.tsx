import { getRoles } from "@/app/actions/admin";
import { getLocale } from "next-intl/server";
import { SidebarIcon } from "@/components/SidebarIcon";

export default async function RolesPage() {
    const locale = await getLocale();
    const roles = await getRoles();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {locale === "ar" ? "الأدوار" : "Roles"}
                </h1>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {locale === "ar"
                        ? `${roles.length} أدوار في النظام`
                        : `${roles.length} roles in the system`}
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {roles.map((role: { id: string; name_en: string; name_ar: string; description_en: string | null; description_ar: string | null; is_system: boolean; user_count: number; permission_count: number }) => (
                    <div
                        key={role.id}
                        className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-[var(--brand-primary)]/30 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-[var(--brand-primary)]/30"
                    >
                        {/* System badge */}
                        {role.is_system && (
                            <span className="absolute end-3 top-3 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                {locale === "ar" ? "نظام" : "System"}
                            </span>
                        )}

                        {/* Icon + Name */}
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--brand-primary-50)] dark:bg-[var(--brand-primary)]/10">
                                <SidebarIcon name="shield" className="size-5 text-[var(--brand-primary)]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                                    {locale === "ar" ? role.name_ar : role.name_en}
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {role.id}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        {(role.description_en || role.description_ar) && (
                            <p className="mt-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                                {locale === "ar" ? role.description_ar : role.description_en}
                            </p>
                        )}

                        {/* Stats */}
                        <div className="mt-4 flex gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                            <div className="flex items-center gap-1.5">
                                <SidebarIcon name="users" className="size-3.5 text-zinc-400" />
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    {role.user_count}
                                </span>
                                <span className="text-xs text-zinc-400">
                                    {locale === "ar" ? "مستخدم" : "users"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <SidebarIcon name="key" className="size-3.5 text-zinc-400" />
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    {role.permission_count}
                                </span>
                                <span className="text-xs text-zinc-400">
                                    {locale === "ar" ? "صلاحية" : "perms"}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
