"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveCategory, deleteCategory } from "@/app/actions/services-lists";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion } from "framer-motion";

const getCategorySchema = (locale: string) => z.object({
  slug: z.string().min(1, locale === "ar" ? "مطلوب" : "Slug is required").regex(/^[a-z0-9-]+$/, locale === "ar" ? "أحرف إنجليزية وأرقام فقط" : "Lowercase letters, numbers, and hyphens only"),
  name_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  name_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
});

type CategoryFormValues = z.infer<ReturnType<typeof getCategorySchema>>;

type Props = { locale: string; categories: any[]; };

export function CategoriesGrid({ locale, categories }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const schema = getCategorySchema(locale);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CategoryFormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: { slug: "", name_ar: "", name_en: "", description_ar: "", description_en: "" }
    });

    function openNew() {
        setEditingId(null);
        reset({ slug: "", name_ar: "", name_en: "", description_ar: "", description_en: "" });
        setDrawerOpen(true);
    }

    function openEdit(c: any) {
        setEditingId(c.id);
        reset({
            slug: c.slug || "", name_ar: c.name_ar || "", name_en: c.name_en || "",
            description_ar: c.description_ar || "", description_en: c.description_en || ""
        });
        setDrawerOpen(true);
    }

    function closeDrawer() { setDrawerOpen(false); }

    function handleNameEnChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
        setValue("name_en", val, { shouldValidate: true });
        if (!editingId) {
            setValue("slug", val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), { shouldValidate: true });
        }
    }

    function onSubmit(data: CategoryFormValues) {
        startTransition(async () => {
            try {
                await saveCategory(data, editingId || undefined);
                closeDrawer();
                toast.success(locale === "ar" ? "تم الحفظ بنجاح!" : "Saved successfully!", { icon: "🎉" });
            } catch (err) {
                console.error(err);
                toast.error(locale === "ar" ? "فشل الحفظ، الرابط (Slug) يجب أن يكون فريداً" : "Save failed, slug MUST be unique.");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "حذف هذا التصنيف؟" : "Delete this category?")) return;
        startTransition(async () => {
            try {
                await deleteCategory(id);
                toast.success(locale === "ar" ? "تم الحذف" : "Deleted");
            } catch (err) {
                toast.error(locale === "ar" ? "فشل الحذف" : "Delete failed");
            }
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-amber-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40"
            >
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {locale === "ar" ? "تصنيفات الخدمات" : "Service Categories"}
                    </h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="layout-grid" className="size-4" />
                        {locale === "ar" ? "قسّم خدماتك إلى فئات رئيسية ليسهل التصفح." : "Group your services into super-categories."}
                    </p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-amber-500 hover:!shadow-amber-500/30">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "إضافة تصنيف" : "New Category"}
                </PlayfulButton>
            </motion.div>

            {/* Grid */}
            {categories.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-amber-50 text-amber-400 mb-4 dark:bg-amber-500/10">
                        <SidebarIcon name="folder" className="size-10" />
                    </div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد تصنيفات بعد" : "No folders created yet"}</h3>
                    <p className="mt-2 text-sm font-medium text-zinc-500">{locale === "ar" ? "اضغط على زر الإضافة لتصنيف خدماتك." : "Start organizing services by creating a category."}</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((c, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            key={c.id} 
                            className="group flex flex-col gap-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-6 shadow-sm transition-all duration-300 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 shadow-inner dark:bg-amber-500/10">
                                    <SidebarIcon name="folder" className="size-7" />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                                    <button onClick={() => openEdit(c)} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-white shadow-sm hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500"><SidebarIcon name="edit" className="size-4" /></button>
                                    <button onClick={() => handleDelete(c.id)} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-rose-50 shadow-sm hover:bg-rose-100 text-rose-500 dark:bg-rose-500/10 dark:hover:bg-rose-500/20"><SidebarIcon name="trash" className="size-4" /></button>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1 leading-tight">{locale === "ar" ? c.name_ar : c.name_en}</h3>
                                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 line-clamp-2">{locale === "ar" ? c.description_ar : c.description_en}</p>
                            </div>
                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50">
                                <span className="text-xs font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg shadow-inner">/{c.slug}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <PlayfulModal isOpen={isDrawerOpen} onClose={closeDrawer} title={editingId ? (locale === "ar" ? "تعديل التصنيف" : "Edit Category") : (locale === "ar" ? "تصنيف جديد" : "New Category")}
                footer={
                    <>
                        <PlayfulButton variant="secondary" onClick={closeDrawer}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                        <PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-amber-500 hover:!bg-amber-600 hover:!shadow-amber-500/30">
                            {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                            {editingId ? "Save" : "Create"}
                        </PlayfulButton>
                    </>
                }
            >
                <form id="category-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <PlayfulInput label={locale === "ar" ? "الرابط اللطيف (Slug)" : "URL Slug"} dir="ltr" placeholder="e.g. consulting-services" {...register("slug")} error={errors.slug?.message} />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "الاسم (EN)" : "English Name"} dir="ltr" {...register("name_en")} onChange={handleNameEnChange} error={errors.name_en?.message} />
                        <PlayfulInput label={locale === "ar" ? "الاسم (AR)" : "Arabic Name"} dir="rtl" {...register("name_ar")} error={errors.name_ar?.message} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (EN)" : "English Description"} dir="ltr" rows={3} {...register("description_en")} error={errors.description_en?.message} />
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (AR)" : "Arabic Description"} dir="rtl" rows={3} {...register("description_ar")} error={errors.description_ar?.message} />
                    </div>
                </form>
            </PlayfulModal>
        </div>
    );
}
