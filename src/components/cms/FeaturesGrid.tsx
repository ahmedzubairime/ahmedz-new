"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveFeature, deleteFeature } from "@/app/actions/homepage-lists";
import { UploadDialog } from "@/components/media/UploadDialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { PlayfulIconPicker } from "@/components/ui/PlayfulIconPicker";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getFeatureSchema = (locale: string) => z.object({
  title_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  title_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  description_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  description_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  icon_name: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  is_active: z.boolean(),
});

type FeatureFormValues = z.infer<ReturnType<typeof getFeatureSchema>>;

type Props = {
    locale: string;
    features: any[];
};

export function FeaturesGrid({ locale, features }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const schema = useMemo(() => getFeatureSchema(locale), [locale]);

    const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<FeatureFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { icon_name: "star", is_active: true }
    });

    const currentIcon = watch("icon_name") || "star";

    const [imageId, setImageId] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

    function openNew() {
        setEditingId(null);
        reset({ title_ar: "", title_en: "", description_ar: "", description_en: "", icon_name: "star", is_active: true });
        setImageId(null); setImageUrl(null);
        setModalOpen(true);
    }

    function openEdit(f: any) {
        setEditingId(f.id);
        reset({
            title_ar: f.title_ar || "", title_en: f.title_en || "",
            description_ar: f.description_ar || "", description_en: f.description_en || "",
            icon_name: f.icon_name || "star", is_active: f.is_active
        });
        setImageId(f.image_id || null);
        setImageUrl(f.feature_image ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${f.feature_image.bucket}/${f.feature_image.storage_path}` : null);
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function onSubmit(data: FeatureFormValues) {
        startTransition(async () => {
            try {
                await saveFeature({ ...data, image_id: imageId }, editingId || undefined);
                close();
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully", { icon: "✨" });
            } catch (err) {
                console.error(err);
                toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "متأكد من حذف هذه الميزة؟" : "Are you sure you want to delete this feature?")) return;
        startTransition(async () => {
            try {
                await deleteFeature(id);
                toast.success(locale === "ar" ? "تم الحذف" : "Deleted");
            } catch(e) {
                toast.error(locale === "ar" ? "فشل الحذف" : "Delete failed");
            }
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-indigo-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {locale === "ar" ? "المميزات الأساسية" : "Core Features"}
                    </h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="star" className="size-4 text-indigo-500" />
                        {locale === "ar" ? "أدر قائمة المميزات التي تظهر كبطاقات تعريفية." : "Manage the feature cards displayed on the public landing page."}
                    </p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-[var(--brand-primary)] hover:!shadow-[var(--brand-primary)]/30">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "إضافة ميزة" : "Add Feature"}
                </PlayfulButton>
            </motion.div>

            {/* Grid */}
            {features.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-500 mb-4 animate-bounce"><SidebarIcon name="box" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد مميزات بعد" : "No features added yet"}</h3>
                    <p className="mt-2 text-sm font-medium text-zinc-500">{locale === "ar" ? "اضغط على زر الإضافة لإضافة ميزتك الأولى." : "Click Add Feature to highlight your system."}</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                        {features.map((f, i) => (
                            <motion.div key={f.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`group relative flex flex-col gap-4 rounded-3xl border-2 bg-white/80 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900/80 backdrop-blur-md ${f.is_active ? 'border-zinc-200/50 hover:border-indigo-500/30 hover:shadow-indigo-500/10 dark:border-zinc-800/80' : 'border-zinc-200/50 opacity-60 dark:border-zinc-800/50'}`}>
                                
                                <div className="flex items-start justify-between relative z-10">
                                    <div className={`flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${f.is_active ? 'bg-gradient-to-br from-indigo-400 to-indigo-600 text-white shadow-indigo-500/30' : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                                        <SidebarIcon name={f.icon_name || 'star'} className="size-6" />
                                    </div>
                                    <div className="flex gap-2">
                                        {f.is_active ? 
                                            <span className="flex items-center justify-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 uppercase tracking-wider">{locale === "ar" ? "مرئي" : "Visible"}</span> 
                                            : 
                                            <span className="flex items-center justify-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 uppercase tracking-wider">{locale === "ar" ? "مخفي" : "Hidden"}</span>
                                        }
                                    </div>
                                </div>

                                <div className="relative z-10 flex-1">
                                    <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 mb-2 truncate">
                                        {locale === "ar" ? f.title_ar : f.title_en}
                                    </h3>
                                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 line-clamp-3">
                                        {locale === "ar" ? f.description_ar : f.description_en}
                                    </p>
                                </div>

                                <div className="mt-auto pt-4 flex items-center justify-between border-t-2 border-zinc-100/50 dark:border-zinc-800/50 relative z-10">
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg"><SidebarIcon name="hash" className="size-3" /> {f.sort_order}</span>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 p-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-300 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-zinc-900 dark:via-zinc-900/80 rounded-b-3xl z-20">
                                    <button onClick={() => openEdit(f)} className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-white text-zinc-600 shadow-sm hover:bg-[var(--brand-primary)] hover:text-white hover:scale-110 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 transition-all"><SidebarIcon name="edit" className="size-4" /></button>
                                    <button onClick={() => handleDelete(f.id)} disabled={isPending} className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-sm hover:bg-rose-500 hover:text-white hover:scale-110 border border-rose-100 dark:bg-rose-900/30 dark:border-rose-800 transition-all"><SidebarIcon name="trash" className="size-4" /></button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal */}
            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل الميزة" : "Edit Feature") : (locale === "ar" ? "ميزة جديدة" : "New Feature")}
                footer={
                    <>
                        <PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                        <PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-[var(--brand-primary)] hover:!bg-[var(--brand-primary)] hover:brightness-110">
                            {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                            {editingId ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة ميزة" : "Create Feature")}
                        </PlayfulButton>
                    </>
                }
            >
                <form id="feature-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "العنوان (EN)" : "English Title"} dir="ltr" {...register("title_en")} error={errors.title_en?.message} />
                        <PlayfulInput label={locale === "ar" ? "العنوان (AR)" : "Arabic Title"} dir="rtl" {...register("title_ar")} error={errors.title_ar?.message} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (EN)" : "English Description"} dir="ltr" rows={3} {...register("description_en")} error={errors.description_en?.message} />
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (AR)" : "Arabic Description"} dir="rtl" rows={3} {...register("description_ar")} error={errors.description_ar?.message} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Controller name="icon_name" control={control} render={({ field }) => (
                            <PlayfulIconPicker 
                                label={locale === "ar" ? "الأيقونة (Lucide)" : "Icon Name"} 
                                value={field.value} 
                                onChange={field.onChange} 
                                error={errors.icon_name?.message} 
                                locale={locale} 
                            />
                        )} />

                        <Controller name="is_active" control={control} render={({ field }) => (
                            <div className="pt-2 pl-4">
                                <PlayfulSwitch label={locale === "ar" ? "مرئي بالموقع" : "Visible on Site"} checked={field.value} onChange={field.onChange} />
                            </div>
                        )} />
                    </div>

                    {/* Optional Image */}
                    <div className="p-4 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800 space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-500">{locale === "ar" ? "صورة الميزة (اختياري)" : "Feature Image (Optional)"}</label>
                        {imageUrl ? (
                            <div className="relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 aspect-video max-w-xs group shadow-sm">
                                <img src={imageUrl} alt="" className="size-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                                    <button type="button" onClick={() => setIsImageDialogOpen(true)} className="px-3 py-1.5 bg-white text-zinc-900 rounded-lg text-xs font-bold hover:scale-105 transition-transform">Change</button>
                                    <button type="button" onClick={() => { setImageId(null); setImageUrl(null); }} className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:scale-105 transition-transform">Remove</button>
                                </div>
                            </div>
                        ) : (
                            <div onClick={() => setIsImageDialogOpen(true)} className="group flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-white/50 py-8 max-w-xs transition-all hover:border-[var(--brand-primary)] dark:border-zinc-700 dark:bg-zinc-900/50">
                                <SidebarIcon name="image-plus" className="size-5 text-zinc-400 group-hover:text-[var(--brand-primary)]" />
                                <span className="ml-2 text-xs text-zinc-500">{locale === "ar" ? "اختيار صورة" : "Select Image"}</span>
                            </div>
                        )}
                    </div>
                </form>
            </PlayfulModal>

            {isImageDialogOpen && (
                <UploadDialog folders={[]} bucket="images" defaultFolderId="all" locale={locale}
                    onClose={() => setIsImageDialogOpen(false)}
                    onSuccess={(urls) => { setIsImageDialogOpen(false); if (urls?.[0]) setImageUrl(urls[0]); }}
                />
            )}
        </div>
    );
}
