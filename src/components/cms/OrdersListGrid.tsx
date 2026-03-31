"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { updateOrderStatus } from "@/app/actions/store-orders";

type Props = { locale: string; orders: any[]; statuses: any[]; };

export function OrdersListGrid({ locale, orders, statuses }: Props) {
    const [isPending, startTransition] = useTransition();
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    function handleStatusChange(orderId: string, newStatusId: string) {
        startTransition(async () => { await updateOrderStatus(orderId, newStatusId); });
    }

    const filtered = orders.filter(o => {
        const q = search.toLowerCase();
        const matchSearch = !q || o.order_number?.toLowerCase().includes(q) || o.customer_name?.toLowerCase().includes(q) || o.customer_email?.toLowerCase().includes(q);
        const matchStatus = !filterStatus || o.status_id === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "الطلبات" : "Orders"}</h1>
                    <p className="mt-1 text-sm text-zinc-500">{locale === "ar" ? "تتبع جميع طلبات العملاء." : "Track all customer orders."}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-zinc-400">{orders.length}</span>
                    <span className="text-zinc-400">{locale === "ar" ? "طلب" : "orders"}</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <SidebarIcon name="search" className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={locale === "ar" ? "بحث برقم الطلب أو اسم العميل..." : "Search by order # or customer..."} className="w-full rounded-xl border border-zinc-200 bg-white ps-10 pe-4 py-2.5 text-sm outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white" />
                </div>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
                    <option value="">{locale === "ar" ? "كل الحالات" : "All Statuses"}</option>
                    {statuses.map(s => (<option key={s.id} value={s.id}>{locale === "ar" ? s.name_ar : s.name_en}</option>))}
                </select>
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <SidebarIcon name="shopping-bag" className="size-8 text-zinc-400 mb-3" />
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد طلبات" : "No orders yet"}</h3>
                </div>
            ) : (
                <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80">
                                <th className="px-4 py-3 text-start font-semibold text-zinc-500">#</th>
                                <th className="px-4 py-3 text-start font-semibold text-zinc-500">{locale === "ar" ? "العميل" : "Customer"}</th>
                                <th className="px-4 py-3 text-start font-semibold text-zinc-500">{locale === "ar" ? "الإجمالي" : "Total"}</th>
                                <th className="px-4 py-3 text-start font-semibold text-zinc-500">{locale === "ar" ? "الحالة" : "Status"}</th>
                                <th className="px-4 py-3 text-start font-semibold text-zinc-500">{locale === "ar" ? "التاريخ" : "Date"}</th>
                                <th className="px-4 py-3 text-end font-semibold text-zinc-500">{locale === "ar" ? "تغيير الحالة" : "Update"}</th>
                            </tr></thead>
                            <tbody>
                                {filtered.map(o => (
                                    <tr key={o.id} className="group border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer" onClick={() => setSelectedOrder(selectedOrder?.id === o.id ? null : o)}>
                                        <td className="px-4 py-3 font-mono text-xs font-bold text-[var(--brand-primary)]">{o.order_number}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-zinc-900 dark:text-zinc-100">{o.customer_name}</p>
                                            <p className="text-xs text-zinc-400">{o.customer_email || o.customer_phone}</p>
                                        </td>
                                        <td className="px-4 py-3 font-bold text-zinc-700 dark:text-zinc-300">{o.grand_total}</td>
                                        <td className="px-4 py-3">
                                            {o.status && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold" style={{ backgroundColor: o.status.color + '20', color: o.status.color }}>
                                                    <SidebarIcon name={o.status.icon || "circle"} className="size-3" />
                                                    {locale === "ar" ? o.status.name_ar : o.status.name_en}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-zinc-400">{new Date(o.created_at).toLocaleDateString(locale === "ar" ? "ar" : "en")}</td>
                                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                            <select value={o.status_id || ""} onChange={(e) => handleStatusChange(o.id, e.target.value)} disabled={isPending} className="rounded-lg border border-zinc-200 bg-transparent px-2 py-1 text-xs outline-none focus:border-[var(--brand-primary)] dark:border-zinc-700 dark:text-white">
                                                {statuses.map(s => (<option key={s.id} value={s.id}>{locale === "ar" ? s.name_ar : s.name_en}</option>))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Details Panel */}
            {selectedOrder && (
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "تفاصيل الطلب" : "Order Details"}: {selectedOrder.order_number}</h3>
                        <button onClick={() => setSelectedOrder(null)} className="text-zinc-400 hover:text-zinc-600"><SidebarIcon name="x" className="size-5" /></button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div><p className="text-zinc-400 mb-1">{locale === "ar" ? "المبلغ الفرعي" : "Subtotal"}</p><p className="font-bold text-zinc-900 dark:text-zinc-100">{selectedOrder.subtotal}</p></div>
                        <div><p className="text-zinc-400 mb-1">{locale === "ar" ? "الخصم" : "Discount"}</p><p className="font-bold text-emerald-600">{selectedOrder.discount_total}</p></div>
                        <div><p className="text-zinc-400 mb-1">{locale === "ar" ? "الشحن" : "Shipping"}</p><p className="font-bold text-zinc-900 dark:text-zinc-100">{selectedOrder.shipping_total}</p></div>
                        <div><p className="text-zinc-400 mb-1">{locale === "ar" ? "الإجمالي" : "Grand Total"}</p><p className="font-black text-lg text-[var(--brand-primary)]">{selectedOrder.grand_total}</p></div>
                    </div>
                    {selectedOrder.tracking_number && (
                        <div className="mt-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-sm">
                            <span className="text-zinc-400">{locale === "ar" ? "رقم التتبع: " : "Tracking: "}</span>
                            <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">{selectedOrder.tracking_number}</span>
                        </div>
                    )}
                    {selectedOrder.notes && <p className="mt-3 text-sm text-zinc-500 italic">{selectedOrder.notes}</p>}
                </div>
            )}
        </div>
    );
}
