"use client";

import { useState, useTransition, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveContactInfo } from "@/app/actions/cms";
import { SidebarIcon } from "@/components/SidebarIcon";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getContactSchema = (locale: string) => z.object({
  email_primary: z.string().email(locale === "ar" ? "بريد غير صالح" : "Invalid email").or(z.literal("")),
  email_support: z.string().email(locale === "ar" ? "بريد غير صالح" : "Invalid email").or(z.literal("")),
  phone_primary: z.string().optional(),
  phone_secondary: z.string().optional(),
  address_ar: z.string().optional(),
  address_en: z.string().optional(),
});

type ContactFormValues = z.infer<ReturnType<typeof getContactSchema>>;

type Props = {
    locale: string;
    initialData: any;
};

export function ContactInfoForm({ locale, initialData }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const schema = useMemo(() => getContactSchema(locale), [locale]);

    const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ContactFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            email_primary: initialData?.email_primary || "",
            email_support: initialData?.email_support || "",
            phone_primary: initialData?.phone_primary || "",
            phone_secondary: initialData?.phone_secondary || "",
            address_ar: initialData?.address_ar || "",
            address_en: initialData?.address_en || "",
        }
    });

    useEffect(() => {
        // Hydrate after save
        reset({
            email_primary: initialData?.email_primary || "",
            email_support: initialData?.email_support || "",
            phone_primary: initialData?.phone_primary || "",
            phone_secondary: initialData?.phone_secondary || "",
            address_ar: initialData?.address_ar || "",
            address_en: initialData?.address_en || "",
        });
    }, [initialData, reset]);

    function onSubmit(data: ContactFormValues) {
        startTransition(async () => {
            try {
                await saveContactInfo(data);
                toast.success(locale === "ar" ? "تم حفظ معلومات التواصل" : "Contact info saved", { icon: "📞" });
                router.refresh();
            } catch (err) {
                console.error(err);
                toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed");
            }
        });
    }

    function handleDiscard() {
        reset();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-5xl space-y-8 pb-24 relative">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-sky-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {locale === "ar" ? "معلومات التواصل الأساسية" : "Primary Contact Information"}
                </h1>
                <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                    <SidebarIcon name="globe" className="size-4 text-sky-500" />
                    {locale === "ar" ? "أدر تفاصيل الاتصال العالمية التي تظهر في تذييل الموقع وصفحات المساعدة." : "Manage the global contact details that appear in footers and help pages."}
                </p>
            </motion.div>

            {/* General Contact Specs */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl shadow-zinc-200/20 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:shadow-none">
                <div className="mb-6 flex items-center gap-3 border-b-2 border-zinc-100/50 pb-4 dark:border-zinc-800/50">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-lg shadow-sky-500/30">
                        <SidebarIcon name="phone" className="size-5" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        {locale === "ar" ? "أرقام الهواتف والبريد" : "Phones & Emails"}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <PlayfulInput 
                            label={locale === "ar" ? "البريد الإلكتروني الأساسي" : "Primary Email"} 
                            type="email" dir="ltr" placeholder="hello@company.com" 
                            {...register("email_primary")} 
                            error={errors.email_primary?.message} 
                        />
                        <PlayfulInput 
                            label={locale === "ar" ? "بريد الدعم الفني" : "Support Email"} 
                            type="email" dir="ltr" placeholder="support@company.com" 
                            {...register("email_support")} 
                            error={errors.email_support?.message} 
                        />
                    </div>
                    <div className="space-y-4">
                        <PlayfulInput 
                            label={locale === "ar" ? "رقم الهاتف الأساسي" : "Primary Phone"} 
                            type="tel" dir="ltr" placeholder="+1 (555) 000-0000" 
                            {...register("phone_primary")} 
                            error={errors.phone_primary?.message} 
                        />
                        <PlayfulInput 
                            label={locale === "ar" ? "رقم هاتف إضافي" : "Secondary Phone"} 
                            type="tel" dir="ltr" placeholder="+1 (555) 000-0000" 
                            {...register("phone_secondary")} 
                            error={errors.phone_secondary?.message} 
                        />
                    </div>
                </div>
            </motion.div>

            {/* Headquarters Address (Dual Language) */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-8 shadow-xl shadow-zinc-200/20 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:shadow-none">
                <div className="mb-6 flex items-center gap-3 border-b-2 border-zinc-100/50 pb-4 dark:border-zinc-800/50">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-white shadow-lg shadow-indigo-500/30">
                        <SidebarIcon name="map-pin" className="size-5" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        {locale === "ar" ? "عنوان المقر الرئيسي" : "Headquarters Address"}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <PlayfulTextarea 
                        label={locale === "ar" ? "العنوان (بالإنجليزية - LTR)" : "English Location (LTR)"}
                        dir="ltr" rows={4} placeholder="123 Innovation Drive..." 
                        {...register("address_en")} 
                        error={errors.address_en?.message} 
                        className="bg-zinc-50/50 dark:bg-zinc-900/30"
                    />
                    <PlayfulTextarea 
                        label={locale === "ar" ? "العنوان (بالعربية - RTL)" : "Arabic Location (RTL)"}
                        dir="rtl" rows={4} placeholder="123 شارع الابتكار..." 
                        {...register("address_ar")} 
                        error={errors.address_ar?.message} 
                        className="bg-zinc-50/50 dark:bg-zinc-900/30"
                    />
                </div>
            </motion.div>

            {/* Massive Sticky Save Footer */}
            <AnimatePresence>
                {isDirty && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 left-1/2 z-50 flex w-max -translate-x-1/2 items-center gap-6 rounded-2xl border-2 border-zinc-200/50 bg-white/95 p-3 pl-6 shadow-2xl shadow-sky-500/20 backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-900/95"
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
        </form>
    );
}
