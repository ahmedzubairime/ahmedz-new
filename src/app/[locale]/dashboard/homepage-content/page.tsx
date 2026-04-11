import { getLocale } from "next-intl/server";
import Link from "next/link";
import { SidebarIcon } from "@/components/SidebarIcon";

export default async function HomepageContentOverview() {
    const locale = await getLocale();

    const modules = [
        {
            href: `/${locale}/dashboard/homepage-content/hero`,
            title_ar: "القسم الرئيسي (Hero)",
            title_en: "Hero Section",
            desc_ar: "تعديل النصوص والصورة الرئيسية لأول ما يراه الزائر.",
            desc_en: "Modify the primary text and image visitors see first.",
            icon: "monitor",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            href: `/${locale}/dashboard/homepage-content/features`,
            title_ar: "المميزات الأساسية",
            title_en: "Core Features",
            desc_ar: "أدر البطاقات التي تستعرض أهم مميزات وخدمات منصتك.",
            desc_en: "Manage the cards showcasing your platform's main features.",
            icon: "box",
            color: "text-indigo-500",
            bg: "bg-indigo-500/10"
        },
        {
            href: `/${locale}/dashboard/homepage-content/partners`,
            title_ar: "شركاء النجاح",
            title_en: "Partners & Clients",
            desc_ar: "أضف شعارات الشركات والعملاء لبناء الثقة.",
            desc_en: "Add logos of companies and clients to build trust.",
            icon: "briefcase",
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        },
        {
            href: `/${locale}/dashboard/homepage-content/testimonials`,
            title_ar: "آراء العملاء",
            title_en: "Testimonials",
            desc_ar: "شارك مراجعات وتقييمات عملائك السابقين.",
            desc_en: "Share reviews and ratings from your past users.",
            icon: "message-square-quote",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            href: `/${locale}/dashboard/homepage-content/stats`,
            title_ar: "الإحصائيات والعدادات",
            title_en: "Stats & Counters",
            desc_ar: "أرقام مثل عدد العملاء، المشاريع المنجزة.",
            desc_en: "Numbers like clients served, projects completed.",
            icon: "bar-chart-2",
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
            href: `/${locale}/dashboard/homepage-content/cta`,
            title_ar: "شريط الدعوة للإجراء",
            title_en: "CTA Banner",
            desc_ar: "تخصيص شريط الدعوة للإجراء الظاهر في الصفحة الرئيسية.",
            desc_en: "Customize the call-to-action banner on the homepage.",
            icon: "megaphone",
            color: "text-rose-500",
            bg: "bg-rose-500/10"
        },
        {
            href: `/${locale}/dashboard/homepage-content/faq`,
            title_ar: "الأسئلة الشائعة",
            title_en: "FAQ",
            desc_ar: "أدر الأسئلة المتكررة التي تظهر في الصفحة الرئيسية.",
            desc_en: "Manage frequently asked questions displayed on the homepage.",
            icon: "message-square",
            color: "text-sky-500",
            bg: "bg-sky-500/10"
        },
        {
            href: `/${locale}/dashboard/homepage-content/seo`,
            title_ar: "إعدادات السيو",
            title_en: "SEO Settings",
            desc_ar: "تحسين ظهور الصفحة الرئيسية في محركات البحث.",
            desc_en: "Optimize how the homepage appears in search engines.",
            icon: "search",
            color: "text-teal-500",
            bg: "bg-teal-500/10"
        }
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {locale === "ar" ? "إدارة محتوى الصفحة الرئيسية" : "Homepage Content Management"}
                </h1>
                <p className="text-sm text-zinc-500">
                    {locale === "ar"
                        ? "اختر القسم الذي ترغب بتعديله في الصفحة الرئيسية للموقع العام."
                        : "Select the section you wish to modify on the public website's homepage."}
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
