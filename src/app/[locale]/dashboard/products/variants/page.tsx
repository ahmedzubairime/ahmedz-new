import { getLocale } from "next-intl/server";
import { getAllVariants } from "@/app/actions/store-products";
import { getStoreProducts } from "@/app/actions/store-products";
import { VariantsGrid } from "@/components/cms/VariantsGrid";

export default async function VariantsPage() {
    const [locale, variants, products] = await Promise.all([
        getLocale(),
        getAllVariants(),
        getStoreProducts()
    ]);
    return <VariantsGrid locale={locale} variants={variants} products={products} />;
}
