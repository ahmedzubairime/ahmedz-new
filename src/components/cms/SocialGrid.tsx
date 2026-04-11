"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveSocialLink, deleteSocialLink } from "@/app/actions/external-lists";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulSelect, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const PLATFORMS = [
    { label: "Facebook", value: "facebook", icon: "facebook", color: "#1877F2" },
    { label: "Twitter / X", value: "twitter", icon: "twitter", color: "#000000" },
    { label: "Instagram", value: "instagram", icon: "instagram", color: "#E4405F" },
    { label: "LinkedIn", value: "linkedin", icon: "linkedin", color: "#0A66C2" },
    { label: "YouTube", value: "youtube", icon: "youtube", color: "#FF0000" },
    { label: "TikTok", value: "tiktok", icon: "video", color: "#000000" },
    { label: "WhatsApp", value: "whatsapp", icon: "message-circle", color: "#25D366" },
    { label: "GitHub", value: "github", icon: "github", color: "#181717" },
    { label: "Dribbble", value: "dribbble", icon: "dribbble", color: "#EA4C89" },
    { label: "Other Link", value: "link", icon: "link", color: "#8B5CF6" }
];

const getSocialSchema = (locale: string) => z.object({
  platform: z.string().min(1),
  url: z.string().url(locale === "ar" ? "رابط غير صالح" : "Invalid URL"),
  is_active: z.boolean(),
});

type SocialFormValues = z.infer<ReturnType<typeof getSocialSchema>>;

type Props = { locale: string; links: any[]; };

