"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveCoupon, deleteCoupon } from "@/app/actions/store-marketing";

type Props = { locale: string; coupons: any[]; };

export function CouponsGrid({ locale, coupons }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);

    const [code, setCode] = useState("");
    const [descAr, setDescAr] = useState("");
    const [descEn, setDescEn] = useState("");
    const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
    const [discountValue, setDiscountValue] = useState("10");
    const [minOrder, setMinOrder] = useState("");
    const [maxDiscount, setMaxDiscount] = useState("");
    const [startsAt, setStartsAt] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const [usageLimit, setUsageLimit] = useState("");
    const [isActive, setIsActive] = useState(true);

    function openNew() {
        setEditing(null); setCode(""); setDescAr(""); setDescEn(""); setDiscountType("percentage");
        setDiscountValue("10"); setMinOrder(""); setMaxDiscount(""); setStartsAt(""); setExpiresAt("");
        setUsageLimit(""); setIsActive(true); setModalOpen(true);
    }

    function openEdit(c: any) {
        setEditing(c); setCode(c.code || ""); setDescAr(c.description_ar || ""); setDescEn(c.description_en || "");
        setDiscountType(c.discount_type || "percentage"); setDiscountValue(String(c.discount_value || ""));
        setMinOrder(c.min_order_amount ? String(c.min_order_amount) : "");
        setMaxDiscount(c.max_discount_amount ? String(c.max_discount_amount) : "");
        setStartsAt(c.starts_at ? c.starts_at.substring(0, 16) : "");
        setExpiresAt(c.expires_at ? c.expires_at.substring(0, 16) : "");
        setUsageLimit(c.usage_limit ? String(c.usage_limit) : "");
        setIsActive(c.is_active); setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const payload: any = {
                code: code.toUpperCase(), description_ar: descAr, description_en: descEn,
                discount_type: discountType, discount_value: parseFloat(discountValue) || 0,
                min_order_amount: minOrder ? parseFloat(minOrder) : null,
                max_discount_amount: maxDiscount ? parseFloat(maxDiscount) : null,
                starts_at: startsAt || null, expires_at: expiresAt || null,
                usage_limit: usageLimit ? parseInt(usageLimit) : null, is_active: isActive,
            };
            try { await saveCoupon(payload, editing?.id); close(); }
            catch (err) { console.error(err); alert(locale === "ar" ? "فشل الحفظ. تأكد من عدم تكرار الكود." : "Save failed. Ensure code is unique."); }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "حذف هذا الكوبون؟" : "Delete this coupon?")) return;
        startTransition(async () => { await deleteCoupon(id); });
    }

    const now = new Date();

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "الكوبونات" : "Coupons"}</h1>
                    <p className="mt-1 text-sm text-zinc-500">{locale === "ar" ? "أنشئ أكواد خصم بحدود استخدام وتواريخ انتهاء." : "Create discount codes with usage limits and expiry dates."}</p>
                </div>
                <button onClick={openNew} className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "كوبون جديد" : "New Coupon"}
                </button>
            </div>

            {coupons.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <SidebarIcon name="ticket" className="size-8 text-zinc-400 mb-3" />
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد كوبونات" : "No coupons yet"}</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {coupons.map(c => {
                        const expired = c.expires_at && new Date(c.expires_at) < now;
                        const usedUp = c.usage_limit && c.used_count >= c.usage_limit;
                        return (
                            <div key={c.id} className={`group relative rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-lg dark:bg-zinc-900 ${expired || usedUp ? 'border-zinc-300 dark:border-zinc-700 opacity-60' : 'border-zinc-200 dark:border-zinc-800'}`}>
                                {/* Coupon Code Badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-mono text-lg font-black tracking-wider text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 px-3 py-1 rounded-lg">{c.code}</span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(c)} className="flex size-7 cursor-pointer items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400"><SidebarIcon name="edit" className="size-3.5" /></button>
                                        <button onClick={() => handleDelete(c.id)} className="flex size-7 cursor-pointer items-center justify-center rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 text-zinc-400"><SidebarIcon name="trash" className="size-3.5" /></button>
                                    </div>
                                </div>
                                {/* Discount */}
                                <p className="text-3xl font-black text-zinc-900 dark:text-zinc-50 mb-1">
                                    {c.discount_type === "percentage" ? `${c.discount_value}%` : `${c.discount_value}`}
                                    <span className="text-sm font-normal text-zinc-400 ms-1">{locale === "ar" ? "خصم" : "off"}</span>
                                </p>
                                {/* Meta */}
                                <div className="space-y-1 mt-3 text-xs text-zinc-500">
                                    {c.min_order_amount && <p>{locale === "ar" ? `الحد الأدنى: ${c.min_order_amount}` : `Min order: ${c.min_order_amount}`}</p>}
                                    {c.usage_limit && <p>{locale === "ar" ? `${c.used_count}/${c.usage_limit} استخدام` : `${c.used_count}/${c.usage_limit} used`}</p>}
                                    {c.expires_at && <p className={expired ? 'text-rose-500 font-bold' : ''}>{locale === "ar" ? `ينتهي: ${new Date(c.expires_at).toLocaleDateString("ar")}` : `Expires: ${new Date(c.expires_at).toLocaleDateString()}`}</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div onClick={close} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" />
                    <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-950 shadow-2xl flex flex-col rounded-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between border-b border-zinc-100 p-6 dark:border-zinc-800">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{editing ? (locale === "ar" ? "تعديل الكوبون" : "Edit Coupon") : (locale === "ar" ? "كوبون جديد" : "New Coupon")}</h2>
                            <button onClick={close} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"><SidebarIcon name="x" className="size-5" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="coupon-form" onSubmit={handleSave} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "كود الخصم" : "Coupon Code"}</label>
                                    <input required dir="ltr" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="SUMMER2026" className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white font-mono font-bold tracking-wider" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الوصف (EN)" : "Description (EN)"}</label>
                                        <input dir="ltr" value={descEn} onChange={(e) => setDescEn(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الوصف (AR)" : "Description (AR)"}</label>
                                        <input dir="rtl" value={descAr} onChange={(e) => setDescAr(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "نوع الخصم" : "Type"}</label>
                                        <select value={discountType} onChange={(e) => setDiscountType(e.target.value as any)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white">
                                            <option value="percentage">{locale === "ar" ? "نسبة %" : "Percentage %"}</option>
                                            <option value="fixed">{locale === "ar" ? "مبلغ ثابت" : "Fixed Amount"}</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "قيمة الخصم" : "Value"}</label>
                                        <input required dir="ltr" type="number" step="0.01" min="0" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "حد الاستخدام" : "Usage Limit"}</label>
                                        <input dir="ltr" type="number" min="1" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} placeholder="∞" className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الحد الأدنى للطلب" : "Min Order"}</label>
                                        <input dir="ltr" type="number" step="0.01" min="0" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "أقصى خصم" : "Max Discount"}</label>
                                        <input dir="ltr" type="number" step="0.01" min="0" value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "يبدأ من" : "Starts At"}</label>
                                        <input dir="ltr" type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "ينتهي في" : "Expires At"}</label>
                                        <input dir="ltr" type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div onClick={() => setIsActive(!isActive)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${isActive ? 'bg-[var(--brand-primary)]' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                                        <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </div>
                                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "مفعّل" : "Active"}</span>
                                </div>
                            </form>
                        </div>
                        <div className="border-t border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50 flex justify-end gap-3">
                            <button onClick={close} type="button" className="rounded-xl border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors">{locale === "ar" ? "إلغاء" : "Cancel"}</button>
                            <button type="submit" form="coupon-form" disabled={isPending} className="flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-2 text-sm font-bold text-white shadow-lg transition-all hover:brightness-110 hover:shadow-xl disabled:opacity-50">
                                {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                                {editing ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إنشاء كوبون" : "Create Coupon")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
