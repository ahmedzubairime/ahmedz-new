"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveOffer, deleteOffer } from "@/app/actions/store-marketing";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulSelect, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion } from "framer-motion";

const getOfferSchema = (locale: string) => z.object({
  title_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  title_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.any(),
  product_id: z.string().optional(),
  category_id: z.string().optional(),
  starts_at: z.string().optional(),
  expires_at: z.string().optional(),
  is_active: z.boolean(),
});

type OfferFormValues = z.infer<ReturnType<typeof getOfferSchema>>;

type Props = { locale: string; offers: any[]; products: any[]; categories: any[]; };

export function OffersGrid({ locale, offers, products, categories }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const schema = getOfferSchema(locale);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<OfferFormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: { discount_type: "percentage", discount_value: 10, is_active: true }
    });

    function openNew() {
        setEditingId(null);
        reset({ title_ar: "", title_en: "", description_ar: "", description_en: "", discount_type: "percentage", discount_value: 10, product_id: "", category_id: "", starts_at: "", expires_at: "", is_active: true });
        setModalOpen(true);
    }

    function openEdit(o: any) {
        setEditingId(o.id);
        reset({
            title_ar: o.title_ar || "", title_en: o.title_en || "", description_ar: o.description_ar || "", description_en: o.description_en || "",
            discount_type: o.discount_type || "percentage", discount_value: o.discount_value || 0,
            product_id: o.product_id || "", category_id: o.category_id || "",
            starts_at: o.starts_at ? o.starts_at.substring(0, 16) : "", expires_at: o.expires_at ? o.expires_at.substring(0, 16) : "",
            is_active: o.is_active
        });
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function onSubmit(data: any) {
        startTransition(async () => {
            const payload = {
                ...data,
                discount_value: parseFloat(String(data.discount_value)) || 0,
                product_id: data.product_id || null,
                category_id: data.category_id || null,
                starts_at: data.starts_at || null,
                expires_at: data.expires_at || null,
            };
            try { 
                await saveOffer(payload, editingId || undefined); 
                close(); 
                toast.success(locale === "ar" ? "تم الحفظ بنجاح!" : "Saved successfully!", { icon: "🎉" });
            }
            catch (err) { 
                console.error(err); 
                toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed"); 
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "حذف هذا العرض؟" : "Delete this offer?")) return;
        startTransition(async () => { 
            try {
                await deleteOffer(id); 
                toast.success(locale === "ar" ? "تم الحذف" : "Deleted");
            } catch (err) {
                toast.error(locale === "ar" ? "فشل الحذف" : "Delete failed");
            }
        });
    }

    const now = new Date();

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Playful Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-[var(--brand-primary)]/5 dark:border-zinc-800/50 dark:bg-zinc-900/40"
            >
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {locale === "ar" ? "العروض الترويجية" : "Offers & Promos"}
                    </h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand-primary)] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--brand-primary)]"></span></span>
                        {locale === "ar" ? "عروض حصرية وخصومات فورية." : "Flash deals & instant discounts."}
                    </p>
                </div>
                <PlayfulButton onClick={openNew}>
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "عرض جديد" : "New Offer"}
                </PlayfulButton>
            </motion.div>

            {/* Grid */}
            {offers.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] mb-4 rotate-12 transition-transform hover:rotate-0">
                        <SidebarIcon name="zap" className="size-10" />
                    </div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد عروض النشطة" : "No active offers"}</h3>
                    <p className="mt-2 text-sm font-medium text-zinc-500">{locale === "ar" ? "ابدأ بإنشاء أول عرض لجذب العملاء!" : "Create your first special offer to attract customers!"}</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {offers.map((o, i) => {
                        const active = o.is_active && (!o.expires_at || new Date(o.expires_at) > now);
                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                key={o.id} 
                                className={`group relative flex flex-col rounded-3xl border-2 bg-white/80 p-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 backdrop-blur-md dark:bg-zinc-900/80 ${active ? 'border-white dark:border-zinc-800' : 'border-zinc-200 dark:border-zinc-800 opacity-60 grayscale'}`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex size-14 items-center justify-center rounded-2xl shadow-inner ${active ? 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 dark:from-amber-500/20 dark:to-amber-500/10' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'}`}>
                                            <SidebarIcon name="zap" className="size-7" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{o.discount_type === 'percentage' ? 'Percentage' : 'Fixed'}</span>
                                            <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">
                                                {o.discount_type === "percentage" ? `${o.discount_value}%` : o.discount_value}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                                        <button onClick={() => openEdit(o)} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-white shadow-sm hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500"><SidebarIcon name="edit" className="size-4" /></button>
                                        <button onClick={() => handleDelete(o.id)} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-rose-50 shadow-sm hover:bg-rose-100 text-rose-500 dark:bg-rose-500/10 dark:hover:bg-rose-500/20"><SidebarIcon name="trash" className="size-4" /></button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-2">{locale === "ar" ? o.title_ar : o.title_en}</h3>
                                <p className="text-sm font-medium text-zinc-500 line-clamp-2 mb-4 flex-1">{locale === "ar" ? o.description_ar : o.description_en}</p>
                                
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                                    {o.product && <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm dark:bg-blue-500/10 dark:text-blue-400"><SidebarIcon name="package" className="size-3" /> {locale === "ar" ? o.product.title_ar : o.product.title_en}</span>}
                                    {o.category && <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm dark:bg-emerald-500/10 dark:text-emerald-400"><SidebarIcon name="folder" className="size-3" /> {locale === "ar" ? o.category.name_ar : o.category.name_en}</span>}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل العرض" : "Edit Offer") : (locale === "ar" ? "عرض جديد" : "New Offer")} 
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
                <form id="offer-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "عنوان العرض (EN)" : "Offer Title (EN)"} dir="ltr" {...register("title_en")} error={errors.title_en?.message} />
                        <PlayfulInput label={locale === "ar" ? "عنوان العرض (AR)" : "Offer Title (AR)"} dir="rtl" {...register("title_ar")} error={errors.title_ar?.message} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (EN)" : "Description (EN)"} dir="ltr" rows={2} {...register("description_en")} error={errors.description_en?.message} />
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (AR)" : "Description (AR)"} dir="rtl" rows={2} {...register("description_ar")} error={errors.description_ar?.message} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <PlayfulSelect label={locale === "ar" ? "نوع الخصم" : "Discount Type"} {...register("discount_type")} error={errors.discount_type?.message}
                            options={[{ value: "percentage", label: "Percentage %" }, { value: "fixed", label: "Fixed Amount" }]} 
                        />
                        <PlayfulInput label={locale === "ar" ? "قيمة الخصم" : "Value"} dir="ltr" type="number" step="0.01" min="0" {...register("discount_value")} error={errors.discount_value?.message as string} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulSelect label={locale === "ar" ? "منتج محدد" : "Specific Product"} {...register("product_id")} error={errors.product_id?.message}
                            options={[{ value: "", label: "-- All --" }, ...products.map(p => ({ value: p.id, label: locale === "ar" ? p.title_ar : p.title_en }))]} 
                        />
                        <PlayfulSelect label={locale === "ar" ? "تصنيف محدد" : "Specific Category"} {...register("category_id")} error={errors.category_id?.message}
                            options={[{ value: "", label: "-- All --" }, ...categories.map(c => ({ value: c.id, label: locale === "ar" ? c.name_ar : c.name_en }))]} 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "يبدأ من" : "Starts At"} dir="ltr" type="datetime-local" {...register("starts_at")} error={errors.starts_at?.message} />
                        <PlayfulInput label={locale === "ar" ? "ينتهي في" : "Expires At"} dir="ltr" type="datetime-local" {...register("expires_at")} error={errors.expires_at?.message} />
                    </div>

                    <Controller
                        name="is_active"
                        control={control}
                        render={({ field }) => (
                            <div className="pt-2">
                                <PlayfulSwitch label={locale === "ar" ? "مفعّل" : "Active"} checked={field.value} onChange={field.onChange} />
                            </div>
                        )}
                    />
                </form>
            </PlayfulModal>
        </div>
    );
}
