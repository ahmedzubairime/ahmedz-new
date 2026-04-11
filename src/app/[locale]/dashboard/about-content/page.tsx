import { getLocale } from "next-intl/server";
import Link from "next/link";
import { SidebarIcon } from "@/components/SidebarIcon";

export default async function AboutContentOverview() {
    const locale = await getLocale();

    const modules = [
        {
            href: `/${locale}/dashboard/about-content/company`,
            title_ar: "معلومات الشركة",
            title_en: "Company Info",
            desc_ar: "تعديل قصة الشركة، سنة التأسيس، صورة الغلاف ومعرض الصور.",
            desc_en: "Edit your company story, founding year, cover image and photo gallery.",
            icon: "building",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            href: `/${locale}/dashboard/about-content/mission`,
            title_ar: "الرؤية والرسالة",
            title_en: "Mission & Vision",
            desc_ar: "حدد رسالة ورؤية وفلسفة شركتك.",
            desc_en: "Define your company mission, vision and philosophy.",
            icon: "target",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            href: `/${locale}/dashboard/about-content/team`,
            title_ar: "أعضاء الفريق",
            title_en: "Team Members",
            desc_ar: "أدر أعضاء الفريق: الاسم، الدور، السيرة الذاتية، حسابات التواصل.",
            desc_en: "Manage team members: name, role, bio, social accounts.",
            icon: "users",
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        },
        {
            href: `/${locale}/dashboard/about-content/values`,
            title_ar: "القيم الأساسية",
            title_en: "Core Values",
            desc_ar: "أدر القيم الأساسية التي تمثل هوية شركتك.",
            desc_en: "Manage core values that represent your company identity.",
            icon: "heart",
            color: "text-rose-500",
            bg: "bg-rose-500/10"
        },
        {
            href: `/${locale}/dashboard/about-content/timeline`,
            title_ar: "المراحل الزمنية",
            title_en: "Timeline & Milestones",
            desc_ar: "أضف أبرز المحطات والإنجازات عبر السنوات.",
            desc_en: "Add key milestones and achievements across the years.",
            icon: "clock",
            color: "text-cyan-500",
            bg: "bg-cyan-500/10"
        },
        {
            href: `/${locale}/dashboard/about-content/stats`,
            title_ar: "الإحصائيات",
            title_en: "Statistics & Counters",
            desc_ar: "أدر أرقام الإحصائيات مثل المشاريع المنجزة، عدد الموظفين.",
            desc_en: "Manage stat counters like completed projects, team size.",
            icon: "bar-chart-2",
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
            href: `/${locale}/dashboard/about-content/certificates`,
            title_ar: "الشهادات والجوائز",
            title_en: "Certificates & Awards",
            desc_ar: "اعرض الشهادات والاعتمادات والجوائز التي حصلت عليها.",
            desc_en: "Display certifications, accreditations and awards.",
            icon: "award",
            color: "text-indigo-500",
            bg: "bg-indigo-500/10"
        },
        {
            href: `/${locale}/dashboard/about-content/seo`,
            title_ar: "إعدادات SEO",
            title_en: "SEO Settings",
            desc_ar: "إعدادات محركات البحث الخاصة بصفحة من نحن.",
            desc_en: "Search engine optimization settings for the About page.",
            icon: "search",
            color: "text-teal-500",
            bg: "bg-teal-500/10"
        }
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {locale === "ar" ? "إدارة صفحة من نحن" : "About Page Management"}
                </h1>
                <p className="text-sm text-zinc-500">
                    {locale === "ar"
                        ? "اختر القسم الذي ترغب بتعديله في صفحة من نحن."
                        : "Select the section you wish to modify on the About page."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
