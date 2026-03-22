import { getLocale } from "next-intl/server";
import Link from "next/link";
import { SidebarIcon } from "@/components/SidebarIcon";

export default async function ContactSettingsOverview() {
    const locale = await getLocale();

    const modules = [
        {
            href: `/${locale}/dashboard/contact-settings/info`,
            title_ar: "معلومات التواصل الأساسية",
            title_en: "Primary Contact Info",
            desc_ar: "تعديل أرقام الهواتف، البريد الإلكتروني، وعنوان المقر الرئيسي.",
            desc_en: "Update support emails, phone numbers, and HQ address.",
            icon: "headset",
            color: "text-rose-500",
            bg: "bg-rose-500/10"
        },
        {
            href: `/${locale}/projects-management/branches`,
            title_ar: "الفروع والمقرات",
            title_en: "Branches Locations",
            desc_ar: "أدر مواقع المكاتب الخاصة بك على الخريطة.",
            desc_en: "Manage physical office geographical locations on Maps.",
            icon: "mapPin",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            href: `/${locale}/dashboard/contact-settings/social`,
            title_ar: "روابط التواصل الاجتماعي",
            title_en: "Social Media Links",
            desc_ar: "تعديل روابط صفحاتك للتيك توك، انستغرام، يوتيوب.",
            desc_en: "Update platform URLs like Twitter, LinkedIn, Instagram.",
            icon: "share-2",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        }
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {locale === "ar" ? "إعدادات التواصل" : "Contact Settings & Locations"}
                </h1>
                <p className="text-sm text-zinc-500">
                    {locale === "ar"
                        ? "اختر القسم الذي ترغب بتعديله سواء وسائل التواصل الاجتماعي أو تفاصيل الفروع."
                        : "Select whether to modify global contact hooks, social networks, or physical footprint."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {modules.map((mod, i) => (
                    <Link
                        key={i}
                        href={mod.href}
                        className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-[var(--brand-primary)]/40 hover:shadow-xl hover:shadow-[var(--brand-primary)]/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-[var(--brand-primary)]/50"
                    >
                        <div className={`flex size-14 shrink-0 items-center justify-center rounded-xl ${mod.bg} ${mod.color} transition-transform group-hover:scale-110`}>
                            <SidebarIcon name={mod.icon as any} className="size-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[var(--brand-primary)] transition-colors">
                                {locale === "ar" ? mod.title_ar : mod.title_en}
                            </h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                                {locale === "ar" ? mod.desc_ar : mod.desc_en}
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-auto rtl:sm:ml-0 rtl:sm:mr-auto flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 group-hover:bg-[var(--brand-primary)] group-hover:text-white dark:bg-zinc-800 transition-colors">
                            <SidebarIcon name={locale === "ar" ? "arrow-left" : "arrow-right"} className="size-4" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
