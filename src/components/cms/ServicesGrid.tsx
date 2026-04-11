"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveService, deleteService } from "@/app/actions/services-lists";
import { UploadDialog } from "@/components/media/UploadDialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulSelect, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getServiceSchema = (locale: string) => z.object({
  slug: z.string().min(1, locale === "ar" ? "مطلوب" : "Required").regex(/^[a-z0-9-]+$/, locale === "ar" ? "أحرف إنجليزية وأرقام وشرطات فقط" : "Lowercase letters, numbers, and dashes only"),
  title_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  title_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  category_id: z.string().optional(),
  is_active: z.boolean(),
});

type ServiceFormValues = z.infer<ReturnType<typeof getServiceSchema>>;

type Props = { locale: string; services: any[]; categories: any[]; };

export function ServicesGrid({ locale, services, categories }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const schema = useMemo(() => getServiceSchema(locale), [locale]);

    const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm<ServiceFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { is_active: true }
    });

    const [imageId, setImageId] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

    function openNew() {
        setEditingId(null);
        reset({ slug: "", title_ar: "", title_en: "", description_ar: "", description_en: "", category_id: "", is_active: true });
        setImageId(null); setImageUrl(null); setModalOpen(true);
    }

    function openEdit(s: any) {
        setEditingId(s.id);
        reset({
            slug: s.slug || "", title_ar: s.title_ar || "", title_en: s.title_en || "",
            description_ar: s.description_ar || "", description_en: s.description_en || "",
            category_id: s.category_id || "", is_active: s.is_active
        });
        setImageId(s.image_id || null);
        setImageUrl(s.image ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${s.image.bucket}/${s.image.storage_path}` : null);
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function handleTitleEnChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
        setValue("title_en", val);
        if (!editingId) {
            setValue("slug", val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), { shouldValidate: true });
        }
    }

    function onSubmit(data: ServiceFormValues) {
        startTransition(async () => {
            try {
                const payload = { ...data, category_id: data.category_id || null, image_id: imageId };
                await saveService(payload, editingId || undefined);
                close();
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully", { icon: "✨" });
            } catch (err) {
                console.error(err);
                toast.error(locale === "ar" ? "الرابط اللطيف مُستخدم أو فشل الحفظ" : "Slug exists or save failed");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "هل أنت متأكد من حذف هذه الخدمة؟" : "Are you sure you want to delete this service?")) return;
        startTransition(async () => {
            try { await deleteService(id); toast.success(locale === "ar" ? "تم الحذف" : "Deleted"); }
            catch(e) { toast.error(locale === "ar" ? "فشل الحذف" : "Delete failed"); }
        });
    }

    const catOptions = useMemo(() => {
        return [{ value: "", label: locale === "ar" ? "-- بدون تصنيف --" : "-- No Category --" }, ...categories.map(c => ({ value: c.id, label: locale === "ar" ? c.name_ar : c.name_en }))];
    }, [categories, locale]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-indigo-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {locale === "ar" ? "قائمة الخدمات" : "Services Portfolio"}
                    </h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="briefcase" className="size-4 text-indigo-500" />
                        {locale === "ar" ? "أدر قائمة الخدمات التي تقدمها شركتك." : "Manage the core offerings provided by your company."}
                    </p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-indigo-600 hover:!shadow-indigo-500/30 text-white">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "إضافة خدمة" : "New Service"}
                </PlayfulButton>
            </motion.div>

            {/* Grid */}
            {services.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-500 mb-4 animate-bounce"><SidebarIcon name="briefcase" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد خدمات بعد" : "No services created yet"}</h3>
                    <p className="mt-2 text-sm font-medium text-zinc-500">{locale === "ar" ? "ابدأ بإضافة أول خدمة تقدمها." : "Build your portfolio by defining a core service."}</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <AnimatePresence>
                        {services.map((s, i) => {
                            const compiledImage = s.image ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${s.image.bucket}/${s.image.storage_path}` : null;
                            return (
                                <motion.div key={s.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className={`group flex flex-col rounded-3xl border-2 bg-white/90 p-1 shadow-sm transition-all hover:-translate-y-2 hover:shadow-2xl dark:bg-zinc-900/90 backdrop-blur-md overflow-hidden ${s.is_active ? 'border-zinc-200/50 hover:border-indigo-500/50 dark:border-zinc-700/50' : 'border-zinc-200/30 opacity-70 grayscale-[30%] dark:border-zinc-800/50'}`}>
                                    
                                    <div className="relative h-48 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden shadow-inner">
                                        {compiledImage ? (
                                            <img src={compiledImage} alt={s.title_en} className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="flex size-full items-center justify-center bg-indigo-50/50 dark:bg-indigo-900/20">
                                                <SidebarIcon name="image" className="size-10 text-indigo-200 dark:text-indigo-800" />
                                            </div>
                                        )}

                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex justify-between items-end translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                            <span className="text-xs font-mono font-bold text-indigo-300 drop-shadow-md bg-black/40 px-2 py-1 rounded-lg backdrop-blur-md">/{s.slug}</span>
                                            <div className="flex gap-2">
                                                <button onClick={() => openEdit(s)} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-white/20 text-white shadow-md hover:bg-white hover:text-zinc-900 backdrop-blur-md transition-colors border border-white/20"><SidebarIcon name="edit" className="size-4.5" /></button>
                                                <button onClick={() => handleDelete(s.id)} disabled={isPending} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-rose-500/80 text-white shadow-md hover:bg-rose-600 backdrop-blur-md transition-colors border border-rose-500/50"><SidebarIcon name="trash" className="size-4.5" /></button>
                                            </div>
                                        </div>

                                        {s.category && (
                                            <div className="absolute top-3 right-3 rounded-lg bg-black/60 backdrop-blur-md px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white border border-white/10 z-10 shadow-lg">
                                                {locale === "ar" ? s.category.name_ar : s.category.name_en}
                                            </div>
                                        )}
                                        {!s.is_active && (
                                            <div className="absolute top-3 left-3 rounded-lg bg-zinc-800/80 backdrop-blur-md px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-300 border border-zinc-600 z-10">
                                                Hidden
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col justify-center text-center">
                                        <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50 line-clamp-1 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {locale === "ar" ? s.title_ar : s.title_en}
                                        </h3>
                                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed px-2">
                                            {locale === "ar" ? s.description_ar : s.description_en}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal */}
            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل الخدمة" : "Edit Service") : (locale === "ar" ? "خدمة جديدة" : "New Service")}
                footer={
                    <>
                        <PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                        <PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-indigo-600 hover:!bg-indigo-700 text-white shadow-lg shadow-indigo-600/30">
                            {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                            {editingId ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إنشاء الخدمة" : "Create Service")}
                        </PlayfulButton>
                    </>
                }
            >
                <form id="service-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Cover Upload Area */}
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-500 pl-2">{locale === "ar" ? "صورة الغلاف" : "Cover Image"}</label>
                        {imageUrl ? (
                            <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 group shadow-inner bg-zinc-50 dark:bg-zinc-900">
                                <img src={imageUrl} alt="Cover preview" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-4 backdrop-blur-sm">
                                    <PlayfulButton type="button" onClick={() => setIsImageDialogOpen(true)} className="!bg-white !text-zinc-900 px-6 hover:scale-105">Replace</PlayfulButton>
                                    <PlayfulButton type="button" onClick={() => { setImageUrl(null); setImageId(null); }} className="!bg-rose-600 !text-white px-6 hover:scale-105">Remove</PlayfulButton>
                                </div>
                            </div>
                        ) : (
                            <div onClick={() => setIsImageDialogOpen(true)} className="group flex aspect-video cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 transition-all hover:border-indigo-500 hover:bg-indigo-50/50 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-indigo-500">
                                <div className="flex size-16 items-center justify-center rounded-full bg-white shadow-sm dark:bg-zinc-800 mb-4 text-zinc-400 group-hover:text-indigo-500 group-hover:scale-110 transition-transform">
                                    <SidebarIcon name="image-plus" className="size-6" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-indigo-500">
                                    Select amazing cover photo
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "العنوان (EN)" : "English Title"} dir="ltr" {...register("title_en")} onChange={handleTitleEnChange} error={errors.title_en?.message} />
                        <PlayfulInput label={locale === "ar" ? "العنوان (AR)" : "Arabic Title"} dir="rtl" {...register("title_ar")} error={errors.title_ar?.message} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <Controller name="category_id" control={control} render={({ field }) => (
                            <PlayfulSelect label={locale === "ar" ? "التصنيف التابع" : "Category"} options={catOptions} {...field} />
                        )} />
                        
                        <div className="relative">
                            <PlayfulInput label={locale === "ar" ? "الرابط اللطيف" : "URL Slug"} dir="ltr" {...register("slug")} className="pl-8 text-indigo-600 dark:text-indigo-400 font-mono" error={errors.slug?.message} />
                            <span className="absolute left-4 top-[42px] text-zinc-400 select-none">/</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (EN)" : "English Description"} dir="ltr" rows={4} {...register("description_en")} className="resize-none" />
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (AR)" : "Arabic Description"} dir="rtl" rows={4} {...register("description_ar")} className="resize-none" />
                    </div>

                    <div className="pt-2 pl-4">
                        <Controller name="is_active" control={control} render={({ field }) => (
                            <PlayfulSwitch label={locale === "ar" ? "مفعل وظاهر للعميل" : "Active & Visible"} checked={field.value} onChange={field.onChange} />
                        )} />
                    </div>
                </form>
            </PlayfulModal>

            {/* Modal for Cover Picker */}
            {isImageDialogOpen && (
                <UploadDialog folders={[]} bucket="images" defaultFolderId="all" locale={locale} onClose={() => setIsImageDialogOpen(false)}
                    onSuccess={(urls) => { setIsImageDialogOpen(false); if (urls && urls[0]) setImageUrl(urls[0]); }}
                />
            )}
        </div>
    );
}
