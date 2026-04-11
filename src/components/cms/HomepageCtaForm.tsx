"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveHomepageCta } from "@/app/actions/cms";
import { UploadDialog } from "@/components/media/UploadDialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const schema = z.object({
    title_ar: z.string().optional(),
    title_en: z.string().optional(),
    subtitle_ar: z.string().optional(),
    subtitle_en: z.string().optional(),
    button_text_ar: z.string().optional(),
    button_text_en: z.string().optional(),
    button_link: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type Props = { locale: string; initialData: any };

function buildMediaUrl(m: any) {
    if (!m) return null;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${m.bucket}/${m.storage_path}`;
}

export function HomepageCtaForm({ locale, initialData }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [bgImageId, setBgImageId] = useState<string | null>(initialData?.background_image_id || null);
    const [bgImageUrl, setBgImageUrl] = useState<string | null>(buildMediaUrl(initialData?.bg_image));
    const [showUpload, setShowUpload] = useState(false);

    const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title_ar: initialData?.title_ar || "",
            title_en: initialData?.title_en || "",
            subtitle_ar: initialData?.subtitle_ar || "",
            subtitle_en: initialData?.subtitle_en || "",
            button_text_ar: initialData?.button_text_ar || "",
            button_text_en: initialData?.button_text_en || "",
            button_link: initialData?.button_link || "",
        },
    });

    const isMediaDirty = bgImageId !== (initialData?.background_image_id || null);
    const hasChanges = isDirty || isMediaDirty;

    useEffect(() => {
        reset({
            title_ar: initialData?.title_ar || "",
            title_en: initialData?.title_en || "",
            subtitle_ar: initialData?.subtitle_ar || "",
            subtitle_en: initialData?.subtitle_en || "",
            button_text_ar: initialData?.button_text_ar || "",
            button_text_en: initialData?.button_text_en || "",
            button_link: initialData?.button_link || "",
        });
        setBgImageId(initialData?.background_image_id || null);
        setBgImageUrl(buildMediaUrl(initialData?.bg_image));
    }, [initialData, reset]);

    function onSubmit(data: FormValues) {
        startTransition(async () => {
            try {
                await saveHomepageCta({ ...data, background_image_id: bgImageId });
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully", { icon: "📢" });
                router.refresh();
            } catch (err) {
                console.error(err);
                toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed");
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-5xl space-y-6 pb-24 relative">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-orange-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {locale === "ar" ? "شريط الدعوة للإجراء" : "Call-to-Action Banner"}
                </h1>
                <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                    <SidebarIcon name="megaphone" className="size-4 text-orange-500" />
                    {locale === "ar" ? "تخصيص شريط CTA الذي يظهر في الصفحة الرئيسية." : "Customize the CTA banner that appears on the homepage."}
                </p>
            </motion.div>

            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
                    <div className="mb-4 flex items-center justify-between border-b-2 border-zinc-100/50 pb-4 dark:border-zinc-800/50">
                        <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">English Content</span>
                        <span className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-bold font-mono tracking-widest text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">LTR</span>
                    </div>
                    <PlayfulInput label="CTA Title" dir="ltr" placeholder="Ready to get started?" {...register("title_en")} error={errors.title_en?.message} />
                    <PlayfulTextarea label="CTA Subtitle" dir="ltr" rows={2} placeholder="Join thousands of satisfied customers." {...register("subtitle_en")} error={errors.subtitle_en?.message} />
                    <PlayfulInput label="Button Text" dir="ltr" placeholder="Get Started Now" {...register("button_text_en")} error={errors.button_text_en?.message} />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 rounded-3xl border-2 border-[var(--brand-primary)]/20 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-[var(--brand-primary)]/20 dark:bg-zinc-900/80">
                    <div className="mb-4 flex items-center justify-between border-b-2 border-[var(--brand-primary)]/10 pb-4 dark:border-[var(--brand-primary)]/20">
                        <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">المحتوى العربي</span>
                        <span className="rounded-lg bg-[var(--brand-primary)]/10 px-3 py-1 text-xs font-bold font-mono tracking-widest text-[var(--brand-primary)]">RTL</span>
                    </div>
                    <PlayfulInput label="عنوان CTA" dir="rtl" placeholder="مستعد للبدء؟" {...register("title_ar")} error={errors.title_ar?.message} />
                    <PlayfulTextarea label="النص الفرعي" dir="rtl" rows={2} placeholder="انضم لآلاف العملاء الراضين." {...register("subtitle_ar")} error={errors.subtitle_ar?.message} />
                    <PlayfulInput label="نص الزر" dir="rtl" placeholder="ابدأ الآن" {...register("button_text_ar")} error={errors.button_text_ar?.message} />
                </motion.div>
            </div>

            {/* Button Link */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
                <div className="flex items-center gap-3 border-b-2 border-zinc-100/50 pb-4 dark:border-zinc-800/50">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/30"><SidebarIcon name="link" className="size-5" /></div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{locale === "ar" ? "رابط الزر" : "Button Link"}</h3>
                </div>
                <PlayfulInput label={locale === "ar" ? "الرابط" : "Link URL"} dir="ltr" placeholder="https://example.com/signup" {...register("button_link")} error={errors.button_link?.message} />
            </motion.div>

            {/* Background Image */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
                <div className="flex items-center gap-3 border-b-2 border-zinc-100/50 pb-4 dark:border-zinc-800/50">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/30"><SidebarIcon name="image" className="size-5" /></div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{locale === "ar" ? "صورة الخلفية" : "Background Image"}</h3>
                </div>
                <p className="text-xs text-zinc-400">{locale === "ar" ? "صورة خلفية اختيارية لشريط CTA." : "Optional background image for the CTA banner."}</p>
                {bgImageUrl ? (
                    <div className="relative overflow-hidden rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 aspect-[21/9] max-w-lg group shadow-md">
                        <img src={bgImageUrl} alt="" className="size-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                            <PlayfulButton type="button" onClick={() => setShowUpload(true)} className="!bg-white !text-zinc-900 px-6">{locale === "ar" ? "استبدال" : "Replace"}</PlayfulButton>
                            <PlayfulButton type="button" onClick={() => { setBgImageId(null); setBgImageUrl(null); }} className="!bg-rose-600 !text-white px-6">{locale === "ar" ? "إزالة" : "Remove"}</PlayfulButton>
                        </div>
                    </div>
                ) : (
                    <div onClick={() => setShowUpload(true)} className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 py-10 max-w-lg transition-all hover:border-[var(--brand-primary)] dark:border-zinc-700 dark:bg-zinc-900/50">
                        <SidebarIcon name="image-plus" className="size-6 text-zinc-400 group-hover:text-[var(--brand-primary)]" />
                        <span className="mt-2 text-sm text-zinc-500">{locale === "ar" ? "اختيار صورة خلفية" : "Select Background Image"}</span>
                    </div>
                )}
            </motion.div>

            {/* Sticky Save Bar */}
            <AnimatePresence>
                {hasChanges && (
                    <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 left-1/2 z-50 flex w-max -translate-x-1/2 items-center gap-6 rounded-2xl border-2 border-zinc-200/50 bg-white/95 p-3 pl-6 shadow-2xl shadow-orange-500/20 backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-900/95">
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span></span>
                            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{locale === "ar" ? "تغييرات غير محفوظة" : "Unsaved changes"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <PlayfulButton type="button" variant="secondary" onClick={() => { reset(); setBgImageId(initialData?.background_image_id || null); setBgImageUrl(buildMediaUrl(initialData?.bg_image)); }} disabled={isPending}>{locale === "ar" ? "تجاهل" : "Discard"}</PlayfulButton>
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
                    onSuccess={(urls) => { setShowUpload(false); if (urls?.[0]) setBgImageUrl(urls[0]); }}
                />
            )}
        </form>
    );
}
