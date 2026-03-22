import { getLocale } from "next-intl/server";
import Link from "next/link";
import { SidebarIcon } from "@/components/SidebarIcon";

export default async function ServicesContentOverview() {
    const locale = await getLocale();

    const modules = [
        {
            href: `/${locale}/dashboard/services-content/list`,
            title_ar: "قائمة الخدمات",
            title_en: "Services List",
            desc_ar: "إنشاء وتعديل خدمات الشركة وتفاصيلها.",
            desc_en: "Create and modify company services and their descriptions.",
            icon: "briefcase",
            color: "text-[var(--brand-primary)]",
            bg: "bg-[var(--brand-primary)]/10"
        },
        {
            href: `/${locale}/dashboard/services-content/categories`,
            title_ar: "تصنيفات الخدمات",
            title_en: "Service Categories",
            desc_ar: "تقسيم الخدمات إلى فئات لتسهيل التصفح.",
            desc_en: "Group services into categories for easier navigation.",
            icon: "folder",
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        }
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {locale === "ar" ? "قائمة الخدمات والتصنيفات" : "Services & Capabilities"}
                </h1>
                <p className="text-sm text-zinc-500">
                    {locale === "ar"
                        ? "أدر الخدمات الرئيسية التي تقدمها شركتك."
                        : "Manage the core offerings and services of the company."}
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
