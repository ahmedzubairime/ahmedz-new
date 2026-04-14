"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveHomepageStat, deleteHomepageStat } from "@/app/actions/homepage-lists";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { PlayfulIconPicker } from "@/components/ui/PlayfulIconPicker";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getSchema = (locale: string) => z.object({
    label_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    label_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    numeric_value: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    suffix: z.string().optional(),
    icon_name: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    is_active: z.boolean(),
});

type FormValues = z.infer<ReturnType<typeof getSchema>>;
type Props = { locale: string; stats: any[] };

export function HomepageStatsGrid({ locale, stats }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const schema = useMemo(() => getSchema(locale), [locale]);
    const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { icon_name: "bar-chart-2", suffix: "+", is_active: true },
    });
    const currentIcon = watch("icon_name") || "bar-chart-2";

    function openNew() { setEditingId(null); reset({ label_ar: "", label_en: "", numeric_value: "", suffix: "+", icon_name: "bar-chart-2", is_active: true }); setModalOpen(true); }
    function openEdit(s: any) { setEditingId(s.id); reset({ label_ar: s.label_ar, label_en: s.label_en, numeric_value: s.numeric_value?.toString() || "0", suffix: s.suffix || "+", icon_name: s.icon_name || "bar-chart-2", is_active: s.is_active }); setModalOpen(true); }
    function close() { setModalOpen(false); }

    function onSubmit(data: FormValues) {
        startTransition(async () => {
            try {
                await saveHomepageStat({ ...data, numeric_value: parseInt(data.numeric_value) }, editingId || undefined);
                close(); toast.success(locale === "ar" ? "تم الحفظ" : "Saved", { icon: "📊" });
            } catch { toast.error(locale === "ar" ? "فشل" : "Failed"); }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "متأكد؟" : "Are you sure?")) return;
        startTransition(async () => {
            try { await deleteHomepageStat(id); toast.success(locale === "ar" ? "تم الحذف" : "Deleted"); }
            catch { toast.error(locale === "ar" ? "فشل" : "Failed"); }
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-amber-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{locale === "ar" ? "الإحصائيات والعدادات" : "Stats & Counters"}</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500"><SidebarIcon name="bar-chart-2" className="size-4 text-amber-500" />{locale === "ar" ? "أرقام مثل العملاء، المشاريع المنجزة." : "Numbers like clients served, projects completed."}</p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-[var(--brand-primary)]"><SidebarIcon name="plus" className="size-5" />{locale === "ar" ? "إضافة إحصائية" : "Add Stat"}</PlayfulButton>
            </motion.div>

            {stats.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500 mb-4 animate-bounce"><SidebarIcon name="bar-chart-2" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد إحصائيات" : "No stats yet"}</h3>
                    <p className="mt-2 text-sm text-zinc-500">{locale === "ar" ? "أضف أرقاماً تُبرز إنجازاتك." : "Add numbers that highlight your achievements."}</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <AnimatePresence>
                        {stats.map((s, i) => (
                            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className={`group relative flex flex-col items-center gap-3 rounded-3xl border-2 bg-white/80 p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900/80 backdrop-blur-md ${s.is_active ? "border-zinc-200/50 hover:border-amber-500/30 dark:border-zinc-800/80" : "opacity-60 border-zinc-200/50 dark:border-zinc-800/50"}`}>
                                <div className={`flex size-12 items-center justify-center rounded-2xl ${s.is_active ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30" : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800"} transition-transform group-hover:scale-110`}>
                                    <SidebarIcon name={s.icon_name || "bar-chart-2"} className="size-5" />
                                </div>
                                <div className="text-4xl font-black text-zinc-900 dark:text-zinc-100">
                                    {s.numeric_value}<span className="text-[var(--brand-primary)]">{s.suffix}</span>
                                </div>
                                <p className="text-sm font-semibold text-zinc-500">{locale === "ar" ? s.label_ar : s.label_en}</p>
                                <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 p-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-300 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-zinc-900 dark:via-zinc-900/80 rounded-b-3xl z-20">
                                    <button onClick={() => openEdit(s)} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-white text-zinc-600 shadow-sm hover:bg-[var(--brand-primary)] hover:text-white border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 transition-all"><SidebarIcon name="edit" className="size-4" /></button>
                                    <button onClick={() => handleDelete(s.id)} disabled={isPending} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-sm hover:bg-rose-500 hover:text-white border border-rose-100 dark:bg-rose-900/30 dark:border-rose-800 transition-all"><SidebarIcon name="trash" className="size-4" /></button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل إحصائية" : "Edit Stat") : (locale === "ar" ? "إحصائية جديدة" : "New Stat")}
                footer={<><PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton><PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-[var(--brand-primary)]">{isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}{editingId ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إضافة" : "Create")}</PlayfulButton></>}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "التسمية (EN)" : "Label (EN)"} dir="ltr" placeholder="Completed Projects" {...register("label_en")} error={errors.label_en?.message} />
                        <PlayfulInput label={locale === "ar" ? "التسمية (AR)" : "Label (AR)"} dir="rtl" placeholder="مشاريع منجزة" {...register("label_ar")} error={errors.label_ar?.message} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <PlayfulInput label={locale === "ar" ? "القيمة الرقمية" : "Numeric Value"} type="number" dir="ltr" placeholder="500" {...register("numeric_value")} error={errors.numeric_value?.message} />
                        <PlayfulInput label={locale === "ar" ? "اللاحقة" : "Suffix"} dir="ltr" placeholder="+" {...register("suffix")} />
                        <Controller name="icon_name" control={control} render={({ field }) => (
                            <PlayfulIconPicker label={locale === "ar" ? "الأيقونة" : "Icon"} value={field.value} onChange={field.onChange} error={errors.icon_name?.message} locale={locale} />
                        )} />
                    </div>
                    <Controller name="is_active" control={control} render={({ field }) => <PlayfulSwitch label={locale === "ar" ? "مرئي" : "Visible"} checked={field.value} onChange={field.onChange} />} />
                </form>
            </PlayfulModal>
        </div>
    );
}
