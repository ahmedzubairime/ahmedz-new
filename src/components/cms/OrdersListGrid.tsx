"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { updateOrderStatus } from "@/app/actions/store-orders";
import { PlayfulInput, PlayfulSelect, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type Props = { locale: string; orders: any[]; statuses: any[]; };

export function OrdersListGrid({ locale, orders, statuses }: Props) {
    const [isPending, startTransition] = useTransition();
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    function handleStatusChange(orderId: string, newStatusId: string) {
        startTransition(async () => { 
            try {
                await updateOrderStatus(orderId, newStatusId); 
                toast.success(locale === "ar" ? "تم تحديث حالة الطلب" : "Order status updated");
            } catch(e) {
                toast.error(locale === "ar" ? "فشل تحديث الحالة" : "Failed to update status");
            }
        });
    }

    const filtered = orders.filter(o => {
        const q = search.toLowerCase();
        const matchSearch = !q || o.order_number?.toLowerCase().includes(q) || o.customer_name?.toLowerCase().includes(q) || o.customer_email?.toLowerCase().includes(q);
        const matchStatus = !filterStatus || o.status_id === filterStatus;
        return matchSearch && matchStatus;
    });

    const statusOptions = [{ value: "", label: locale === "ar" ? "كل الحالات" : "All Statuses" }, ...statuses.map(s => ({ value: s.id, label: locale === "ar" ? s.name_ar : s.name_en }))];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-[var(--brand-primary)]/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {locale === "ar" ? "الطلبات" : "Orders"}
                    </h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="shopping-cart" className="size-4 text-[var(--brand-primary)]" />
                        {locale === "ar" ? "تتبع جميع طلبات العملاء." : "Track all customer orders."}
                    </p>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-white/60 dark:bg-zinc-800/60 px-4 py-2 shadow-inner border border-zinc-100 dark:border-zinc-700">
                    <span className="font-black text-2xl text-[var(--brand-primary)]">{orders.length}</span>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{locale === "ar" ? "طلب مسجل" : "Total Orders"}</span>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-4 rounded-3xl border-2 border-zinc-200/50 bg-white/60 p-4 shadow-sm backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                <div className="flex-1 min-w-[250px]">
                    <div className="relative">
                        <PlayfulInput label="" dir={locale === "ar" ? "rtl" : "ltr"} className={locale === "ar" ? "pr-12 !mt-0 h-[52px]" : "pl-12 !mt-0 h-[52px]"} placeholder={locale === "ar" ? "بحث برقم الطلب أو اسم العميل..." : "Search by order # or customer..."} value={search} onChange={(e) => setSearch(e.target.value)} />
                        <div className={`absolute top-1/2 -translate-y-1/2 text-[var(--brand-primary)] ${locale === "ar" ? "right-4" : "left-4"}`}>
                            <SidebarIcon name="search" className="size-5" />
                        </div>
                    </div>
                </div>
                <div className="min-w-[200px]">
                    <PlayfulSelect label="" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} options={statusOptions} className="!mt-0 h-[52px]" />
                </div>
            </motion.div>

            {/* Table */}
            {filtered.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/30 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/30">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] mb-4 animate-bounce"><SidebarIcon name="inbox" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد طلبات" : "No orders found"}</h3>
                </motion.div>
            ) : (
                <div className="rounded-3xl border-2 border-zinc-200/60 bg-white/80 dark:border-zinc-800/60 dark:bg-zinc-900/80 shadow-xl shadow-zinc-200/20 dark:shadow-none overflow-hidden backdrop-blur-xl">
                    <div className="overflow-x-auto custom-scroll">
                        <table className="w-full text-sm text-left rtl:text-right">
                            <thead className="text-xs text-zinc-500 uppercase tracking-widest bg-zinc-50/80 dark:bg-zinc-800/80 border-b-2 border-zinc-200/60 dark:border-zinc-700/60">
                                <tr>
                                    <th className="px-6 py-4 font-black">#</th>
                                    <th className="px-6 py-4 font-black">{locale === "ar" ? "العميل" : "Customer"}</th>
                                    <th className="px-6 py-4 font-black">{locale === "ar" ? "الإجمالي" : "Total"}</th>
                                    <th className="px-6 py-4 font-black">{locale === "ar" ? "الحالة" : "Status"}</th>
                                    <th className="px-6 py-4 font-black">{locale === "ar" ? "التاريخ" : "Date"}</th>
                                    <th className="px-6 py-4 text-end font-black">{locale === "ar" ? "إجراء" : "Action"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filtered.map((o, i) => (
                                        <motion.tr key={o.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} onClick={() => setSelectedOrder(selectedOrder?.id === o.id ? null : o)} className="group border-b border-zinc-100 dark:border-zinc-800 hover:bg-[var(--brand-primary)]/5 transition-colors cursor-pointer">
                                            
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-xs font-black tracking-widest bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg text-zinc-700 dark:text-zinc-300 shadow-inner group-hover:bg-white dark:group-hover:bg-zinc-700 transition-colors">{o.order_number}</span>
                                            </td>
                                            
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">{o.customer_name}</p>
                                                <p className="text-xs font-medium text-zinc-400">{o.customer_email || o.customer_phone}</p>
                                            </td>
                                            
                                            <td className="px-6 py-4">
                                                <span className="font-black text-zinc-800 dark:text-zinc-200 tracking-tighter text-lg">{o.grand_total}</span>
                                            </td>
                                            
                                            <td className="px-6 py-4">
                                                {o.status && (
                                                    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider shadow-sm" style={{ backgroundColor: o.status.color + '20', color: o.status.color, border: `1px solid ${o.status.color}30` }}>
                                                        <SidebarIcon name={o.status.icon || "circle"} className="size-3.5" />
                                                        {locale === "ar" ? o.status.name_ar : o.status.name_en}
                                                    </span>
                                                )}
                                            </td>
                                            
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 px-2.5 py-1 rounded-full">{new Date(o.created_at).toLocaleDateString(locale === "ar" ? "ar" : "en", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </td>
                                            
                                            <td className="px-6 py-4 flex justify-end" onClick={(e) => e.stopPropagation()}>
                                                <select value={o.status_id || ""} onChange={(e) => handleStatusChange(o.id, e.target.value)} disabled={isPending} className="appearance-none cursor-pointer rounded-xl border border-zinc-200 bg-white/50 px-3 py-1.5 text-xs font-bold text-zinc-700 outline-none hover:bg-white hover:border-[var(--brand-primary)] hover:shadow-sm focus:border-[var(--brand-primary)] dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-all">
                                                    {statuses.map(s => (<option key={s.id} value={s.id}>{locale === "ar" ? s.name_ar : s.name_en}</option>))}
                                                </select>
                                            </td>

                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            <PlayfulModal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={locale === "ar" ? `تفاصيل الطلب: ${selectedOrder?.order_number}` : `Order Details: ${selectedOrder?.order_number}`}
                footer={<PlayfulButton variant="secondary" onClick={() => setSelectedOrder(null)}>{locale === "ar" ? "إغلاق" : "Close"}</PlayfulButton>}
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-zinc-100 dark:border-zinc-800 text-center">
                                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">{locale === "ar" ? "المبلغ الفرعي" : "Subtotal"}</p>
                                <p className="font-black text-lg text-zinc-900 dark:text-zinc-100">{selectedOrder.subtotal}</p>
                            </div>
                            <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 p-4 border border-emerald-100 dark:border-emerald-500/20 text-center shadow-inner">
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1">{locale === "ar" ? "الخصم" : "Discount"}</p>
                                <p className="font-black text-lg text-emerald-600 dark:text-emerald-400">{selectedOrder.discount_total || "—"}</p>
                            </div>
                            <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-zinc-100 dark:border-zinc-800 text-center">
                                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">{locale === "ar" ? "الشحن" : "Shipping"}</p>
                                <p className="font-black text-lg text-zinc-900 dark:text-zinc-100">{selectedOrder.shipping_total}</p>
                            </div>
                            <div className="rounded-2xl bg-[var(--brand-primary)]/10 p-4 border border-[var(--brand-primary)]/20 text-center shadow-inner">
                                <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand-primary)] mb-1">{locale === "ar" ? "الإجمالي" : "Total"}</p>
                                <p className="font-black text-xl text-[var(--brand-primary)]">{selectedOrder.grand_total}</p>
                            </div>
                        </div>

                        {selectedOrder.tracking_number && (
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 shadow-inner">
                                <SidebarIcon name="truck" className="size-5 text-zinc-400" />
                                <div className="flex-1">
                                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">{locale === "ar" ? "رقم التتبع" : "Tracking Number"}</p>
                                    <p className="font-mono font-black text-lg text-zinc-800 dark:text-zinc-200 tracking-widest">{selectedOrder.tracking_number}</p>
                                </div>
                            </div>
                        )}

                        {selectedOrder.notes && (
                            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                                <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">{locale === "ar" ? "ملاحظات" : "Notes"}</p>
                                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">{selectedOrder.notes}</p>
                            </div>
                        )}
                    </div>
                )}
            </PlayfulModal>

            <style dangerouslySetInnerHTML={{__html:`
                .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .custom-scroll::-webkit-scrollbar-thumb { background-color: rgba(161, 161, 170, 0.3); border-radius: 10px; }
            `}} />
        </div>
    );
}
