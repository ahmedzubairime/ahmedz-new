"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveCampaign, deleteCampaign } from "@/app/actions/store-marketing";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getCampaignSchema = (locale: string) => z.object({
  name_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  name_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  starts_at: z.string().optional(),
  expires_at: z.string().optional(),
  is_active: z.boolean(),
});

type CampaignFormValues = z.infer<ReturnType<typeof getCampaignSchema>>;

type Props = { locale: string; campaigns: any[]; };

export function CampaignsGrid({ locale, campaigns }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const schema = useMemo(() => getCampaignSchema(locale), [locale]);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<CampaignFormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: { is_active: true }
    });

    function openNew() {
        setEditingId(null);
        reset({ name_ar: "", name_en: "", description_ar: "", description_en: "", starts_at: "", expires_at: "", is_active: true });
        setModalOpen(true);
    }

    function openEdit(c: any) {
        setEditingId(c.id);
        reset({
            name_ar: c.name_ar || "", name_en: c.name_en || "",
            description_ar: c.description_ar || "", description_en: c.description_en || "",
            starts_at: c.starts_at ? c.starts_at.substring(0, 16) : "",
            expires_at: c.expires_at ? c.expires_at.substring(0, 16) : "",
            is_active: c.is_active
        });
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function onSubmit(data: any) {
        startTransition(async () => {
            const payload = {
                ...data,
                starts_at: data.starts_at || null, 
                expires_at: data.expires_at || null,
            };
            try { 
                await saveCampaign(payload, editingId || undefined); 
                close(); 
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully", { icon: "🎊" });
            }
            catch (err) { 
                console.error(err); 
                toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed"); 
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "حذف هذه الحملة؟" : "Delete this campaign?")) return;
        startTransition(async () => { 
            try {
                await deleteCampaign(id); 
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
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-amber-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {locale === "ar" ? "الحملات التسويقية" : "Campaigns"}
                    </h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="megaphone" className="size-4 text-amber-500" />
                        {locale === "ar" ? "أنشئ حملات ترويجية مؤقتة." : "Create time-limited promotional campaigns."}
                    </p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-[var(--brand-primary)] hover:!shadow-[var(--brand-primary)]/30">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "حملة جديدة" : "New Campaign"}
                </PlayfulButton>
            </motion.div>

            {/* Grid */}
            {campaigns.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500 mb-4 animate-bounce"><SidebarIcon name="megaphone" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد حملات" : "No campaigns yet"}</h3>
                    <p className="mt-2 text-sm font-medium text-zinc-500">{locale === "ar" ? "صمم حملات خصومات متقدمة." : "Design advanced discount campaigns."}</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                        {campaigns.map((c, i) => {
                            const active = c.is_active && (!c.expires_at || new Date(c.expires_at) > now);
                            return (
                                <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`group relative overflow-hidden rounded-3xl border-2 p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900/50 backdrop-blur-sm ${active ? 'border-amber-500/30 bg-white/80 hover:border-amber-500/60 hover:shadow-amber-500/10 dark:hover:border-amber-400/50' : 'border-zinc-200/50 bg-zinc-50/50 opacity-80 hover:border-zinc-300 dark:border-zinc-800/50 dark:hover:border-zinc-700'}`}>
                                    {active && <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />}
                                    <div className="flex items-start justify-between mb-4 relative z-10">
                                        <div className={`flex size-14 items-center justify-center rounded-2xl shadow-sm ${active ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-amber-500/30' : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                                            <SidebarIcon name="megaphone" className="size-6" />
                                        </div>
                                        <div className="flex gap-2">
                                            {c.is_active ? 
                                                <span className="flex items-center justify-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 uppercase tracking-wider">{locale === "ar" ? "مفعّل" : "Active"}</span> 
                                                : 
                                                <span className="flex items-center justify-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 uppercase tracking-wider">{locale === "ar" ? "معطّل" : "Disabled"}</span>
                                            }
                                        </div>
                                    </div>
                                    
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 mb-2 truncate">{locale === "ar" ? c.name_ar : c.name_en}</h3>
                                        <p className="text-sm font-medium text-zinc-500 line-clamp-2 h-10">{locale === "ar" ? c.description_ar : c.description_en}</p>
                                    </div>

                                    {(c.starts_at || c.expires_at) && (
                                        <div className="mt-6 flex flex-wrap gap-2 relative z-10">
                                            {c.starts_at && (
                                                <div className="flex items-center gap-1.5 rounded-lg bg-zinc-100/80 px-2.5 py-1.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50">
                                                    <SidebarIcon name="calendar" className="size-3" />
                                                    {new Date(c.starts_at).toLocaleDateString(locale === "ar" ? "ar" : "en", { month: 'short', day: 'numeric' })}
                                                </div>
                                            )}
                                            {c.starts_at && c.expires_at && <span className="text-zinc-300 dark:text-zinc-600 flex items-center">&rarr;</span>}
                                            {c.expires_at && (
                                                <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold border ${new Date(c.expires_at) < now ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20' : 'bg-zinc-100/80 text-zinc-600 border-zinc-200/50 dark:bg-zinc-800/80 dark:text-zinc-400 dark:border-zinc-700/50'}`}>
                                                    <SidebarIcon name="clock" className="size-3" />
                                                    {new Date(c.expires_at).toLocaleDateString(locale === "ar" ? "ar" : "en", { month: 'short', day: 'numeric' })}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="absolute inset-x-0 bottom-0 flex justify-between p-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-300 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-zinc-900 dark:via-zinc-900/80 rounded-b-3xl">
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
            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل الحملة" : "Edit Campaign") : (locale === "ar" ? "حملة جديدة" : "New Campaign")}
                footer={
                    <>
                        <PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                        <PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-[var(--brand-primary)] hover:!bg-[var(--brand-primary)] hover:brightness-110">
                            {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                            {editingId ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إنشاء الحملة" : "Create Campaign")}
                        </PlayfulButton>
                    </>
                }
            >
                <form id="campaign-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "الاسم (EN)" : "Campaign Name (EN)"} dir="ltr" {...register("name_en")} error={errors.name_en?.message as string} />
                        <PlayfulInput label={locale === "ar" ? "الاسم (AR)" : "Campaign Name (AR)"} dir="rtl" {...register("name_ar")} error={errors.name_ar?.message as string} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (EN)" : "Description (EN)"} dir="ltr" rows={2} {...register("description_en")} error={errors.description_en?.message as string} />
                        <PlayfulTextarea label={locale === "ar" ? "الوصف (AR)" : "Description (AR)"} dir="rtl" rows={2} {...register("description_ar")} error={errors.description_ar?.message as string} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "يبدأ من" : "Starts At"} type="datetime-local" dir="ltr" {...register("starts_at")} error={errors.starts_at?.message as string} />
                        <PlayfulInput label={locale === "ar" ? "ينتهي في" : "Expires At"} type="datetime-local" dir="ltr" {...register("expires_at")} error={errors.expires_at?.message as string} />
                    </div>

                    <Controller
                        name="is_active"
                        control={control}
                        render={({ field }) => (
                            <div className="pt-2">
                                <PlayfulSwitch label={locale === "ar" ? "مفعّل" : "Active"} checked={field.value} onChange={field.onChange} />
                            </div>
                        )}
                    />
                </form>
            </PlayfulModal>
        </div>
    );
}
