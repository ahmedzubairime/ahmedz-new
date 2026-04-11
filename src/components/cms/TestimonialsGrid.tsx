"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveTestimonial, deleteTestimonial } from "@/app/actions/homepage-lists";
import { UploadDialog } from "@/components/media/UploadDialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getTestimonialSchema = (locale: string) => z.object({
  author_name_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  author_name_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  role_ar: z.string().optional(),
  role_en: z.string().optional(),
  content_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  content_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  rating: z.any(),
  is_active: z.boolean(),
  sort_order: z.any()
});

type TestimonialFormValues = z.infer<ReturnType<typeof getTestimonialSchema>>;

type Props = { locale: string; testimonials: any[]; };

export function TestimonialsGrid({ locale, testimonials }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const schema = useMemo(() => getTestimonialSchema(locale), [locale]);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<TestimonialFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { is_active: true, sort_order: 0, rating: 5 }
    });

    const [avatarId, setAvatarId] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

    function openNew() {
        setEditingId(null);
        reset({ author_name_ar: "", author_name_en: "", role_ar: "", role_en: "", content_ar: "", content_en: "", is_active: true, sort_order: 0, rating: 5 });
        setAvatarId(null); setAvatarUrl(null); setModalOpen(true);
    }

    function openEdit(t: any) {
        setEditingId(t.id);
        reset({
            author_name_ar: t.author_name_ar || "", author_name_en: t.author_name_en || "",
            role_ar: t.role_ar || "", role_en: t.role_en || "",
            content_ar: t.content_ar || "", content_en: t.content_en || "",
            is_active: t.is_active, sort_order: t.sort_order || 0, rating: t.rating || 5
        });
        setAvatarId(t.avatar_id || null);
        setAvatarUrl(t.avatar ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${t.avatar.bucket}/${t.avatar.storage_path}` : null);
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function onSubmit(data: TestimonialFormValues) {
        startTransition(async () => {
            try {
                const payload = { ...data, sort_order: parseInt(String(data.sort_order)) || 0, rating: parseInt(String(data.rating)) || 5, avatar_id: avatarId };
                await saveTestimonial(payload, editingId || undefined);
                close();
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully", { icon: "🗣️" });
            } catch (err) {
                toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "حذف المراجعة؟" : "Are you sure you want to delete this testimonial?")) return;
        startTransition(async () => {
            try { await deleteTestimonial(id); toast.success(locale === "ar" ? "تم الحذف" : "Deleted"); }
            catch(e) { toast.error(locale === "ar" ? "فشل الحذف" : "Delete failed"); }
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-violet-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {locale === "ar" ? "آراء العملاء" : "Client Testimonials"}
                    </h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="message-square-quote" className="size-4 text-violet-500" />
                        {locale === "ar" ? "شارك المراجعات وتقييمات عملائك لزيادة الموثوقية." : "Share reviews and ratings from your past customers."}
                    </p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-[var(--brand-primary)] text-white hover:!shadow-[var(--brand-primary)]/30">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "إضافة رأي" : "Add Testimonial"}
                </PlayfulButton>
            </motion.div>

            {/* Grid */}
            {testimonials.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-violet-500/10 text-violet-500 mb-4 animate-bounce"><SidebarIcon name="message-square-quote" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد آراء بعد" : "No testimonials created yet"}</h3>
                    <p className="mt-2 text-sm font-medium text-zinc-500">{locale === "ar" ? "دع عملائك يتحدثون عن تجربتك المميزة." : "Let your customers speak for your brand."}</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                        {testimonials.map((t, i) => {
                            const compiledAvatar = t.avatar ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${t.avatar.bucket}/${t.avatar.storage_path}` : null;
                            const isActive = t.is_active;

                            return (
                                <motion.div key={t.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className={`group relative flex flex-col gap-5 rounded-3xl border-2 bg-white/90 p-6 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl dark:bg-zinc-900/90 backdrop-blur-md overflow-hidden ${isActive ? 'border-zinc-200/50 hover:border-violet-500/30 dark:border-zinc-700/50' : 'border-zinc-200/30 opacity-70 grayscale-[30%] dark:border-zinc-800/30'}`}>
                                    
                                    <SidebarIcon name="quote" className="absolute top-4 right-4 size-16 text-zinc-100 fill-zinc-100 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 dark:text-zinc-800 dark:fill-zinc-800" />
                                    
                                    <div className="absolute top-4 right-4 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                        <button onClick={() => openEdit(t)} className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-white text-zinc-600 shadow-md hover:scale-110 hover:bg-violet-500 hover:text-white dark:bg-zinc-800 dark:text-zinc-300 transition-all border border-zinc-200 dark:border-zinc-700">
                                            <SidebarIcon name="edit" className="size-4" />
                                        </button>
                                        <button onClick={() => handleDelete(t.id)} disabled={isPending} className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-rose-50 text-rose-600 shadow-md hover:scale-110 hover:bg-rose-600 hover:text-white dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-600 transition-all border border-rose-100 dark:border-rose-800">
                                            <SidebarIcon name="trash" className="size-4" />
                                        </button>
                                    </div>

                                    {!isActive && (
                                        <div className="absolute top-4 left-4 flex items-center justify-center rounded-full px-2 py-0.5 bg-zinc-200 text-zinc-600 text-[10px] font-black uppercase tracking-widest z-20 dark:bg-zinc-800/80 shadow-inner">
                                            Hidden
                                        </div>
                                    )}

                                    <div className="relative z-10 flex items-center gap-4">
                                        {compiledAvatar ? (
                                            <div className="relative size-16 shrink-0 rounded-full border-2 border-white dark:border-zinc-800 shadow-md p-0.5 bg-gradient-to-tr from-[var(--brand-primary)] to-violet-500">
                                                <img src={compiledAvatar} className="size-full rounded-full object-cover shadow-inner bg-white dark:bg-zinc-900" alt="avatar" />
                                            </div>
                                        ) : (
                                            <div className="relative size-16 shrink-0 rounded-full border-2 border-white dark:border-zinc-800 shadow-md p-0.5 bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-400 font-black text-xl">
                                                {(locale === "ar" ? t.author_name_ar : t.author_name_en).charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-1 mt-1 pr-10"> {/* pr-10 for absolute buttons padding */}
                                            <h3 className="font-black tracking-tight text-lg text-zinc-900 dark:text-zinc-100 line-clamp-1">{locale === "ar" ? t.author_name_ar : t.author_name_en}</h3>
                                            <p className="text-sm font-bold tracking-wide uppercase text-violet-600 dark:text-violet-400 line-clamp-1 opacity-80">{locale === "ar" ? t.role_ar : t.role_en}</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 z-10 mt-1">
                                        <div className="flex items-center gap-0.5 mb-2">
                                            {[1,2,3,4,5].map(star => (
                                                <SidebarIcon key={star} name="star" className={`size-4 ${star <= (t.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-zinc-200 dark:text-zinc-700'}`} />
                                            ))}
                                        </div>
                                        <p className="text-[15px] font-medium leading-relaxed text-zinc-600 dark:text-zinc-300 italic line-clamp-5 px-1 tracking-wide relative">
                                            {locale === "ar" ? t.content_ar : t.content_en}
                                        </p>
                                    </div>

                                    <div className="pt-4 flex items-center justify-between border-t-2 border-dashed border-zinc-100 dark:border-zinc-800 z-10">
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 shadow-inner">
                                            <SidebarIcon name="arrow-up-down" className="size-3 text-zinc-400" />
                                            <span className="text-xs font-black tracking-widest uppercase text-zinc-500 dark:text-zinc-400">Order:</span>
                                            <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">{t.sort_order}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal */}
            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل المراجعة" : "Edit Testimonial") : (locale === "ar" ? "مراجعة جديدة" : "New Testimonial")}
                footer={
                    <>
                        <PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                        <PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-[var(--brand-primary)] hover:!bg-[var(--brand-primary)] hover:brightness-110">
                            {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                            {editingId ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إنشاء المراجعة" : "Create Testimonial")}
                        </PlayfulButton>
                    </>
                }
            >
                <form id="testimonial-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Avatar Upload Area */}
                    <div className="flex bg-zinc-50/80 dark:bg-zinc-900/50 rounded-3xl p-5 border-2 border-zinc-100 dark:border-zinc-800 items-center justify-center flex-col gap-4">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-500 text-center">{locale === "ar" ? "الصورة الشخصية" : "Author Avatar"}</label>
                        {avatarUrl ? (
                            <div className="relative size-32 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 group shadow-lg bg-zinc-100 dark:bg-zinc-900">
                                <img src={avatarUrl} alt="Avatar preview" className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 backdrop-blur-sm">
                                    <button type="button" onClick={() => setIsImageDialogOpen(true)} className="p-1.5 px-3 bg-white text-zinc-900 rounded-lg text-[10px] uppercase font-bold hover:scale-105 shadow-xl transition-transform">Change</button>
                                    <button type="button" onClick={() => { setAvatarUrl(null); setAvatarId(null); }} className="p-1.5 px-3 bg-rose-600 text-white rounded-lg text-[10px] uppercase font-bold hover:scale-105 shadow-xl transition-transform">Remove</button>
                                </div>
                            </div>
                        ) : (
                            <div onClick={() => setIsImageDialogOpen(true)} className="flex size-32 cursor-pointer items-center justify-center rounded-full border-4 border-dashed border-zinc-300 bg-white/50 transition-all hover:border-violet-500 hover:text-violet-500 group dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-violet-500 shadow-inner">
                                <SidebarIcon name="camera" className="size-8 text-zinc-400 group-hover:text-violet-500 group-hover:scale-110 transition-transform" />
                            </div>
                        )}
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{locale === "ar" ? "انقر للصورة المربعة (اختياري)" : "Tap for square avatar (optional)"}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "الاسم (EN)" : "English Name"} dir="ltr" {...register("author_name_en")} error={errors.author_name_en?.message} />
                        <PlayfulInput label={locale === "ar" ? "الاسم (AR)" : "Arabic Name"} dir="rtl" {...register("author_name_ar")} error={errors.author_name_ar?.message} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "المنصب (EN)" : "English Role"} dir="ltr" placeholder="e.g. CEO, Acme" {...register("role_en")} error={errors.role_en?.message} />
                        <PlayfulInput label={locale === "ar" ? "المنصب (AR)" : "Arabic Role"} dir="rtl" {...register("role_ar")} error={errors.role_ar?.message} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulTextarea label={locale === "ar" ? "نص المراجعة (EN)" : "English Testimonial"} dir="ltr" rows={4} {...register("content_en")} error={errors.content_en?.message} />
                        <PlayfulTextarea label={locale === "ar" ? "نص المراجعة (AR)" : "Arabic Testimonial"} dir="rtl" rows={4} {...register("content_ar")} error={errors.content_ar?.message} />
                    </div>

                        <div className="flex gap-4 p-5 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800">
                        <PlayfulInput label={locale === "ar" ? "الترتيب" : "Sort Order"} type="number" dir="ltr" {...register("sort_order")} error={errors.sort_order?.message as string} className="max-w-24 text-center font-black !m-0" />
                        <PlayfulInput label={locale === "ar" ? "التقييم" : "Rating (1-5)"} type="number" dir="ltr" min={1} max={5} {...register("rating")} className="max-w-24 text-center font-black !m-0" />
                        <div className="flex-1 pt-2">
                            <Controller name="is_active" control={control} render={({ field }) => (
                                <PlayfulSwitch label={locale === "ar" ? "مرئي بالموقع" : "Visible on Site"} checked={field.value} onChange={field.onChange} />
                            )} />
                        </div>
                    </div>
                </form>
            </PlayfulModal>

            {isImageDialogOpen && (
                <UploadDialog folders={[]} bucket="images" defaultFolderId="all" locale={locale} onClose={() => setIsImageDialogOpen(false)}
                    onSuccess={(urls) => { setIsImageDialogOpen(false); if (urls && urls[0]) setAvatarUrl(urls[0]); }}
                />
            )}
        </div>
    );
}
