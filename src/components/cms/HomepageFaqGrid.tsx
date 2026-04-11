"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveHomepageFaq, deleteHomepageFaq } from "@/app/actions/homepage-lists";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getSchema = (locale: string) => z.object({
    question_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    question_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    answer_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    answer_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    sort_order: z.any(),
    is_active: z.boolean(),
});

type FormValues = z.infer<ReturnType<typeof getSchema>>;
type Props = { locale: string; faqs: any[] };

export function HomepageFaqGrid({ locale, faqs }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const schema = useMemo(() => getSchema(locale), [locale]);
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { is_active: true, sort_order: 0 },
    });

    function openNew() { setEditingId(null); reset({ question_ar: "", question_en: "", answer_ar: "", answer_en: "", sort_order: 0, is_active: true }); setModalOpen(true); }
    function openEdit(f: any) { setEditingId(f.id); reset({ question_ar: f.question_ar, question_en: f.question_en, answer_ar: f.answer_ar, answer_en: f.answer_en, sort_order: f.sort_order || 0, is_active: f.is_active }); setModalOpen(true); }
    function close() { setModalOpen(false); }

    function onSubmit(data: FormValues) {
        startTransition(async () => {
            try {
                await saveHomepageFaq({ ...data, sort_order: parseInt(String(data.sort_order)) || 0 }, editingId || undefined);
                close(); toast.success(locale === "ar" ? "تم الحفظ" : "Saved", { icon: "❓" });
            } catch { toast.error(locale === "ar" ? "فشل" : "Failed"); }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "متأكد من الحذف؟" : "Delete this FAQ?")) return;
        startTransition(async () => {
            try { await deleteHomepageFaq(id); toast.success(locale === "ar" ? "تم الحذف" : "Deleted"); }
            catch { toast.error(locale === "ar" ? "فشل" : "Failed"); }
        });
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-sky-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{locale === "ar" ? "الأسئلة الشائعة" : "FAQ"}</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500"><SidebarIcon name="message-square" className="size-4 text-sky-500" />{locale === "ar" ? "الأسئلة المتكررة التي تظهر في الصفحة الرئيسية." : "Frequently asked questions displayed on the homepage."}</p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-[var(--brand-primary)]"><SidebarIcon name="plus" className="size-5" />{locale === "ar" ? "سؤال جديد" : "Add FAQ"}</PlayfulButton>
            </motion.div>

            {faqs.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-500 mb-4 animate-bounce"><SidebarIcon name="message-square" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد أسئلة" : "No FAQs yet"}</h3>
                    <p className="mt-2 text-sm text-zinc-500">{locale === "ar" ? "أضف أسئلة متكررة لزيادة ثقة العملاء." : "Add common questions to build customer trust."}</p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {faqs.map((f, i) => {
                            const isExpanded = expandedId === f.id;
                            return (
                                <motion.div key={f.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                                    className={`group rounded-3xl border-2 bg-white/90 shadow-sm backdrop-blur-md transition-all dark:bg-zinc-900/90 overflow-hidden ${f.is_active ? "border-zinc-200/50 hover:border-sky-500/30 dark:border-zinc-800/80" : "opacity-60 border-zinc-200/50 dark:border-zinc-800/50"}`}>
                                    <div className="flex items-center gap-4 p-5 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : f.id)}>
                                        <div className={`flex size-10 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${isExpanded ? "bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-lg shadow-sky-500/30 rotate-0" : "bg-sky-500/10 text-sky-500"}`}>
                                            <SidebarIcon name="message-square" className="size-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{locale === "ar" ? f.question_ar : f.question_en}</h3>
                                            {!f.is_active && <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">Hidden</span>}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg">#{f.sort_order}</span>
                                            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                                <SidebarIcon name="chevron-down" className="size-5 text-zinc-400" />
                                            </motion.div>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                                                <div className="px-5 pb-5 space-y-4">
                                                    <div className="rounded-2xl bg-sky-50/60 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-900/30 p-4">
                                                        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{locale === "ar" ? f.answer_ar : f.answer_en}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <PlayfulButton onClick={() => openEdit(f)} variant="secondary" className="!text-xs !px-4"><SidebarIcon name="edit" className="size-3.5" />{locale === "ar" ? "تعديل" : "Edit"}</PlayfulButton>
                                                        <PlayfulButton onClick={() => handleDelete(f.id)} variant="secondary" className="!text-xs !px-4 !text-rose-600 hover:!bg-rose-50 dark:hover:!bg-rose-900/20"><SidebarIcon name="trash" className="size-3.5" />{locale === "ar" ? "حذف" : "Delete"}</PlayfulButton>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل سؤال" : "Edit FAQ") : (locale === "ar" ? "سؤال جديد" : "New FAQ")}
                footer={<><PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton><PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-[var(--brand-primary)]">{isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}{editingId ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إضافة" : "Create")}</PlayfulButton></>}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "السؤال (EN)" : "Question (EN)"} dir="ltr" placeholder="How do I get started?" {...register("question_en")} error={errors.question_en?.message} />
                        <PlayfulInput label={locale === "ar" ? "السؤال (AR)" : "Question (AR)"} dir="rtl" placeholder="كيف أبدأ؟" {...register("question_ar")} error={errors.question_ar?.message} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulTextarea label={locale === "ar" ? "الجواب (EN)" : "Answer (EN)"} dir="ltr" rows={4} placeholder="Getting started is easy..." {...register("answer_en")} error={errors.answer_en?.message} />
                        <PlayfulTextarea label={locale === "ar" ? "الجواب (AR)" : "Answer (AR)"} dir="rtl" rows={4} placeholder="البدء سهل..." {...register("answer_ar")} error={errors.answer_ar?.message} />
                    </div>
                    <div className="flex gap-4 p-5 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800">
                        <PlayfulInput label={locale === "ar" ? "الترتيب" : "Sort Order"} type="number" dir="ltr" {...register("sort_order")} className="max-w-24 text-center font-black !m-0" />
                        <div className="flex-1 pt-2">
                            <Controller name="is_active" control={control} render={({ field }) => <PlayfulSwitch label={locale === "ar" ? "مرئي" : "Visible"} checked={field.value} onChange={field.onChange} />} />
                        </div>
                    </div>
                </form>
            </PlayfulModal>
        </div>
    );
}
