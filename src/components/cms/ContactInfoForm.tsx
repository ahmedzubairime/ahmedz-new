"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveContactInfo } from "@/app/actions/cms";
import { SidebarIcon } from "@/components/SidebarIcon";

type Props = {
    locale: string;
    initialData: any;
};

export function ContactInfoForm({ locale, initialData }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Form State
    const [emailPrimary, setEmailPrimary] = useState(initialData?.email_primary || "");
    const [emailSupport, setEmailSupport] = useState(initialData?.email_support || "");
    const [phonePrimary, setPhonePrimary] = useState(initialData?.phone_primary || "");
    const [phoneSecondary, setPhoneSecondary] = useState(initialData?.phone_secondary || "");
    const [addressAr, setAddressAr] = useState(initialData?.address_ar || "");
    const [addressEn, setAddressEn] = useState(initialData?.address_en || "");

    // Detect Changes
    const isDirty =
        emailPrimary !== (initialData?.email_primary || "") ||
        emailSupport !== (initialData?.email_support || "") ||
        phonePrimary !== (initialData?.phone_primary || "") ||
        phoneSecondary !== (initialData?.phone_secondary || "") ||
        addressAr !== (initialData?.address_ar || "") ||
        addressEn !== (initialData?.address_en || "");

    function handleSave() {
        startTransition(async () => {
            try {
                await saveContactInfo({
                    email_primary: emailPrimary,
                    email_support: emailSupport,
                    phone_primary: phonePrimary,
                    phone_secondary: phoneSecondary,
                    address_ar: addressAr,
                    address_en: addressEn,
                });
                router.refresh();
            } catch (err) {
                console.error(err);
                alert("Failed to save changes.");
            }
        });
    }

    function handleDiscard() {
        setEmailPrimary(initialData?.email_primary || "");
        setEmailSupport(initialData?.email_support || "");
        setPhonePrimary(initialData?.phone_primary || "");
        setPhoneSecondary(initialData?.phone_secondary || "");
        setAddressAr(initialData?.address_ar || "");
        setAddressEn(initialData?.address_en || "");
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8 pb-24">

            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {locale === "ar" ? "معلومات التواصل الأساسية" : "Primary Contact Information"}
                </h1>
                <p className="text-sm text-zinc-500">
                    {locale === "ar"
                        ? "أدر تفاصيل الاتصال العالمية التي تظهر في تذييل الموقع وصفحات المساعدة."
                        : "Manage the global contact details that appear in footers and help pages."}
                </p>
            </div>

            {/* General Contact Specs */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-6 flex items-center gap-2 border-b border-zinc-100 pb-4 dark:border-zinc-800">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                        <SidebarIcon name="phone" className="size-4" />
                    </div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        {locale === "ar" ? "أرقام الهواتف والبريد" : "Phones & Emails"}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                {locale === "ar" ? "البريد الإلكتروني الأساسي" : "Primary Email"}
                            </label>
                            <input
                                type="email"
                                value={emailPrimary}
                                onChange={(e) => setEmailPrimary(e.target.value)}
                                dir="ltr"
                                placeholder="hello@company.com"
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 outline-none focus:border-[var(--brand-primary)] focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                {locale === "ar" ? "بريد الدعم الفني" : "Support Email"}
                            </label>
                            <input
                                type="email"
                                value={emailSupport}
                                onChange={(e) => setEmailSupport(e.target.value)}
                                dir="ltr"
                                placeholder="support@company.com"
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 outline-none focus:border-[var(--brand-primary)] focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                {locale === "ar" ? "رقم الهاتف الأساسي" : "Primary Phone"}
                            </label>
                            <input
                                type="tel"
                                value={phonePrimary}
                                onChange={(e) => setPhonePrimary(e.target.value)}
                                dir="ltr"
                                placeholder="+1 (555) 000-0000"
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 outline-none focus:border-[var(--brand-primary)] focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                {locale === "ar" ? "رقم هاتف إضافي" : "Secondary Phone"}
                            </label>
                            <input
                                type="tel"
                                value={phoneSecondary}
                                onChange={(e) => setPhoneSecondary(e.target.value)}
                                dir="ltr"
                                placeholder="Optional..."
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 outline-none focus:border-[var(--brand-primary)] focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Headquarters Address (Dual Language) */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-6 flex items-center gap-2 border-b border-zinc-100 pb-4 dark:border-zinc-800">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                        <SidebarIcon name="map-pin" className="size-4" />
                    </div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        {locale === "ar" ? "عنوان المقر الرئيسي" : "Headquarters Address"}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 flex items-center justify-between text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            English Location
                            <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">LTR</span>
                        </label>
                        <textarea
                            value={addressEn}
                            onChange={(e) => setAddressEn(e.target.value)}
                            dir="ltr"
                            rows={3}
                            placeholder="123 Innovation Drive..."
                            className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900"
                        />
                    </div>
                    <div>
                        <label className="mb-2 flex items-center justify-between text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            العنوان بالعربية
                            <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-500">RTL</span>
                        </label>
                        <textarea
                            value={addressAr}
                            onChange={(e) => setAddressAr(e.target.value)}
                            dir="rtl"
                            rows={3}
                            placeholder="123 شارع الابتكار..."
                            className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900"
                        />
                    </div>
                </div>
            </div>

            {/* Massive Sticky Save Footer */}
            {isDirty && (
                <div className="fixed bottom-6 left-1/2 z-50 flex w-max -translate-x-1/2 items-center gap-4 rounded-2xl border border-zinc-200/50 bg-white/90 p-3 pl-6 shadow-2xl shadow-black/10 backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-900/90 dark:shadow-white/5 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 line-clamp-1 max-w-[200px] sm:max-w-none">
                        {locale === "ar" ? "لديك تغييرات غير محفوظة." : "You have unsaved changes."}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDiscard}
                            disabled={isPending}
                            className="rounded-xl px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 disabled:opacity-50"
                        >
                            {locale === "ar" ? "تجاهل" : "Discard"}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isPending}
                            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-zinc-800 hover:shadow-xl dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white disabled:opacity-50"
                        >
                            {isPending ? (
                                <SidebarIcon name="loader-2" className="size-4 animate-spin" />
                            ) : (
                                <SidebarIcon name="save" className="size-4" />
                            )}
                            {isPending
                                ? (locale === "ar" ? "جاري الحفظ..." : "Saving...")
                                : (locale === "ar" ? "حفظ التغييرات" : "Save Changes")
                            }
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
