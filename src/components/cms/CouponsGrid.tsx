"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveCoupon, deleteCoupon } from "@/app/actions/store-marketing";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulSelect, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getCouponSchema = (locale: string) => z.object({
  code: z.string().min(1, locale === "ar" ? "مطلوب" : "Required").regex(/^[A-Za-z0-9_-]+$/, locale === "ar" ? "أرقام وحروف إنجليزية فقط" : "Alphanumeric only"),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.any(),
  min_order_amount: z.any().optional(),
  max_discount_amount: z.any().optional(),
  usage_limit: z.any().optional(),
  starts_at: z.string().optional(),
  expires_at: z.string().optional(),
  is_active: z.boolean(),
});

type CouponFormValues = z.infer<ReturnType<typeof getCouponSchema>>;

type Props = { locale: string; coupons: any[]; };

export function CouponsGrid({ locale, coupons }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const schema = useMemo(() => getCouponSchema(locale), [locale]);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<CouponFormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: { discount_type: "percentage", is_active: true }
    });

    function openNew() {
        setEditingId(null);
        reset({ 
            code: "", description_ar: "", description_en: "", discount_type: "percentage", 
            discount_value: "", min_order_amount: "", max_discount_amount: "", usage_limit: "", 
            starts_at: "", expires_at: "", is_active: true 
        });
        setModalOpen(true);
    }

    function openEdit(c: any) {
        setEditingId(c.id);
        reset({
            code: c.code || "", description_ar: c.description_ar || "", description_en: c.description_en || "",
            discount_type: c.discount_type || "percentage", discount_value: c.discount_value || "",
            min_order_amount: c.min_order_amount || "",
            max_discount_amount: c.max_discount_amount || "",
            starts_at: c.starts_at ? c.starts_at.substring(0, 16) : "",
            expires_at: c.expires_at ? c.expires_at.substring(0, 16) : "",
            usage_limit: c.usage_limit || "",
            is_active: c.is_active
        });
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function onSubmit(data: any) {
        startTransition(async () => {
            const payload = {
                ...data,
                code: data.code.toUpperCase(),
                discount_value: parseFloat(String(data.discount_value)) || 0,
                min_order_amount: data.min_order_amount ? parseFloat(String(data.min_order_amount)) : null,
                max_discount_amount: data.max_discount_amount ? parseFloat(String(data.max_discount_amount)) : null,
                usage_limit: data.usage_limit ? parseInt(String(data.usage_limit)) : null,
                starts_at: data.starts_at || null, 
                expires_at: data.expires_at || null,
            };
            try { 
                await saveCoupon(payload, editingId || undefined); 
                close(); 
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully", { icon: "🎫" });
            }
            catch (err) { 
                console.error(err); 
                toast.error(locale === "ar" ? "فشل الحفظ. تأكد من عدم تكرار الكود." : "Save failed. Ensure code is unique."); 
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "حذف هذا الكوبون؟" : "Delete this coupon?")) return;
        startTransition(async () => { 
            try {
                await deleteCoupon(id); 
                toast.success(locale === "ar" ? "تم الحذف" : "Deleted");
            } catch (err) {
                toast.error(locale === "ar" ? "فشل الحذف" : "Delete failed");
            }
        });
    }

    const now = new Date();

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-rose-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {locale === "ar" ? "الكوبونات" : "Coupons"}
                    </h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="ticket" className="size-4 text-rose-500" />
                        {locale === "ar" ? "أنشئ أكواد خصم بحدود استخدام وتواريخ انتهاء." : "Create discount codes with usage limits and expiry dates."}
                    </p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-[var(--brand-primary)] hover:!shadow-[var(--brand-primary)]/30">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "كوبون جديد" : "New Coupon"}
                </PlayfulButton>
            </motion.div>

            {/* Grid */}
            {coupons.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-500 mb-4 animate-pulse"><SidebarIcon name="ticket" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد كوبونات" : "No coupons yet"}</h3>
                    <p className="mt-2 text-sm font-medium text-zinc-500">{locale === "ar" ? "أنشئ أكواد خصم لعملائك." : "Create discount codes for your customers."}</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                        {coupons.map((c, i) => {
                            const expired = c.expires_at && new Date(c.expires_at) < now;
                            const usedUp = c.usage_limit && c.used_count >= c.usage_limit;
                            const inactive = !c.is_active || expired || usedUp;

                            return (
                                <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`group relative overflow-hidden rounded-3xl border-2 p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900/50 backdrop-blur-sm ${!inactive ? 'border-rose-500/20 bg-white/80 hover:border-rose-500/50 hover:shadow-rose-500/10 dark:hover:border-rose-400/50' : 'border-zinc-200/50 bg-zinc-50/50 opacity-80 hover:border-zinc-300 dark:border-zinc-800/50 dark:hover:border-zinc-700'}`}>
                                    
                                    {!inactive && <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />}
                                    
                                    <div className="flex items-start justify-between mb-4 relative z-10">
                                        <div className="font-mono text-xl font-black tracking-widest text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 shadow-sm shadow-rose-500/10">
                                            {c.code}
                                        </div>
                                        <div className="flex gap-2">
                                            {!inactive ? 
                                                <span className="flex items-center justify-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 uppercase tracking-wider">{locale === "ar" ? "نشط" : "Active"}</span> 
                                                : 
                                                <span className="flex items-center justify-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 uppercase tracking-wider">{expired ? "Expired" : "Disabled"}</span>
                                            }
                                        </div>
                                    </div>
                                    
                                    <div className="relative z-10 mb-6">
                                        <div className="flex items-baseline gap-1">
                                            <p className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">
                                                {c.discount_type === "percentage" ? `${c.discount_value}%` : `${c.discount_value}`}
                                            </p>
                                            <span className="text-base font-bold text-zinc-400">{locale === "ar" ? "خصم" : "OFF"}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 relative z-10">
                                        {c.min_order_amount && (
                                            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100/50 dark:bg-zinc-800/50 px-3 py-2 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50">
                                                <SidebarIcon name="shopping-bag" className="size-3.5 text-zinc-400" />
                                                <span>{locale === "ar" ? `الحد الأدنى للطلب: ${c.min_order_amount}` : `Min order: ${c.min_order_amount}`}</span>
                                            </div>
                                        )}
                                        {c.usage_limit && (
                                            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100/50 dark:bg-zinc-800/50 px-3 py-2 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50">
                                                <SidebarIcon name="users" className="size-3.5 text-zinc-400" />
                                                <span>{locale === "ar" ? `تم استخدام ${c.used_count} من ${c.usage_limit}` : `${c.used_count} of ${c.usage_limit} used`}</span>
                                            </div>
                                        )}
                                        {(c.starts_at || c.expires_at) && (
                                            <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border ${expired ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20' : 'bg-zinc-100/50 text-zinc-600 border-zinc-200/50 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700/50'}`}>
                                                <SidebarIcon name="clock" className="size-3.5 text-inherit opacity-70" />
                                                <span>
                                                    {c.starts_at && new Date(c.starts_at).toLocaleDateString(locale === "ar" ? "ar" : "en", { month: 'short', day: 'numeric' })}
                                                    {c.starts_at && c.expires_at && " → "}
                                                    {c.expires_at && new Date(c.expires_at).toLocaleDateString(locale === "ar" ? "ar" : "en", { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 flex justify-between p-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-300 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-zinc-900 dark:via-zinc-900/80 rounded-b-3xl z-20">
                                        <button onClick={() => openEdit(c)} className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-white text-zinc-600 shadow-sm hover:bg-[var(--brand-primary)] hover:text-white hover:scale-110 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 transition-all"><SidebarIcon name="edit" className="size-4" /></button>
                                        <button onClick={() => handleDelete(c.id)} disabled={isPending} className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-sm hover:bg-rose-500 hover:text-white hover:scale-110 border border-rose-100 dark:bg-rose-900/30 dark:border-rose-800 transition-all"><SidebarIcon name="trash" className="size-4" /></button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal */}
            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل الكوبون" : "Edit Coupon") : (locale === "ar" ? "كوبون جديد" : "New Coupon")}
                footer={
                    <>
                        <PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                        <PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-[var(--brand-primary)] hover:!bg-[var(--brand-primary)] hover:brightness-110">
                            {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                            {editingId ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إنشاء الكوبون" : "Create Coupon")}
                        </PlayfulButton>
                    </>
                }
            >
                <form id="coupon-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    <div className="bg-rose-500/5 border border-rose-500/20 p-4 rounded-3xl dark:bg-rose-500/10">
                        <PlayfulInput 
                            label={locale === "ar" ? "كود الخصم" : "Coupon Code"} 
                            dir="ltr" 
                            placeholder="SUMMER2026" 
                            {...register("code", { onChange: (e) => e.target.value = e.target.value.toUpperCase() })} 
                            error={errors.code?.message as string} 
                            className="font-mono font-bold tracking-widest text-lg text-rose-600 placeholder:text-rose-200" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "الوصف (EN)" : "Description (EN)"} dir="ltr" {...register("description_en")} error={errors.description_en?.message as string} />
                        <PlayfulInput label={locale === "ar" ? "الوصف (AR)" : "Description (AR)"} dir="rtl" {...register("description_ar")} error={errors.description_ar?.message as string} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <PlayfulSelect label={locale === "ar" ? "نوع الخصم" : "Discount Type"} {...register("discount_type")} error={errors.discount_type?.message as string}
                            options={[{ value: "percentage", label: locale === "ar" ? "نسبة %" : "Percentage %" }, { value: "fixed", label: locale === "ar" ? "مبلغ ثابت" : "Fixed Amount" }]} 
                        />
                        <PlayfulInput label={locale === "ar" ? "قيمة الخصم" : "Discount Value"} type="number" step="0.01" dir="ltr" {...register("discount_value", { valueAsNumber: true })} error={errors.discount_value?.message as string} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "الحد الأدنى للطلب" : "Min Order Amount"} type="number" step="0.01" dir="ltr" {...register("min_order_amount", { valueAsNumber: true })} error={errors.min_order_amount?.message as string} placeholder="—" />
                        <PlayfulInput label={locale === "ar" ? "أقصى مبلغ للخصم" : "Max Discount Amount"} type="number" step="0.01" dir="ltr" {...register("max_discount_amount", { valueAsNumber: true })} error={errors.max_discount_amount?.message as string} placeholder="—" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "حد الاستخدام" : "Usage Limit"} type="number" min="1" dir="ltr" {...register("usage_limit", { valueAsNumber: true })} error={errors.usage_limit?.message as string} placeholder="∞" />
                        <Controller name="is_active" control={control} render={({ field }) => (
                            <div className="pt-2 pl-4">
                                <PlayfulSwitch label={locale === "ar" ? "مفعّل" : "Active"} checked={field.value} onChange={field.onChange} />
                            </div>
                        )} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "يبدأ من" : "Starts At"} type="datetime-local" dir="ltr" {...register("starts_at")} error={errors.starts_at?.message as string} />
                        <PlayfulInput label={locale === "ar" ? "ينتهي في" : "Expires At"} type="datetime-local" dir="ltr" {...register("expires_at")} error={errors.expires_at?.message as string} />
                    </div>

                </form>
            </PlayfulModal>
        </div>
    );
}
