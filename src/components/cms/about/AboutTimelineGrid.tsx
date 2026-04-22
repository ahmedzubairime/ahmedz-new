"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveAboutTimeline, deleteAboutTimeline } from "@/app/actions/about";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getSchema = (locale: string) => z.object({
    year: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    title_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    title_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    description_ar: z.string().optional(),
    description_en: z.string().optional(),
    is_active: z.boolean(),
});

type FormValues = z.infer<ReturnType<typeof getSchema>>;
type Props = { locale: string; milestones: any[] };

export function AboutTimelineGrid({ locale, milestones }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const schema = useMemo(() => getSchema(locale), [locale]);
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: { is_active: true },
    });

    function openNew() { setEditingId(null); reset({ year: "", title_ar: "", title_en: "", description_ar: "", description_en: "", is_active: true }); setModalOpen(true); }
    function openEdit(m: any) { setEditingId(m.id); reset({ year: m.year?.toString() || "", title_ar: m.title_ar, title_en: m.title_en, description_ar: m.description_ar || "", description_en: m.description_en || "", is_active: m.is_active }); setModalOpen(true); }
    function close() { setModalOpen(false); }

    function onSubmit(data: FormValues) {
        startTransition(async () => {
            try {
                await saveAboutTimeline({ ...data, year: parseInt(data.year) }, editingId || undefined);
                close(); toast.success(locale === "ar" ? "تم الحفظ" : "Saved", { icon: "✨" });
            } catch { toast.error(locale === "ar" ? "فشل" : "Failed"); }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "متأكد؟" : "Are you sure?")) return;
        startTransition(async () => {
            try { await deleteAboutTimeline(id); toast.success(locale === "ar" ? "تم الحذف" : "Deleted"); }
            catch { toast.error(locale === "ar" ? "فشل" : "Failed"); }
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-cyan-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{locale === "ar" ? "المراحل الزمنية" : "Timeline & Milestones"}</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500"><SidebarIcon name="clock" className="size-4 text-cyan-500" />{locale === "ar" ? "أبرز المحطات والإنجازات عبر السنوات." : "Key milestones and achievements across the years."}</p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-[var(--brand-primary)]"><SidebarIcon name="plus" className="size-5" />{locale === "ar" ? "إضافة محطة" : "Add Milestone"}</PlayfulButton>
            </motion.div>

            {milestones.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-500 mb-4 animate-bounce"><SidebarIcon name="clock" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد محطات بعد" : "No milestones yet"}</h3>
                </motion.div>
            ) : (
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 rtl:right-8 rtl:left-auto top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-indigo-500 rounded-full hidden md:block" />
                    <div className="space-y-6">
                        <AnimatePresence>
                            {milestones.map((m, i) => (
                                <motion.div key={m.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                    className={`group relative flex items-start gap-6 ${m.is_active ? "" : "opacity-60"}`}>
                                    {/* Year dot */}
                                    <div className="hidden md:flex flex-col items-center shrink-0">
                                        <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white font-black text-lg shadow-lg shadow-cyan-500/30 z-10">{m.year}</div>
                                    </div>
                                    {/* Card */}
                                    <div className="flex-1 rounded-3xl border-2 border-zinc-200/50 bg-white/80 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-cyan-500/30 dark:border-zinc-800/80 dark:bg-zinc-900/80 backdrop-blur-md">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <span className="md:hidden inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 px-2.5 py-1 text-xs font-black mb-2">{m.year}</span>
                                                <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100">{locale === "ar" ? m.title_ar : m.title_en}</h3>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(m)} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-white text-zinc-600 shadow-sm hover:bg-[var(--brand-primary)] hover:text-white border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 transition-all"><SidebarIcon name="edit" className="size-4" /></button>
                                                <button onClick={() => handleDelete(m.id)} disabled={isPending} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-sm hover:bg-rose-500 hover:text-white border border-rose-100 dark:bg-rose-900/30 dark:border-rose-800 transition-all"><SidebarIcon name="trash" className="size-4" /></button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-zinc-500 line-clamp-3">{locale === "ar" ? m.description_ar : m.description_en}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل المحطة" : "Edit Milestone") : (locale === "ar" ? "محطة جديدة" : "New Milestone")}
                footer={<><PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton><PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-[var(--brand-primary)]">{isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}{editingId ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إضافة" : "Create")}</PlayfulButton></>}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <PlayfulInput label={locale === "ar" ? "السنة" : "Year"} type="number" dir="ltr" placeholder="2020" {...register("year")} error={errors.year?.message} />
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "العنوان (EN)" : "Title (EN)"} dir="ltr" {...register("title_en")} error={errors.title_en?.message} />
                        <PlayfulInput label={locale === "ar" ? "العنوان (AR)" : "Title (AR)"} dir="rtl" {...register("title_ar")} error={errors.title_ar?.message} />
                    </div>
                    <div className="grid grid-cols-1 gap-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (EN)" : "Description (EN)"} dir="ltr" rows={3} {...register("description_en")} />
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (AR)" : "Description (AR)"} dir="rtl" rows={3} {...register("description_ar")} />
                    </div>
                    <Controller name="is_active" control={control} render={({ field }) => <PlayfulSwitch label={locale === "ar" ? "مرئي" : "Visible"} checked={field.value} onChange={field.onChange} />} />
                </form>
            </PlayfulModal>
        </div>
    );
}
