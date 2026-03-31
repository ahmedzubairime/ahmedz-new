"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveStoreProduct, deleteStoreProduct } from "@/app/actions/store-products";

type Props = { locale: string; products: any[]; categories: any[]; };

export function StoreProductsGrid({ locale, products, categories }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [search, setSearch] = useState("");

    const [titleAr, setTitleAr] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [slug, setSlug] = useState("");
    const [descAr, setDescAr] = useState("");
    const [descEn, setDescEn] = useState("");
    const [basePrice, setBasePrice] = useState("0");
    const [salePrice, setSalePrice] = useState("");
    const [sku, setSku] = useState("");
    const [barcode, setBarcode] = useState("");
    const [stockQty, setStockQty] = useState("0");
    const [categoryId, setCategoryId] = useState("");
    const [isActive, setIsActive] = useState(true);

    function openNew() {
        setEditing(null); setTitleAr(""); setTitleEn(""); setSlug(""); setDescAr(""); setDescEn("");
        setBasePrice("0"); setSalePrice(""); setSku(""); setBarcode(""); setStockQty("0");
        setCategoryId(""); setIsActive(true); setModalOpen(true);
    }

    function openEdit(p: any) {
        setEditing(p); setTitleAr(p.title_ar || ""); setTitleEn(p.title_en || ""); setSlug(p.slug || "");
        setDescAr(p.description_ar || ""); setDescEn(p.description_en || "");
        setBasePrice(String(p.base_price || 0)); setSalePrice(String(p.sale_price || ""));
        setSku(p.sku || ""); setBarcode(p.barcode || ""); setStockQty(String(p.stock_quantity || 0));
        setCategoryId(p.category_id || ""); setIsActive(p.is_active); setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function handleTitleEnChange(val: string) {
        setTitleEn(val);
        if (!editing) setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const payload: any = {
                title_ar: titleAr, title_en: titleEn, slug,
                description_ar: descAr, description_en: descEn,
                base_price: parseFloat(basePrice) || 0,
                sale_price: salePrice ? parseFloat(salePrice) : null,
                sku: sku || null, barcode: barcode || null,
                stock_quantity: parseInt(stockQty) || 0,
                category_id: categoryId || null, is_active: isActive,
            };
            try {
                await saveStoreProduct(payload, editing?.id);
                close();
            } catch (err) { console.error(err); alert(locale === "ar" ? "فشل الحفظ" : "Save failed"); }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "سيتم أرشفة المنتج (لن يُحذف نهائياً)" : "Product will be archived (soft delete)")) return;
        startTransition(async () => { await deleteStoreProduct(id); });
    }

    const filtered = products.filter(p => {
        const q = search.toLowerCase();
        return !q || p.title_en?.toLowerCase().includes(q) || p.title_ar?.includes(q) || p.sku?.toLowerCase().includes(q);
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "المنتجات" : "Products"}</h1>
                    <p className="mt-1 text-sm text-zinc-500">{locale === "ar" ? "مخزون المنتجات والأسعار والتصنيفات." : "Manage inventory, pricing, and categories."}</p>
                </div>
                <button onClick={openNew} className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "منتج جديد" : "New Product"}
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <SidebarIcon name="search" className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={locale === "ar" ? "بحث بالاسم أو SKU..." : "Search by name or SKU..."} className="w-full rounded-xl border border-zinc-200 bg-white ps-10 pe-4 py-2.5 text-sm outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white" />
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex size-16 items-center justify-center rounded-full bg-white dark:bg-zinc-800 mb-4 shadow-sm text-zinc-400"><SidebarIcon name="package" className="size-8" /></div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد منتجات" : "No products yet"}</h3>
                </div>
            ) : (
                <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80">
                                    <th className="px-4 py-3 text-start font-semibold text-zinc-500 dark:text-zinc-400">{locale === "ar" ? "المنتج" : "Product"}</th>
                                    <th className="px-4 py-3 text-start font-semibold text-zinc-500 dark:text-zinc-400">SKU</th>
                                    <th className="px-4 py-3 text-start font-semibold text-zinc-500 dark:text-zinc-400">{locale === "ar" ? "السعر" : "Price"}</th>
                                    <th className="px-4 py-3 text-start font-semibold text-zinc-500 dark:text-zinc-400">{locale === "ar" ? "المخزون" : "Stock"}</th>
                                    <th className="px-4 py-3 text-start font-semibold text-zinc-500 dark:text-zinc-400">{locale === "ar" ? "التصنيف" : "Category"}</th>
                                    <th className="px-4 py-3 text-end font-semibold text-zinc-500 dark:text-zinc-400">{locale === "ar" ? "إجراءات" : "Actions"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p) => (
                                    <tr key={p.id} className="group border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                                                    {p.cover?.storage_path ? (
                                                        <img src={`${supabaseUrl}/storage/v1/object/public/${p.cover.bucket}/${p.cover.storage_path}`} alt="" className="size-10 object-cover" />
                                                    ) : (
                                                        <SidebarIcon name="image" className="size-4 text-zinc-400" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{locale === "ar" ? p.title_ar : p.title_en}</p>
                                                    <p className="text-xs text-zinc-400 font-mono truncate">/{p.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-zinc-500">{p.sku || "—"}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                {p.sale_price ? (
                                                    <>
                                                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{p.sale_price}</span>
                                                        <span className="text-xs text-zinc-400 line-through">{p.base_price}</span>
                                                    </>
                                                ) : (
                                                    <span className="font-bold text-zinc-700 dark:text-zinc-300">{p.base_price}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${p.stock_quantity > 10 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : p.stock_quantity > 0 ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                                                {p.stock_quantity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-zinc-500">{p.category ? (locale === "ar" ? p.category.name_ar : p.category.name_en) : "—"}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(p)} className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 transition-colors"><SidebarIcon name="edit" className="size-4" /></button>
                                                <button onClick={() => handleDelete(p.id)} disabled={isPending} className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 text-zinc-400 transition-colors"><SidebarIcon name="archive" className="size-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div onClick={close} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" />
                    <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-950 shadow-2xl flex flex-col rounded-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between border-b border-zinc-100 p-6 dark:border-zinc-800">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                {editing ? (locale === "ar" ? "تعديل المنتج" : "Edit Product") : (locale === "ar" ? "منتج جديد" : "New Product")}
                            </h2>
                            <button onClick={close} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"><SidebarIcon name="x" className="size-5" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="product-form" onSubmit={handleSave} className="space-y-5">
                                {/* Bilingual Titles */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "اسم المنتج (EN)" : "Product Name (EN)"}</label>
                                        <input required dir="ltr" value={titleEn} onChange={(e) => handleTitleEnChange(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "اسم المنتج (AR)" : "Product Name (AR)"}</label>
                                        <input required dir="rtl" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                {/* Slug */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الرابط (Slug)" : "URL Slug"}</label>
                                    <input required dir="ltr" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white font-mono text-sm" />
                                </div>
                                {/* Bilingual Descriptions */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الوصف (EN)" : "Description (EN)"}</label>
                                    <textarea dir="ltr" rows={2} value={descEn} onChange={(e) => setDescEn(e.target.value)} className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الوصف (AR)" : "Description (AR)"}</label>
                                    <textarea dir="rtl" rows={2} value={descAr} onChange={(e) => setDescAr(e.target.value)} className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                </div>
                                {/* Pricing */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "السعر الأساسي" : "Base Price"}</label>
                                        <input required dir="ltr" type="number" step="0.01" min="0" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "سعر التخفيض" : "Sale Price"}</label>
                                        <input dir="ltr" type="number" step="0.01" min="0" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="—" className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الكمية" : "Stock"}</label>
                                        <input dir="ltr" type="number" min="0" value={stockQty} onChange={(e) => setStockQty(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                {/* SKU + Barcode */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">SKU</label>
                                        <input dir="ltr" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="PRD-001" className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white font-mono text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الباركود" : "Barcode"}</label>
                                        <input dir="ltr" value={barcode} onChange={(e) => setBarcode(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white font-mono text-sm" />
                                    </div>
                                </div>
                                {/* Category + Active */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "التصنيف" : "Category"}</label>
                                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white">
                                            <option value="">{locale === "ar" ? "-- بدون تصنيف --" : "-- No Category --"}</option>
                                            {categories.map(c => (<option key={c.id} value={c.id}>{locale === "ar" ? c.name_ar : c.name_en}</option>))}
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-3 pt-8">
                                        <div onClick={() => setIsActive(!isActive)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${isActive ? 'bg-[var(--brand-primary)]' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                                            <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </div>
                                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "نشط" : "Active"}</span>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="border-t border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50 flex justify-end gap-3">
                            <button onClick={close} type="button" className="rounded-xl border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors">{locale === "ar" ? "إلغاء" : "Cancel"}</button>
                            <button type="submit" form="product-form" disabled={isPending} className="flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-2 text-sm font-bold text-white shadow-lg transition-all hover:brightness-110 hover:shadow-xl disabled:opacity-50">
                                {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                                {editing ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة منتج" : "Create Product")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
