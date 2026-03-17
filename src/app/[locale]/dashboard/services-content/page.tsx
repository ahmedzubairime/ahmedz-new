import { getLocale } from "next-intl/server";

export default async function ServicesContentPage() {
    const locale = await getLocale();
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {locale === "ar" ? "محتوى الخدمات" : "Services Content"}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
                {locale === "ar" ? "إدارة محتوى صفحة الخدمات" : "Manage services page content"}
            </p>
        </div>
    );
}
