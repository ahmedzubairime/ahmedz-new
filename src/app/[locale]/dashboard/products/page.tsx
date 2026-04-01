import { getLocale } from "next-intl/server";
import { getStoreProducts } from "@/app/actions/store-products";
import { getStoreCategories } from "@/app/actions/store-categories";
import { StoreProductsGrid } from "@/components/cms/StoreProductsGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function ProductsDataWrapper({ locale }: { locale: string }) {
    const [products, categories] = await Promise.all([
        getStoreProducts(),
        getStoreCategories()
    ]);
    return <StoreProductsGrid locale={locale} products={products} categories={categories} />;
}

export default async function ProductsPage() {
    const locale = await getLocale();
    
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <Suspense fallback={
                <div className="space-y-6">
                    {/* Placeholder Header - Renders Instantly */}
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                {locale === "ar" ? "المنتجات" : "Products"}
                            </h1>
                            <p className="mt-1 text-sm text-zinc-500">
                                {locale === "ar" ? "مخزون المنتجات والأسعار والتصنيفات." : "Manage inventory, pricing, and categories."}
                            </p>
                        </div>
                        <div className="h-10 w-32 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                    {/* Placeholder Search */}
                    <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                    {/* Placeholder Table */}
                    <TableSkeleton rowCount={5} />
                </div>
            }>
                {/* @ts-ignore - Async Server Component */}
                <ProductsDataWrapper locale={locale} />
            </Suspense>
        </div>
    );
}
