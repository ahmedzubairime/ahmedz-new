"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { updateReturnStatus } from "@/app/actions/store-orders";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type Props = { locale: string; returns: any[]; };

const STATUS_MAP: Record<string, { label_ar: string; label_en: string; color: string }> = {
    pending: { label_ar: "قيد المراجعة", label_en: "Pending", color: "#f59e0b" },
    approved: { label_ar: "مقبول", label_en: "Approved", color: "#3b82f6" },
    rejected: { label_ar: "مرفوض", label_en: "Rejected", color: "#ef4444" },
    refunded: { label_ar: "تم الاسترجاع", label_en: "Refunded", color: "#10b981" },
};

const getRefundSchema = (locale: string) => z.object({
    refundAmount: z.any(),
    adminNotes: z.string().optional(),
});

type RefundValues = z.infer<ReturnType<typeof getRefundSchema>>;

export function ReturnsGrid({ locale, returns }: Props) {
    const [isPending, startTransition] = useTransition();
    const [selected, setSelected] = useState<any>(null);

    const schema = useMemo(() => getRefundSchema(locale), [locale]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<RefundValues>({
        resolver: zodResolver(schema),
    });

    function handleSimpleUpdate(id: string, status: string) {
        startTransition(async () => {
            try {
                await updateReturnStatus(id, status);
                toast.success(locale === "ar" ? "تم تحديث الحالة" : "Status updated");
            } catch (err) {
                toast.error(locale === "ar" ? "فشل التحديث" : "Update failed");
            }
        });
    }

    function openRefundModal(r: any) {
        setSelected(r);
        reset({ refundAmount: r.order?.grand_total || "", adminNotes: "" });
    }

    function onRefundSubmit(data: RefundValues) {
        if (!selected) return;
        startTransition(async () => {
            try {
                const amount = data.refundAmount ? parseFloat(String(data.refundAmount)) : undefined;
                await updateReturnStatus(selected.id, "refunded", data.adminNotes || undefined, amount);
                toast.success(locale === "ar" ? "تم معالجة الاسترداد" : "Refund processed", { icon: "💸" });
                setSelected(null);
            } catch (err) {
                toast.error(locale === "ar" ? "فشل معالجة الاسترداد" : "Refund failed");
            }
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-emerald-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {locale === "ar" ? "طلبات الإرجاع" : "Return Requests"}
                    </h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="rotate-ccw" className="size-4 text-emerald-500" />
                        {locale === "ar" ? "راجع طلبات الإرجاع والاسترداد." : "Review return and refund requests."}
                    </p>
                </div>
            </motion.div>

            {/* Grid */}
            {returns.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-4 animate-bounce"><SidebarIcon name="rotate-ccw" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد طلبات إرجاع" : "No return requests"}</h3>
                    <p className="mt-2 text-sm font-medium text-zinc-500">{locale === "ar" ? "كل شيء يسير على ما يرام." : "Everything is running smoothly."}</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                        {returns.map((r, i) => {
                            const st = STATUS_MAP[r.status] || STATUS_MAP.pending;
                            return (
                                <motion.div key={r.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="group rounded-3xl border-2 border-zinc-200/50 bg-white/80 p-6 dark:border-zinc-800/50 dark:bg-zinc-900/80 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden backdrop-blur-md" style={{ borderLeftColor: st.color, borderLeftWidth: 4 }}>
                                    
                                    <div className="flex items-start gap-5">
                                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-inner transition-transform group-hover:scale-110 group-hover:-rotate-12" style={{ backgroundColor: `${st.color}20`, color: st.color }}>
                                            <SidebarIcon name="rotate-ccw" className="size-6 drop-shadow-sm" />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="font-mono text-xs font-black tracking-widest bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md text-zinc-700 dark:text-zinc-300 shadow-inner">{r.order?.order_number || "—"}</span>
                                                <span className="inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest shadow-sm" style={{ backgroundColor: `${st.color}15`, color: st.color, border: `1px solid ${st.color}30` }}>
                                                    {locale === "ar" ? st.label_ar : st.label_en}
                                                </span>
                                            </div>
                                            
                                            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{r.reason_text}</p>
                                            
                                            {r.customer_notes && (
                                                <div className="mt-2 text-sm font-medium text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-xl italic border-l-2 border-zinc-200 dark:border-zinc-700">
                                                    "{r.customer_notes}"
                                                </div>
                                            )}
                                            
                                            {r.refund_amount && (
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"><SidebarIcon name="check" className="size-3" /></span>
                                                    <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">{locale === "ar" ? `مبلغ الاسترداد: ${r.refund_amount}` : `Refunded: ${r.refund_amount}`}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Footers for non-finalized states */}
                                    {(r.status === "pending" || r.status === "approved") && (
                                        <div className="mt-6 pt-4 flex gap-2 border-t-2 border-zinc-100/50 dark:border-zinc-800/50">
                                            {r.status === "pending" && (
                                                <>
                                                    <PlayfulButton onClick={() => handleSimpleUpdate(r.id, "approved")} disabled={isPending} className="flex-1 !bg-blue-50 !text-blue-600 hover:!bg-blue-600 hover:!text-white dark:!bg-blue-500/10 dark:!text-blue-400 dark:hover:!bg-blue-600 dark:hover:!text-white border border-blue-100 dark:border-blue-500/20 !shadow-none hover:!shadow-lg">
                                                        {locale === "ar" ? "قبول وتحديد مبلغ استرداد" : "Approve"}
                                                    </PlayfulButton>
                                                    <PlayfulButton onClick={() => handleSimpleUpdate(r.id, "rejected")} disabled={isPending} className="flex-1 !bg-rose-50 !text-rose-600 hover:!bg-rose-600 hover:!text-white dark:!bg-rose-500/10 dark:!text-rose-400 dark:hover:!bg-rose-600 dark:hover:!text-white border border-rose-100 dark:border-rose-500/20 !shadow-none hover:!shadow-lg">
                                                        {locale === "ar" ? "رفض الطلب" : "Reject"}
                                                    </PlayfulButton>
                                                </>
                                            )}
                                            {r.status === "approved" && (
                                                <PlayfulButton onClick={() => openRefundModal(r)} disabled={isPending} className="w-full !bg-emerald-50 !text-emerald-600 hover:!bg-emerald-600 hover:!text-white dark:!bg-emerald-500/10 dark:!text-emerald-400 dark:hover:!bg-emerald-600 dark:hover:!text-white border border-emerald-100 dark:border-emerald-500/20 !shadow-none hover:!shadow-lg">
                                                    <SidebarIcon name="credit-card" className="size-4" />
                                                    {locale === "ar" ? "معالجة الاسترداد" : "Process Refund"}
                                                </PlayfulButton>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Refund Modal */}
            <PlayfulModal isOpen={!!selected} onClose={() => setSelected(null)} title={locale === "ar" ? "تأكيد الاسترداد" : "Process Refund"}
                footer={
                    <>
                        <PlayfulButton variant="secondary" onClick={() => setSelected(null)}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                        <PlayfulButton onClick={handleSubmit(onRefundSubmit)} disabled={isPending} className="!bg-emerald-500 hover:!bg-emerald-600 text-white !shadow-emerald-500/30">
                            {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                            <SidebarIcon name="check-circle" className="size-4" />
                            {locale === "ar" ? "تأكيد الاسترداد" : "Confirm Refund"}
                        </PlayfulButton>
                    </>
                }
            >
                <form id="refund-form" onSubmit={handleSubmit(onRefundSubmit)} className="space-y-4">
                    <PlayfulInput 
                        label={locale === "ar" ? "مبلغ الاسترداد القابل للتعديل" : "Refund Amount"} 
                        type="number" step="0.01" dir="ltr" 
                        {...register("refundAmount", { valueAsNumber: true })} 
                        error={errors.refundAmount?.message as string} 
                        className="font-black text-emerald-600"
                    />
                    <PlayfulTextarea 
                        label={locale === "ar" ? "ملاحظات الإدارة (اختياري)" : "Admin Notes (Optional)"} 
                        rows={3} 
                        {...register("adminNotes")} 
                        className="bg-zinc-50/50 dark:bg-zinc-900/30"
                    />
                </form>
            </PlayfulModal>
        </div>
    );
}
