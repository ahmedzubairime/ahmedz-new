"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { toggleReviewApproval, deleteReview } from "@/app/actions/store-products";

type Props = { locale: string; reviews: any[]; };

export function ReviewsGrid({ locale, reviews }: Props) {
    const [isPending, startTransition] = useTransition();
    const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");

    function handleToggle(id: string, current: boolean) {
        startTransition(async () => { await toggleReviewApproval(id, !current); });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "حذف هذا التقييم نهائياً؟" : "Permanently delete this review?")) return;
        startTransition(async () => { await deleteReview(id); });
    }

    const filtered = reviews.filter(r =>
        filter === "all" ? true : filter === "approved" ? r.is_approved : !r.is_approved
    );

    const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0.0";

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "تقييمات المنتجات" : "Product Reviews"}</h1>
                    <p className="mt-1 text-sm text-zinc-500">{locale === "ar" ? "وافق على التقييمات أو أرفضها." : "Approve or reject customer reviews."}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-4 py-2 dark:bg-amber-500/10">
                        <SidebarIcon name="star" className="size-5 text-amber-500 fill-amber-500" />
                        <span className="text-lg font-black text-amber-600 dark:text-amber-400">{avgRating}</span>
                        <span className="text-xs text-zinc-500">({reviews.length})</span>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {(["all", "pending", "approved"] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${filter === f ? 'bg-[var(--brand-primary)] text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'}`}>
                        {f === "all" ? (locale === "ar" ? "الكل" : "All") : f === "pending" ? (locale === "ar" ? "قيد المراجعة" : "Pending") : (locale === "ar" ? "مقبول" : "Approved")}
                    </button>
                ))}
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <SidebarIcon name="message-square" className="size-8 text-zinc-400 mb-3" />
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد تقييمات" : "No reviews"}</h3>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(r => (
                        <div key={r.id} className="group rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 font-bold text-sm">
                                    {r.reviewer_name?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-zinc-900 dark:text-zinc-100">{r.reviewer_name}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.is_approved ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                                            {r.is_approved ? (locale === "ar" ? "مقبول" : "Approved") : (locale === "ar" ? "قيد المراجعة" : "Pending")}
                                        </span>
                                    </div>
                                    <div className="flex gap-0.5 mb-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <SidebarIcon key={star} name="star" className={`size-4 ${star <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-200 dark:text-zinc-700'}`} />
                                        ))}
                                    </div>
                                    {r.comment_text && <p className="text-sm text-zinc-600 dark:text-zinc-400">{r.comment_text}</p>}
                                    <p className="text-xs text-zinc-400 mt-2">{r.product ? (locale === "ar" ? r.product.title_ar : r.product.title_en) : "—"}</p>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleToggle(r.id, r.is_approved)} disabled={isPending} className={`flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors ${r.is_approved ? 'hover:bg-amber-50 hover:text-amber-600 text-zinc-400' : 'hover:bg-emerald-50 hover:text-emerald-600 text-zinc-400'}`}>
                                        <SidebarIcon name={r.is_approved ? "eye-off" : "check-circle"} className="size-4" />
                                    </button>
                                    <button onClick={() => handleDelete(r.id)} disabled={isPending} className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 text-zinc-400 transition-colors">
                                        <SidebarIcon name="trash" className="size-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
