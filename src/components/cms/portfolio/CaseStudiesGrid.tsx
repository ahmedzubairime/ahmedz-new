"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveCaseStudy, deleteCaseStudy } from "@/app/actions/portfolio";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getSchema = (locale: string) => z.object({
    projectId: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    titleAr: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    titleEn: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    slug: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    challengeAr: z.string().optional(),
    challengeEn: z.string().optional(),
    solutionAr: z.string().optional(),
    solutionEn: z.string().optional(),
    impactAr: z.string().optional(),
    impactEn: z.string().optional(),
    contentAr: z.string().optional(),
    contentEn: z.string().optional(),
    sortOrder: z.coerce.number().default(0),
    isActive: z.boolean(),
});

type FormValues = z.infer<ReturnType<typeof getSchema>>;
type Props = { locale: string; caseStudies: any[]; projects: any[] };

export function CaseStudiesGrid({ locale, caseStudies, projects }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const schema = useMemo(() => getSchema(locale), [locale]);
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { isActive: true, sortOrder: 0, projectId: projects[0]?.id || "" },
    });

    function openNew() {
        setEditingId(null);
        reset({ 
            projectId: projects[0]?.id || "", titleAr: "", titleEn: "", slug: "", 
            challengeAr: "", challengeEn: "", solutionAr: "", solutionEn: "", 
            impactAr: "", impactEn: "", contentAr: "", contentEn: "",
            sortOrder: 0, isActive: true 
        });
        setModalOpen(true);
    }

    function openEdit(c: any) {
        setEditingId(c.id);
        reset({ 
            projectId: c.projectId || "",
            titleAr: c.titleAr || "", 
            titleEn: c.titleEn || "", 
            slug: c.slug || "",
            challengeAr: c.challengeAr || "", challengeEn: c.challengeEn || "", 
            solutionAr: c.solutionAr || "", solutionEn: c.solutionEn || "", 
            impactAr: c.impactAr || "", impactEn: c.impactEn || "", 
            contentAr: c.contentAr || "", contentEn: c.contentEn || "", 
            sortOrder: c.sortOrder ?? 0, 
            isActive: c.isActive ?? true 
        });
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function onSubmit(data: FormValues) {
        startTransition(async () => {
            try {
                await saveCaseStudy(data, editingId || undefined);
                close();
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully", { icon: "✨" });
            } catch { toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed"); }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "متأكد من الحذف؟" : "Are you sure?")) return;
        startTransition(async () => {
            try { await deleteCaseStudy(id); toast.success(locale === "ar" ? "تم الحذف" : "Deleted"); }
            catch { toast.error(locale === "ar" ? "فشل الحذف" : "Delete failed"); }
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-purple-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{locale === "ar" ? "دراسات الحالة" : "Case Studies"}</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="book-open" className="size-4 text-purple-500" />
                        {locale === "ar" ? "إضافة دراسات حالة مفصلة لمشاريعك." : "Add detailed case studies for your projects."}
                    </p>
                </div>
                <PlayfulButton onClick={openNew} disabled={projects.length === 0} className="!bg-[var(--brand-primary)] hover:!shadow-[var(--brand-primary)]/30 disabled:opacity-50">
                    <SidebarIcon name="plus" className="size-5" />{locale === "ar" ? "إضافة دراسة" : "Add Case Study"}
                </PlayfulButton>
            </motion.div>

            {projects.length === 0 && (
                <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/20 p-4 border border-amber-200 dark:border-amber-800/30 flex items-center gap-3 text-amber-700 dark:text-amber-400 font-medium">
                    <SidebarIcon name="alert-triangle" className="size-5" />
                    {locale === "ar" ? "يجب إضافة مشروع واحد على الأقل قبل إضافة دراسة حالة." : "You must add at least one project before creating a case study."}
                </div>
            )}

            {caseStudies.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-purple-500/10 text-purple-500 mb-4 animate-bounce"><SidebarIcon name="book-open" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد دراسات حالة" : "No case studies"}</h3>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <AnimatePresence>
                        {caseStudies.map((c, i) => (
                            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className={`group relative flex flex-col rounded-3xl border-2 bg-white/80 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900/80 backdrop-blur-md ${c.isActive ? "border-zinc-200/50 hover:border-purple-500/30 dark:border-zinc-800/80" : "border-zinc-200/50 opacity-60 dark:border-zinc-800/50"}`}>
                                
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider">
                                            {locale === "ar" ? c.project?.titleAr : c.project?.titleEn}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100">{locale === "ar" ? c.titleAr : c.titleEn}</h3>
                                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                            <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1"><SidebarIcon name="target" className="size-3" /> {locale === "ar" ? "التحدي" : "Challenge"}</p>
                                            <p className="text-zinc-500 line-clamp-3">{locale === "ar" ? c.challengeAr : c.challengeEn}</p>
                                        </div>
                                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                            <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1"><SidebarIcon name="award" className="size-3" /> {locale === "ar" ? "النتيجة" : "Impact"}</p>
                                            <p className="text-zinc-500 line-clamp-3">{locale === "ar" ? c.impactAr : c.impactEn}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(c)} className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-white text-zinc-600 shadow-sm hover:bg-[var(--brand-primary)] hover:text-white border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 transition-all"><SidebarIcon name="edit" className="size-4" /></button>
                                    <button onClick={() => handleDelete(c.id)} disabled={isPending} className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-rose-50 text-rose-600 shadow-sm hover:bg-rose-500 hover:text-white border border-rose-100 dark:bg-rose-900/30 dark:border-rose-800 transition-all"><SidebarIcon name="trash" className="size-4" /></button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل دراسة الحالة" : "Edit Case Study") : (locale === "ar" ? "إضافة دراسة حالة" : "New Case Study")}
                footer={<>
                    <PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                    <PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-[var(--brand-primary)] hover:brightness-110">
                        {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                        {editingId ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إضافة" : "Create")}
                    </PlayfulButton>
                </>}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{locale === "ar" ? "المشروع المرتبط" : "Linked Project"}</label>
                        <select {...register("projectId")} className="w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100 focus:border-[var(--brand-primary)] focus:ring-0 transition-colors">
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{locale === "ar" ? p.titleAr : p.titleEn}</option>
                            ))}
                        </select>
                        {errors.projectId && <p className="mt-1 text-xs text-red-500">{errors.projectId.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "العنوان (EN)" : "Title (EN)"} dir="ltr" {...register("titleEn")} error={errors.titleEn?.message} />
                        <PlayfulInput label={locale === "ar" ? "العنوان (AR)" : "Title (AR)"} dir="rtl" {...register("titleAr")} error={errors.titleAr?.message} />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                        <PlayfulInput label="Slug (URL)" dir="ltr" {...register("slug")} error={errors.slug?.message} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulTextarea label={locale === "ar" ? "التحدي (EN)" : "Challenge (EN)"} dir="ltr" rows={3} {...register("challengeEn")} />
                        <PlayfulTextarea label={locale === "ar" ? "التحدي (AR)" : "Challenge (AR)"} dir="rtl" rows={3} {...register("challengeAr")} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulTextarea label={locale === "ar" ? "الحل (EN)" : "Solution (EN)"} dir="ltr" rows={3} {...register("solutionEn")} />
                        <PlayfulTextarea label={locale === "ar" ? "الحل (AR)" : "Solution (AR)"} dir="rtl" rows={3} {...register("solutionAr")} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulTextarea label={locale === "ar" ? "النتائج (EN)" : "Impact (EN)"} dir="ltr" rows={3} {...register("impactEn")} />
                        <PlayfulTextarea label={locale === "ar" ? "النتائج (AR)" : "Impact (AR)"} dir="rtl" rows={3} {...register("impactAr")} />
                    </div>

                    <div className="flex gap-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
                        <div className="flex-1">
                            <PlayfulInput label={locale === "ar" ? "الترتيب" : "Sort Order"} type="number" dir="ltr" {...register("sortOrder")} error={errors.sortOrder?.message} />
                        </div>
                        <div className="flex items-center">
                            <Controller name="isActive" control={control} render={({ field }) => (<PlayfulSwitch label={locale === "ar" ? "مرئي بالموقع" : "Visible on Site"} checked={field.value} onChange={field.onChange} />)} />
                        </div>
                    </div>
                </form>
            </PlayfulModal>
        </div>
    );
}
