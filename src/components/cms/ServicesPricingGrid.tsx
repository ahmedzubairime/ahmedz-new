"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveServicePricing, deleteServicePricing } from "@/app/actions/services-lists";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulSelect, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getSchema = (locale: string) => z.object({
    service_id: z.string().min(1, locale === "ar" ? "اختر خدمة" : "Required"),
    plan_name_ar: z.string().min(1), plan_name_en: z.string().min(1),
    description_ar: z.string().optional(), description_en: z.string().optional(),
    price: z.any(), currency: z.string().optional(), billing_period: z.string().optional(),
    is_popular: z.boolean(), is_active: z.boolean(), sort_order: z.any(),
});
type FormValues = z.infer<ReturnType<typeof getSchema>>;
type Props = { locale: string; plans: any[]; services: any[] };

export function ServicesPricingGrid({ locale, plans, services }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [filterServiceId, setFilterServiceId] = useState("");
    const schema = useMemo(() => getSchema(locale), [locale]);
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema) as any, defaultValues: { is_active: true, is_popular: false, sort_order: 0, currency: "SAR", billing_period: "monthly" }
    });
    const svcOpts = useMemo(() => services.map(s => ({ value: s.id, label: locale === "ar" ? s.title_ar : s.title_en })), [services, locale]);
    const filterOpts = [{ value: "", label: locale === "ar" ? "-- الكل --" : "-- All --" }, ...svcOpts];
    const filtered = filterServiceId ? plans.filter(p => p.service_id === filterServiceId) : plans;
    const billingOpts = [{ value: "monthly", label: locale === "ar" ? "شهري" : "Monthly" }, { value: "yearly", label: locale === "ar" ? "سنوي" : "Yearly" }, { value: "one-time", label: locale === "ar" ? "مرة واحدة" : "One-time" }, { value: "custom", label: locale === "ar" ? "مخصص" : "Custom" }];

    function openNew() { setEditingId(null); reset({ service_id: filterServiceId || "", plan_name_ar: "", plan_name_en: "", description_ar: "", description_en: "", price: "", currency: "SAR", billing_period: "monthly", is_popular: false, is_active: true, sort_order: 0 }); setModalOpen(true); }
    function openEdit(p: any) { setEditingId(p.id); reset({ service_id: p.service_id, plan_name_ar: p.plan_name_ar, plan_name_en: p.plan_name_en, description_ar: p.description_ar || "", description_en: p.description_en || "", price: p.price || "", currency: p.currency || "SAR", billing_period: p.billing_period || "monthly", is_popular: p.is_popular, is_active: p.is_active, sort_order: p.sort_order || 0 }); setModalOpen(true); }
    function close() { setModalOpen(false); }
    function onSubmit(data: FormValues) { startTransition(async () => { try { await saveServicePricing({ ...data, price: parseFloat(String(data.price)) || 0, sort_order: parseInt(String(data.sort_order)) || 0 }, editingId || undefined); close(); toast.success(locale === "ar" ? "تم الحفظ" : "Saved", { icon: "💰" }); } catch { toast.error(locale === "ar" ? "فشل" : "Failed"); } }); }
    function handleDelete(id: string) { if (!confirm(locale === "ar" ? "حذف؟" : "Delete?")) return; startTransition(async () => { try { await deleteServicePricing(id); toast.success("Deleted"); } catch { toast.error("Failed"); } }); }
    function svcName(id: string) { const s = services.find(v => v.id === id); return s ? (locale === "ar" ? s.title_ar : s.title_en) : "—"; }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "أسعار الخدمات" : "Service Pricing Plans"}</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500"><SidebarIcon name="credit-card" className="size-4 text-emerald-500" />{locale === "ar" ? "أدر خطط الأسعار لكل خدمة." : "Manage pricing tiers per service."}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-48"><PlayfulSelect label="" options={filterOpts} value={filterServiceId} onChange={(e: any) => setFilterServiceId(e.target.value)} /></div>
                    <PlayfulButton onClick={openNew} className="!bg-emerald-600 text-white"><SidebarIcon name="plus" className="size-5" />{locale === "ar" ? "خطة جديدة" : "Add Plan"}</PlayfulButton>
                </div>
            </motion.div>

            {filtered.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 dark:border-zinc-800">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500 mb-4 animate-bounce"><SidebarIcon name="credit-card" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد خطط" : "No pricing plans yet"}</h3>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                        {filtered.map((plan, i) => (
                            <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                                className={`group relative flex flex-col rounded-3xl border-2 bg-white/80 p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900/80 backdrop-blur-md transition-all ${plan.is_popular ? 'border-emerald-500/50 ring-2 ring-emerald-500/20' : plan.is_active ? 'border-zinc-200/50 hover:border-emerald-500/30 dark:border-zinc-800/80' : 'opacity-60'}`}>
                                {plan.is_popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">{locale === "ar" ? "الأكثر طلباً" : "Popular"}</div>}
                                <div className="text-center pt-2">
                                    <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100">{locale === "ar" ? plan.plan_name_ar : plan.plan_name_en}</h3>
                                    <div className="mt-3 flex items-baseline justify-center gap-1">
                                        <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{plan.price || 0}</span>
                                        <span className="text-sm font-bold text-zinc-400">{plan.currency}/{plan.billing_period === "monthly" ? (locale === "ar" ? "شهر" : "mo") : plan.billing_period === "yearly" ? (locale === "ar" ? "سنة" : "yr") : ""}</span>
                                    </div>
                                    <p className="mt-3 text-sm text-zinc-500 line-clamp-2">{locale === "ar" ? plan.description_ar : plan.description_en}</p>
                                </div>
                                <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg">{svcName(plan.service_id)}</span>
                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(plan)} className="flex size-8 cursor-pointer items-center justify-center rounded-xl bg-white shadow-sm hover:bg-emerald-50 dark:bg-zinc-800 text-zinc-500"><SidebarIcon name="edit" className="size-3.5" /></button>
                                        <button onClick={() => handleDelete(plan.id)} className="flex size-8 cursor-pointer items-center justify-center rounded-xl bg-rose-50 text-rose-500 shadow-sm dark:bg-rose-900/20"><SidebarIcon name="trash" className="size-3.5" /></button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل" : "Edit Plan") : (locale === "ar" ? "خطة جديدة" : "New Plan")}
                footer={<><PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton><PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-emerald-600 text-white">{isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}{editingId ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إنشاء" : "Create")}</PlayfulButton></>}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <Controller name="service_id" control={control} render={({ field }) => (<PlayfulSelect label={locale === "ar" ? "الخدمة" : "Service"} options={svcOpts} {...field} error={errors.service_id?.message} />)} />
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label="Plan Name (EN)" dir="ltr" {...register("plan_name_en")} error={errors.plan_name_en?.message} />
                        <PlayfulInput label="اسم الخطة (AR)" dir="rtl" {...register("plan_name_ar")} error={errors.plan_name_ar?.message} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulTextarea label="Description (EN)" dir="ltr" rows={2} {...register("description_en")} />
                        <PlayfulTextarea label="الوصف (AR)" dir="rtl" rows={2} {...register("description_ar")} />
                    </div>
                    <div className="flex gap-4 p-4 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800">
                        <PlayfulInput label={locale === "ar" ? "السعر" : "Price"} type="number" step="0.01" {...register("price")} className="max-w-28 font-black" />
                        <PlayfulInput label={locale === "ar" ? "العملة" : "Currency"} {...register("currency")} className="max-w-20 font-mono" />
                        <Controller name="billing_period" control={control} render={({ field }) => (<PlayfulSelect label={locale === "ar" ? "الفترة" : "Period"} options={billingOpts} {...field} />)} />
                        <PlayfulInput label="Sort" type="number" {...register("sort_order")} className="max-w-16 text-center font-black" />
                    </div>
                    <div className="flex gap-6 pt-2 pl-4">
                        <Controller name="is_active" control={control} render={({ field }) => (<PlayfulSwitch label={locale === "ar" ? "مفعل" : "Active"} checked={field.value} onChange={field.onChange} />)} />
                        <Controller name="is_popular" control={control} render={({ field }) => (<PlayfulSwitch label={locale === "ar" ? "الأشهر" : "Popular"} checked={field.value} onChange={field.onChange} />)} />
                    </div>
                </form>
            </PlayfulModal>
        </div>
    );
}
