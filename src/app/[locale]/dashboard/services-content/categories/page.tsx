import { getLocale } from "next-intl/server";

export default async function ServiceCategoriesPage() {
    const locale = await getLocale();
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {locale === "ar" ? "تصنيفات الخدمات" : "Service Categories"}
            </h1>
        </div>
    );
}
