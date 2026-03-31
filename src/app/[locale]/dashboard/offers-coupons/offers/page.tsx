import { getLocale } from "next-intl/server";
import { getOffers } from "@/app/actions/store-marketing";
import { getStoreProducts } from "@/app/actions/store-products";
import { getStoreCategories } from "@/app/actions/store-categories";
import { OffersGrid } from "@/components/cms/OffersGrid";

export default async function OffersPage() {
    const [locale, offers, products, categories] = await Promise.all([
        getLocale(),
        getOffers(),
        getStoreProducts(),
        getStoreCategories()
    ]);
    return <OffersGrid locale={locale} offers={offers} products={products} categories={categories} />;
}