export function SocialGrid({ locale, links }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const schema = useMemo(() => getSocialSchema(locale), [locale]);

    const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<SocialFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { platform: PLATFORMS[0].value, is_active: true }
    });

    const currentPlatform = watch("platform");
    const platformData = PLATFORMS.find(p => p.value === currentPlatform) || PLATFORMS[0];

    function openNew() {
        setEditingId(null);
        reset({ platform: PLATFORMS[0].value, url: "", is_active: true });
        setModalOpen(true);
    }

    function openEdit(l: any) {
        setEditingId(l.id);
        reset({ platform: l.platform || PLATFORMS[0].value, url: l.url || "", is_active: l.is_active });
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function onSubmit(data: SocialFormValues) {
        startTransition(async () => {
            try {
                await saveSocialLink(data, editingId || undefined);
                close();
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully", { icon: "🌍" });
            } catch (err) {
                toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "حذف هذا الرابط؟" : "Are you sure you want to delete this social link?")) return;
        startTransition(async () => {
            try { await deleteSocialLink(id); toast.success(locale === "ar" ? "تم الحذف" : "Deleted"); }
            catch(e) { toast.error(locale === "ar" ? "فشل الحذف" : "Delete failed"); }
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-sky-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {locale === "ar" ? "التواصل" : "Social Links"}
                    </h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="globe" className="size-4 text-sky-500" />
                        {locale === "ar" ? "أدر الروابط لأيقونات التواصل في تذييل الموقع." : "Manage your brand's presence across networks."}
                    </p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-[var(--brand-primary)] hover:!shadow-[var(--brand-primary)]/30 text-white">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "رابط جديد" : "Add Link"}
                </PlayfulButton>
            </motion.div>

            {/* Grid */}
            {links.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-500 mb-4 animate-bounce"><SidebarIcon name="link" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا يوجد أي رابط بعد" : "No social links configured"}</h3>
                    <p className="mt-2 text-sm font-medium text-zinc-500">{locale === "ar" ? "أضف روابط لحسابات التواصل الخاصة بك." : "Add links to your public profiles."}</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6">
                    <AnimatePresence>
                        {links.map((l, i) => {
                            const platf = PLATFORMS.find(p => p.value === l.platform) || PLATFORMS[PLATFORMS.length - 1];
                            const isActive = l.is_active;

                            return (
                                <motion.div key={l.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className={`group relative flex flex-col items-center justify-center rounded-3xl border-2 bg-white/90 p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl dark:bg-zinc-900/90 backdrop-blur-md overflow-hidden ${isActive ? 'border-zinc-200/50 hover:border-zinc-300 dark:border-zinc-800/70' : 'border-zinc-200/30 opacity-60 grayscale-[50%] dark:border-zinc-800/30'}`}>
                                    
                                    <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none opacity-10 transition-colors group-hover:opacity-20" style={{ backgroundImage: `linear-gradient(to bottom left, ${platf.color}, transparent)` }} />

                                    <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                        <button onClick={() => openEdit(l)} className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-white text-zinc-600 shadow-md hover:scale-110 hover:text-white dark:bg-zinc-800 dark:text-zinc-300 transition-all border border-zinc-200 dark:border-zinc-700" style={{ backgroundColor: `white`, transition: "all 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.backgroundColor = platf.color)} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "")}>
                                            <SidebarIcon name="edit" className="size-4" />
                                        </button>
                                        <button onClick={() => handleDelete(l.id)} disabled={isPending} className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-rose-50 text-rose-600 shadow-md hover:scale-110 hover:bg-rose-600 hover:text-white dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-600 transition-all border border-rose-100 dark:border-rose-800">
                                            <SidebarIcon name="trash" className="size-4" />
                                        </button>
                                    </div>

                                    {!isActive && (
                                        <div className="absolute top-3 left-3 flex items-center justify-center rounded-full px-2 py-0.5 bg-zinc-200 text-zinc-600 text-[10px] font-black uppercase tracking-widest z-20 dark:bg-zinc-800">
                                            Hidden
                                        </div>
                                    )}

                                    {/* Icon Avatar */}
                                    <div className="relative mb-4 flex size-20 items-center justify-center rounded-3xl shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 bg-zinc-50 dark:bg-zinc-800" style={{ color: platf.color }}>
                                        <div className="absolute inset-0 rounded-3xl opacity-10 pointer-events-none" style={{ backgroundColor: platf.color }} />
                                        <SidebarIcon name={platf.icon as any} className="size-8 drop-shadow-sm" />
                                    </div>

                                    <h3 className="text-center font-black tracking-tight text-zinc-900 dark:text-zinc-100 w-full text-base mb-1 group-hover:drop-shadow-sm transition-colors" style={{ color: platf.color }}>
                                        {platf.label}
                                    </h3>

                                    <a href={l.url} target="_blank" className="text-xs font-bold text-zinc-400 hover:text-[var(--brand-primary)] underline decoration-transparent hover:decoration-[var(--brand-primary)] transition-all line-clamp-1 truncate w-full text-center block px-2" title={l.url}>
                                        {l.url.replace(/^https?:\/\//, '')}
                                    </a>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal */}
            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل الرابط" : "Edit Link") : (locale === "ar" ? "رابط جديد" : "New Link")}
                footer={
                    <>
                        <PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                        <PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-[var(--brand-primary)] hover:!bg-[var(--brand-primary)] hover:brightness-110 transition-all">
                            {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                            {editingId ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة الرابط" : "Create Link")}
                        </PlayfulButton>
                    </>
                }
            >
                <form id="social-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex bg-zinc-50/80 dark:bg-zinc-900/50 rounded-3xl p-5 border-2 border-zinc-100 dark:border-zinc-800 items-center gap-6">
                        <div className="flex size-20 shrink-0 items-center justify-center rounded-3xl shadow-inner bg-white dark:bg-zinc-950 transition-colors" style={{ color: platformData.color }}>
                            <div className="absolute size-20 rounded-3xl opacity-10 pointer-events-none" style={{ backgroundColor: platformData.color }} />
                            <SidebarIcon name={platformData.icon as any} className="size-8 drop-shadow-sm transition-transform duration-300 transform scale-110" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <Controller name="platform" control={control} render={({ field }) => (
                                <PlayfulSelect label={locale === "ar" ? "المنصة المستهدفة" : "Target Platform"} options={PLATFORMS.map(p => ({ value: p.value, label: p.label }))} {...field} />
                            )} />
                        </div>
                    </div>

                    <PlayfulInput label={locale === "ar" ? "رابط الحساب (URL)" : "Profile URL"} type="url" dir="ltr" placeholder="https://..." {...register("url")} error={errors.url?.message} className="font-mono pt-1 text-sm text-[var(--brand-primary)]" />

                    <div className="pt-2 pl-4">
                        <Controller name="is_active" control={control} render={({ field }) => (
                            <PlayfulSwitch label={locale === "ar" ? "مفعل وظاهر في التذييل" : "Active & Visible in Footer"} checked={field.value} onChange={field.onChange} />
                        )} />
                    </div>
                </form>
            </PlayfulModal>
        </div>
    );
}
