"use client";

import { SidebarIcon } from "@/components/SidebarIcon";
import type { CrudPermissions } from "@/lib/permissions";

type Props = {
    locale: string;
    logs: any[];
    perms: CrudPermissions;
};

const ACTION_COLORS: Record<string, string> = {
    create: 'bg-emerald-500 text-white',
    update: 'bg-blue-500 text-white',
    delete: 'bg-rose-500 text-white',
    status_change: 'bg-amber-500 text-white',
    comment: 'bg-purple-500 text-white',
    assign: 'bg-indigo-500 text-white',
    log_time: 'bg-zinc-800 text-white',
};

const ACTION_ICONS: Record<string, string> = {
    create: 'plus',
    update: 'edit',
    delete: 'trash',
    status_change: 'refresh-ccw',
    comment: 'message-square',
    assign: 'user-plus',
    log_time: 'clock',
};

export function ActivityFeed({ locale, logs, perms }: Props) {
    const isAr = locale === "ar";

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{isAr ? "سجل النشاطات" : "Activity Log"}</h1>
                    <p className="mt-1 text-sm text-zinc-500">{isAr ? "جميع الأحداث والنشاطات في نظام إدارة المشاريع" : "All events and activities across the PMS"}</p>
                </div>
            </div>

            {/* Timeline */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-sm text-zinc-400">
                        <SidebarIcon name="activity" className="size-8 pb-3" />
                        {isAr ? "لا يوجد أي نشاط مسجل." : "No activities recorded."}
                    </div>
                ) : (
                    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent dark:before:via-zinc-800">
                        {logs.map((log: any) => {
                            const Icon = ACTION_ICONS[log.action_type] || "activity";
                            const colorClass = ACTION_COLORS[log.action_type] || "bg-zinc-200 text-zinc-600";
                            return (
                                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-zinc-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mx-auto absolute left-0 md:left-1/2 transform -translate-x-[2px] md:-translate-x-1/2 bg-white dark:bg-zinc-900">
                                        <div className={`flex items-center justify-center size-8 rounded-full ${colorClass}`}>
                                            <SidebarIcon name={Icon as any} className="size-4" />
                                        </div>
                                    </div>
                                    
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/30 group-hover:bg-white dark:group-hover:bg-zinc-900 shadow-sm transition-colors ml-14 md:ml-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            {log.account?.avatar_url ? (
                                                <img src={log.account.avatar_url} className="size-6 rounded-full" alt=""/>
                                            ) : (
                                                <div className="flex size-6 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] font-bold">{log.account?.full_name?.charAt(0) || "?"}</div>
                                            )}
                                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{log.account?.full_name || "System"}</span>
                                            <span className="text-[10px] text-zinc-400">
                                                {new Date(log.created_at).toLocaleDateString(isAr?'ar':'en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                            </span>
                                        </div>

                                        <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                            {isAr ? 
                                                `${log.action_type === 'create' ? 'أنشأ' : log.action_type === 'update' ? 'عدّل' : log.action_type === 'delete' ? 'حذف' : log.action_type === 'comment' ? 'علق على' : log.action_type === 'status_change' ? 'غيّر حالة' : log.action_type} `
                                                : 
                                                `${log.action_type.split('_').map((w: string)=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ')} `
                                            }
                                            <span className="font-bold">{log.entity_type}</span>
                                        </p>

                                        {(log.project || log.task) && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {log.project && (
                                                    <span className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 px-2 py-1 rounded border border-blue-200 dark:border-blue-500/20 truncate max-w-full">
                                                        {isAr ? log.project.title_ar : log.project.title_en}
                                                    </span>
                                                )}
                                                {log.task && (
                                                    <span className="text-[10px] bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 truncate max-w-full">
                                                        {isAr ? log.task.title_ar : log.task.title_en}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        
                                        {Object.keys(log.details || {}).length > 0 && (
                                            <div className="mt-3 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-mono text-zinc-600 dark:text-zinc-400 break-words whitespace-pre-wrap">
                                                {JSON.stringify(log.details, null, 2)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
