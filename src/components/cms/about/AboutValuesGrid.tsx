"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveAboutValue, deleteAboutValue } from "@/app/actions/about";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { PlayfulIconPicker } from "@/components/ui/PlayfulIconPicker";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getSchema = (locale: string) => z.object({
    title_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    title_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    description_ar: z.string().optional(),
    description_en: z.string().optional(),
    icon_name: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    is_active: z.boolean(),
});

type FormValues = z.infer<ReturnType<typeof getSchema>>;
type Props = { locale: string; values: any[] };

export function AboutValuesGrid({ locale, values }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const schema = useMemo(() => getSchema(locale), [locale]);
    const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { icon_name: "heart", is_active: true },
    });
    const currentIcon = watch("icon_name") || "heart";

    function openNew() { setEditingId(null); reset({ title_ar: "", title_en: "", description_ar: "", description_en: "", icon_name: "heart", is_active: true }); setModalOpen(true); }
    function openEdit(v: any) { setEditingId(v.id); reset({ title_ar: v.title_ar, title_en: v.title_en, description_ar: v.description_ar || "", description_en: v.description_en || "", icon_name: v.icon_name || "heart", is_active: v.is_active }); setModalOpen(true); }
    function close() { setModalOpen(false); }

    function onSubmit(data: FormValues) {
        startTransition(async () => {
            try { await saveAboutValue(data, editingId || undefined); close(); toast.success(locale === "ar" ? "تم الحفظ" : "Saved", { icon: "✨" }); }
            catch { toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed"); }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "متأكد من الحذف؟" : "Are you sure?")) return;
        startTransition(async () => {
            try { await deleteAboutValue(id); toast.success(locale === "ar" ? "تم الحذف" : "Deleted"); }
            catch { toast.error(locale === "ar" ? "فشل" : "Failed"); }
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-rose-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{locale === "ar" ? "القيم الأساسية" : "Core Values"}</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500"><SidebarIcon name="heart" className="size-4 text-rose-500" />{locale === "ar" ? "أدر القيم الأساسية لشركتك." : "Manage your company's core values."}</p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-[var(--brand-primary)]"><SidebarIcon name="plus" className="size-5" />{locale === "ar" ? "إضافة قيمة" : "Add Value"}</PlayfulButton>
            </motion.div>

            {values.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-500 mb-4 animate-bounce"><SidebarIcon name="heart" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد قيم بعد" : "No values yet"}</h3>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                        {values.map((v, i) => (
                            <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className={`group relative flex flex-col gap-4 rounded-3xl border-2 bg-white/80 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900/80 backdrop-blur-md ${v.is_active ? "border-zinc-200/50 hover:border-rose-500/30 dark:border-zinc-800/80" : "opacity-60 border-zinc-200/50 dark:border-zinc-800/50"}`}>
                                <div className="flex items-start justify-between">
                                    <div className={`flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${v.is_active ? "bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-rose-500/30" : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800"}`}>
                                        <SidebarIcon name={v.icon_name || "heart"} className="size-6" />
                                    </div>
                                    {v.is_active ? <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">{locale === "ar" ? "مرئي" : "Visible"}</span> : <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{locale === "ar" ? "مخفي" : "Hidden"}</span>}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 mb-2 truncate">{locale === "ar" ? v.title_ar : v.title_en}</h3>
                                    <p className="text-sm text-zinc-500 line-clamp-3">{locale === "ar" ? v.description_ar : v.description_en}</p>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 p-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-300 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-zinc-900 dark:via-zinc-900/80 rounded-b-3xl z-20">
                                    <button onClick={() => openEdit(v)} className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-white text-zinc-600 shadow-sm hover:bg-[var(--brand-primary)] hover:text-white hover:scale-110 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 transition-all"><SidebarIcon name="edit" className="size-4" /></button>
                                    <button onClick={() => handleDelete(v.id)} disabled={isPending} className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-sm hover:bg-rose-500 hover:text-white hover:scale-110 border border-rose-100 dark:bg-rose-900/30 dark:border-rose-800 transition-all"><SidebarIcon name="trash" className="size-4" /></button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل القيمة" : "Edit Value") : (locale === "ar" ? "قيمة جديدة" : "New Value")}
                footer={<><PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton><PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-[var(--brand-primary)]">{isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}{editingId ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إضافة" : "Create")}</PlayfulButton></>}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "العنوان (EN)" : "Title (EN)"} dir="ltr" {...register("title_en")} error={errors.title_en?.message} />
                        <PlayfulInput label={locale === "ar" ? "العنوان (AR)" : "Title (AR)"} dir="rtl" {...register("title_ar")} error={errors.title_ar?.message} />
                    </div>
                    <div className="grid grid-cols-1 gap-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (EN)" : "Description (EN)"} dir="ltr" rows={3} {...register("description_en")} />
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (AR)" : "Description (AR)"} dir="rtl" rows={3} {...register("description_ar")} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Controller name="icon_name" control={control} render={({ field }) => (
                            <PlayfulIconPicker label={locale === "ar" ? "الأيقونة (Lucide)" : "Icon Name"} value={field.value} onChange={field.onChange} error={errors.icon_name?.message} locale={locale} />
                        )} />
                        <Controller name="is_active" control={control} render={({ field }) => <div className="pt-8"><PlayfulSwitch label={locale === "ar" ? "مرئي" : "Visible"} checked={field.value} onChange={field.onChange} /></div>} />
                    </div>
                </form>
            </PlayfulModal>
        </div>
    );
}
