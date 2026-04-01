import { getLocale } from "next-intl/server";
import { getStoreCategories } from "@/app/actions/store-categories";
import { StoreCategoriesGrid } from "@/components/cms/StoreCategoriesGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function CategoriesWrapper({ locale }: { locale: string }) {
    const categories = await getStoreCategories();
    return <StoreCategoriesGrid locale={locale} categories={categories} />;
}

export default async function CategoriesPage() {
    const locale = await getLocale();
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "تصنيفات المتجر" : "Store Categories"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {locale === "ar" ? "إدارة وتصنيف منتجات المتجر" : "Manage and organize store products"}
                    </p>
                </div>
            </div>
            <Suspense fallback={<TableSkeleton rowCount={6} />}>
                <CategoriesWrapper locale={locale} />
            </Suspense>
        </div>
    );
}
