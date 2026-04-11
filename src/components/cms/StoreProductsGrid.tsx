"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveStoreProduct, deleteStoreProduct } from "@/app/actions/store-products";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulSelect, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion } from "framer-motion";

const getProductSchema = (locale: string) => z.object({
  title_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  title_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  slug: z.string().min(1, locale === "ar" ? "مطلوب" : "Required").regex(/^[a-z0-9-]+$/, locale === "ar" ? "أحرف إنجليزية صغيرة وأرقام فقط" : "Lowercase, numbers & hyphens only"),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  base_price: z.any(),
  sale_price: z.any(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  stock_quantity: z.any(),
  category_id: z.string().optional(),
  is_active: z.boolean(),
});

type ProductFormValues = z.infer<ReturnType<typeof getProductSchema>>;

type Props = { locale: string; products: any[]; categories: any[]; };

export function StoreProductsGrid({ locale, products, categories }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const schema = getProductSchema(locale);

    const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<ProductFormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: { base_price: 0, stock_quantity: 0, is_active: true }
    });

    function openNew() {
        setEditingId(null);
        reset({ title_ar: "", title_en: "", slug: "", description_ar: "", description_en: "", base_price: 0, sale_price: null, sku: "", barcode: "", stock_quantity: 0, category_id: "", is_active: true });
        setModalOpen(true);
    }

    function openEdit(p: any) {
        setEditingId(p.id);
        reset({
            title_ar: p.title_ar || "", title_en: p.title_en || "", slug: p.slug || "",
            description_ar: p.description_ar || "", description_en: p.description_en || "",
            base_price: p.base_price || 0, sale_price: p.sale_price ?? null,
            sku: p.sku || "", barcode: p.barcode || "", stock_quantity: p.stock_quantity || 0,
            category_id: p.category_id || "", is_active: p.is_active
        });
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function handleTitleEnChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
        setValue("title_en", val, { shouldValidate: true });
        if (!editingId) setValue("slug", val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), { shouldValidate: true });
    }

    function onSubmit(data: any) {
        startTransition(async () => {
            const payload = {
                ...data,
                base_price: parseFloat(String(data.base_price)) || 0,
                stock_quantity: parseInt(String(data.stock_quantity)) || 0,
                sale_price: (Number.isNaN(parseFloat(String(data.sale_price))) || parseFloat(String(data.sale_price)) === 0) ? null : parseFloat(String(data.sale_price)),
                sku: data.sku || null,
                barcode: data.barcode || null,
                category_id: data.category_id || null,
            };
            try {
                await saveStoreProduct(payload, editingId || undefined);
                close();
                toast.success(locale === "ar" ? "تم الحفظ بنجاح!" : "Saved successfully!", { icon: "🛍️" });
            } catch (err) {
                console.error(err);
                toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "سيتم أرشفة المنتج (لن يُحذف نهائياً)" : "Product will be archived (soft delete)")) return;
        startTransition(async () => { 
            try {
                await deleteStoreProduct(id); 
                toast.success(locale === "ar" ? "تم الأرشفة" : "Archived");
            } catch {
                toast.error("Failed");
            }
        });
    }

    const filtered = products.filter(p => {
        const q = search.toLowerCase();
        return !q || p.title_en?.toLowerCase().includes(q) || p.title_ar?.includes(q) || p.sku?.toLowerCase().includes(q);
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-blue-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{locale === "ar" ? "المنتجات" : "Products"}</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500"><SidebarIcon name="package" className="size-4" />{locale === "ar" ? "مخزون المنتجات والأسعار والتصنيفات." : "Manage inventory, pricing, and categories."}</p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-[var(--brand-primary)] hover:!shadow-[var(--brand-primary)]/30">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "منتج جديد" : "New Product"}
                </PlayfulButton>
            </motion.div>

            {/* Search */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative group">
                <SidebarIcon name="search" className="absolute start-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400 transition-colors group-focus-within:text-[var(--brand-primary)]" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={locale === "ar" ? "بحث بالاسم أو SKU..." : "Search by name or SKU..."} className="w-full rounded-2xl border-2 border-zinc-200 bg-white/60 ps-12 pe-4 py-3 outline-none backdrop-blur-md transition-all focus:border-[var(--brand-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--brand-primary)]/20 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-white" />
            </motion.div>

            {/* Table */}
            {filtered.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20 flex-col items-center">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] mb-4 animate-bounce"><SidebarIcon name="package-search" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد منتجات مطابقة" : "No products found"}</h3>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border-2 border-zinc-200/60 bg-white/80 dark:border-zinc-800/80 dark:bg-zinc-900/80 overflow-hidden shadow-xl shadow-zinc-200/20 dark:shadow-none backdrop-blur-md">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50">
                                    <th className="px-6 py-4 text-start font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{locale === "ar" ? "المنتج" : "Product"}</th>
                                    <th className="px-6 py-4 text-start font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">SKU</th>
                                    <th className="px-6 py-4 text-start font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{locale === "ar" ? "السعر" : "Price"}</th>
                                    <th className="px-6 py-4 text-start font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{locale === "ar" ? "المخزون" : "Stock"}</th>
                                    <th className="px-6 py-4 text-start font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{locale === "ar" ? "التصنيف" : "Category"}</th>
                                    <th className="px-6 py-4 text-end font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{locale === "ar" ? "إجراءات" : "Actions"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p) => (
                                    <tr key={p.id} className="group border-b border-zinc-50 dark:border-zinc-800/30 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 shadow-inner dark:bg-zinc-800 overflow-hidden relative">
                                                    {p.cover?.storage_path ? (
                                                        <img src={`${supabaseUrl}/storage/v1/object/public/${p.cover.bucket}/${p.cover.storage_path}`} alt="" className="absolute inset-0 size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <SidebarIcon name="image" className="size-5 text-zinc-400" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate text-base">{locale === "ar" ? p.title_ar : p.title_en}</p>
                                                    <p className="text-xs font-semibold text-zinc-400 font-mono truncate bg-zinc-100 dark:bg-zinc-800 w-fit px-2 py-0.5 rounded-md mt-1">/{p.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono font-medium text-xs text-zinc-500">{p.sku || "—"}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                {p.sale_price ? (
                                                    <>
                                                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-lg">${p.sale_price}</span>
                                                        <span className="text-xs font-medium text-zinc-400 line-through decoration-rose-400/50">${p.base_price}</span>
                                                    </>
                                                ) : (
                                                    <span className="font-black text-zinc-700 dark:text-zinc-300 text-lg">${p.base_price}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-black shadow-sm ${p.stock_quantity > 10 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:border-none dark:bg-emerald-500/10 dark:text-emerald-400' : p.stock_quantity > 0 ? 'bg-amber-50 text-amber-600 border border-amber-200 dark:border-none dark:bg-amber-500/10 dark:text-amber-400' : 'bg-rose-50 text-rose-600 border border-rose-200 dark:border-none dark:bg-rose-500/10 dark:text-rose-400'}`}>
                                                {p.stock_quantity === 0 && <SidebarIcon name="alert-circle" className="size-3" />}
                                                {p.stock_quantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {p.category ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-lg">
                                                    <SidebarIcon name="folder" className="size-3" /> {locale === "ar" ? p.category.name_ar : p.category.name_en}
                                                </span>
                                            ) : "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-300">
                                                <button onClick={() => openEdit(p)} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-white shadow-sm hover:scale-110 hover:bg-zinc-50 hover:text-zinc-900 border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-400 transition-all"><SidebarIcon name="edit" className="size-4" /></button>
                                                <button onClick={() => handleDelete(p.id)} disabled={isPending} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-rose-50 shadow-sm border border-rose-100 hover:scale-110 hover:bg-rose-100 hover:text-rose-600 dark:border-rose-900 dark:bg-rose-500/10 text-rose-500 transition-all"><SidebarIcon name="archive" className="size-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* Form Modal */}
            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل المنتج" : "Edit Product") : (locale === "ar" ? "منتج جديد" : "New Product")}
                footer={
                    <>
                        <PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                        <PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending}>
                            {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                            {editingId ? "Save" : "Create"}
                        </PlayfulButton>
                    </>
                }
            >
                <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "اسم المنتج (EN)" : "Product Name (EN)"} dir="ltr" {...register("title_en")} onChange={handleTitleEnChange} error={errors.title_en?.message} />
                        <PlayfulInput label={locale === "ar" ? "اسم المنتج (AR)" : "Product Name (AR)"} dir="rtl" {...register("title_ar")} error={errors.title_ar?.message} />
                    </div>
                    
                    <PlayfulInput label={locale === "ar" ? "الرابط (Slug)" : "URL Slug"} dir="ltr" {...register("slug")} error={errors.slug?.message} />
                    
                    <div className="grid grid-cols-2 gap-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (EN)" : "Description (EN)"} dir="ltr" rows={2} {...register("description_en")} error={errors.description_en?.message} />
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (AR)" : "Description (AR)"} dir="rtl" rows={2} {...register("description_ar")} error={errors.description_ar?.message} />
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-2 border-emerald-500/20 bg-emerald-500/5 p-4 rounded-3xl dark:border-emerald-500/10">
                        <PlayfulInput label={locale === "ar" ? "السعر الأساسي" : "Base Price (USD)"} type="number" step="0.01" dir="ltr" {...register("base_price", { valueAsNumber: true })} error={errors.base_price?.message as string} />
                        <PlayfulInput label={locale === "ar" ? "سعر التخفيض" : "Sale Price"} type="number" step="0.01" dir="ltr" placeholder="—" {...register("sale_price", { valueAsNumber: true })} error={errors.sale_price?.message as string} />
                        <PlayfulInput label={locale === "ar" ? "الكمية" : "Stock Qty"} type="number" dir="ltr" {...register("stock_quantity", { valueAsNumber: true })} error={errors.stock_quantity?.message as string} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label="SKU" dir="ltr" placeholder="PRD-001" {...register("sku")} error={errors.sku?.message} />
                        <PlayfulInput label={locale === "ar" ? "الباركود" : "Barcode"} dir="ltr" {...register("barcode")} error={errors.barcode?.message} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulSelect label={locale === "ar" ? "التصنيف" : "Category"} {...register("category_id")} error={errors.category_id?.message}
                            options={[{ value: "", label: "-- No Category --" }, ...categories.map(c => ({ value: c.id, label: locale === "ar" ? c.name_ar : c.name_en }))]} 
                        />
                        <Controller name="is_active" control={control} render={({ field }) => (
                            <div className="pt-2 pl-4">
                                <PlayfulSwitch label={locale === "ar" ? "نشط ومتاح للبيع" : "Active & Available"} checked={field.value} onChange={field.onChange} />
                            </div>
                        )} />
                    </div>
                </form>
            </PlayfulModal>
        </div>
    );
}
