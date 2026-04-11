"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveStoreCategory, deleteStoreCategory } from "@/app/actions/store-categories";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulSelect, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getStoreCategorySchema = (locale: string) => z.object({
  name_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  name_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  slug: z.string().min(1, locale === "ar" ? "مطلوب" : "Required").regex(/^[a-z0-9-]+$/, locale === "ar" ? "أحرف إنجليزية صغيرة وأرقام فقط" : "Lowercase, numbers & hyphens only"),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  parent_id: z.string().optional(),
  icon: z.string().optional(),
  is_active: z.boolean(),
});

type StoreCategoryFormValues = z.infer<ReturnType<typeof getStoreCategorySchema>>;

type Props = {
    locale: string;
    categories: any[];
};

export function StoreCategoriesGrid({ locale, categories }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const schema = useMemo(() => getStoreCategorySchema(locale), [locale]);

    const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm<StoreCategoryFormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: { parent_id: "", icon: "folder", is_active: true }
    });

    const currentIcon = watch("icon") || "folder";

    function openNew() {
        setEditingId(null);
        reset({ name_ar: "", name_en: "", slug: "", description_ar: "", description_en: "", parent_id: "", icon: "folder", is_active: true });
        setModalOpen(true);
    }

    function openEdit(c: any) {
        setEditingId(c.id);
        reset({
            name_ar: c.name_ar || "", name_en: c.name_en || "", slug: c.slug || "",
            description_ar: c.description_ar || "", description_en: c.description_en || "",
            parent_id: c.parent_id || "", icon: c.icon || "folder", is_active: c.is_active
        });
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function handleNameEnChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
        setValue("name_en", val, { shouldValidate: true });
        if (!editingId) setValue("slug", val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), { shouldValidate: true });
    }

    function onSubmit(data: any) {
        startTransition(async () => {
            const payload = {
                ...data,
                parent_id: data.parent_id || null
            };
            try {
                await saveStoreCategory(payload, editingId || undefined);
                close();
                toast.success(locale === "ar" ? "تم الحفظ بنجاح!" : "Saved successfully!", { icon: "📂" });
            } catch (err) {
                console.error(err);
                toast.error(locale === "ar" ? "فشل الحفظ. تأكد من عدم تكرار الرابط (Slug)." : "Save failed. Ensure slug is unique.");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا التصنيف؟" : "Delete this category?")) return;
        startTransition(async () => {
             try {
                 await deleteStoreCategory(id);
                 toast.success(locale === "ar" ? "تم الحذف" : "Deleted");
             } catch(e) {
                 toast.error("Failed");
             }
        });
    }

    // Build tree for display  
    const rootCats = categories.filter(c => !c.parent_id);
    const childrenOf = (parentId: string) => categories.filter(c => c.parent_id === parentId);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-[var(--brand-primary)]/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {locale === "ar" ? "تصنيفات المتجر" : "Store Categories"}
                    </h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="folder-tree" className="size-4" />
                        {locale === "ar" ? "نظّم منتجاتك في تصنيفات هرمية (رئيسية وفرعية)." : "Organize products with hierarchical categories."}
                    </p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-[var(--brand-primary)] hover:!shadow-[var(--brand-primary)]/30">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "تصنيف جديد" : "New Category"}
                </PlayfulButton>
            </motion.div>

            {/* Grid */}
            {categories.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] mb-4 animate-bounce shrink-0"><SidebarIcon name="folder-tree" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد تصنيفات بعد" : "No categories yet"}</h3>
                    <p className="mt-2 text-sm font-medium text-zinc-500">{locale === "ar" ? "أنشئ أول تصنيف لتنظيم منتجاتك." : "Create your first category to organize products."}</p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {rootCats.map((cat, i) => (
                            <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-3xl border-2 border-zinc-200/60 bg-white/80 dark:border-zinc-800/80 dark:bg-zinc-900/80 overflow-hidden shadow-xl shadow-zinc-200/20 dark:shadow-none backdrop-blur-md">
                                {/* Root Category */}
                                <div className="group flex items-center gap-4 p-5 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand-primary)]/80 to-[var(--brand-primary)] text-white shadow-lg shadow-[var(--brand-primary)]/30 transition-transform group-hover:scale-105">
                                        <SidebarIcon name={cat.icon || "folder"} className="size-6" />
                                    </div>
                                    <div className="flex-1 min-w-0 pr-16 text-start">
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">{locale === "ar" ? cat.name_ar : cat.name_en}</h3>
                                        <p className="text-xs font-semibold text-zinc-400 mt-1 truncate bg-zinc-100 dark:bg-zinc-800 w-fit px-2 py-0.5 rounded-md font-mono">/{cat.slug}</p>
                                    </div>
                                    <span className="text-xs font-semibold text-zinc-500 flex items-center gap-2">
                                        <span className="relative flex h-2.5 w-2.5"><span className={`${cat.is_active ? 'animate-ping bg-emerald-400' : ''} absolute inline-flex h-full w-full rounded-full opacity-75`}></span><span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${cat.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span></span>
                                    </span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-300">
                                        <button onClick={() => openEdit(cat)} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-white text-zinc-600 shadow-sm hover:bg-[var(--brand-primary)]/10 hover:text-[var(--brand-primary)] hover:scale-110 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 transition-all"><SidebarIcon name="edit" className="size-4" /></button>
                                        <button onClick={() => handleDelete(cat.id)} disabled={isPending} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-sm hover:bg-rose-100 hover:scale-110 border border-rose-100 dark:bg-rose-500/10 dark:border-rose-900 transition-all"><SidebarIcon name="trash" className="size-4" /></button>
                                    </div>
                                </div>
                                {/* Children */}
                                {childrenOf(cat.id).length > 0 && (
                                    <div className="border-t-2 border-zinc-100/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2">
                                        {childrenOf(cat.id).map(child => (
                                            <div key={child.id} className="group flex items-center gap-4 px-4 py-3 ml-6 mb-2 rounded-2xl transition-all hover:bg-white dark:hover:bg-zinc-800 border-2 border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 hover:shadow-sm">
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-200/60 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-300">
                                                    <SidebarIcon name={child.icon || "folder"} className="size-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-base font-bold text-zinc-700 dark:text-zinc-200 truncate">{locale === "ar" ? child.name_ar : child.name_en}</span>
                                                    <p className="text-[10px] font-semibold text-zinc-400 font-mono mt-0.5 truncate">/{child.slug}</p>
                                                </div>
                                                <span className={`flex size-2 rounded-full ${child.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 duration-300">
                                                    <button onClick={() => openEdit(child)} className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"><SidebarIcon name="edit" className="size-4" /></button>
                                                    <button onClick={() => handleDelete(child.id)} disabled={isPending} className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-400 hover:text-rose-600 transition-all"><SidebarIcon name="trash" className="size-4" /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal */}
            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل التصنيف" : "Edit Category") : (locale === "ar" ? "تصنيف جديد" : "New Category")}
                footer={
                    <>
                        <PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                        <PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-[var(--brand-primary)] hover:!bg-[var(--brand-primary)] hover:brightness-110">
                            {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                            {editingId ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إنشاء التصنيف" : "Create Category")}
                        </PlayfulButton>
                    </>
                }
            >
                <form id="store-cat-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Parent */}
                    <PlayfulSelect label={locale === "ar" ? "التصنيف الأب (اختياري)" : "Parent Category (optional)"} {...register("parent_id")} error={errors.parent_id?.message as string}
                        options={[
                            { value: "", label: locale === "ar" ? "-- تصنيف رئيسي --" : "-- Root Category --" },
                            ...categories.filter(c => c.id !== editingId).map(c => ({ value: c.id, label: locale === "ar" ? c.name_ar : c.name_en }))
                        ]} 
                    />

                    {/* Bilingual Names */}
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "الاسم (EN)" : "English Name"} dir="ltr" {...register("name_en")} onChange={handleNameEnChange} error={errors.name_en?.message as string} />
                        <PlayfulInput label={locale === "ar" ? "الاسم (AR)" : "Arabic Name"} dir="rtl" {...register("name_ar")} error={errors.name_ar?.message as string} />
                    </div>

                    {/* Slug */}
                    <PlayfulInput label={locale === "ar" ? "الرابط اللطيف (Slug)" : "URL Slug"} dir="ltr" placeholder="e.g. electronics" {...register("slug")} error={errors.slug?.message as string} />

                    {/* Bilingual Descriptions */}
                    <div className="grid grid-cols-2 gap-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (EN)" : "English Description"} dir="ltr" rows={2} {...register("description_en")} error={errors.description_en?.message as string} />
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (AR)" : "Arabic Description"} dir="rtl" rows={2} {...register("description_ar")} error={errors.description_ar?.message as string} />
                    </div>

                    {/* Icon + Toggle */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <PlayfulInput label={locale === "ar" ? "الأيقونة" : "Icon Name (lucide)"} dir="ltr" placeholder="folder" {...register("icon")} error={errors.icon?.message as string} className="pl-12" />
                            <div className="absolute left-4 top-[38px] flex size-6 items-center justify-center rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] shadow-sm">
                                <SidebarIcon name={currentIcon as any} className="size-4" />
                            </div>
                        </div>
                        <Controller name="is_active" control={control} render={({ field }) => (
                            <div className="pt-2 pl-4">
                                <PlayfulSwitch label={locale === "ar" ? "مفعّل" : "Active"} checked={field.value} onChange={field.onChange} />
                            </div>
                        )} />
                    </div>
                </form>
            </PlayfulModal>
        </div>
    );
}
