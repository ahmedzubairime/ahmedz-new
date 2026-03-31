"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { updateReturnStatus } from "@/app/actions/store-orders";

type Props = { locale: string; returns: any[]; };

const STATUS_MAP: Record<string, { label_ar: string; label_en: string; color: string }> = {
    pending: { label_ar: "قيد المراجعة", label_en: "Pending", color: "#f59e0b" },
    approved: { label_ar: "مقبول", label_en: "Approved", color: "#3b82f6" },
    rejected: { label_ar: "مرفوض", label_en: "Rejected", color: "#ef4444" },
    refunded: { label_ar: "تم الاسترجاع", label_en: "Refunded", color: "#22c55e" },
};

export function ReturnsGrid({ locale, returns }: Props) {
    const [isPending, startTransition] = useTransition();
    const [selected, setSelected] = useState<any>(null);
    const [adminNotes, setAdminNotes] = useState("");
    const [refundAmount, setRefundAmount] = useState("");

    function handleStatusUpdate(id: string, status: string) {
        startTransition(async () => {
            await updateReturnStatus(id, status, adminNotes || undefined, refundAmount ? parseFloat(refundAmount) : undefined);
            setSelected(null); setAdminNotes(""); setRefundAmount("");
        });
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "طلبات الإرجاع" : "Return Requests"}</h1>
                    <p className="mt-1 text-sm text-zinc-500">{locale === "ar" ? "راجع طلبات الإرجاع والاسترداد." : "Review return and refund requests."}</p>
                </div>
            </div>

            {returns.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <SidebarIcon name="rotate-ccw" className="size-8 text-zinc-400 mb-3" />
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد طلبات إرجاع" : "No return requests"}</h3>
                </div>
            ) : (
                <div className="space-y-3">
                    {returns.map(r => {
                        const st = STATUS_MAP[r.status] || STATUS_MAP.pending;
                        return (
                            <div key={r.id} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md">
                                <div className="flex items-start gap-4">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: st.color + '15', color: st.color }}>
                                        <SidebarIcon name="rotate-ccw" className="size-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-xs font-bold text-[var(--brand-primary)]">{r.order?.order_number || "—"}</span>
                                            <span className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: st.color + '20', color: st.color }}>
                                                {locale === "ar" ? st.label_ar : st.label_en}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-1">{r.reason_text}</p>
                                        {r.customer_notes && <p className="text-xs text-zinc-400 italic">{r.customer_notes}</p>}
                                        {r.refund_amount && <p className="text-sm font-bold text-emerald-600 mt-1">{locale === "ar" ? `مبلغ الاسترداد: ${r.refund_amount}` : `Refund: ${r.refund_amount}`}</p>}
                                    </div>
                                    <div className="flex gap-1">
                                        {r.status === "pending" && (
                                            <>
                                                <button onClick={() => handleStatusUpdate(r.id, "approved")} disabled={isPending} className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 transition-colors">{locale === "ar" ? "قبول" : "Approve"}</button>
                                                <button onClick={() => handleStatusUpdate(r.id, "rejected")} disabled={isPending} className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 transition-colors">{locale === "ar" ? "رفض" : "Reject"}</button>
                                            </>
                                        )}
                                        {r.status === "approved" && (
                                            <button onClick={() => { setSelected(r); setRefundAmount(String(r.order?.grand_total || "")); }} className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 transition-colors">{locale === "ar" ? "استرداد" : "Refund"}</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Refund Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div onClick={() => setSelected(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" />
                    <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 shadow-2xl rounded-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "تأكيد الاسترداد" : "Process Refund"}</h2>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "مبلغ الاسترداد" : "Refund Amount"}</label>
                            <input dir="ltr" type="number" step="0.01" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "ملاحظات الإدارة" : "Admin Notes"}</label>
                            <textarea rows={2} value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setSelected(null)} className="rounded-xl border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300">{locale === "ar" ? "إلغاء" : "Cancel"}</button>
                            <button onClick={() => handleStatusUpdate(selected.id, "refunded")} disabled={isPending} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-lg hover:bg-emerald-700 disabled:opacity-50">
                                {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                                {locale === "ar" ? "تأكيد الاسترداد" : "Confirm Refund"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
