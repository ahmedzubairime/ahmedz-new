import { getLocale } from "next-intl/server";
import { getAllVariants } from "@/app/actions/store-products";
import { getStoreProducts } from "@/app/actions/store-products";
import { VariantsGrid } from "@/components/cms/VariantsGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function VariantsWrapper({ locale }: { locale: string }) {
    const [variants, products] = await Promise.all([
        getAllVariants(),
        getStoreProducts()
    ]);
    return <VariantsGrid locale={locale} variants={variants} products={products} />;
}

export default async function VariantsPage() {
    const locale = await getLocale();
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "المتغيرات" : "Variants"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {locale === "ar" ? "إعداد متغيرات المنتجات" : "Configure product variants"}
                    </p>
                </div>
            </div>
            <Suspense fallback={<TableSkeleton rowCount={6} />}>
                <VariantsWrapper locale={locale} />
            </Suspense>
        </div>
    );
}
