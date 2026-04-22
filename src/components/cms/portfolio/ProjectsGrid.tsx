"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveProject, deleteProject } from "@/app/actions/portfolio";
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
    slug: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    clientAr: z.string().optional(),
    clientEn: z.string().optional(),
    descriptionAr: z.string().optional(),
    descriptionEn: z.string().optional(),
    completionDate: z.string().optional().nullable(),
    sortOrder: z.coerce.number().default(0),
    isActive: z.boolean(),
});

type FormValues = z.infer<ReturnType<typeof getSchema>>;
type Props = { locale: string; projects: any[] };

function buildMediaUrl(m: any) {
    if (!m) return null;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${m.bucket}/${m.storage_path}`;
}

export function ProjectsGrid({ locale, projects }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [coverImageId, setCoverImageId] = useState<string | null>(null);
    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
    const [showUpload, setShowUpload] = useState(false);

    const schema = useMemo(() => getSchema(locale), [locale]);
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: { isActive: true, sortOrder: 0 },
    });

    function openNew() {
        setEditingId(null);
        setCoverImageId(null); setCoverImageUrl(null);
        reset({ 
            titleAr: "", titleEn: "", slug: "", clientAr: "", clientEn: "", 
            descriptionAr: "", descriptionEn: "", completionDate: null, 
            sortOrder: 0, isActive: true 
        });
        setModalOpen(true);
    }

    function openEdit(e: any) {
        setEditingId(e.id);
        setCoverImageId(e.coverImageId); setCoverImageUrl(buildMediaUrl(e.coverImage)); // assuming relation is fetched
        reset({ 
            titleAr: e.titleAr || "", 
            titleEn: e.titleEn || "", 
            slug: e.slug || "",
            clientAr: e.clientAr || "", 
            clientEn: e.clientEn || "", 
            descriptionAr: e.descriptionAr || "", 
            descriptionEn: e.descriptionEn || "", 
            completionDate: e.completionDate ? e.completionDate.split('T')[0] : null, 
            sortOrder: e.sortOrder ?? 0, 
            isActive: e.isActive ?? true 
        });
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function onSubmit(data: FormValues) {
        startTransition(async () => {
            try {
                await saveProject({ ...data, coverImageId }, editingId || undefined);
                close();
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully", { icon: "✨" });
            } catch { toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed"); }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "متأكد من الحذف؟" : "Are you sure?")) return;
        startTransition(async () => {
            try { await deleteProject(id); toast.success(locale === "ar" ? "تم الحذف" : "Deleted"); }
            catch { toast.error(locale === "ar" ? "فشل الحذف" : "Delete failed"); }
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-indigo-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{locale === "ar" ? "المشاريع" : "Projects"}</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="folder" className="size-4 text-indigo-500" />
                        {locale === "ar" ? "إدارة مشاريعك المهنية المنجزة." : "Manage your completed professional projects."}
                    </p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-[var(--brand-primary)] hover:!shadow-[var(--brand-primary)]/30">
                    <SidebarIcon name="plus" className="size-5" />{locale === "ar" ? "إضافة مشروع" : "Add Project"}
                </PlayfulButton>
            </motion.div>

            {projects.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-500 mb-4 animate-bounce"><SidebarIcon name="folder" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد مشاريع" : "No projects"}</h3>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                        {projects.map((p, i) => (
                            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className={`group relative overflow-hidden rounded-3xl border-2 bg-white/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900/80 backdrop-blur-md ${p.isActive ? "border-zinc-200/50 hover:border-indigo-500/30 dark:border-zinc-800/80" : "border-zinc-200/50 opacity-60 dark:border-zinc-800/50"}`}>
                                
                                <div className="aspect-video w-full bg-zinc-100 dark:bg-zinc-800 relative">
                                    {buildMediaUrl(p.coverImage) ? (
                                        <img src={buildMediaUrl(p.coverImage)!} alt={p.titleEn} className="size-full object-cover" />
                                    ) : (
                                        <div className="flex size-full items-center justify-center">
                                            <SidebarIcon name="image" className="size-8 text-zinc-300" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 truncate">{locale === "ar" ? p.titleAr : p.titleEn}</h3>
                                    <p className="text-sm font-semibold text-[var(--brand-primary)]">{locale === "ar" ? p.clientAr : p.clientEn}</p>
                                    <p className="mt-2 text-xs text-zinc-500 line-clamp-2">{locale === "ar" ? p.descriptionAr : p.descriptionEn}</p>
                                </div>
                                
                                <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button onClick={() => openEdit(p)} className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm text-zinc-700 shadow-sm hover:bg-[var(--brand-primary)] hover:text-white border border-white/20 transition-all"><SidebarIcon name="edit" className="size-4" /></button>
                                    <button onClick={() => handleDelete(p.id)} disabled={isPending} className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-rose-50/90 backdrop-blur-sm text-rose-600 shadow-sm hover:bg-rose-500 hover:text-white border border-rose-100/50 transition-all"><SidebarIcon name="trash" className="size-4" /></button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل المشروع" : "Edit Project") : (locale === "ar" ? "إضافة مشروع" : "New Project")}
                footer={<>
                    <PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                    <PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-[var(--brand-primary)] hover:brightness-110">
                        {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                        {editingId ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إضافة" : "Create")}
                    </PlayfulButton>
                </>}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex justify-center">
                        <div onClick={() => setShowUpload(true)} className="group cursor-pointer relative w-full max-w-sm aspect-video rounded-2xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden ring-4 ring-white dark:ring-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all hover:border-[var(--brand-primary)]">
                            {coverImageUrl ? (
                                <img src={coverImageUrl} alt="" className="size-full object-cover" />
                            ) : (
                                <div className="flex size-full flex-col items-center justify-center gap-2 text-zinc-400 group-hover:text-[var(--brand-primary)]">
                                    <SidebarIcon name="camera" className="size-8" />
                                    <span className="text-sm font-medium">{locale === "ar" ? "إضافة صورة" : "Add Cover"}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "العنوان (EN)" : "Title (EN)"} dir="ltr" {...register("titleEn")} error={errors.titleEn?.message} />
                        <PlayfulInput label={locale === "ar" ? "العنوان (AR)" : "Title (AR)"} dir="rtl" {...register("titleAr")} error={errors.titleAr?.message} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label="Slug (URL)" dir="ltr" {...register("slug")} error={errors.slug?.message} />
                        <PlayfulInput label={locale === "ar" ? "تاريخ الإنجاز" : "Completion Date"} type="date" dir="ltr" {...register("completionDate")} error={errors.completionDate?.message} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "العميل (EN)" : "Client (EN)"} dir="ltr" {...register("clientEn")} error={errors.clientEn?.message} />
                        <PlayfulInput label={locale === "ar" ? "العميل (AR)" : "Client (AR)"} dir="rtl" {...register("clientAr")} error={errors.clientAr?.message} />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                        <PlayfulTextarea label={locale === "ar" ? "الوصف المُختصر (EN)" : "Short Description (EN)"} dir="ltr" rows={2} {...register("descriptionEn")} />
                        <PlayfulTextarea label={locale === "ar" ? "الوصف المُختصر (AR)" : "Short Description (AR)"} dir="rtl" rows={2} {...register("descriptionAr")} />
                    </div>

                    <div className="flex gap-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
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
