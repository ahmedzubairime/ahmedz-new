import { getLocale } from "next-intl/server";
import { getStoreProducts } from "@/app/actions/store-products";
import { getStoreCategories } from "@/app/actions/store-categories";
import { StoreProductsGrid } from "@/components/cms/StoreProductsGrid";

export default async function ProductsPage() {
    const [locale, products, categories] = await Promise.all([
        getLocale(),
        getStoreProducts(),
        getStoreCategories()
    ]);
    return <StoreProductsGrid locale={locale} products={products} categories={categories} />;
}
