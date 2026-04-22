"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveGalleryAlbum, deleteGalleryAlbum } from "@/app/actions/portfolio";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { UploadDialog } from "@/components/media/UploadDialog";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getSchema = (locale: string) => z.object({
    titleAr: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    titleEn: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    descriptionAr: z.string().optional(),
    descriptionEn: z.string().optional(),
    sortOrder: z.coerce.number().default(0),
    isActive: z.boolean(),
});

type FormValues = { titleAr: string; titleEn: string; descriptionAr?: string; descriptionEn?: string; sortOrder: number; isActive: boolean };
type Props = { locale: string; albums: any[] };

function buildMediaUrl(m: any) {
    if (!m) return null;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${m.bucket}/${m.storage_path}`;
}

export function AlbumsGrid({ locale, albums }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [coverImageId, setCoverImageId] = useState<string | null>(null);
    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
    const [showUpload, setShowUpload] = useState(false);

    const schema = useMemo(() => getSchema(locale), [locale]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: { isActive: true, sortOrder: 0 },
    });

    function openNew() {
        setEditingId(null);
        setCoverImageId(null); setCoverImageUrl(null);
        reset({ titleAr: "", titleEn: "", descriptionAr: "", descriptionEn: "", sortOrder: 0, isActive: true });
        setModalOpen(true);
    }

    function openEdit(a: any) {
        setEditingId(a.id);
        setCoverImageId(a.coverImageId); setCoverImageUrl(buildMediaUrl(a.coverImage));
        reset({ 
            titleAr: a.titleAr || "", 
            titleEn: a.titleEn || "", 
            descriptionAr: a.descriptionAr || "", 
            descriptionEn: a.descriptionEn || "", 
            sortOrder: a.sortOrder ?? 0, 
            isActive: a.isActive ?? true 
        });
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function onSubmit(data: FormValues) {
        startTransition(async () => {
            try {
                await saveGalleryAlbum({ ...data, coverImageId }, editingId || undefined);
                close();
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully", { icon: "✨" });
            } catch { toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed"); }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "متأكد من الحذف؟" : "Are you sure?")) return;
        startTransition(async () => {
            try { await deleteGalleryAlbum(id); toast.success(locale === "ar" ? "تم الحذف" : "Deleted"); }
            catch { toast.error(locale === "ar" ? "فشل الحذف" : "Delete failed"); }
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-pink-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{locale === "ar" ? "الألبومات" : "Albums"}</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="images" className="size-4 text-pink-500" />
                        {locale === "ar" ? "إدارة ألبومات معرض الصور الخاص بك." : "Manage your photo gallery albums."}
                    </p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-[var(--brand-primary)] hover:!shadow-[var(--brand-primary)]/30">
                    <SidebarIcon name="plus" className="size-5" />{locale === "ar" ? "إضافة ألبوم" : "Add Album"}
                </PlayfulButton>
            </motion.div>

            {albums.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-pink-500/10 text-pink-500 mb-4 animate-bounce"><SidebarIcon name="images" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد ألبومات" : "No albums"}</h3>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                        {albums.map((a, i) => (
                            <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className={`group relative overflow-hidden rounded-3xl border-2 bg-white/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900/80 backdrop-blur-md ${a.isActive ? "border-zinc-200/50 hover:border-pink-500/30 dark:border-zinc-800/80" : "border-zinc-200/50 opacity-60 dark:border-zinc-800/50"}`}>
                                
                                <div className="aspect-square w-full bg-zinc-100 dark:bg-zinc-800 relative">
                                    {buildMediaUrl(a.coverImage) ? (
                                        <img src={buildMediaUrl(a.coverImage)!} alt={a.titleEn} className="size-full object-cover" />
                                    ) : (
                                        <div className="flex size-full items-center justify-center">
                                            <SidebarIcon name="image" className="size-8 text-zinc-300" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 truncate">{locale === "ar" ? a.titleAr : a.titleEn}</h3>
                                    <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{locale === "ar" ? a.descriptionAr : a.descriptionEn}</p>
                                </div>
                                
                                <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button onClick={() => openEdit(a)} className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm text-zinc-700 shadow-sm hover:bg-[var(--brand-primary)] hover:text-white border border-white/20 transition-all"><SidebarIcon name="edit" className="size-4" /></button>
                                    <button onClick={() => handleDelete(a.id)} disabled={isPending} className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-rose-50/90 backdrop-blur-sm text-rose-600 shadow-sm hover:bg-rose-500 hover:text-white border border-rose-100/50 transition-all"><SidebarIcon name="trash" className="size-4" /></button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل الألبوم" : "Edit Album") : (locale === "ar" ? "إضافة ألبوم" : "New Album")}
                footer={<>
                    <PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                    <PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-[var(--brand-primary)] hover:brightness-110">
                        {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                        {editingId ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إضافة" : "Create")}
                    </PlayfulButton>
                </>}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex justify-center">
                        <div onClick={() => setShowUpload(true)} className="group cursor-pointer relative w-full max-w-xs aspect-square rounded-2xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden ring-4 ring-white dark:ring-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all hover:border-[var(--brand-primary)]">
                            {coverImageUrl ? (
                                <img src={coverImageUrl} alt="" className="size-full object-cover" />
                            ) : (
                                <div className="flex size-full flex-col items-center justify-center gap-2 text-zinc-400 group-hover:text-[var(--brand-primary)]">
                                    <SidebarIcon name="camera" className="size-8" />
                                    <span className="text-sm font-medium">{locale === "ar" ? "إضافة الغلاف" : "Add Cover"}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "العنوان (EN)" : "Title (EN)"} dir="ltr" {...register("titleEn")} error={errors.titleEn?.message} />
                        <PlayfulInput label={locale === "ar" ? "العنوان (AR)" : "Title (AR)"} dir="rtl" {...register("titleAr")} error={errors.titleAr?.message} />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                        <PlayfulTextarea label={locale === "ar" ? "الوصف المُختصر (EN)" : "Short Description (EN)"} dir="ltr" rows={2} {...register("descriptionEn")} />
                        <PlayfulTextarea label={locale === "ar" ? "الوصف المُختصر (AR)" : "Short Description (AR)"} dir="rtl" rows={2} {...register("descriptionAr")} />
                    </div>

                    <div className="flex gap-4 p-4 rounded-xl bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-900/30">
                        <div className="flex-1">
                            <PlayfulInput label={locale === "ar" ? "الترتيب" : "Sort Order"} type="number" dir="ltr" {...register("sortOrder")} error={errors.sortOrder?.message} />
                        </div>
                        <div className="flex items-center">
                            <Controller name="isActive" control={control} render={({ field }) => (<PlayfulSwitch label={locale === "ar" ? "مرئي بالموقع" : "Visible on Site"} checked={field.value} onChange={field.onChange} />)} />
                        </div>
                    </div>
                </form>
            </PlayfulModal>

            {showUpload && (
                <UploadDialog folders={[]} bucket="images" defaultFolderId="all" locale={locale}
                    onClose={() => setShowUpload(false)}
                    onSuccess={(urls) => { setShowUpload(false); if (urls?.[0]) setCoverImageUrl(urls[0]); }}
                />
            )}
        </div>
    );
}
