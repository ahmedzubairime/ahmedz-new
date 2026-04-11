"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { toggleReviewApproval, deleteReview } from "@/app/actions/store-products";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type Props = { locale: string; reviews: any[]; };

export function ReviewsGrid({ locale, reviews }: Props) {
    const [isPending, startTransition] = useTransition();
    const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");

    function handleToggle(id: string, current: boolean) {
        startTransition(async () => { 
            try {
                await toggleReviewApproval(id, !current); 
                toast.success(locale === "ar" ? "تم التحديث" : "Review updated", { icon: "✨" });
            } catch(e) {
                toast.error(locale === "ar" ? "حدث خطأ" : "Error updating review");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا التقييم نهائياً؟ لا يمكن التراجع عن هذا." : "Permanently delete this review? This cannot be undone.")) return;
        startTransition(async () => { 
            try {
                await deleteReview(id); 
                toast.success(locale === "ar" ? "تم الحذف" : "Review deleted");
            } catch(e) {
                toast.error(locale === "ar" ? "فشل الحذف" : "Delete failed");
            }
        });
    }

    const filtered = reviews.filter(r => filter === "all" ? true : filter === "approved" ? r.is_approved : !r.is_approved);
    const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0.0";

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-amber-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {locale === "ar" ? "التقييمات" : "Product Reviews"}
                    </h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="message-square" className="size-4 text-amber-500" />
                        {locale === "ar" ? "إدارة التقييمات وردود أفعال العملاء." : "Manage customer feedback and ratings."}
                    </p>
                </div>
                
                <div className="flex items-center gap-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 px-6 py-3 border border-amber-100 dark:border-amber-500/20 shadow-inner">
                    <div className="flex -space-x-1">
                        <SidebarIcon name="star" className="size-8 text-amber-500 fill-amber-500 drop-shadow-sm" />
                    </div>
                    <div>
                        <span className="text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tighter">{avgRating}</span>
                        <span className="text-sm font-bold text-amber-700/50 dark:text-amber-300/50 ml-1">/ 5.0</span>
                    </div>
                    <div className="ml-2 pl-3 border-l-2 border-amber-200/50 dark:border-amber-500/30">
                        <span className="text-xs font-black uppercase tracking-widest text-amber-600/60 dark:text-amber-400/60">
                            {reviews.length} {locale === "ar" ? "تقييم" : "Reviews"}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="flex gap-2 p-1.5 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border-2 border-zinc-200/50 dark:border-zinc-800/50 w-fit">
                {(["all", "pending", "approved"] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`relative px-6 py-2.5 rounded-xl text-sm font-black transition-all overflow-hidden ${filter === f ? 'text-white shadow-lg' : 'text-zinc-500 hover:bg-white/50 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'}`}>
                        {filter === f && <motion.div layoutId="review-filter-pill" className="absolute inset-0 bg-amber-500 dark:bg-amber-600 -z-10 rounded-xl" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                        <span className="relative z-10 uppercase tracking-widest">{f === "all" ? (locale === "ar" ? "الكل" : "All") : f === "pending" ? (locale === "ar" ? "قيد المراجعة" : "Pending") : (locale === "ar" ? "مقبول" : "Approved")}</span>
                    </button>
                ))}
            </motion.div>

            {/* List */}
            {filtered.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/30 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/30">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-amber-50 text-amber-500 dark:bg-amber-500/10 mb-4 animate-bounce"><SidebarIcon name="message-square-dashed" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد تقييمات" : "No reviews found"}</h3>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    <AnimatePresence>
                        {filtered.map((r, i) => (
                            <motion.div key={r.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.03 }} className="group relative rounded-3xl border-2 border-zinc-200/50 bg-white/80 p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 dark:border-zinc-800/50 dark:bg-zinc-900/80 backdrop-blur-md overflow-hidden">
                                
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-200/20 to-transparent dark:from-amber-500/10 rounded-bl-full pointer-events-none" />

                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-500 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-300 font-black text-xl shadow-inner border border-zinc-200/50 dark:border-zinc-700/50">
                                        {r.reviewer_name?.charAt(0)?.toUpperCase() || "?"}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0 z-10">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 truncate">{r.reviewer_name}</h3>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border shadow-sm ${r.is_approved ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'}`}>
                                                {r.is_approved ? (locale === "ar" ? "مقبول" : "Approved") : (locale === "ar" ? "قيد المراجعة" : "Pending")}
                                            </span>
                                        </div>
                                        
                                        {/* Stars */}
                                        <div className="flex gap-1 mb-3">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <SidebarIcon key={star} name="star" className={`size-4 transition-colors ${star <= r.rating ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-zinc-200 dark:text-zinc-800'}`} />
                                            ))}
                                        </div>
                                        
                                        {/* Comment */}
                                        {r.comment_text && (
                                            <div className="relative mb-3">
                                                <SidebarIcon name="quote" className="absolute -top-1 -left-1 size-6 text-zinc-100 fill-zinc-100 dark:text-zinc-800 dark:fill-zinc-800 -z-10" />
                                                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 italic tracking-wide leading-relaxed line-clamp-3">"{r.comment_text}"</p>
                                            </div>
                                        )}
                                        
                                        <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 max-w-full">
                                            <SidebarIcon name="box" className="size-3 text-[var(--brand-primary)] shrink-0" />
                                            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 truncate">{r.product ? (locale === "ar" ? r.product.title_ar : r.product.title_en) : "—"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Overlay */}
                                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 z-20">
                                    <button onClick={() => handleToggle(r.id, r.is_approved)} disabled={isPending} className={`flex size-10 cursor-pointer items-center justify-center rounded-xl shadow-lg border transition-all hover:scale-110 ${r.is_approved ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-500 hover:text-white dark:bg-amber-900/50 dark:border-amber-800' : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-500 hover:text-white dark:bg-emerald-900/50 dark:border-emerald-800'}`}>
                                        <SidebarIcon name={r.is_approved ? "eye-off" : "check-circle"} className="size-5" />
                                    </button>
                                    <button onClick={() => handleDelete(r.id)} disabled={isPending} className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200 shadow-lg hover:bg-rose-600 hover:text-white hover:scale-110 dark:bg-rose-900/50 dark:border-rose-800 transition-all">
                                        <SidebarIcon name="trash-2" className="size-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
