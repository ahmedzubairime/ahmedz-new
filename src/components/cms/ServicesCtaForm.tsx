"use client";

import { useState, useTransition, useEffect } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveServicesCta } from "@/app/actions/cms";
import { UploadDialog } from "@/components/media/UploadDialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

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

export function ServicesCtaForm({ locale, initialData }: Props) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const [bgImageId, setBgImageId] = useState<string | null>(initialData?.bg_image_id || null);
    const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [isMediaDirty, setIsMediaDirty] = useState(false);

    const { register, handleSubmit, reset, formState: { isDirty } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title_ar: initialData?.title_ar || "", title_en: initialData?.title_en || "",
            subtitle_ar: initialData?.subtitle_ar || "", subtitle_en: initialData?.subtitle_en || "",
            button_text_ar: initialData?.button_text_ar || "", button_text_en: initialData?.button_text_en || "",
            button_link: initialData?.button_link || "",
        }
    });

    const hasChanges = isDirty || isMediaDirty;

    useEffect(() => {
        reset({
            title_ar: initialData?.title_ar || "", title_en: initialData?.title_en || "",
            subtitle_ar: initialData?.subtitle_ar || "", subtitle_en: initialData?.subtitle_en || "",
            button_text_ar: initialData?.button_text_ar || "", button_text_en: initialData?.button_text_en || "",
            button_link: initialData?.button_link || "",
        });
        setBgImageId(initialData?.bg_image_id || null);
        setBgImageUrl(initialData?.bg_image ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${initialData.bg_image.bucket}/${initialData.bg_image.storage_path}` : null);
    }, [initialData, reset]);

    function onSubmit(data: FormValues) {
        startTransition(async () => {
            try {
                await saveServicesCta({ ...data, bg_image_id: bgImageId });
                toast.success(locale === "ar" ? "تم الحفظ" : "Saved", { icon: "📣" });
                router.refresh();
            } catch { toast.error(locale === "ar" ? "فشل" : "Failed"); }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-5xl space-y-6 pb-24 relative">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{locale === "ar" ? "شريط الدعوة للإجراء — الخدمات" : "Services CTA Banner"}</h1>
                <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                    <SidebarIcon name="megaphone" className="size-4 text-rose-500" />
                    {locale === "ar" ? "تخصيص شريط الدعوة للإجراء بصفحة الخدمات." : "Customize the call-to-action banner on the services page."}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
                    <div className="mb-4 border-b-2 border-zinc-100/50 pb-4 dark:border-zinc-800/50"><span className="text-xl font-bold">English CTA</span></div>
                    <PlayfulInput label="CTA Title" dir="ltr" placeholder="Ready to get started?" {...register("title_en")} />
                    <PlayfulTextarea label="CTA Subtitle" dir="ltr" rows={2} placeholder="Contact our team..." {...register("subtitle_en")} />
                    <PlayfulInput label="Button Text" dir="ltr" placeholder="Contact Us" {...register("button_text_en")} />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 rounded-3xl border-2 border-[var(--brand-primary)]/20 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-[var(--brand-primary)]/20 dark:bg-zinc-900/80">
                    <div className="mb-4 border-b-2 border-[var(--brand-primary)]/10 pb-4"><span className="text-xl font-bold">دعوة عربية</span></div>
                    <PlayfulInput label="عنوان الدعوة" dir="rtl" placeholder="هل أنت مستعد؟" {...register("title_ar")} />
                    <PlayfulTextarea label="النص الفرعي" dir="rtl" rows={2} placeholder="تواصل مع فريقنا..." {...register("subtitle_ar")} />
                    <PlayfulInput label="نص الزر" dir="rtl" placeholder="تواصل معنا" {...register("button_text_ar")} />
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
                    <div className="mb-4 flex items-center gap-3 border-b-2 border-zinc-100/50 pb-4 dark:border-zinc-800/50">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-lg"><SidebarIcon name="link" className="size-5" /></div>
                        <h3 className="text-xl font-bold">{locale === "ar" ? "رابط الزر" : "Button URL"}</h3>
                    </div>
                    <PlayfulInput label="URL" dir="ltr" placeholder="/contact or https://..." {...register("button_link")} />
                </div>

                <div className="space-y-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
                    <div className="mb-4 flex items-center gap-3 border-b-2 border-zinc-100/50 pb-4 dark:border-zinc-800/50">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-lg"><SidebarIcon name="image" className="size-5" /></div>
                        <h3 className="text-xl font-bold">{locale === "ar" ? "صورة الخلفية" : "Background Image"}</h3>
                    </div>
                    {bgImageUrl ? (
                        <div className="relative overflow-hidden rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 aspect-video group shadow-md">
                            <img src={bgImageUrl} alt="" className="size-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                                <PlayfulButton type="button" onClick={() => setIsImageDialogOpen(true)} className="!bg-white !text-zinc-900 px-6">Replace</PlayfulButton>
                                <PlayfulButton type="button" onClick={() => { setBgImageUrl(null); setBgImageId(null); setIsMediaDirty(true); }} className="!bg-rose-600 !text-white px-6">Remove</PlayfulButton>
                            </div>
                        </div>
                    ) : (
                        <div onClick={() => setIsImageDialogOpen(true)} className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 py-10 transition-all hover:border-rose-500 dark:border-zinc-700">
                            <SidebarIcon name="image-plus" className="size-6 text-zinc-400 group-hover:text-rose-500" />
                            <span className="mt-3 text-sm font-bold text-zinc-500 group-hover:text-rose-500">{locale === "ar" ? "اختيار صورة" : "Select Image"}</span>
                        </div>
                    )}
                </div>
            </motion.div>

            <AnimatePresence>
                {hasChanges && (
                    <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 left-1/2 z-50 flex w-max -translate-x-1/2 items-center gap-6 rounded-2xl border-2 border-zinc-200/50 bg-white/95 p-3 pl-6 shadow-2xl backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-900/95">
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span></span>
                            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{locale === "ar" ? "تغييرات غير محفوظة" : "Unsaved changes"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <PlayfulButton type="button" variant="secondary" onClick={() => { reset(); setIsMediaDirty(false); }} disabled={isPending}>{locale === "ar" ? "تجاهل" : "Discard"}</PlayfulButton>
                            <PlayfulButton type="submit" disabled={isPending} className="!bg-[var(--brand-primary)] hover:brightness-110 !font-black px-8">
                                {isPending ? <SidebarIcon name="loader-2" className="size-4 animate-spin" /> : <SidebarIcon name="save" className="size-4" />}
                                {locale === "ar" ? "حفظ" : "Save"}
                            </PlayfulButton>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isImageDialogOpen && (
                <UploadDialog folders={[]} bucket="images" defaultFolderId="all" locale={locale}
                    onClose={() => setIsImageDialogOpen(false)}
                    onSuccess={(urls) => { setIsImageDialogOpen(false); if (urls?.[0]) { setBgImageUrl(urls[0]); setIsMediaDirty(true); } }}
                />
            )}
        </form>
    );
}
