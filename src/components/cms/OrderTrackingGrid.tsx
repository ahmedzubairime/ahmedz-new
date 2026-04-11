"use client";

import { useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { updateOrderStatus } from "@/app/actions/store-orders";
import { PlayfulButton } from "@/components/ui/PlayfulInputs";
import { motion, AnimatePresence } from "framer-motion";

type Props = { locale: string; orders: any[]; statuses: any[]; };

export function OrderTrackingGrid({ locale, orders, statuses }: Props) {
    const [isPending, startTransition] = useTransition();

    const columns = statuses.map((s: any) => ({
        ...s,
        orders: orders.filter((o: any) => o.status_id === s.id) as any[]
    }));

    function moveOrder(orderId: string, newStatusId: string) {
        startTransition(async () => { await updateOrderStatus(orderId, newStatusId); });
    }

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto overflow-hidden">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-yellow-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {locale === "ar" ? "لوحة التتبع" : "Tracking Board"}
                    </h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="kanban" className="size-4 text-yellow-500" />
                        {locale === "ar" ? "مخطط كانبان لسير عمل الطلبات." : "Kanban board for your order pipeline."}
                    </p>
                </div>
            </motion.div>

            {/* Kanban Board */}
            <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory hide-scroll">
                {columns.map((col, cIndex) => (
                    <motion.div key={col.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: cIndex * 0.1 }} className="flex flex-col min-w-[320px] max-w-[340px] rounded-3xl border-2 border-zinc-200/50 bg-zinc-50/50 dark:border-zinc-800/50 dark:bg-zinc-900/30 snap-start backdrop-blur-sm shadow-sm" style={{ borderTopColor: col.color, borderTopWidth: 4 }}>
                        
                        {/* Column Header */}
                        <div className="flex items-center justify-between p-5 border-b-2 border-zinc-100/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 rounded-t-[20px]">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl shadow-inner" style={{ backgroundColor: `${col.color}20`, color: col.color }}>
                                    <SidebarIcon name={col.icon || "circle"} className="size-5 drop-shadow-sm" />
                                </div>
                                <span className="font-black text-sm tracking-wide text-zinc-900 dark:text-zinc-100 uppercase">{locale === "ar" ? col.name_ar : col.name_en}</span>
                            </div>
                            <span className="flex size-8 items-center justify-center rounded-full bg-zinc-200/80 dark:bg-zinc-800/80 text-xs font-black text-zinc-600 dark:text-zinc-400 font-mono tracking-widest">{col.orders.length}</span>
                        </div>

                        {/* Cards Container */}
                        <div className="flex-1 p-3 space-y-3 max-h-[65vh] overflow-y-auto custom-scroll">
                            {col.orders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 opacity-50">
                                    <SidebarIcon name="inbox" className="size-8 text-zinc-300 mb-2" />
                                    <span className="text-xs font-bold text-zinc-400 tracking-widest uppercase">{locale === "ar" ? "لا توجد طلبات" : "No orders"}</span>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {col.orders.map((o: any) => (
                                        <motion.div key={o.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="group relative rounded-2xl bg-white/90 dark:bg-zinc-900/90 border-2 border-zinc-200/50 dark:border-zinc-800/50 p-4 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                                            
                                            <div className="flex items-start justify-between mb-3">
                                                <span className="font-mono text-xs font-black tracking-widest bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md text-zinc-700 dark:text-zinc-300">{o.order_number}</span>
                                                <span className="text-[10px] font-bold text-zinc-400 capitalize bg-zinc-50 dark:bg-zinc-800/50 px-2 py-0.5 rounded-full">{new Date(o.created_at).toLocaleDateString(locale === "ar" ? "ar" : "en", { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                            
                                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 mb-1">{o.customer_name}</p>
                                            <p className="text-xl font-black text-zinc-800 dark:text-zinc-200 tracking-tighter" style={{ color: col.color }}>{o.grand_total}</p>

                                            {/* Action Overlay */}
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-zinc-900 dark:via-zinc-900/90 rounded-b-2xl p-2 pt-6 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 flex gap-2 flex-wrap justify-center border-t-2 border-zinc-50 dark:border-zinc-800/50">
                                                {statuses.filter(s => s.id !== col.id).map(s => (
                                                    <button key={s.id} onClick={() => moveOrder(o.id, s.id)} disabled={isPending} className="flex-1 min-w-[60px] max-w-[100px] rounded-xl px-2 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 shadow-sm truncate" style={{ backgroundColor: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30` }}>
                                                        {locale === "ar" ? s.name_ar : s.name_en}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{__html:`
                .hide-scroll::-webkit-scrollbar { display: none; }
                .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scroll::-webkit-scrollbar { width: 6px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .custom-scroll::-webkit-scrollbar-thumb { background-color: rgba(161, 161, 170, 0.3); border-radius: 10px; }
            `}} />
        </div>
    );
}
