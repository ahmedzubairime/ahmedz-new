"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveSkill, deleteSkill } from "@/app/actions/portfolio";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getSchema = (locale: string) => z.object({
    nameAr: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    nameEn: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    category: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    proficiencyLevel: z.coerce.number().min(0).max(100),
    iconName: z.string().optional(),
    sortOrder: z.coerce.number().default(0),
    isActive: z.boolean(),
});

type FormValues = z.infer<ReturnType<typeof getSchema>>;
type Props = { locale: string; skills: any[] };

export function SkillsGrid({ locale, skills }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const schema = useMemo(() => getSchema(locale), [locale]);
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { isActive: true, category: 'skill', proficiencyLevel: 100, sortOrder: 0, iconName: '' },
    });

    function openNew() {
        setEditingId(null);
        reset({ nameAr: "", nameEn: "", category: "skill", proficiencyLevel: 100, iconName: "", sortOrder: 0, isActive: true });
        setModalOpen(true);
    }

    function openEdit(s: any) {
        setEditingId(s.id);
        reset({ 
            nameAr: s.nameAr || "", 
            nameEn: s.nameEn || "", 
            category: s.category || "skill", 
            proficiencyLevel: s.proficiencyLevel ?? 100, 
            iconName: s.iconName || "", 
            sortOrder: s.sortOrder ?? 0, 
            isActive: s.isActive ?? true 
        });
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function onSubmit(data: FormValues) {
        startTransition(async () => {
            try {
                await saveSkill(data, editingId || undefined);
                close();
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully", { icon: "✨" });
            } catch { toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed"); }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "متأكد من الحذف؟" : "Are you sure?")) return;
        startTransition(async () => {
            try { await deleteSkill(id); toast.success(locale === "ar" ? "تم الحذف" : "Deleted"); }
            catch { toast.error(locale === "ar" ? "فشل الحذف" : "Delete failed"); }
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-yellow-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{locale === "ar" ? "المهارات" : "Skills"}</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="star" className="size-4 text-yellow-500" />
                        {locale === "ar" ? "إدارة مهاراتك ومستويات إتقانك." : "Manage your skills and proficiency levels."}
                    </p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-[var(--brand-primary)] hover:!shadow-[var(--brand-primary)]/30">
                    <SidebarIcon name="plus" className="size-5" />{locale === "ar" ? "إضافة مهارة" : "Add Skill"}
                </PlayfulButton>
            </motion.div>

            {skills.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-yellow-500/10 text-yellow-500 mb-4 animate-bounce"><SidebarIcon name="star" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد مهارات بعد" : "No skills yet"}</h3>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                        {skills.map((s, i) => (
                            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className={`group relative flex flex-col items-center gap-4 rounded-3xl border-2 bg-white/80 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900/80 backdrop-blur-md ${s.isActive ? "border-zinc-200/50 hover:border-yellow-500/30 dark:border-zinc-800/80" : "border-zinc-200/50 opacity-60 dark:border-zinc-800/50"}`}>
                                
                                <div className="text-center flex-1">
                                    <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 truncate">{locale === "ar" ? s.nameAr : s.nameEn}</h3>
                                    <p className="text-sm font-semibold text-zinc-500">{s.category}</p>
                                    <p className="mt-2 flex items-center justify-center gap-1 text-sm font-bold text-[var(--brand-primary)]">
                                        {s.proficiencyLevel}%
                                    </p>
                                    {s.iconName && (
                                        <p className="text-xs text-zinc-400 mt-2">Icon: {s.iconName}</p>
                                    )}
                                </div>
                                <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 p-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-300 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-zinc-900 dark:via-zinc-900/80 rounded-b-3xl z-20">
                                    <button onClick={() => openEdit(s)} className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-white text-zinc-600 shadow-sm hover:bg-[var(--brand-primary)] hover:text-white hover:scale-110 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 transition-all"><SidebarIcon name="edit" className="size-4" /></button>
                                    <button onClick={() => handleDelete(s.id)} disabled={isPending} className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-sm hover:bg-rose-500 hover:text-white hover:scale-110 border border-rose-100 dark:bg-rose-900/30 dark:border-rose-800 transition-all"><SidebarIcon name="trash" className="size-4" /></button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل مهارة" : "Edit Skill") : (locale === "ar" ? "تعديل مهارة" : "New Skill")}
                footer={<>
                    <PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                    <PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-[var(--brand-primary)] hover:brightness-110">
                        {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                        {editingId ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إضافة" : "Create")}
                    </PlayfulButton>
                </>}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "الاسم (EN)" : "Name (EN)"} dir="ltr" {...register("nameEn")} error={errors.nameEn?.message} />
                        <PlayfulInput label={locale === "ar" ? "الاسم (AR)" : "Name (AR)"} dir="rtl" {...register("nameAr")} error={errors.nameAr?.message} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "التصنيف" : "Category"} dir="ltr" {...register("category")} error={errors.category?.message} />
                        <PlayfulInput label={locale === "ar" ? "مستوى الإتقان (0-100)" : "Proficiency (0-100)"} type="number" dir="ltr" {...register("proficiencyLevel")} error={errors.proficiencyLevel?.message} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "اسم الأيقونة (اختياري)" : "Icon Name (optional)"} dir="ltr" {...register("iconName")} error={errors.iconName?.message} />
                        <PlayfulInput label={locale === "ar" ? "الترتيب" : "Sort Order"} type="number" dir="ltr" {...register("sortOrder")} error={errors.sortOrder?.message} />
                    </div>
                    <Controller name="isActive" control={control} render={({ field }) => (
                        <PlayfulSwitch label={locale === "ar" ? "مرئي بالموقع" : "Visible on Site"} checked={field.value} onChange={field.onChange} />
                    )} />
                </form>
            </PlayfulModal>
        </div>
    );
}
