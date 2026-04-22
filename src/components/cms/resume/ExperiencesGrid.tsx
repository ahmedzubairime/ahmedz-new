"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveExperience, deleteExperience } from "@/app/actions/portfolio";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { UploadDialog } from "@/components/media/UploadDialog";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const getSchema = (locale: string) => z.object({
    companyAr: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    companyEn: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    roleAr: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    roleEn: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    sectorAr: z.string().optional(),
    sectorEn: z.string().optional(),
    startDate: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    endDate: z.string().optional().nullable(),
    isCurrent: z.boolean(),
    descriptionAr: z.string().optional(),
    descriptionEn: z.string().optional(),
    sortOrder: z.coerce.number().default(0),
    isActive: z.boolean(),
});

type FormValues = z.infer<ReturnType<typeof getSchema>>;
type Props = { locale: string; experiences: any[] };

function buildMediaUrl(m: any) {
    if (!m) return null;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${m.bucket}/${m.storage_path}`;
}

export function ExperiencesGrid({ locale, experiences }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [logoId, setLogoId] = useState<string | null>(null);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [showUpload, setShowUpload] = useState(false);

    const schema = useMemo(() => getSchema(locale), [locale]);
    const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: { isActive: true, isCurrent: false, sortOrder: 0 },
    });

    const isCurrent = watch("isCurrent");

    function openNew() {
        setEditingId(null);
        setLogoId(null); setLogoUrl(null);
        reset({ 
            companyAr: "", companyEn: "", roleAr: "", roleEn: "", sectorAr: "", sectorEn: "", 
            startDate: "", endDate: null, isCurrent: false, descriptionAr: "", descriptionEn: "", 
            sortOrder: 0, isActive: true 
        });
        setModalOpen(true);
    }

    function openEdit(e: any) {
        setEditingId(e.id);
        setLogoId(e.logoId); setLogoUrl(buildMediaUrl(e.logo));
        reset({ 
            companyAr: e.companyAr || "", 
            companyEn: e.companyEn || "", 
            roleAr: e.roleAr || "", 
            roleEn: e.roleEn || "", 
            sectorAr: e.sectorAr || "", 
            sectorEn: e.sectorEn || "", 
            startDate: e.startDate ? e.startDate.split('T')[0] : "", 
            endDate: e.endDate ? e.endDate.split('T')[0] : null, 
            isCurrent: e.isCurrent || false, 
            descriptionAr: e.descriptionAr || "", 
            descriptionEn: e.descriptionEn || "", 
            sortOrder: e.sortOrder ?? 0, 
            isActive: e.isActive ?? true 
        });
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function onSubmit(data: FormValues) {
        startTransition(async () => {
            try {
                if(data.isCurrent) data.endDate = null;
                await saveExperience({ ...data, logoId }, editingId || undefined);
                close();
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully", { icon: "✨" });
            } catch { toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed"); }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "متأكد من الحذف؟" : "Are you sure?")) return;
        startTransition(async () => {
            try { await deleteExperience(id); toast.success(locale === "ar" ? "تم الحذف" : "Deleted"); }
            catch { toast.error(locale === "ar" ? "فشل الحذف" : "Delete failed"); }
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-blue-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{locale === "ar" ? "الخبرات المهنية" : "Experiences"}</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="briefcase" className="size-4 text-blue-500" />
                        {locale === "ar" ? "أدر سجل خبراتك المهنية." : "Manage your professional career history."}
                    </p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-[var(--brand-primary)] hover:!shadow-[var(--brand-primary)]/30">
                    <SidebarIcon name="plus" className="size-5" />{locale === "ar" ? "إضافة خبرة" : "Add Experience"}
                </PlayfulButton>
            </motion.div>

            {experiences.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-500 mb-4 animate-bounce"><SidebarIcon name="briefcase" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد خبرات بعد" : "No experiences yet"}</h3>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <AnimatePresence>
                        {experiences.map((e, i) => (
                            <motion.div key={e.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className={`group relative flex items-start gap-4 rounded-3xl border-2 bg-white/80 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900/80 backdrop-blur-md ${e.isActive ? "border-zinc-200/50 hover:border-blue-500/30 dark:border-zinc-800/80" : "border-zinc-200/50 opacity-60 dark:border-zinc-800/50"}`}>
                                
                                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 ring-2 ring-white dark:ring-zinc-900 shadow-lg">
                                    {buildMediaUrl(e.logo) ? (
                                        <img src={buildMediaUrl(e.logo)!} alt={e.companyEn} className="size-full object-cover" />
                                    ) : (
                                        <SidebarIcon name="building" className="size-8 text-zinc-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 truncate w-11/12">{locale === "ar" ? e.roleAr : e.roleEn}</h3>
                                    <p className="text-sm font-semibold text-[var(--brand-primary)]">{locale === "ar" ? e.companyAr : e.companyEn}</p>
                                    <p className="mt-1 text-xs text-zinc-500 flex items-center gap-1">
                                        <SidebarIcon name="calendar" className="size-3" />
                                        {format(new Date(e.startDate), 'MMM yyyy')} - {e.isCurrent ? (locale === "ar" ? "الآن" : "Present") : (e.endDate ? format(new Date(e.endDate), 'MMM yyyy') : "")}
                                    </p>
                                </div>
                                <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(e)} className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-white text-zinc-600 shadow-sm hover:bg-[var(--brand-primary)] hover:text-white border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 transition-all"><SidebarIcon name="edit" className="size-4" /></button>
                                    <button onClick={() => handleDelete(e.id)} disabled={isPending} className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-rose-50 text-rose-600 shadow-sm hover:bg-rose-500 hover:text-white border border-rose-100 dark:bg-rose-900/30 dark:border-rose-800 transition-all"><SidebarIcon name="trash" className="size-4" /></button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل الخبرة" : "Edit Experience") : (locale === "ar" ? "إضافة خبرة" : "New Experience")}
                footer={<>
                    <PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                    <PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-[var(--brand-primary)] hover:brightness-110">
                        {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                        {editingId ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إضافة" : "Create")}
                    </PlayfulButton>
                </>}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex justify-center">
                        <div onClick={() => setShowUpload(true)} className="group cursor-pointer relative">
                            <div className="flex size-24 items-center justify-center overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 ring-4 ring-zinc-200 dark:ring-zinc-700 transition-all group-hover:ring-[var(--brand-primary)]">
                                {logoUrl ? <img src={logoUrl} alt="" className="size-full object-cover" /> : <SidebarIcon name="camera" className="size-8 text-zinc-400 group-hover:text-[var(--brand-primary)]" />}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "الشركة (EN)" : "Company (EN)"} dir="ltr" {...register("companyEn")} error={errors.companyEn?.message} />
                        <PlayfulInput label={locale === "ar" ? "الشركة (AR)" : "Company (AR)"} dir="rtl" {...register("companyAr")} error={errors.companyAr?.message} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "الدور (EN)" : "Role (EN)"} dir="ltr" {...register("roleEn")} error={errors.roleEn?.message} />
                        <PlayfulInput label={locale === "ar" ? "الدور (AR)" : "Role (AR)"} dir="rtl" {...register("roleAr")} error={errors.roleAr?.message} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "القطاع (EN)" : "Sector (EN)"} dir="ltr" {...register("sectorEn")} error={errors.sectorEn?.message} />
                        <PlayfulInput label={locale === "ar" ? "القطاع (AR)" : "Sector (AR)"} dir="rtl" {...register("sectorAr")} error={errors.sectorAr?.message} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-center">
                        <div className="sm:col-span-5"><PlayfulInput label={locale === "ar" ? "تاريخ البدء" : "Start Date"} type="date" dir="ltr" {...register("startDate")} error={errors.startDate?.message} /></div>
                        <div className="sm:col-span-1 pt-6 flex justify-center text-zinc-400">⟶</div>
                        <div className="sm:col-span-5">
                            {!isCurrent && <PlayfulInput label={locale === "ar" ? "تاريخ الانتهاء" : "End Date"} type="date" dir="ltr" {...register("endDate")} error={errors.endDate?.message} />}
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                        <Controller name="isCurrent" control={control} render={({ field }) => (<PlayfulSwitch label={locale === "ar" ? "أعمل هنا حالياً" : "I currently work here"} checked={field.value} onChange={field.onChange} />)} />
                        <Controller name="isActive" control={control} render={({ field }) => (<PlayfulSwitch label={locale === "ar" ? "مرئي بالموقع" : "Visible on Site"} checked={field.value} onChange={field.onChange} />)} />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (EN)" : "Description (EN)"} dir="ltr" rows={3} {...register("descriptionEn")} />
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (AR)" : "Description (AR)"} dir="rtl" rows={3} {...register("descriptionAr")} />
                    </div>
                </form>
            </PlayfulModal>

            {showUpload && (
                <UploadDialog folders={[]} bucket="images" defaultFolderId="all" locale={locale}
                    onClose={() => setShowUpload(false)}
                    onSuccess={(urls) => { setShowUpload(false); if (urls?.[0]) setLogoUrl(urls[0]); }}
                />
            )}
        </div>
    );
}
