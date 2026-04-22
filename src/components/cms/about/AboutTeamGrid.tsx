"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveAboutTeamMember, deleteAboutTeamMember } from "@/app/actions/about";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { UploadDialog } from "@/components/media/UploadDialog";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Controller } from "react-hook-form";

const getSchema = (locale: string) => z.object({
    name_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    name_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    role_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    role_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    bio_ar: z.string().optional(),
    bio_en: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    linkedin_url: z.string().optional(),
    twitter_url: z.string().optional(),
    is_active: z.boolean(),
});

type FormValues = z.infer<ReturnType<typeof getSchema>>;
type Props = { locale: string; members: any[] };

function buildMediaUrl(m: any) {
    if (!m) return null;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${m.bucket}/${m.storage_path}`;
}

export function AboutTeamGrid({ locale, members }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [avatarId, setAvatarId] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [showUpload, setShowUpload] = useState(false);

    const schema = useMemo(() => getSchema(locale), [locale]);
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: { is_active: true },
    });

    function openNew() {
        setEditingId(null);
        setAvatarId(null); setAvatarUrl(null);
        reset({ name_ar: "", name_en: "", role_ar: "", role_en: "", bio_ar: "", bio_en: "", email: "", phone: "", linkedin_url: "", twitter_url: "", is_active: true });
        setModalOpen(true);
    }

    function openEdit(m: any) {
        setEditingId(m.id);
        setAvatarId(m.avatar_id); setAvatarUrl(buildMediaUrl(m.avatar));
        reset({ name_ar: m.name_ar, name_en: m.name_en, role_ar: m.role_ar, role_en: m.role_en, bio_ar: m.bio_ar || "", bio_en: m.bio_en || "", email: m.email || "", phone: m.phone || "", linkedin_url: m.linkedin_url || "", twitter_url: m.twitter_url || "", is_active: m.is_active });
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function onSubmit(data: FormValues) {
        startTransition(async () => {
            try {
                await saveAboutTeamMember({ ...data, avatar_id: avatarId }, editingId || undefined);
                close();
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully", { icon: "✨" });
            } catch { toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed"); }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "متأكد من الحذف؟" : "Are you sure?")) return;
        startTransition(async () => {
            try { await deleteAboutTeamMember(id); toast.success(locale === "ar" ? "تم الحذف" : "Deleted"); }
            catch { toast.error(locale === "ar" ? "فشل الحذف" : "Delete failed"); }
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-orange-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{locale === "ar" ? "أعضاء الفريق" : "Team Members"}</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="users" className="size-4 text-orange-500" />
                        {locale === "ar" ? "أدر أعضاء الفريق الذين يظهرون في صفحة من نحن." : "Manage team members displayed on the About page."}
                    </p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-[var(--brand-primary)] hover:!shadow-[var(--brand-primary)]/30">
                    <SidebarIcon name="plus" className="size-5" />{locale === "ar" ? "إضافة عضو" : "Add Member"}
                </PlayfulButton>
            </motion.div>

            {members.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500 mb-4 animate-bounce"><SidebarIcon name="users" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا يوجد أعضاء بعد" : "No members yet"}</h3>
                    <p className="mt-2 text-sm font-medium text-zinc-500">{locale === "ar" ? "أضف أعضاء فريقك ليظهروا في صفحة من نحن." : "Add team members for the About page."}</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                        {members.map((m, i) => (
                            <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className={`group relative flex flex-col items-center gap-4 rounded-3xl border-2 bg-white/80 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900/80 backdrop-blur-md ${m.is_active ? "border-zinc-200/50 hover:border-orange-500/30 dark:border-zinc-800/80" : "border-zinc-200/50 opacity-60 dark:border-zinc-800/50"}`}>
                                <div className="relative">
                                    <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 ring-4 ring-white dark:ring-zinc-900 shadow-lg">
                                        {buildMediaUrl(m.avatar) ? (
                                            <img src={buildMediaUrl(m.avatar)!} alt={m.name_en} className="size-full object-cover" />
                                        ) : (
                                            <SidebarIcon name="user" className="size-8 text-zinc-400" />
                                        )}
                                    </div>
                                    {m.is_active ? (
                                        <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white dark:ring-zinc-900"><SidebarIcon name="check" className="size-3" /></span>
                                    ) : (
                                        <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-zinc-400 text-white ring-2 ring-white dark:ring-zinc-900"><SidebarIcon name="eye-off" className="size-3" /></span>
                                    )}
                                </div>
                                <div className="text-center flex-1">
                                    <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 truncate">{locale === "ar" ? m.name_ar : m.name_en}</h3>
                                    <p className="text-sm font-semibold text-[var(--brand-primary)]">{locale === "ar" ? m.role_ar : m.role_en}</p>
                                    {(m.bio_ar || m.bio_en) && <p className="mt-2 text-xs text-zinc-500 line-clamp-2">{locale === "ar" ? m.bio_ar : m.bio_en}</p>}
                                </div>
                                <div className="flex gap-2">
                                    {m.linkedin_url && <span className="flex size-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500"><SidebarIcon name="linkedin" className="size-3.5" /></span>}
                                    {m.twitter_url && <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-500/10 text-zinc-500"><SidebarIcon name="twitter" className="size-3.5" /></span>}
                                </div>
                                <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 p-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-300 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-zinc-900 dark:via-zinc-900/80 rounded-b-3xl z-20">
                                    <button onClick={() => openEdit(m)} className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-white text-zinc-600 shadow-sm hover:bg-[var(--brand-primary)] hover:text-white hover:scale-110 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 transition-all"><SidebarIcon name="edit" className="size-4" /></button>
                                    <button onClick={() => handleDelete(m.id)} disabled={isPending} className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-sm hover:bg-rose-500 hover:text-white hover:scale-110 border border-rose-100 dark:bg-rose-900/30 dark:border-rose-800 transition-all"><SidebarIcon name="trash" className="size-4" /></button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل العضو" : "Edit Member") : (locale === "ar" ? "عضو جديد" : "New Member")}
                footer={<>
                    <PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                    <PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-[var(--brand-primary)] hover:brightness-110">
                        {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                        {editingId ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إضافة" : "Create")}
                    </PlayfulButton>
                </>}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Avatar */}
                    <div className="flex justify-center">
                        <div onClick={() => setShowUpload(true)} className="group cursor-pointer relative">
                            <div className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 ring-4 ring-zinc-200 dark:ring-zinc-700 transition-all group-hover:ring-[var(--brand-primary)]">
                                {avatarUrl ? <img src={avatarUrl} alt="" className="size-full object-cover" /> : <SidebarIcon name="camera" className="size-8 text-zinc-400 group-hover:text-[var(--brand-primary)]" />}
                            </div>
                            <span className="absolute -bottom-1 right-0 flex size-7 items-center justify-center rounded-full bg-[var(--brand-primary)] text-white shadow-lg"><SidebarIcon name="plus" className="size-3.5" /></span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "الاسم (EN)" : "Name (EN)"} dir="ltr" {...register("name_en")} error={errors.name_en?.message} />
                        <PlayfulInput label={locale === "ar" ? "الاسم (AR)" : "Name (AR)"} dir="rtl" {...register("name_ar")} error={errors.name_ar?.message} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "المسمى الوظيفي (EN)" : "Job Title (EN)"} dir="ltr" {...register("role_en")} error={errors.role_en?.message} />
                        <PlayfulInput label={locale === "ar" ? "المسمى الوظيفي (AR)" : "Job Title (AR)"} dir="rtl" {...register("role_ar")} error={errors.role_ar?.message} />
                    </div>
                    <div className="grid grid-cols-1 gap-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <PlayfulTextarea label={locale === "ar" ? "السيرة (EN)" : "Bio (EN)"} dir="ltr" rows={2} {...register("bio_en")} />
                        <PlayfulTextarea label={locale === "ar" ? "السيرة (AR)" : "Bio (AR)"} dir="rtl" rows={2} {...register("bio_ar")} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "البريد" : "Email"} dir="ltr" type="email" {...register("email")} />
                        <PlayfulInput label={locale === "ar" ? "الهاتف" : "Phone"} dir="ltr" {...register("phone")} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label="LinkedIn URL" dir="ltr" placeholder="https://linkedin.com/in/..." {...register("linkedin_url")} />
                        <PlayfulInput label="Twitter / X URL" dir="ltr" placeholder="https://x.com/..." {...register("twitter_url")} />
                    </div>
                    <Controller name="is_active" control={control} render={({ field }) => (
                        <PlayfulSwitch label={locale === "ar" ? "مرئي بالموقع" : "Visible on Site"} checked={field.value} onChange={field.onChange} />
                    )} />
                </form>
            </PlayfulModal>

            {showUpload && (
                <UploadDialog folders={[]} bucket="images" defaultFolderId="all" locale={locale}
                    onClose={() => setShowUpload(false)}
                    onSuccess={(urls) => { setShowUpload(false); if (urls?.[0]) setAvatarUrl(urls[0]); }}
                />
            )}
        </div>
    );
}
