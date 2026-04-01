import { getLocale } from "next-intl/server";
import { getOffers } from "@/app/actions/store-marketing";
import { getStoreProducts } from "@/app/actions/store-products";
import { getStoreCategories } from "@/app/actions/store-categories";
import { OffersGrid } from "@/components/cms/OffersGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function OffersWrapper({ locale }: { locale: string }) {
    const [offers, products, categories] = await Promise.all([
        getOffers(),
        getStoreProducts(),
        getStoreCategories()
    ]);
    return <OffersGrid locale={locale} offers={offers} products={products} categories={categories} />;
}

export default async function OffersPage() {
    const locale = await getLocale();
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "العروض" : "Offers"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {locale === "ar" ? "إدارة عروض وتخفيضات المتجر" : "Manage store promotional offers"}
                    </p>
                </div>
            </div>
            <Suspense fallback={<TableSkeleton rowCount={6} />}>
                <OffersWrapper locale={locale} />
            </Suspense>
        </div>
    );
}
