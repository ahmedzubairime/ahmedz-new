"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveVariant, deleteVariant } from "@/app/actions/store-products";

type Props = { locale: string; variants: any[]; products: any[]; };

export function VariantsGrid({ locale, variants, products }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);

    const [productId, setProductId] = useState("");
    const [sku, setSku] = useState("");
    const [price, setPrice] = useState("0");
    const [salePrice, setSalePrice] = useState("");
    const [stockQty, setStockQty] = useState("0");
    const [attributes, setAttributes] = useState<{ key: string; en: string; ar: string }[]>([]);
    const [isActive, setIsActive] = useState(true);

    function openNew() {
        setEditing(null); setProductId(""); setSku(""); setPrice("0"); setSalePrice(""); setStockQty("0");
        setAttributes([{ key: "", en: "", ar: "" }]); setIsActive(true); setModalOpen(true);
    }

    function openEdit(v: any) {
        setEditing(v); setProductId(v.product_id || ""); setSku(v.sku || "");
        setPrice(String(v.price || 0)); setSalePrice(String(v.sale_price || ""));
        setStockQty(String(v.stock_quantity || 0)); setIsActive(v.is_active);
        // Parse JSONB attributes back into form
        const attrs = Object.entries(v.attributes || {}).map(([key, val]: [string, any]) => ({
            key, en: typeof val === 'object' ? val.en || '' : String(val), ar: typeof val === 'object' ? val.ar || '' : ''
        }));
        setAttributes(attrs.length > 0 ? attrs : [{ key: "", en: "", ar: "" }]);
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function addAttr() { setAttributes([...attributes, { key: "", en: "", ar: "" }]); }
    function removeAttr(i: number) { setAttributes(attributes.filter((_, idx) => idx !== i)); }
    function updateAttr(i: number, field: "key" | "en" | "ar", val: string) {
        const copy = [...attributes]; copy[i][field] = val; setAttributes(copy);
    }

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            // Build JSONB: {"Color": {"en": "Red", "ar": "أحمر"}}
            const attrObj: Record<string, { en: string; ar: string }> = {};
            attributes.forEach(a => { if (a.key.trim()) attrObj[a.key.trim()] = { en: a.en, ar: a.ar }; });

            const payload: any = {
                product_id: productId, sku, price: parseFloat(price) || 0,
                sale_price: salePrice ? parseFloat(salePrice) : null,
                stock_quantity: parseInt(stockQty) || 0, attributes: attrObj, is_active: isActive,
            };
            try { await saveVariant(payload, editing?.id); close(); }
            catch (err) { console.error(err); alert(locale === "ar" ? "فشل الحفظ" : "Save failed"); }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "حذف هذا المتغيّر؟" : "Delete this variant?")) return;
        startTransition(async () => { await deleteVariant(id); });
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "متغيّرات المنتجات" : "Product Variants"}</h1>
                    <p className="mt-1 text-sm text-zinc-500">{locale === "ar" ? "أضف ألوان، أحجام، ومتغيّرات أخرى." : "Add colors, sizes, and dynamic variant attributes."}</p>
                </div>
                <button onClick={openNew} className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "متغيّر جديد" : "New Variant"}
                </button>
            </div>

            {variants.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <SidebarIcon name="layers" className="size-8 text-zinc-400 mb-3" />
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد متغيّرات" : "No variants yet"}</h3>
                </div>
            ) : (
                <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80">
                                <th className="px-4 py-3 text-start font-semibold text-zinc-500">{locale === "ar" ? "المنتج" : "Product"}</th>
                                <th className="px-4 py-3 text-start font-semibold text-zinc-500">SKU</th>
                                <th className="px-4 py-3 text-start font-semibold text-zinc-500">{locale === "ar" ? "الخصائص" : "Attributes"}</th>
                                <th className="px-4 py-3 text-start font-semibold text-zinc-500">{locale === "ar" ? "السعر" : "Price"}</th>
                                <th className="px-4 py-3 text-start font-semibold text-zinc-500">{locale === "ar" ? "المخزون" : "Stock"}</th>
                                <th className="px-4 py-3 text-end font-semibold text-zinc-500">{locale === "ar" ? "إجراءات" : "Actions"}</th>
                            </tr></thead>
                            <tbody>
                                {variants.map(v => (
                                    <tr key={v.id} className="group border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                                            {v.product ? (locale === "ar" ? v.product.title_ar : v.product.title_en) : "—"}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-zinc-500">{v.sku}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {Object.entries(v.attributes || {}).map(([key, val]: [string, any]) => (
                                                    <span key={key} className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                                                        {key}: {typeof val === 'object' ? (locale === "ar" ? val.ar : val.en) : String(val)}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-bold text-zinc-700 dark:text-zinc-300">{v.price}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${v.stock_quantity > 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                                                {v.stock_quantity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(v)} className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400"><SidebarIcon name="edit" className="size-4" /></button>
                                                <button onClick={() => handleDelete(v.id)} className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 text-zinc-400"><SidebarIcon name="trash" className="size-4" /></button>
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
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{editing ? (locale === "ar" ? "تعديل المتغيّر" : "Edit Variant") : (locale === "ar" ? "متغيّر جديد" : "New Variant")}</h2>
                            <button onClick={close} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><SidebarIcon name="x" className="size-5" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="variant-form" onSubmit={handleSave} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "المنتج" : "Product"}</label>
                                        <select required value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white">
                                            <option value="">{locale === "ar" ? "-- اختر منتج --" : "-- Select Product --"}</option>
                                            {products.map(p => (<option key={p.id} value={p.id}>{locale === "ar" ? p.title_ar : p.title_en}</option>))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">SKU</label>
                                        <input required dir="ltr" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="PRD-RED-XL" className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white font-mono text-sm" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "السعر" : "Price"}</label>
                                        <input required dir="ltr" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "سعر عرض" : "Sale Price"}</label>
                                        <input dir="ltr" type="number" step="0.01" min="0" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "المخزون" : "Stock"}</label>
                                        <input dir="ltr" type="number" min="0" value={stockQty} onChange={(e) => setStockQty(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>

                                {/* Dynamic Bilingual Attributes Builder */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الخصائص (ثنائية اللغة)" : "Attributes (Bilingual)"}</label>
                                        <button type="button" onClick={addAttr} className="text-xs font-bold text-[var(--brand-primary)] hover:underline cursor-pointer">+ {locale === "ar" ? "إضافة خاصية" : "Add attribute"}</button>
                                    </div>
                                    {attributes.map((a, i) => (
                                        <div key={i} className="grid grid-cols-[1fr_1fr_1fr_32px] gap-2 items-end">
                                            <input dir="ltr" value={a.key} onChange={(e) => updateAttr(i, "key", e.target.value)} placeholder="Color" className="rounded-lg border border-zinc-200 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                            <input dir="ltr" value={a.en} onChange={(e) => updateAttr(i, "en", e.target.value)} placeholder="Red" className="rounded-lg border border-zinc-200 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                            <input dir="rtl" value={a.ar} onChange={(e) => updateAttr(i, "ar", e.target.value)} placeholder="أحمر" className="rounded-lg border border-zinc-200 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                            <button type="button" onClick={() => removeAttr(i)} className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-rose-50 text-zinc-400 hover:text-rose-500"><SidebarIcon name="x" className="size-4" /></button>
                                        </div>
                                    ))}
                                </div>
                            </form>
                        </div>
                        <div className="border-t border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50 flex justify-end gap-3">
                            <button onClick={close} type="button" className="rounded-xl border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">{locale === "ar" ? "إلغاء" : "Cancel"}</button>
                            <button type="submit" form="variant-form" disabled={isPending} className="flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-2 text-sm font-bold text-white shadow-lg hover:brightness-110 disabled:opacity-50">
                                {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                                {editing ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إنشاء" : "Create")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
