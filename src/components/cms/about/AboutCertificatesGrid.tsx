"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveAboutCertificate, deleteAboutCertificate } from "@/app/actions/about";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { UploadDialog } from "@/components/media/UploadDialog";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getSchema = (locale: string) => z.object({
    title_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    title_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
    issuer_ar: z.string().optional(),
    issuer_en: z.string().optional(),
    year: z.string().optional(),
    is_active: z.boolean(),
});

type FormValues = z.infer<ReturnType<typeof getSchema>>;
type Props = { locale: string; certificates: any[] };

function buildMediaUrl(m: any) {
    if (!m) return null;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${m.bucket}/${m.storage_path}`;
}

export function AboutCertificatesGrid({ locale, certificates }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [imageId, setImageId] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [showUpload, setShowUpload] = useState(false);

    const schema = useMemo(() => getSchema(locale), [locale]);
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: { is_active: true },
    });

    function openNew() { setEditingId(null); setImageId(null); setImageUrl(null); reset({ title_ar: "", title_en: "", issuer_ar: "", issuer_en: "", year: "", is_active: true }); setModalOpen(true); }
    function openEdit(c: any) { setEditingId(c.id); setImageId(c.image_id); setImageUrl(buildMediaUrl(c.image)); reset({ title_ar: c.title_ar, title_en: c.title_en, issuer_ar: c.issuer_ar || "", issuer_en: c.issuer_en || "", year: c.year?.toString() || "", is_active: c.is_active }); setModalOpen(true); }
    function close() { setModalOpen(false); }

    function onSubmit(data: FormValues) {
        startTransition(async () => {
            try {
                await saveAboutCertificate({ ...data, year: data.year ? parseInt(data.year) : null, image_id: imageId }, editingId || undefined);
                close(); toast.success(locale === "ar" ? "تم الحفظ" : "Saved", { icon: "✨" });
            } catch { toast.error(locale === "ar" ? "فشل" : "Failed"); }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "متأكد؟" : "Are you sure?")) return;
        startTransition(async () => {
            try { await deleteAboutCertificate(id); toast.success(locale === "ar" ? "تم الحذف" : "Deleted"); }
            catch { toast.error(locale === "ar" ? "فشل" : "Failed"); }
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-indigo-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{locale === "ar" ? "الشهادات والجوائز" : "Certificates & Awards"}</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500"><SidebarIcon name="award" className="size-4 text-indigo-500" />{locale === "ar" ? "اعرض الشهادات والاعتمادات لشركتك." : "Display your company's certifications and awards."}</p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-[var(--brand-primary)]"><SidebarIcon name="plus" className="size-5" />{locale === "ar" ? "إضافة شهادة" : "Add Certificate"}</PlayfulButton>
            </motion.div>

            {certificates.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-500 mb-4 animate-bounce"><SidebarIcon name="award" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد شهادات" : "No certificates yet"}</h3>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                        {certificates.map((c, i) => (
                            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className={`group relative flex flex-col gap-4 rounded-3xl border-2 bg-white/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900/80 backdrop-blur-md overflow-hidden ${c.is_active ? "border-zinc-200/50 hover:border-indigo-500/30 dark:border-zinc-800/80" : "opacity-60 border-zinc-200/50 dark:border-zinc-800/50"}`}>
                                {/* Image */}
                                <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                                    {buildMediaUrl(c.image) ? (
                                        <img src={buildMediaUrl(c.image)!} alt={c.title_en} className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    ) : (
                                        <div className="flex size-full items-center justify-center"><SidebarIcon name="award" className="size-12 text-zinc-300 dark:text-zinc-600" /></div>
                                    )}
                                </div>
                                <div className="p-6 pt-0 flex-1">
                                    <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 mb-1 truncate">{locale === "ar" ? c.title_ar : c.title_en}</h3>
                                    {(c.issuer_ar || c.issuer_en) && <p className="text-sm text-[var(--brand-primary)] font-semibold truncate">{locale === "ar" ? c.issuer_ar : c.issuer_en}</p>}
                                    {c.year && <span className="mt-2 inline-flex rounded-lg bg-indigo-500/10 text-indigo-600 px-2.5 py-1 text-xs font-bold">{c.year}</span>}
                                </div>
                                <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 p-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-300 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-zinc-900 dark:via-zinc-900/80 z-20">
                                    <button onClick={() => openEdit(c)} className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-white text-zinc-600 shadow-sm hover:bg-[var(--brand-primary)] hover:text-white hover:scale-110 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 transition-all"><SidebarIcon name="edit" className="size-4" /></button>
                                    <button onClick={() => handleDelete(c.id)} disabled={isPending} className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-sm hover:bg-rose-500 hover:text-white hover:scale-110 border border-rose-100 dark:bg-rose-900/30 dark:border-rose-800 transition-all"><SidebarIcon name="trash" className="size-4" /></button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل الشهادة" : "Edit Certificate") : (locale === "ar" ? "شهادة جديدة" : "New Certificate")}
                footer={<><PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton><PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-[var(--brand-primary)]">{isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}{editingId ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إضافة" : "Create")}</PlayfulButton></>}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Image upload */}
                    <div onClick={() => setShowUpload(true)} className="group cursor-pointer flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 py-8 transition-all hover:border-[var(--brand-primary)] dark:border-zinc-700 dark:bg-zinc-900/50">
                        {imageUrl ? (
                            <img src={imageUrl} alt="" className="h-32 rounded-xl object-contain" />
                        ) : (
                            <>
                                <SidebarIcon name="image-plus" className="size-8 text-zinc-400 group-hover:text-[var(--brand-primary)]" />
                                <span className="mt-2 text-sm text-zinc-500">{locale === "ar" ? "صورة الشهادة (اختياري)" : "Certificate Image (optional)"}</span>
                            </>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "العنوان (EN)" : "Title (EN)"} dir="ltr" {...register("title_en")} error={errors.title_en?.message} />
                        <PlayfulInput label={locale === "ar" ? "العنوان (AR)" : "Title (AR)"} dir="rtl" {...register("title_ar")} error={errors.title_ar?.message} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "الجهة المانحة (EN)" : "Issuer (EN)"} dir="ltr" {...register("issuer_en")} />
                        <PlayfulInput label={locale === "ar" ? "الجهة المانحة (AR)" : "Issuer (AR)"} dir="rtl" {...register("issuer_ar")} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "السنة" : "Year"} type="number" dir="ltr" placeholder="2024" {...register("year")} />
                        <Controller name="is_active" control={control} render={({ field }) => <div className="pt-8"><PlayfulSwitch label={locale === "ar" ? "مرئي" : "Visible"} checked={field.value} onChange={field.onChange} /></div>} />
                    </div>
                </form>
            </PlayfulModal>

            {showUpload && (
                <UploadDialog folders={[]} bucket="images" defaultFolderId="all" locale={locale}
                    onClose={() => setShowUpload(false)}
                    onSuccess={(urls) => { setShowUpload(false); if (urls?.[0]) setImageUrl(urls[0]); }}
                />
            )}
        </div>
    );
}
