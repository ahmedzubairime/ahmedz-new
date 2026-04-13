"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveServiceProcess, deleteServiceProcess } from "@/app/actions/services-lists";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulSelect, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getSchema = (locale: string) => z.object({
    service_id: z.string().min(1, locale === "ar" ? "اختر خدمة" : "Required"),
    step_number: z.any(), title_ar: z.string().min(1), title_en: z.string().min(1),
    description_ar: z.string().optional(), description_en: z.string().optional(),
    icon_name: z.string().optional(), is_active: z.boolean(), sort_order: z.any(),
});
type FormValues = z.infer<ReturnType<typeof getSchema>>;
type Props = { locale: string; steps: any[]; services: any[] };

export function ServicesProcessGrid({ locale, steps, services }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [filterServiceId, setFilterServiceId] = useState("");
    const schema = useMemo(() => getSchema(locale), [locale]);
    const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema), defaultValues: { is_active: true, sort_order: 0, step_number: 1, icon_name: "check" }
    });
    const currentIcon = watch("icon_name") || "check";
    const svcOpts = useMemo(() => services.map(s => ({ value: s.id, label: locale === "ar" ? s.title_ar : s.title_en })), [services, locale]);
    const filterOpts = [{ value: "", label: locale === "ar" ? "-- الكل --" : "-- All --" }, ...svcOpts];
    const filtered = filterServiceId ? steps.filter(s => s.service_id === filterServiceId) : steps;

    function openNew() { setEditingId(null); reset({ service_id: filterServiceId || "", step_number: filtered.length + 1, title_ar: "", title_en: "", description_ar: "", description_en: "", icon_name: "check", is_active: true, sort_order: 0 }); setModalOpen(true); }
    function openEdit(s: any) { setEditingId(s.id); reset({ service_id: s.service_id, step_number: s.step_number || 1, title_ar: s.title_ar, title_en: s.title_en, description_ar: s.description_ar || "", description_en: s.description_en || "", icon_name: s.icon_name || "check", is_active: s.is_active, sort_order: s.sort_order || 0 }); setModalOpen(true); }
    function close() { setModalOpen(false); }
    function onSubmit(data: FormValues) { startTransition(async () => { try { await saveServiceProcess({ ...data, step_number: parseInt(String(data.step_number)) || 1, sort_order: parseInt(String(data.sort_order)) || 0 }, editingId || undefined); close(); toast.success(locale === "ar" ? "تم الحفظ" : "Saved", { icon: "📋" }); } catch { toast.error(locale === "ar" ? "فشل" : "Failed"); } }); }
    function handleDelete(id: string) { if (!confirm(locale === "ar" ? "حذف؟" : "Delete?")) return; startTransition(async () => { try { await deleteServiceProcess(id); toast.success("Deleted"); } catch { toast.error("Failed"); } }); }
    function svcName(id: string) { const s = services.find(v => v.id === id); return s ? (locale === "ar" ? s.title_ar : s.title_en) : "—"; }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "خطوات الخدمة" : "Service Process Steps"}</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500"><SidebarIcon name="list-ordered" className="size-4 text-sky-500" />{locale === "ar" ? "خطوات \"كيف نعمل\" لكل خدمة." : "\"How We Work\" steps per service."}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-48"><PlayfulSelect label="" options={filterOpts} value={filterServiceId} onChange={(e: any) => setFilterServiceId(e.target.value)} /></div>
                    <PlayfulButton onClick={openNew} className="!bg-sky-600 text-white"><SidebarIcon name="plus" className="size-5" />{locale === "ar" ? "خطوة جديدة" : "Add Step"}</PlayfulButton>
                </div>
            </motion.div>

            {filtered.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 dark:border-zinc-800">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-500 mb-4 animate-bounce"><SidebarIcon name="list-ordered" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد خطوات" : "No steps yet"}</h3>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                        {filtered.map((step, i) => (
                            <motion.div key={step.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                                className={`group relative flex flex-col gap-3 rounded-3xl border-2 bg-white/80 p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900/80 backdrop-blur-md transition-all ${step.is_active ? 'border-zinc-200/50 hover:border-sky-500/30 dark:border-zinc-800/80' : 'opacity-60'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 text-white font-black text-lg shadow-lg">{step.step_number}</div>
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-sky-50 text-sky-500 dark:bg-sky-900/30"><SidebarIcon name={step.icon_name || "check"} className="size-4" /></div>
                                    </div>
                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(step)} className="flex size-8 cursor-pointer items-center justify-center rounded-xl bg-white shadow-sm hover:bg-sky-50 dark:bg-zinc-800 text-zinc-500"><SidebarIcon name="edit" className="size-3.5" /></button>
                                        <button onClick={() => handleDelete(step.id)} className="flex size-8 cursor-pointer items-center justify-center rounded-xl bg-rose-50 text-rose-500 shadow-sm dark:bg-rose-900/20"><SidebarIcon name="trash" className="size-3.5" /></button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 truncate">{locale === "ar" ? step.title_ar : step.title_en}</h3>
                                <p className="text-sm text-zinc-500 line-clamp-2">{locale === "ar" ? step.description_ar : step.description_en}</p>
                                <div className="mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800/50"><span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg">{svcName(step.service_id)}</span></div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل" : "Edit Step") : (locale === "ar" ? "خطوة جديدة" : "New Step")}
                footer={<><PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton><PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-sky-600 text-white">{isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}{editingId ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إنشاء" : "Create")}</PlayfulButton></>}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <Controller name="service_id" control={control} render={({ field }) => (<PlayfulSelect label={locale === "ar" ? "الخدمة" : "Service"} options={svcOpts} {...field} error={errors.service_id?.message} />)} />
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label="Title (EN)" dir="ltr" {...register("title_en")} error={errors.title_en?.message} />
                        <PlayfulInput label="العنوان (AR)" dir="rtl" {...register("title_ar")} error={errors.title_ar?.message} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulTextarea label="Description (EN)" dir="ltr" rows={3} {...register("description_en")} />
                        <PlayfulTextarea label="الوصف (AR)" dir="rtl" rows={3} {...register("description_ar")} />
                    </div>
                    <div className="flex gap-4 p-4 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800">
                        <PlayfulInput label="Step #" type="number" {...register("step_number")} className="max-w-20 text-center font-black" />
                        <PlayfulInput label="Sort" type="number" {...register("sort_order")} className="max-w-20 text-center font-black" />
                        <div className="relative flex-1">
                            <PlayfulInput label="Icon" dir="ltr" {...register("icon_name")} className="pl-10" />
                            <div className="absolute left-3 top-[38px] flex size-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-500"><SidebarIcon name={currentIcon as any} className="size-4" /></div>
                        </div>
                        <div className="pt-2"><Controller name="is_active" control={control} render={({ field }) => (<PlayfulSwitch label={locale === "ar" ? "مفعل" : "Active"} checked={field.value} onChange={field.onChange} />)} /></div>
                    </div>
                </form>
            </PlayfulModal>
        </div>
    );
}
