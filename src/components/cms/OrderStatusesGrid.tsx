"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveOrderStatus, deleteOrderStatus } from "@/app/actions/store-orders";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { PlayfulIconPicker } from "@/components/ui/PlayfulIconPicker";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getStatusSchema = (locale: string) => z.object({
  name_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  name_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  color: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  icon: z.string().optional(),
  is_default: z.boolean(),
  is_final: z.boolean(),
  sort_order: z.any()
});

type StatusFormValues = z.infer<ReturnType<typeof getStatusSchema>>;

type Props = { locale: string; statuses: any[]; };

export function OrderStatusesGrid({ locale, statuses }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const schema = useMemo(() => getStatusSchema(locale), [locale]);

    const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<StatusFormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: { color: "#3b82f6", icon: "circle", is_default: false, is_final: false, sort_order: 0 }
    });

    const currentColor = watch("color") || "#3b82f6";
    const currentIcon = watch("icon") || "circle";

    function openNew() {
        setEditingId(null);
        reset({ name_ar: "", name_en: "", color: "#3b82f6", icon: "circle", is_default: false, is_final: false, sort_order: 0 });
        setModalOpen(true);
    }

    function openEdit(s: any) {
        setEditingId(s.id);
        reset({
            name_ar: s.name_ar || "", name_en: s.name_en || "",
            color: s.color || "#3b82f6", icon: s.icon || "circle",
            is_default: s.is_default, is_final: s.is_final,
            sort_order: s.sort_order || 0
        });
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function onSubmit(data: StatusFormValues) {
        startTransition(async () => {
            try {
                const payload = { ...data, sort_order: parseInt(String(data.sort_order)) || 0 };
                await saveOrderStatus(payload, editingId || undefined);
                close();
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully", { icon: "📦" });
            } catch (err) {
                console.error(err);
                toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "حذف هذه الحالة؟" : "Delete this status?")) return;
        startTransition(async () => {
            try {
                await deleteOrderStatus(id);
                toast.success(locale === "ar" ? "تم الحذف" : "Deleted");
            } catch(e) {
                toast.error(locale === "ar" ? "فشل الحذف" : "Delete failed");
            }
        });
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-blue-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {locale === "ar" ? "حالات الطلبات" : "Order Statuses"}
                    </h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="git-merge" className="size-4 text-blue-500" />
                        {locale === "ar" ? "خصّص مراحل سير عمل الطلبات." : "Customize your order pipeline stages."}
                    </p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-blue-500 hover:!shadow-blue-500/30 text-white">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "حالة جديدة" : "New Status"}
                </PlayfulButton>
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                    {statuses.map((s, i) => (
                        <motion.div key={s.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="relative group flex items-center gap-4 rounded-3xl border-2 border-zinc-200/50 bg-white/80 p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800/50 dark:bg-zinc-900/80 backdrop-blur-md" style={{ borderColor: `${s.color}30` }}>
                            
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                                <SidebarIcon name={s.icon || "circle"} className="size-6 drop-shadow-sm" />
                            </div>
                            
                            <div className="flex-1 min-w-0 pb-1">
                                <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate text-lg pb-1">{locale === "ar" ? s.name_ar : s.name_en}</p>
                                <div className="flex flex-wrap gap-2">
                                    {s.is_default && <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md dark:bg-emerald-500/20 dark:text-emerald-400 uppercase tracking-widest">{locale === "ar" ? "افتراضي" : "Default"}</span>}
                                    {s.is_final && <span className="text-[10px] font-black bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded-md dark:bg-zinc-700 dark:text-zinc-300 uppercase tracking-widest">{locale === "ar" ? "نهائي" : "Final"}</span>}
                                </div>
                            </div>

                            <div className="absolute right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                <button onClick={() => openEdit(s)} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-white shadow-sm hover:scale-110 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 transition-transform" style={{ color: s.color }}><SidebarIcon name="edit" className="size-4" /></button>
                                <button onClick={() => handleDelete(s.id)} disabled={isPending} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-sm hover:bg-rose-500 hover:text-white hover:scale-110 border border-rose-100 dark:bg-rose-900/30 dark:border-rose-800 transition-all"><SidebarIcon name="trash" className="size-4" /></button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal */}
            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل الحالة" : "Edit Status") : (locale === "ar" ? "حالة جديدة" : "New Status")}
                footer={
                    <>
                        <PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                        <PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-[var(--brand-primary)] hover:!bg-[var(--brand-primary)] hover:brightness-110">
                            {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                            {editingId ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إنشاء" : "Create")}
                        </PlayfulButton>
                    </>
                }
            >
                <form id="status-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "الاسم (EN)" : "Name (EN)"} dir="ltr" {...register("name_en")} error={errors.name_en?.message} />
                        <PlayfulInput label={locale === "ar" ? "الاسم (AR)" : "Name (AR)"} dir="rtl" {...register("name_ar")} error={errors.name_ar?.message} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ms-1">{locale === "ar" ? "اللون" : "Color"}</label>
                            <div className="flex gap-4 items-center bg-white/50 dark:bg-zinc-900/50 px-4 py-[11px] rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-md">
                                <input type="color" {...register("color")} className="size-6 rounded-md border-0 cursor-pointer bg-transparent p-0" />
                                <span className="font-mono text-[13px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest truncate">{currentColor}</span>
                            </div>
                        </div>

                        <Controller name="icon" control={control} render={({ field }) => (
                            <PlayfulIconPicker label={locale === "ar" ? "الأيقونة" : "Icon Name"} value={field.value || ""} onChange={field.onChange} error={errors.icon?.message as string} locale={locale} />
                        )} />

                        <PlayfulInput label={locale === "ar" ? "الترتيب" : "Sort Order"} type="number" dir="ltr" {...register("sort_order")} error={errors.sort_order?.message as string} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Controller name="is_default" control={control} render={({ field }) => (
                            <PlayfulSwitch label={locale === "ar" ? "افتراضي (طلبات جديدة)" : "Default (New Orders)"} checked={field.value} onChange={field.onChange} />
                        )} />
                        <Controller name="is_final" control={control} render={({ field }) => (
                            <PlayfulSwitch label={locale === "ar" ? "حالة نهائية (مغلق)" : "Final State (Closed)"} checked={field.value} onChange={field.onChange} />
                        )} />
                    </div>
                </form>
            </PlayfulModal>
        </div>
    );
}
