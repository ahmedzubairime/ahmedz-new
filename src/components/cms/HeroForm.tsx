"use client";

import { useState, useTransition, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveHomepageHero } from "@/app/actions/cms";
import { UploadDialog } from "@/components/media/UploadDialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getHeroSchema = (locale: string) => z.object({
  title_ar: z.string().optional(),
  title_en: z.string().optional(),
  subtitle_ar: z.string().optional(),
  subtitle_en: z.string().optional(),
  badge_text_ar: z.string().optional(),
  badge_text_en: z.string().optional(),
  cta_primary_text_ar: z.string().optional(),
  cta_primary_text_en: z.string().optional(),
  cta_primary_link: z.string().optional(),
  cta_secondary_text_ar: z.string().optional(),
  cta_secondary_text_en: z.string().optional(),
  cta_secondary_link: z.string().optional(),
});

type HeroFormValues = z.infer<ReturnType<typeof getHeroSchema>>;

type Props = {
    locale: string;
    initialData: any;
};

export function HeroForm({ locale, initialData }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [imageId, setImageId] = useState<string | null>(initialData?.image_id || null);
    const [coverUrl, setCoverUrl] = useState<string | null>(
        initialData?.cover
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${initialData.cover.bucket}/${initialData.cover.storage_path}`
            : null
    );
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

    const schema = useMemo(() => getHeroSchema(locale), [locale]);

    const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<HeroFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title_ar: initialData?.title_ar || "",
            title_en: initialData?.title_en || "",
            subtitle_ar: initialData?.subtitle_ar || "",
            subtitle_en: initialData?.subtitle_en || "",
            badge_text_ar: initialData?.badge_text_ar || "",
            badge_text_en: initialData?.badge_text_en || "",
            cta_primary_text_ar: initialData?.cta_primary_text_ar || "",
            cta_primary_text_en: initialData?.cta_primary_text_en || "",
            cta_primary_link: initialData?.cta_primary_link || "",
            cta_secondary_text_ar: initialData?.cta_secondary_text_ar || "",
            cta_secondary_text_en: initialData?.cta_secondary_text_en || "",
            cta_secondary_link: initialData?.cta_secondary_link || "",
        }
    });

    const isMediaDirty = imageId !== (initialData?.image_id || null);
    const hasChanges = isDirty || isMediaDirty;

    useEffect(() => {
        reset({
            title_ar: initialData?.title_ar || "",
            title_en: initialData?.title_en || "",
            subtitle_ar: initialData?.subtitle_ar || "",
            subtitle_en: initialData?.subtitle_en || "",
            badge_text_ar: initialData?.badge_text_ar || "",
            badge_text_en: initialData?.badge_text_en || "",
            cta_primary_text_ar: initialData?.cta_primary_text_ar || "",
            cta_primary_text_en: initialData?.cta_primary_text_en || "",
            cta_primary_link: initialData?.cta_primary_link || "",
            cta_secondary_text_ar: initialData?.cta_secondary_text_ar || "",
            cta_secondary_text_en: initialData?.cta_secondary_text_en || "",
            cta_secondary_link: initialData?.cta_secondary_link || "",
        });
        setImageId(initialData?.image_id || null);
        setCoverUrl(initialData?.cover ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${initialData.cover.bucket}/${initialData.cover.storage_path}` : null);
    }, [initialData, reset]);

    function onSubmit(data: HeroFormValues) {
        startTransition(async () => {
            try {
                await saveHomepageHero({
                    ...data,
                    image_id: imageId
                });
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully", { icon: "✨" });
                router.refresh();
            } catch (err) {
                console.error(err);
                toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed");
            }
        });
    }

    function handleDiscard() {
        reset();
        setImageId(initialData?.image_id || null);
        setCoverUrl(initialData?.cover ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${initialData.cover.bucket}/${initialData.cover.storage_path}` : null);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-5xl space-y-6 pb-24 relative">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-purple-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {locale === "ar" ? "تكوين القسم الرئيسي (Hero)" : "Hero Section Configuration"}
                </h1>
                <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                    <SidebarIcon name="layout-template" className="size-4 text-purple-500" />
                    {locale === "ar" ? "أدر بيانات القسم الرئيسي الأول الذي يظهر لزوار موقعك." : "Manage the primary hero section that first appears to site visitors."}
                </p>
            </motion.div>

            {/* Split UI Layout */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* English Column */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl shadow-zinc-200/20 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:shadow-none">
                    <div className="mb-4 flex items-center justify-between border-b-2 border-zinc-100/50 pb-4 dark:border-zinc-800/50">
                        <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">English Identity</span>
                        <span className="rounded-lg bg-zinc-100 px-3 flex items-center justify-center py-1 text-xs font-bold font-mono tracking-widest text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">LTR</span>
                    </div>
                    <div className="space-y-4">
                        <PlayfulInput label="Badge Text" dir="ltr" placeholder="🚀 New Feature" {...register("badge_text_en")} error={errors.badge_text_en?.message} />
                        <PlayfulInput label="Hero Title (H1)" dir="ltr" placeholder="E.g., Empowering the Future" {...register("title_en")} error={errors.title_en?.message} />
                        <PlayfulTextarea label="Subtitle (H2 / P)" dir="ltr" rows={3} placeholder="Enter supporting text..." {...register("subtitle_en")} error={errors.subtitle_en?.message} className="bg-zinc-50/50 dark:bg-zinc-900/40" />
                        <PlayfulInput label="Primary CTA Text" dir="ltr" placeholder="E.g., Get Started" {...register("cta_primary_text_en")} error={errors.cta_primary_text_en?.message} />
                        <PlayfulInput label="Secondary CTA Text" dir="ltr" placeholder="E.g., Learn More" {...register("cta_secondary_text_en")} error={errors.cta_secondary_text_en?.message} />
                    </div>
                </motion.div>

                {/* Arabic Column */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 rounded-3xl border-2 border-[var(--brand-primary)]/20 bg-white/80 p-8 shadow-xl shadow-[var(--brand-primary)]/5 backdrop-blur-md dark:border-[var(--brand-primary)]/20 dark:bg-zinc-900/80 dark:shadow-none">
                    <div className="mb-4 flex items-center justify-between border-b-2 border-[var(--brand-primary)]/10 pb-4 dark:border-[var(--brand-primary)]/20">
                        <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">الهوية العربية</span>
                        <span className="rounded-lg bg-[var(--brand-primary)]/10 px-3 flex items-center justify-center py-1 text-xs font-bold font-mono tracking-widest text-[var(--brand-primary)]">RTL</span>
                    </div>
                    <div className="space-y-4">
                        <PlayfulInput label="نص الشارة" dir="rtl" placeholder="🚀 ميزة جديدة" {...register("badge_text_ar")} error={errors.badge_text_ar?.message} />
                        <PlayfulInput label="العنوان الرئيسي (H1)" dir="rtl" placeholder="مثال: تمكين المستقبل" {...register("title_ar")} error={errors.title_ar?.message} />
                        <PlayfulTextarea label="النص الفرعي (H2 / P)" dir="rtl" rows={3} placeholder="أدخل النص الداعم..." {...register("subtitle_ar")} error={errors.subtitle_ar?.message} className="bg-zinc-50/50 dark:bg-zinc-900/40" />
                        <PlayfulInput label="نص الزر الرئيسي" dir="rtl" placeholder="مثال: ابدأ الآن" {...register("cta_primary_text_ar")} error={errors.cta_primary_text_ar?.message} />
                        <PlayfulInput label="نص الزر الثانوي" dir="rtl" placeholder="مثال: اعرف المزيد" {...register("cta_secondary_text_ar")} error={errors.cta_secondary_text_ar?.message} />
                    </div>
                </motion.div>
            </div>

            {/* Global Properties */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl shadow-zinc-200/20 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:shadow-none">
                    <div className="mb-4 flex items-center gap-3 border-b-2 border-zinc-100/50 pb-4 dark:border-zinc-800/50">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 text-white shadow-lg shadow-violet-500/30">
                            <SidebarIcon name="link" className="size-5" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{locale === "ar" ? "رابط الزر (Global)" : "Button URL (Global)"}</h3>
                    </div>
                    <PlayfulInput label={locale === "ar" ? "رابط الزر الرئيسي" : "Primary CTA URL"} dir="ltr" placeholder="https://... or /contact" {...register("cta_primary_link")} error={errors.cta_primary_link?.message} />
                    <PlayfulInput label={locale === "ar" ? "رابط الزر الثانوي" : "Secondary CTA URL"} dir="ltr" placeholder="https://... or /about" {...register("cta_secondary_link")} error={errors.cta_secondary_link?.message} />
                </div>

                <div className="space-y-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl shadow-zinc-200/20 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:shadow-none">
                    <div className="mb-4 flex items-center gap-3 border-b-2 border-zinc-100/50 pb-4 dark:border-zinc-800/50">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-lg shadow-pink-500/30">
                            <SidebarIcon name="image" className="size-5" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{locale === "ar" ? "صورة الغلاف (Hero Image)" : "Hero Image"}</h3>
                    </div>

                    {coverUrl ? (
                        <div className="relative overflow-hidden rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 aspect-video group shadow-md">
                            <img src={coverUrl} alt="Hero image" className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-4 backdrop-blur-sm">
                                <PlayfulButton type="button" onClick={() => setIsImageDialogOpen(true)} className="!bg-white !text-zinc-900 px-6 hover:scale-105">Replace</PlayfulButton>
                                <PlayfulButton type="button" onClick={() => { setCoverUrl(null); setImageId(null); }} className="!bg-rose-600 !text-white px-6 hover:scale-105">Remove</PlayfulButton>
                            </div>
                        </div>
                    ) : (
                        <div onClick={() => setIsImageDialogOpen(true)} className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 py-12 transition-all hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-[var(--brand-primary)]">
                            <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm dark:bg-zinc-800 group-hover:scale-110 transition-transform group-hover:text-[var(--brand-primary)]">
                                <SidebarIcon name="image-plus" className="size-6 text-zinc-400 group-hover:text-[var(--brand-primary)]" />
                            </div>
                            <span className="mt-4 text-sm font-bold text-zinc-500 group-hover:text-[var(--brand-primary)]">
                                {locale === "ar" ? "تحديد صورة للغلاف" : "Select a Hero Image"}
                            </span>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Massive Sticky Save Footer */}
            <AnimatePresence>
                {hasChanges && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 left-1/2 z-50 flex w-max -translate-x-1/2 items-center gap-6 rounded-2xl border-2 border-zinc-200/50 bg-white/95 p-3 pl-6 shadow-2xl shadow-purple-500/20 backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-900/95"
                    >
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span></span>
                            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
                                {locale === "ar" ? "تغييرات غير محفوظة" : "Unsaved changes"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <PlayfulButton type="button" variant="secondary" onClick={handleDiscard} disabled={isPending}>{locale === "ar" ? "تجاهل" : "Discard"}</PlayfulButton>
                            <PlayfulButton type="submit" disabled={isPending} className="!bg-[var(--brand-primary)] hover:!bg-[var(--brand-primary)] hover:brightness-110 !font-black px-8">
                                {isPending ? <SidebarIcon name="loader-2" className="size-4 animate-spin" /> : <SidebarIcon name="save" className="size-4" />}
                                {locale === "ar" ? "حفظ التغييرات" : "Save Changes"}
                            </PlayfulButton>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal for Media Picker */}
            {isImageDialogOpen && (
                <UploadDialog
                    folders={[]}
                    bucket="images"
                    defaultFolderId="all"
                    locale={locale}
                    onClose={() => setIsImageDialogOpen(false)}
                    onSuccess={(urls) => {
                        setIsImageDialogOpen(false);
                        if (urls && urls[0]) {
                            setCoverUrl(urls[0]);
                            // A complete implementation would return the UUID from UploadDialog.
                            // setImageId(uuid);
                        }
                    }}
                />
            )}
        </form>
    );
}
