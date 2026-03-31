"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { updateOrderStatus, updateOrderTracking } from "@/app/actions/store-orders";

type Props = { locale: string; orders: any[]; statuses: any[]; };

export function OrderTrackingGrid({ locale, orders, statuses }: Props) {
    const [isPending, startTransition] = useTransition();

    // Group orders by status for Kanban view
    const columns = statuses.map((s: any) => ({
        ...s,
        orders: orders.filter((o: any) => o.status_id === s.id) as any[]
    }));

    function moveOrder(orderId: string, newStatusId: string) {
        startTransition(async () => { await updateOrderStatus(orderId, newStatusId); });
    }

    return (
        <div className="space-y-6 max-w-full mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "تتبع الطلبات" : "Order Tracking"}</h1>
                    <p className="mt-1 text-sm text-zinc-500">{locale === "ar" ? "مخطط كانبان لسير عمل الطلبات." : "Kanban board for your order pipeline."}</p>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                {columns.map(col => (
                    <div key={col.id} className="flex flex-col min-w-[300px] max-w-[340px] rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/30 snap-start">
                        {/* Column Header */}
                        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
                            <div className="flex items-center gap-2">
                                <div className="flex size-7 items-center justify-center rounded-lg" style={{ backgroundColor: col.color + '20', color: col.color }}>
                                    <SidebarIcon name={col.icon || "circle"} className="size-4" />
                                </div>
                                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{locale === "ar" ? col.name_ar : col.name_en}</span>
                            </div>
                            <span className="flex size-6 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-400">{col.orders.length}</span>
                        </div>
                        {/* Cards */}
                        <div className="flex-1 p-3 space-y-2 max-h-[60vh] overflow-y-auto">
                            {col.orders.length === 0 ? (
                                <div className="flex items-center justify-center py-8 text-xs text-zinc-400">{locale === "ar" ? "لا توجد طلبات" : "No orders"}</div>
                            ) : (
                                col.orders.map((o: any) => (
                                    <div key={o.id} className="group rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3.5 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-mono text-xs font-bold text-[var(--brand-primary)]">{o.order_number}</span>
                                            <span className="text-[10px] text-zinc-400">{new Date(o.created_at).toLocaleDateString(locale === "ar" ? "ar" : "en")}</span>
                                        </div>
                                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{o.customer_name}</p>
                                        <p className="text-lg font-black text-zinc-700 dark:text-zinc-300 mt-1">{o.grand_total}</p>
                                        {/* Step-Forward Buttons */}
                                        <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {statuses.filter(s => s.id !== col.id).map(s => (
                                                <button key={s.id} onClick={() => moveOrder(o.id, s.id)} disabled={isPending}
                                                    className="flex-1 rounded-lg px-2 py-1 text-[10px] font-bold transition-colors cursor-pointer"
                                                    style={{ backgroundColor: s.color + '15', color: s.color, borderWidth: 1, borderColor: s.color + '30' }}>
                                                    {locale === "ar" ? s.name_ar : s.name_en}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
