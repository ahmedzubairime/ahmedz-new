"use client";

import Link from "next/link";
import { SidebarIcon } from "@/components/SidebarIcon";
import type { CrudPermissions, UserAccount } from "@/lib/permissions";

type Stats = {
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    myTasks: number;
    completedTasks: number;
    completionRate: number;
};

type Props = {
    locale: string;
    account: UserAccount;
    perms: CrudPermissions;
    stats: Stats;
    recentProjects: any[];
    myTasks: any[];
};

const STATUS_COLORS: Record<string, string> = {
    planning: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    on_hold: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    completed: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    archived: "bg-zinc-50 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500",
};

const PRIORITY_ICONS: Record<string, { color: string; icon: string }> = {
    low: { color: "text-zinc-400", icon: "arrow-down" },
    medium: { color: "text-blue-500", icon: "minus" },
    high: { color: "text-amber-500", icon: "arrow-up" },
    critical: { color: "text-rose-500", icon: "alert-triangle" },
};

export function PmsDashboard({ locale, account, perms, stats, recentProjects, myTasks }: Props) {
    const isAr = locale === "ar";

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {isAr ? `مرحباً، ${account.full_name}` : `Welcome, ${account.full_name}`}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        {isAr ? "نظرة عامة على أنشطة المشاريع الحالية." : "Overview of current project activities."}
                    </p>
                </div>
                {perms.can_create && (
                    <Link href={`/${locale}/projects-management/projects`} className="flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5">
                        <SidebarIcon name="plus" className="size-5" />
                        {isAr ? "مشروع جديد" : "New Project"}
                    </Link>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: isAr ? "إجمالي المشاريع" : "Total Projects", value: stats.totalProjects, icon: "folder-kanban", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
                    { label: isAr ? "مشاريع نشطة" : "Active Projects", value: stats.activeProjects, icon: "activity", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                    { label: isAr ? "مهامي" : "My Tasks", value: stats.myTasks, icon: "check-square", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
                    { label: isAr ? "نسبة الإنجاز" : "Completion", value: `${stats.completionRate}%`, icon: "pie-chart", color: "text-[var(--brand-primary)]", bg: "bg-[var(--brand-primary)]/10" },
                ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 hover:shadow-lg transition-shadow">
                        <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                            <SidebarIcon name={stat.icon as any} className="size-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                {/* Recent Projects — 3 cols */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{isAr ? "المشاريع الأخيرة" : "Recent Projects"}</h2>
                        <Link href={`/${locale}/projects-management/projects`} className="text-sm font-semibold text-[var(--brand-primary)] hover:underline">
                            {isAr ? "عرض الكل" : "View All"}
                        </Link>
                    </div>

                    {recentProjects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
                            <SidebarIcon name="folder-kanban" className="size-8 text-zinc-400 mb-3" />
                            <p className="text-sm text-zinc-500">{isAr ? "لا توجد مشاريع بعد" : "No projects yet"}</p>
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {recentProjects.map((p: any) => (
                                <Link key={p.id} href={`/${locale}/projects-management/projects`} className="group rounded-2xl border border-zinc-200 bg-white p-4 transition-all hover:shadow-lg hover:border-[var(--brand-primary)]/30 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-[var(--brand-primary)]/40">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: (p.color || '#3b82f6') + '15', color: p.color || '#3b82f6' }}>
                                            <SidebarIcon name="folder" className="size-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-[var(--brand-primary)] transition-colors">
                                                {isAr ? p.title_ar : p.title_en}
                                            </h3>
                                            <p className="text-xs text-zinc-400 truncate">{isAr ? p.description_ar : p.description_en}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_COLORS[p.status] || STATUS_COLORS.planning}`}>
                                            {isAr ? ({ planning: "تخطيط", active: "نشط", on_hold: "معلّق", completed: "مكتمل", archived: "أرشيف" }[p.status as string] || p.status) : p.status}
                                        </span>
                                        {p.due_date && (
                                            <span className="text-[10px] text-zinc-400">
                                                {new Date(p.due_date).toLocaleDateString(isAr ? "ar" : "en", { month: "short", day: "numeric" })}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* My Tasks — 2 cols */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{isAr ? "مهامي القادمة" : "My Upcoming Tasks"}</h2>
                        <Link href={`/${locale}/projects-management/tasks`} className="text-sm font-semibold text-[var(--brand-primary)] hover:underline">
                            {isAr ? "عرض الكل" : "View All"}
                        </Link>
                    </div>

                    {myTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
                            <SidebarIcon name="check-circle" className="size-8 text-emerald-400 mb-3" />
                            <p className="text-sm text-zinc-500">{isAr ? "لا توجد مهام معلّقة 🎉" : "No pending tasks 🎉"}</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {myTasks.slice(0, 8).map((t: any) => {
                                const pri = PRIORITY_ICONS[t.priority] || PRIORITY_ICONS.medium;
                                return (
                                    <div key={t.id} className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                                        <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${pri.color}`}>
                                            <SidebarIcon name={pri.icon as any} className="size-3.5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{isAr ? t.title_ar : t.title_en}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {t.project && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: (t.project.color || '#3b82f6') + '15', color: t.project.color || '#3b82f6' }}>
                                                        {isAr ? t.project.title_ar : t.project.title_en}
                                                    </span>
                                                )}
                                                {t.due_date && (
                                                    <span className={`text-[10px] ${new Date(t.due_date) < new Date() ? 'text-rose-500 font-bold' : 'text-zinc-400'}`}>
                                                        {new Date(t.due_date).toLocaleDateString(isAr ? "ar" : "en", { month: "short", day: "numeric" })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {t.status && (
                                            <span className="flex size-2.5 shrink-0 rounded-full" style={{ backgroundColor: t.status.color || '#94a3b8' }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                {[
                    { href: `/${locale}/projects-management/projects`, icon: "folder-kanban", label: isAr ? "المشاريع" : "Projects", desc: isAr ? "إدارة المشاريع" : "Manage projects" },
                    { href: `/${locale}/projects-management/tasks`, icon: "check-square", label: isAr ? "المهام" : "Tasks", desc: isAr ? "لوحة كانبان" : "Kanban board" },
                    { href: `/${locale}/projects-management/members`, icon: "users", label: isAr ? "الأعضاء" : "Members", desc: isAr ? "إدارة الفريق" : "Team management" },
                    { href: `/${locale}/projects-management/branches`, icon: "git-branch", label: isAr ? "الفروع" : "Branches", desc: isAr ? "المواقع" : "Locations" },
                ].map(link => (
                    <Link key={link.href} href={link.href} className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-[var(--brand-primary)]/40 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 group-hover:bg-[var(--brand-primary)]/10 group-hover:text-[var(--brand-primary)] dark:bg-zinc-800 transition-colors">
                            <SidebarIcon name={link.icon as any} className="size-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[var(--brand-primary)] transition-colors">{link.label}</p>
                            <p className="text-xs text-zinc-400">{link.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
