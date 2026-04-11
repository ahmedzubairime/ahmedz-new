"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveVariant, deleteVariant } from "@/app/actions/store-products";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulSelect, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getVariantSchema = (locale: string) => z.object({
  product_id: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  sku: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  price: z.coerce.number().min(0),
  sale_price: z.union([z.literal(""), z.coerce.number()]).transform((val) => (val === "" ? null : Number(val))).nullable(),
  stock_quantity: z.coerce.number().min(0),
  attributes: z.array(z.object({
      key: z.string(),
      en: z.string(),
      ar: z.string()
  })),
  is_active: z.boolean(),
});

type VariantFormValues = z.infer<ReturnType<typeof getVariantSchema>>;

type Props = { locale: string; variants: any[]; products: any[]; };

export function VariantsGrid({ locale, variants, products }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const schema = useMemo(() => getVariantSchema(locale), [locale]);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<any>({
        resolver: zodResolver(schema),
        defaultValues: { is_active: true, attributes: [{ key: "", en: "", ar: "" }], price: 0, stock_quantity: 0, sale_price: "" }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "attributes" });

    function openNew() {
        setEditingId(null);
        reset({ product_id: "", sku: "", price: 0, sale_price: "", stock_quantity: 0, attributes: [{ key: "", en: "", ar: "" }], is_active: true });
        setModalOpen(true);
    }

    function openEdit(v: any) {
        setEditingId(v.id);
        const attrs = Object.entries(v.attributes || {}).map(([key, val]: [string, any]) => ({
            key, 
            en: typeof val === 'object' ? val.en || '' : String(val), 
            ar: typeof val === 'object' ? val.ar || '' : ''
        }));
        
        reset({
            product_id: v.product_id || "", 
            sku: v.sku || "",
            price: v.price || 0,
            sale_price: v.sale_price !== null ? v.sale_price : "",
            stock_quantity: v.stock_quantity || 0,
            is_active: v.is_active,
            attributes: attrs.length > 0 ? attrs : [{ key: "", en: "", ar: "" }]
        });
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function onSubmit(data: VariantFormValues) {
        startTransition(async () => {
            try {
                // Build JSONB: {"Color": {"en": "Red", "ar": "أحمر"}}
                const attrObj: Record<string, { en: string; ar: string }> = {};
                data.attributes.forEach(a => { if (a.key.trim()) attrObj[a.key.trim()] = { en: a.en, ar: a.ar }; });

                const payload = { ...data, attributes: attrObj };
                await saveVariant(payload, editingId || undefined);
                close();
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully", { icon: "📦" });
            } catch (err) {
                toast.error(locale === "ar" ? "الـ SKU مُستخدم أو فشل الحفظ" : "SKU exists or save failed");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "حذف هذا المتغيّر؟" : "Delete this variant?")) return;
        startTransition(async () => {
            try { await deleteVariant(id); toast.success(locale === "ar" ? "تم الحذف" : "Deleted"); }
            catch(e) { toast.error(locale === "ar" ? "فشل الحذف" : "Delete failed"); }
        });
    }

    const prodOptions = useMemo(() => {
        return [{ value: "", label: locale === "ar" ? "-- اختر منتج --" : "-- Select Product --" }, ...products.map(p => ({ value: p.id, label: locale === "ar" ? p.title_ar : p.title_en }))];
    }, [products, locale]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-teal-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {locale === "ar" ? "متغيّرات المنتجات" : "Product Variants"}
                    </h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="layers" className="size-4 text-teal-500" />
                        {locale === "ar" ? "أضف ألوان، أحجام، ومتغيّرات أخرى بمرونة." : "Add colors, sizes, and dynamic attributes flexibly."}
                    </p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-teal-600 hover:!shadow-teal-500/30 text-white">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "متغيّر جديد" : "New Variant"}
                </PlayfulButton>
            </motion.div>

            {variants.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-teal-500/10 text-teal-500 mb-4 animate-[spin_4s_linear_infinite]"><SidebarIcon name="loader" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد متغيّرات" : "No variants created"}</h3>
                    <p className="mt-2 text-sm font-medium text-zinc-500">{locale === "ar" ? "ابدأ بإضافة أحجام أو ألوان لمنتجاتك." : "Start by adding sizes or colors to products."}</p>
                </motion.div>
            ) : (
                <div className="rounded-3xl border-2 border-zinc-100 bg-white/90 shadow-xl dark:border-zinc-800 dark:bg-zinc-900/90 backdrop-blur-md overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-sm font-medium text-left">
                            <thead>
                                <tr className="border-b-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80">
                                    <th className="px-6 py-4 font-black text-zinc-500 uppercase tracking-widest text-[10px] whitespace-nowrap">{locale === "ar" ? "المنتج التابع" : "Parent Product"}</th>
                                    <th className="px-6 py-4 font-black text-zinc-500 uppercase tracking-widest text-[10px] whitespace-nowrap">SKU</th>
                                    <th className="px-6 py-4 font-black text-zinc-500 uppercase tracking-widest text-[10px] whitespace-nowrap">{locale === "ar" ? "الخصائص (ديناميكية)" : "Dynamic Attributes"}</th>
                                    <th className="px-6 py-4 font-black text-zinc-500 uppercase tracking-widest text-[10px] whitespace-nowrap">{locale === "ar" ? "الجرد" : "Inventory"}</th>
                                    <th className="px-6 py-4 text-right font-black text-zinc-500 uppercase tracking-widest text-[10px] whitespace-nowrap">{locale === "ar" ? "إجراءات" : "Actions"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {variants.map((v, i) => (
                                        <motion.tr 
                                            key={v.id} 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className={`group border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors ${!v.is_active ? 'opacity-60 grayscale-[30%]' : ''}`}
                                        >
                                            <td className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-100 min-w-40 align-middle">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span>{v.product ? (locale === "ar" ? v.product.title_ar : v.product.title_en) : "—"}</span>
                                                    {!v.is_active && <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">Hidden</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-sm text-teal-600 dark:text-teal-400 drop-shadow-sm min-w-32 align-middle">{v.sku}</td>
                                            
                                            <td className="px-6 py-4 align-middle">
                                                <div className="flex items-center flex-wrap gap-1.5 min-w-48">
                                                    {Object.keys(v.attributes || {}).length === 0 ? <span className="text-xs text-zinc-400 font-medium">—</span> : null}
                                                    {Object.entries(v.attributes || {}).map(([key, val]: [string, any]) => (
                                                        <span key={key} className="text-xs font-black tracking-tight bg-teal-50 dark:bg-teal-900/20 px-2.5 py-1 rounded-md text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-800/50 shadow-inner">
                                                            <span className="opacity-60 mr-1">{key}:</span>{typeof val === 'object' ? (locale === "ar" ? val.ar : val.en) : String(val)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 min-w-32 align-middle">
                                                <div className="flex flex-col gap-1.5 w-fit">
                                                    <div className="flex items-center gap-2 text-sm font-black whitespace-nowrap">
                                                        <span className={v.sale_price ? "text-zinc-400 line-through text-[10px] font-semibold" : "text-zinc-900 dark:text-zinc-100"}>{v.price}</span>
                                                        {v.sale_price && <span className="text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-1.5 rounded-md">{v.sale_price}</span>}
                                                    </div>
                                                    <span className={`inline-flex items-center gap-1 w-fit rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest shadow-inner ${v.stock_quantity > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                                                        <SidebarIcon name="package" className="size-3" />
                                                        {v.stock_quantity > 0 ? v.stock_quantity : 'OOS'}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 align-middle">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openEdit(v)} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-white shadow hover:scale-110 hover:text-teal-600 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 transition-all text-zinc-500"><SidebarIcon name="edit" className="size-4" /></button>
                                                    <button onClick={() => handleDelete(v.id)} disabled={isPending} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-white shadow text-rose-600 hover:scale-110 hover:bg-rose-600 hover:text-white border border-rose-100 dark:bg-zinc-800 dark:border-rose-900/50 transition-all"><SidebarIcon name="trash" className="size-4" /></button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل المتغيّر" : "Edit Variant") : (locale === "ar" ? "متغيّر جديد" : "New Variant")}
                footer={
                    <>
                        <PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                        <PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-teal-600 hover:!bg-teal-700 text-white shadow-teal-500/30">
                            {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                            {editingId ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إنشاء المتغيّر" : "Create Variant")}
                        </PlayfulButton>
                    </>
                }
            >
                <form id="variant-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <Controller name="product_id" control={control} render={({ field }) => (
                            <PlayfulSelect label={locale === "ar" ? "المنتج التابع" : "Parent Product"} options={prodOptions} {...field} error={errors.product_id?.message as string} />
                        )} />
                        <PlayfulInput label="SKU" dir="ltr" placeholder="PRD-RED-XL" className="font-mono text-[var(--brand-primary)]" {...register("sku")} error={errors.sku?.message as string} />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <PlayfulInput label={locale === "ar" ? "السعر الأساسي" : "Base Price"} type="number" step="any" dir="ltr" {...register("price")} error={errors.price?.message as string} />
                        <PlayfulInput label={locale === "ar" ? "سعر التخفيض" : "Sale Price"} type="number" step="any" dir="ltr" {...register("sale_price")} error={errors.sale_price?.message as string} />
                        <PlayfulInput label={locale === "ar" ? "المخزون المتوفر" : "Stock Qty"} type="number" dir="ltr" {...register("stock_quantity")} error={errors.stock_quantity?.message as string} className="font-black" />
                    </div>

                    {/* Dynamic Bilingual Attributes Builder */}
                    <div className="space-y-3 p-5 rounded-3xl border border-dashed border-zinc-200 bg-white/50 dark:border-zinc-800 dark:bg-zinc-900/50 shadow-inner">
                        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-2">
                            <label className="text-sm font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                                {locale === "ar" ? "الخصائص الديناميكية" : "Dynamic Attributes"}
                            </label>
                            <PlayfulButton type="button" onClick={() => append({ key: "", en: "", ar: "" })} className="!bg-teal-50 !text-teal-700 hover:!bg-teal-100 dark:!bg-teal-900/30 dark:!text-teal-400 !px-3 font-bold !h-8 text-[11px] uppercase tracking-widest shadow-sm">
                                + {locale === "ar" ? "إضافة خاصية" : "Add attribute"}
                            </PlayfulButton>
                        </div>
                        
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-[1fr_1fr_1fr_36px] gap-2 items-start relative group pl-2">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 group-hover:bg-teal-400 transition-colors" />
                                <PlayfulInput label={locale === "ar" ? "المفتاح" : "Key(e.g. Color)"} dir="ltr" placeholder="Color" {...register(`attributes.${index}.key` as const)} className="!my-0 font-mono text-sm" />
                                <PlayfulInput label="EN(Red)" dir="ltr" placeholder="Red" {...register(`attributes.${index}.en` as const)} className="!my-0 text-sm" />
                                <PlayfulInput label="AR(أحمر)" dir="rtl" placeholder="أحمر" {...register(`attributes.${index}.ar` as const)} className="!my-0 text-sm" />
                                <div className="pt-[22px]">
                                    <button type="button" onClick={() => remove(index)} className="flex size-14 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white shadow-sm border border-zinc-100 text-zinc-400 hover:bg-rose-500 hover:text-white dark:bg-zinc-800 dark:border-zinc-700 transition-colors"><SidebarIcon name="x" className="size-4" /></button>
                                </div>
                            </div>
                        ))}
                        {fields.length === 0 && (
                            <div className="text-center py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                {locale === "ar" ? "لا توجد خصائص. أضف حجماً أو لوناً." : "No attributes. Add a size or color."}
                            </div>
                        )}
                    </div>

                    <div className="pt-2 pl-4 border-t border-zinc-100 dark:border-zinc-800">
                        <Controller name="is_active" control={control} render={({ field }) => (
                            <PlayfulSwitch label={locale === "ar" ? "مرئي للعميل" : "Active & Purchasable"} checked={field.value} onChange={field.onChange} />
                        )} />
                    </div>
                </form>
            </PlayfulModal>
        </div>
    );
}
