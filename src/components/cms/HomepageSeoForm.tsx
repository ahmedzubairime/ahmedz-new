"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveHomepageSeo } from "@/app/actions/cms";
import { UploadDialog } from "@/components/media/UploadDialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const schema = z.object({
    meta_title_ar: z.string().optional(),
    meta_title_en: z.string().optional(),
    meta_description_ar: z.string().optional(),
    meta_description_en: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type Props = { locale: string; initialData: any };

function buildMediaUrl(m: any) {
    if (!m) return null;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${m.bucket}/${m.storage_path}`;
}

export function HomepageSeoForm({ locale, initialData }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [ogImageId, setOgImageId] = useState<string | null>(initialData?.og_image_id || null);
    const [ogImageUrl, setOgImageUrl] = useState<string | null>(buildMediaUrl(initialData?.og_image));
    const [showUpload, setShowUpload] = useState(false);

    const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            meta_title_ar: initialData?.meta_title_ar || "",
            meta_title_en: initialData?.meta_title_en || "",
            meta_description_ar: initialData?.meta_description_ar || "",
            meta_description_en: initialData?.meta_description_en || "",
        },
    });

    const isMediaDirty = ogImageId !== (initialData?.og_image_id || null);
    const hasChanges = isDirty || isMediaDirty;

    useEffect(() => {
        reset({
            meta_title_ar: initialData?.meta_title_ar || "",
            meta_title_en: initialData?.meta_title_en || "",
            meta_description_ar: initialData?.meta_description_ar || "",
            meta_description_en: initialData?.meta_description_en || "",
        });
        setOgImageId(initialData?.og_image_id || null);
        setOgImageUrl(buildMediaUrl(initialData?.og_image));
    }, [initialData, reset]);

    function onSubmit(data: FormValues) {
        startTransition(async () => {
            try {
                await saveHomepageSeo({ ...data, og_image_id: ogImageId });
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully", { icon: "🔍" });
                router.refresh();
            } catch (err) {
                console.error(err);
                toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed");
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-5xl space-y-6 pb-24 relative">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-teal-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {locale === "ar" ? "إعدادات SEO - الصفحة الرئيسية" : "Homepage SEO Settings"}
                </h1>
                <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                    <SidebarIcon name="search" className="size-4 text-teal-500" />
                    {locale === "ar" ? "تحسين ظهور الصفحة الرئيسية في محركات البحث." : "Optimize the homepage appearance in search engines."}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
                    <div className="mb-4 flex items-center justify-between border-b-2 border-zinc-100/50 pb-4 dark:border-zinc-800/50">
                        <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">English SEO</span>
                        <span className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-bold font-mono tracking-widest text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">LTR</span>
                    </div>
                    <PlayfulInput label="Meta Title" dir="ltr" placeholder="Homepage — Company Name" {...register("meta_title_en")} error={errors.meta_title_en?.message} />
                    <PlayfulTextarea label="Meta Description" dir="ltr" rows={3} placeholder="A concise description of the homepage..." {...register("meta_description_en")} error={errors.meta_description_en?.message} />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 rounded-3xl border-2 border-[var(--brand-primary)]/20 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-[var(--brand-primary)]/20 dark:bg-zinc-900/80">
                    <div className="mb-4 flex items-center justify-between border-b-2 border-[var(--brand-primary)]/10 pb-4 dark:border-[var(--brand-primary)]/20">
                        <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">SEO العربي</span>
                        <span className="rounded-lg bg-[var(--brand-primary)]/10 px-3 py-1 text-xs font-bold font-mono tracking-widest text-[var(--brand-primary)]">RTL</span>
                    </div>
                    <PlayfulInput label="عنوان الميتا" dir="rtl" placeholder="الصفحة الرئيسية — اسم الشركة" {...register("meta_title_ar")} error={errors.meta_title_ar?.message} />
                    <PlayfulTextarea label="وصف الميتا" dir="rtl" rows={3} placeholder="وصف مختصر للصفحة الرئيسية..." {...register("meta_description_ar")} error={errors.meta_description_ar?.message} />
                </motion.div>
            </div>

            {/* OG Image */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
                <div className="flex items-center gap-3 border-b-2 border-zinc-100/50 pb-4 dark:border-zinc-800/50">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg shadow-teal-500/30"><SidebarIcon name="image" className="size-5" /></div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{locale === "ar" ? "صورة Open Graph" : "Open Graph Image"}</h3>
                </div>
                <p className="text-xs text-zinc-400">{locale === "ar" ? "الصورة التي تظهر عند مشاركة رابط الصفحة الرئيسية في شبكات التواصل." : "The image displayed when the homepage URL is shared on social networks."}</p>
                {ogImageUrl ? (
                    <div className="relative overflow-hidden rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 aspect-video max-w-md group shadow-md">
                        <img src={ogImageUrl} alt="" className="size-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                            <PlayfulButton type="button" onClick={() => setShowUpload(true)} className="!bg-white !text-zinc-900 px-6">{locale === "ar" ? "استبدال" : "Replace"}</PlayfulButton>
                            <PlayfulButton type="button" onClick={() => { setOgImageId(null); setOgImageUrl(null); }} className="!bg-rose-600 !text-white px-6">{locale === "ar" ? "إزالة" : "Remove"}</PlayfulButton>
                        </div>
                    </div>
                ) : (
                    <div onClick={() => setShowUpload(true)} className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 py-10 max-w-md transition-all hover:border-[var(--brand-primary)] dark:border-zinc-700 dark:bg-zinc-900/50">
                        <SidebarIcon name="image-plus" className="size-6 text-zinc-400 group-hover:text-[var(--brand-primary)]" />
                        <span className="mt-2 text-sm text-zinc-500">{locale === "ar" ? "اختيار صورة OG" : "Select OG Image"}</span>
                    </div>
                )}
            </motion.div>

            <AnimatePresence>
                {hasChanges && (
                    <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 left-1/2 z-50 flex w-max -translate-x-1/2 items-center gap-6 rounded-2xl border-2 border-zinc-200/50 bg-white/95 p-3 pl-6 shadow-2xl shadow-teal-500/20 backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-900/95">
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span></span>
                            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{locale === "ar" ? "تغييرات غير محفوظة" : "Unsaved changes"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <PlayfulButton type="button" variant="secondary" onClick={() => { reset(); setOgImageId(initialData?.og_image_id || null); setOgImageUrl(buildMediaUrl(initialData?.og_image)); }} disabled={isPending}>{locale === "ar" ? "تجاهل" : "Discard"}</PlayfulButton>
                            <PlayfulButton type="submit" disabled={isPending} className="!bg-[var(--brand-primary)] hover:brightness-110 !font-black px-8">
                                {isPending ? <SidebarIcon name="loader-2" className="size-4 animate-spin" /> : <SidebarIcon name="save" className="size-4" />}
                                {locale === "ar" ? "حفظ" : "Save"}
                            </PlayfulButton>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {showUpload && (
                <UploadDialog folders={[]} bucket="images" defaultFolderId="all" locale={locale}
                    onClose={() => setShowUpload(false)}
                    onSuccess={(urls) => { setShowUpload(false); if (urls?.[0]) setOgImageUrl(urls[0]); }}
                />
            )}
        </form>
    );
}
