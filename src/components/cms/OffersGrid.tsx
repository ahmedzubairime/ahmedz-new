"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveOffer, deleteOffer } from "@/app/actions/store-marketing";

type Props = { locale: string; offers: any[]; products: any[]; categories: any[]; };

export function OffersGrid({ locale, offers, products, categories }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);

    const [titleAr, setTitleAr] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [descAr, setDescAr] = useState("");
    const [descEn, setDescEn] = useState("");
    const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
    const [discountValue, setDiscountValue] = useState("10");
    const [productId, setProductId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [startsAt, setStartsAt] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const [isActive, setIsActive] = useState(true);

    function openNew() {
        setEditing(null); setTitleAr(""); setTitleEn(""); setDescAr(""); setDescEn("");
        setDiscountType("percentage"); setDiscountValue("10"); setProductId(""); setCategoryId("");
        setStartsAt(""); setExpiresAt(""); setIsActive(true); setModalOpen(true);
    }

    function openEdit(o: any) {
        setEditing(o); setTitleAr(o.title_ar || ""); setTitleEn(o.title_en || "");
        setDescAr(o.description_ar || ""); setDescEn(o.description_en || "");
        setDiscountType(o.discount_type || "percentage"); setDiscountValue(String(o.discount_value || ""));
        setProductId(o.product_id || ""); setCategoryId(o.category_id || "");
        setStartsAt(o.starts_at ? o.starts_at.substring(0, 16) : "");
        setExpiresAt(o.expires_at ? o.expires_at.substring(0, 16) : "");
        setIsActive(o.is_active); setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const payload: any = {
                title_ar: titleAr, title_en: titleEn, description_ar: descAr, description_en: descEn,
                discount_type: discountType, discount_value: parseFloat(discountValue) || 0,
                product_id: productId || null, category_id: categoryId || null,
                starts_at: startsAt || null, expires_at: expiresAt || null, is_active: isActive,
            };
            try { await saveOffer(payload, editing?.id); close(); }
            catch (err) { console.error(err); alert(locale === "ar" ? "فشل الحفظ" : "Save failed"); }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "حذف هذا العرض؟" : "Delete this offer?")) return;
        startTransition(async () => { await deleteOffer(id); });
    }

    const now = new Date();

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "العروض الترويجية" : "Offers"}</h1>
                    <p className="mt-1 text-sm text-zinc-500">{locale === "ar" ? "أنشئ عروض فلاش على منتجات أو تصنيفات." : "Create flash deals on specific products or categories."}</p>
                </div>
                <button onClick={openNew} className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "عرض جديد" : "New Offer"}
                </button>
            </div>

            {offers.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <SidebarIcon name="zap" className="size-8 text-zinc-400 mb-3" />
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد عروض" : "No offers yet"}</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {offers.map(o => {
                        const active = o.is_active && (!o.expires_at || new Date(o.expires_at) > now);
                        return (
                            <div key={o.id} className={`group relative rounded-2xl border bg-white p-5 shadow-sm hover:shadow-lg transition-all dark:bg-zinc-900 ${active ? 'border-zinc-200 dark:border-zinc-800' : 'border-zinc-300 dark:border-zinc-700 opacity-60'}`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`flex size-10 items-center justify-center rounded-xl ${active ? 'bg-amber-50 text-amber-500 dark:bg-amber-500/10' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'}`}>
                                            <SidebarIcon name="zap" className="size-5" />
                                        </div>
                                        <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
                                            {o.discount_type === "percentage" ? `${o.discount_value}%` : o.discount_value}
                                        </span>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(o)} className="flex size-7 cursor-pointer items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400"><SidebarIcon name="edit" className="size-3.5" /></button>
                                        <button onClick={() => handleDelete(o.id)} className="flex size-7 cursor-pointer items-center justify-center rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 text-zinc-400"><SidebarIcon name="trash" className="size-3.5" /></button>
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">{locale === "ar" ? o.title_ar : o.title_en}</h3>
                                <p className="text-xs text-zinc-500 line-clamp-2 mb-2">{locale === "ar" ? o.description_ar : o.description_en}</p>
                                <div className="flex flex-wrap gap-1 text-[10px]">
                                    {o.product && <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded dark:bg-blue-500/10 dark:text-blue-400">{locale === "ar" ? o.product.title_ar : o.product.title_en}</span>}
                                    {o.category && <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded dark:bg-emerald-500/10 dark:text-emerald-400">{locale === "ar" ? o.category.name_ar : o.category.name_en}</span>}
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
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{editing ? (locale === "ar" ? "تعديل العرض" : "Edit Offer") : (locale === "ar" ? "عرض جديد" : "New Offer")}</h2>
                            <button onClick={close} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><SidebarIcon name="x" className="size-5" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="offer-form" onSubmit={handleSave} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "عنوان العرض (EN)" : "Offer Title (EN)"}</label>
                                        <input required dir="ltr" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "عنوان العرض (AR)" : "Offer Title (AR)"}</label>
                                        <input required dir="rtl" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الوصف (EN)" : "Description (EN)"}</label>
                                    <textarea dir="ltr" rows={2} value={descEn} onChange={(e) => setDescEn(e.target.value)} className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الوصف (AR)" : "Description (AR)"}</label>
                                    <textarea dir="rtl" rows={2} value={descAr} onChange={(e) => setDescAr(e.target.value)} className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "نوع الخصم" : "Discount Type"}</label>
                                        <select value={discountType} onChange={(e) => setDiscountType(e.target.value as any)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white">
                                            <option value="percentage">{locale === "ar" ? "نسبة %" : "Percentage %"}</option>
                                            <option value="fixed">{locale === "ar" ? "مبلغ ثابت" : "Fixed"}</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "قيمة الخصم" : "Value"}</label>
                                        <input required dir="ltr" type="number" step="0.01" min="0" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "منتج محدد" : "Specific Product"}</label>
                                        <select value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white">
                                            <option value="">{locale === "ar" ? "-- الكل --" : "-- All --"}</option>
                                            {products.map(p => (<option key={p.id} value={p.id}>{locale === "ar" ? p.title_ar : p.title_en}</option>))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "تصنيف محدد" : "Specific Category"}</label>
                                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white">
                                            <option value="">{locale === "ar" ? "-- الكل --" : "-- All --"}</option>
                                            {categories.map(c => (<option key={c.id} value={c.id}>{locale === "ar" ? c.name_ar : c.name_en}</option>))}
                                        </select>
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
                            <button onClick={close} type="button" className="rounded-xl border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">{locale === "ar" ? "إلغاء" : "Cancel"}</button>
                            <button type="submit" form="offer-form" disabled={isPending} className="flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-2 text-sm font-bold text-white shadow-lg hover:brightness-110 disabled:opacity-50">
                                {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                                {editing ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إنشاء عرض" : "Create Offer")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
