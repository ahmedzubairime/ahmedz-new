"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveAboutMission } from "@/app/actions/about";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const schema = z.object({
    mission_ar: z.string().optional(),
    mission_en: z.string().optional(),
    vision_ar: z.string().optional(),
    vision_en: z.string().optional(),
    philosophy_ar: z.string().optional(),
    philosophy_en: z.string().optional(),
    mission_icon: z.string().optional(),
    vision_icon: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
    locale: string;
    initialData: any;
};

export function AboutMissionForm({ locale, initialData }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const { register, handleSubmit, reset, watch, formState: { errors, isDirty } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            mission_ar: initialData?.mission_ar || "",
            mission_en: initialData?.mission_en || "",
            vision_ar: initialData?.vision_ar || "",
            vision_en: initialData?.vision_en || "",
            philosophy_ar: initialData?.philosophy_ar || "",
            philosophy_en: initialData?.philosophy_en || "",
            mission_icon: initialData?.mission_icon || "target",
            vision_icon: initialData?.vision_icon || "eye",
        },
    });

    const missionIcon = watch("mission_icon") || "target";
    const visionIcon = watch("vision_icon") || "eye";

    useEffect(() => {
        reset({
            mission_ar: initialData?.mission_ar || "",
            mission_en: initialData?.mission_en || "",
            vision_ar: initialData?.vision_ar || "",
            vision_en: initialData?.vision_en || "",
            philosophy_ar: initialData?.philosophy_ar || "",
            philosophy_en: initialData?.philosophy_en || "",
            mission_icon: initialData?.mission_icon || "target",
            vision_icon: initialData?.vision_icon || "eye",
        });
    }, [initialData, reset]);

    function onSubmit(data: FormValues) {
        startTransition(async () => {
            try {
                await saveAboutMission(data);
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully", { icon: "✨" });
                router.refresh();
            } catch (err) {
                console.error(err);
                toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed");
            }
        });
    }

    function Section({ titleAr, titleEn, icon, iconColor, children }: { titleAr: string; titleEn: string; icon: string; iconColor: string; children: React.ReactNode }) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-1">
                    <div className={`flex size-8 items-center justify-center rounded-xl ${iconColor} bg-current/10`}>
                        <SidebarIcon name={icon as any} className="size-4" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{locale === "ar" ? titleAr : titleEn}</h2>
                </div>
                {children}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-5xl space-y-6 pb-24 relative">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-emerald-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {locale === "ar" ? "الرؤية والرسالة" : "Mission & Vision"}
                </h1>
                <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                    <SidebarIcon name="target" className="size-4 text-emerald-500" />
                    {locale === "ar" ? "حدد رسالة ورؤية وفلسفة شركتك." : "Define your company's mission, vision and philosophy."}
                </p>
            </motion.div>

            {/* Mission */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <div className="flex items-center gap-3 px-1 mb-6">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500"><SidebarIcon name={missionIcon as any} className="size-4" /></div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{locale === "ar" ? "الرسالة" : "Mission"}</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="space-y-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
                        <PlayfulTextarea label="Mission Statement (EN)" dir="ltr" rows={4} placeholder="Our mission is to..." {...register("mission_en")} error={errors.mission_en?.message} />
                    </div>
                    <div className="space-y-4 rounded-3xl border-2 border-[var(--brand-primary)]/20 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-[var(--brand-primary)]/20 dark:bg-zinc-900/80">
                        <PlayfulTextarea label="الرسالة (AR)" dir="rtl" rows={4} placeholder="رسالتنا هي..." {...register("mission_ar")} error={errors.mission_ar?.message} />
                    </div>
                </div>
                <div className="mt-4 max-w-md">
                    <div className="relative">
                        <PlayfulInput label={locale === "ar" ? "أيقونة الرسالة (Lucide)" : "Mission Icon (Lucide)"} dir="ltr" placeholder="target" {...register("mission_icon")} className="pl-12" />
                        <div className="absolute left-4 top-[38px] flex size-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500 shadow-sm"><SidebarIcon name={missionIcon as any} className="size-4" /></div>
                    </div>
                </div>
            </motion.div>

            {/* Vision */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="flex items-center gap-3 px-1 mb-6">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500"><SidebarIcon name={visionIcon as any} className="size-4" /></div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{locale === "ar" ? "الرؤية" : "Vision"}</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="space-y-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
                        <PlayfulTextarea label="Vision Statement (EN)" dir="ltr" rows={4} placeholder="Our vision is to..." {...register("vision_en")} error={errors.vision_en?.message} />
                    </div>
                    <div className="space-y-4 rounded-3xl border-2 border-[var(--brand-primary)]/20 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-[var(--brand-primary)]/20 dark:bg-zinc-900/80">
                        <PlayfulTextarea label="الرؤية (AR)" dir="rtl" rows={4} placeholder="رؤيتنا هي..." {...register("vision_ar")} error={errors.vision_ar?.message} />
                    </div>
                </div>
                <div className="mt-4 max-w-md">
                    <div className="relative">
                        <PlayfulInput label={locale === "ar" ? "أيقونة الرؤية (Lucide)" : "Vision Icon (Lucide)"} dir="ltr" placeholder="eye" {...register("vision_icon")} className="pl-12" />
                        <div className="absolute left-4 top-[38px] flex size-6 items-center justify-center rounded-md bg-blue-500/10 text-blue-500 shadow-sm"><SidebarIcon name={visionIcon as any} className="size-4" /></div>
                    </div>
                </div>
            </motion.div>

            {/* Philosophy */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <div className="flex items-center gap-3 px-1 mb-6">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500"><SidebarIcon name="lightbulb" className="size-4" /></div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{locale === "ar" ? "الفلسفة (اختياري)" : "Philosophy (Optional)"}</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="space-y-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
                        <PlayfulTextarea label="Philosophy (EN)" dir="ltr" rows={3} placeholder="Our philosophy..." {...register("philosophy_en")} />
                    </div>
                    <div className="space-y-4 rounded-3xl border-2 border-[var(--brand-primary)]/20 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-[var(--brand-primary)]/20 dark:bg-zinc-900/80">
                        <PlayfulTextarea label="الفلسفة (AR)" dir="rtl" rows={3} placeholder="فلسفتنا هي..." {...register("philosophy_ar")} />
                    </div>
                </div>
            </motion.div>

            {/* Sticky Save */}
            <AnimatePresence>
                {isDirty && (
                    <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 left-1/2 z-50 flex w-max -translate-x-1/2 items-center gap-6 rounded-2xl border-2 border-zinc-200/50 bg-white/95 p-3 pl-6 shadow-2xl shadow-emerald-500/20 backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-900/95">
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span></span>
                            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{locale === "ar" ? "تغييرات غير محفوظة" : "Unsaved changes"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <PlayfulButton type="button" variant="secondary" onClick={() => reset()} disabled={isPending}>{locale === "ar" ? "تجاهل" : "Discard"}</PlayfulButton>
                            <PlayfulButton type="submit" disabled={isPending} className="!bg-[var(--brand-primary)] hover:brightness-110 !font-black px-8">
                                {isPending ? <SidebarIcon name="loader-2" className="size-4 animate-spin" /> : <SidebarIcon name="save" className="size-4" />}
                                {locale === "ar" ? "حفظ" : "Save"}
                            </PlayfulButton>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </form>
    );
}
