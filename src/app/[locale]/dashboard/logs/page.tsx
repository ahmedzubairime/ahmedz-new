import { createClient } from "@/lib/supabase/server";
import { getLocale } from "next-intl/server";
import { SidebarIcon } from "@/components/SidebarIcon";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

const ACTION_ICONS: Record<string, string> = {
    "user.login": "user",
    "user.logout": "log-out",
    "account.setup": "user",
    "account.update": "user",
    "role.create": "shield",
    "role.update": "shield",
    "role.delete": "shield",
    "permission.update": "key",
};

const ACTION_LABELS: Record<string, { ar: string; en: string }> = {
    "user.login": { ar: "تسجيل دخول", en: "User Login" },
    "user.logout": { ar: "تسجيل خروج", en: "User Logout" },
    "account.setup": { ar: "إعداد حساب", en: "Account Setup" },
    "account.update": { ar: "تحديث حساب", en: "Account Updated" },
    "role.create": { ar: "إنشاء دور", en: "Role Created" },
    "role.update": { ar: "تحديث دور", en: "Role Updated" },
    "role.delete": { ar: "حذف دور", en: "Role Deleted" },
    "permission.update": { ar: "تحديث صلاحية", en: "Permission Updated" },
};

async function LogsWrapper({ locale }: { locale: string }) {
    const supabase = await createClient();

    const { data: logs } = await supabase.rpc("get_audit_logs", {
        p_limit: 100,
        p_offset: 0,
    });

    return (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/60 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
            {logs && logs.length > 0 ? (
                <div className="divide-y divide-zinc-200/50 dark:divide-white/5">
                    {logs.map((log: any) => {
                        const icon = ACTION_ICONS[log.action] || "activity";
                        const label = ACTION_LABELS[log.action];
                        const timeAgo = getTimeAgo(log.created_at, locale);

                        return (
                            <div key={log.id} className="flex items-start gap-4 py-4 transition-colors">
                                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)]/10">
                                    <SidebarIcon name={icon} className="size-5 text-[var(--brand-primary)]" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-zinc-900 dark:text-zinc-100">
                                            {log.actor_name}
                                        </span>
                                        <span className="text-sm font-medium text-zinc-500">
                                            {label ? (locale === "ar" ? label.ar : label.en) : log.action}
                                        </span>
                                    </div>
                                    {log.entity_id && (
                                        <p className="mt-0.5 text-xs text-zinc-400 font-mono">
                                            {log.entity_type}: {log.entity_id}
                                        </p>
                                    )}
                                    {log.details && Object.keys(log.details).length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {Object.entries(log.details).map(([key, val]) => (
                                                <span
                                                    key={key}
                                                    className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800/50"
                                                >
                                                    {key}: {String(val)}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <span className="shrink-0 text-xs font-medium text-zinc-400">
                                    {timeAgo}
                                </span>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-16 text-center text-sm font-medium text-zinc-400">
                    {locale === "ar" ? "لا توجد سجلات بعد" : "No activity logs yet"}
                </div>
            )}
        </div>
    );
}

export default async function LogsPage() {
    const locale = await getLocale();

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "السجلات" : "Activity Logs"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        {locale === "ar"
                            ? "سجل نشاطات المستخدمين في النظام"
                            : "User activity log for the system"}
                    </p>
                </div>
            </div>

            <Suspense fallback={<TableSkeleton rowCount={8} />}>
                {/* @ts-ignore */}
                <LogsWrapper locale={locale} />
            </Suspense>
        </div>
    );
}

function getTimeAgo(dateStr: string, locale: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (locale === "ar") {
        if (minutes < 1) return "الآن";
        if (minutes < 60) return `منذ ${minutes} دقيقة`;
        if (hours < 24) return `منذ ${hours} ساعة`;
        return `منذ ${days} يوم`;
    }

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}
