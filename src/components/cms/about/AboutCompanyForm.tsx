"use client";

import { useState, useTransition, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveAboutHero, saveAboutCompany } from "@/app/actions/about";
import { UploadDialog } from "@/components/media/UploadDialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const schema = z.object({
    hero_title_ar: z.string().optional(),
    hero_title_en: z.string().optional(),
    hero_subtitle_ar: z.string().optional(),
    hero_subtitle_en: z.string().optional(),
    story_ar: z.string().optional(),
    story_en: z.string().optional(),
    founding_year: z.string().optional(),
    founder_name_ar: z.string().optional(),
    founder_name_en: z.string().optional(),
    youtube_url: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
    locale: string;
    heroData: any;
    companyData: any;
};

function buildMediaUrl(media: any) {
    if (!media) return null;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${media.bucket}/${media.storage_path}`;
}

export function AboutCompanyForm({ locale, heroData, companyData }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [heroImageId, setHeroImageId] = useState<string | null>(heroData?.background_image_id || null);
    const [heroImageUrl, setHeroImageUrl] = useState<string | null>(buildMediaUrl(heroData?.background));
    const [coverImageId, setCoverImageId] = useState<string | null>(companyData?.cover_image_id || null);
    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(buildMediaUrl(companyData?.cover));
    const [activeUpload, setActiveUpload] = useState<"hero" | "cover" | null>(null);

    const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: {
            hero_title_ar: heroData?.title_ar || "",
            hero_title_en: heroData?.title_en || "",
            hero_subtitle_ar: heroData?.subtitle_ar || "",
            hero_subtitle_en: heroData?.subtitle_en || "",
            story_ar: companyData?.story_ar || "",
            story_en: companyData?.story_en || "",
            founding_year: companyData?.founding_year?.toString() || "",
            founder_name_ar: companyData?.founder_name_ar || "",
            founder_name_en: companyData?.founder_name_en || "",
            youtube_url: companyData?.youtube_url || "",
        },
    });

    const isMediaDirty =
        heroImageId !== (heroData?.background_image_id || null) ||
        coverImageId !== (companyData?.cover_image_id || null);
    const hasChanges = isDirty || isMediaDirty;

    useEffect(() => {
        reset({
            hero_title_ar: heroData?.title_ar || "",
            hero_title_en: heroData?.title_en || "",
            hero_subtitle_ar: heroData?.subtitle_ar || "",
            hero_subtitle_en: heroData?.subtitle_en || "",
            story_ar: companyData?.story_ar || "",
            story_en: companyData?.story_en || "",
            founding_year: companyData?.founding_year?.toString() || "",
            founder_name_ar: companyData?.founder_name_ar || "",
            founder_name_en: companyData?.founder_name_en || "",
            youtube_url: companyData?.youtube_url || "",
        });
        setHeroImageId(heroData?.background_image_id || null);
        setHeroImageUrl(buildMediaUrl(heroData?.background));
        setCoverImageId(companyData?.cover_image_id || null);
        setCoverImageUrl(buildMediaUrl(companyData?.cover));
    }, [heroData, companyData, reset]);

    function onSubmit(data: FormValues) {
        startTransition(async () => {
            try {
                await Promise.all([
                    saveAboutHero({
                        title_ar: data.hero_title_ar,
                        title_en: data.hero_title_en,
                        subtitle_ar: data.hero_subtitle_ar,
                        subtitle_en: data.hero_subtitle_en,
                        background_image_id: heroImageId,
                    }),
                    saveAboutCompany({
                        story_ar: data.story_ar,
                        story_en: data.story_en,
                        founding_year: data.founding_year ? parseInt(data.founding_year) : null,
                        founder_name_ar: data.founder_name_ar,
                        founder_name_en: data.founder_name_en,
                        cover_image_id: coverImageId,
                        youtube_url: data.youtube_url || null,
                    }),
                ]);
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
        setHeroImageId(heroData?.background_image_id || null);
        setHeroImageUrl(buildMediaUrl(heroData?.background));
        setCoverImageId(companyData?.cover_image_id || null);
        setCoverImageUrl(buildMediaUrl(companyData?.cover));
    }

    function ImagePicker({ label, url, onPick, onRemove }: { label: string; url: string | null; onPick: () => void; onRemove: () => void }) {
        return (
            <div className="space-y-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl shadow-zinc-200/20 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:shadow-none">
                <div className="mb-4 flex items-center gap-3 border-b-2 border-zinc-100/50 pb-4 dark:border-zinc-800/50">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-lg shadow-pink-500/30"><SidebarIcon name="image" className="size-5" /></div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{label}</h3>
                </div>
                {url ? (
                    <div className="relative overflow-hidden rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 aspect-video group shadow-md">
                        <img src={url} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-4 backdrop-blur-sm">
                            <PlayfulButton type="button" onClick={onPick} className="!bg-white !text-zinc-900 px-6 hover:scale-105">{locale === "ar" ? "استبدال" : "Replace"}</PlayfulButton>
                            <PlayfulButton type="button" onClick={onRemove} className="!bg-rose-600 !text-white px-6 hover:scale-105">{locale === "ar" ? "إزالة" : "Remove"}</PlayfulButton>
                        </div>
                    </div>
                ) : (
                    <div onClick={onPick} className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 py-12 transition-all hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 dark:border-zinc-700 dark:bg-zinc-900/50">
                        <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm dark:bg-zinc-800 group-hover:scale-110 transition-transform"><SidebarIcon name="image-plus" className="size-6 text-zinc-400 group-hover:text-[var(--brand-primary)]" /></div>
                        <span className="mt-4 text-sm font-bold text-zinc-500 group-hover:text-[var(--brand-primary)]">{locale === "ar" ? "اختيار صورة" : "Select Image"}</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-5xl space-y-6 pb-24 relative">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-blue-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {locale === "ar" ? "معلومات الشركة" : "Company Information"}
                </h1>
                <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                    <SidebarIcon name="building" className="size-4 text-blue-500" />
                    {locale === "ar" ? "أدر بيانات البانر، قصة الشركة، وصور الغلاف." : "Manage the banner, company story and cover images."}
                </p>
            </motion.div>

            {/* Hero Banner Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-6">
                <div className="flex items-center gap-3 px-1">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500"><SidebarIcon name="monitor" className="size-4" /></div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{locale === "ar" ? "بانر الصفحة (Hero)" : "Page Banner (Hero)"}</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl shadow-zinc-200/20 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:shadow-none">
                        <div className="mb-4 flex items-center justify-between border-b-2 border-zinc-100/50 pb-4 dark:border-zinc-800/50">
                            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">English</span>
                            <span className="rounded-lg bg-zinc-100 px-3 flex items-center justify-center py-1 text-xs font-bold font-mono tracking-widest text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">LTR</span>
                        </div>
                        <PlayfulInput label="Banner Title" dir="ltr" placeholder="E.g., Who We Are" {...register("hero_title_en")} error={errors.hero_title_en?.message} />
                        <PlayfulTextarea label="Banner Subtitle" dir="ltr" rows={2} placeholder="A brief introduction..." {...register("hero_subtitle_en")} error={errors.hero_subtitle_en?.message} />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 rounded-3xl border-2 border-[var(--brand-primary)]/20 bg-white/80 p-8 shadow-xl shadow-[var(--brand-primary)]/5 backdrop-blur-md dark:border-[var(--brand-primary)]/20 dark:bg-zinc-900/80 dark:shadow-none">
                        <div className="mb-4 flex items-center justify-between border-b-2 border-[var(--brand-primary)]/10 pb-4 dark:border-[var(--brand-primary)]/20">
                            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">العربية</span>
                            <span className="rounded-lg bg-[var(--brand-primary)]/10 px-3 flex items-center justify-center py-1 text-xs font-bold font-mono tracking-widest text-[var(--brand-primary)]">RTL</span>
                        </div>
                        <PlayfulInput label="عنوان البانر" dir="rtl" placeholder="مثال: من نحن" {...register("hero_title_ar")} error={errors.hero_title_ar?.message} />
                        <PlayfulTextarea label="العنوان الفرعي" dir="rtl" rows={2} placeholder="مقدمة مختصرة..." {...register("hero_subtitle_ar")} error={errors.hero_subtitle_ar?.message} />
                    </motion.div>
                </div>
                <ImagePicker
                    label={locale === "ar" ? "صورة البانر" : "Banner Image"}
                    url={heroImageUrl}
                    onPick={() => setActiveUpload("hero")}
                    onRemove={() => { setHeroImageId(null); setHeroImageUrl(null); }}
                />
            </motion.div>

            {/* Company Story Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
                <div className="flex items-center gap-3 px-1">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500"><SidebarIcon name="book-open" className="size-4" /></div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{locale === "ar" ? "قصة الشركة" : "Company Story"}</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="space-y-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl shadow-zinc-200/20 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:shadow-none">
                        <PlayfulTextarea label="Company Story (EN)" dir="ltr" rows={6} placeholder="Tell your company story..." {...register("story_en")} error={errors.story_en?.message} />
                    </div>
                    <div className="space-y-4 rounded-3xl border-2 border-[var(--brand-primary)]/20 bg-white/80 p-8 shadow-xl shadow-[var(--brand-primary)]/5 backdrop-blur-md dark:border-[var(--brand-primary)]/20 dark:bg-zinc-900/80 dark:shadow-none">
                        <PlayfulTextarea label="قصة الشركة (AR)" dir="rtl" rows={6} placeholder="اروِ قصة شركتك..." {...register("story_ar")} error={errors.story_ar?.message} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
                        <div className="flex items-center gap-3 border-b-2 border-zinc-100/50 pb-4 dark:border-zinc-800/50">
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30"><SidebarIcon name="calendar" className="size-5" /></div>
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{locale === "ar" ? "سنة التأسيس" : "Founding Year"}</h3>
                        </div>
                        <PlayfulInput label="" type="number" dir="ltr" placeholder="E.g., 2015" {...register("founding_year")} error={errors.founding_year?.message} />
                    </div>
                    <div className="space-y-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
                        <PlayfulInput label={locale === "ar" ? "اسم المؤسس (EN)" : "Founder Name (EN)"} dir="ltr" placeholder="John Doe" {...register("founder_name_en")} />
                    </div>
                    <div className="space-y-4 rounded-3xl border-2 border-[var(--brand-primary)]/20 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-[var(--brand-primary)]/20 dark:bg-zinc-900/80">
                        <PlayfulInput label={locale === "ar" ? "اسم المؤسس (AR)" : "Founder Name (AR)"} dir="rtl" placeholder="محمد أحمد" {...register("founder_name_ar")} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <ImagePicker
                        label={locale === "ar" ? "صورة غلاف الشركة" : "Company Cover Image"}
                        url={coverImageUrl}
                        onPick={() => setActiveUpload("cover")}
                        onRemove={() => { setCoverImageId(null); setCoverImageUrl(null); }}
                    />
                    <div className="space-y-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
                        <div className="mb-4 flex items-center gap-3 border-b-2 border-zinc-100/50 pb-4 dark:border-zinc-800/50">
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-red-400 to-red-600 text-white shadow-lg shadow-red-500/30"><SidebarIcon name="youtube" className="size-5" /></div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{locale === "ar" ? "فيديو الشركة (YouTube)" : "Company Video (YouTube)"}</h3>
                        </div>
                        <PlayfulInput label="YouTube URL" dir="ltr" placeholder="https://youtube.com/watch?v=..." {...register("youtube_url")} error={errors.youtube_url?.message} />
                        <p className="text-xs text-zinc-400 ml-1">{locale === "ar" ? "اختياري — رابط فيديو YouTube تعريفي عن الشركة." : "Optional — a YouTube intro video about the company."}</p>
                    </div>
                </div>
            </motion.div>

            {/* Sticky Save Footer */}
            <AnimatePresence>
                {hasChanges && (
                    <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 left-1/2 z-50 flex w-max -translate-x-1/2 items-center gap-6 rounded-2xl border-2 border-zinc-200/50 bg-white/95 p-3 pl-6 shadow-2xl shadow-blue-500/20 backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-900/95">
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span></span>
                            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{locale === "ar" ? "تغييرات غير محفوظة" : "Unsaved changes"}</span>
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

            {/* Upload Dialog */}
            {activeUpload && (
                <UploadDialog
                    folders={[]} bucket="images" defaultFolderId="all" locale={locale}
                    onClose={() => setActiveUpload(null)}
                    onSuccess={(urls) => {
                        setActiveUpload(null);
                        if (urls && urls[0]) {
                            if (activeUpload === "hero") { setHeroImageUrl(urls[0]); }
                            else { setCoverImageUrl(urls[0]); }
                        }
                    }}
                />
            )}
        </form>
    );
}
