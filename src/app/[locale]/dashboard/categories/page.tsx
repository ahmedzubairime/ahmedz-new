import { getLocale } from "next-intl/server";
import { getStoreCategories } from "@/app/actions/store-categories";
import { StoreCategoriesGrid } from "@/components/cms/StoreCategoriesGrid";

export default async function CategoriesPage() {
    const [locale, categories] = await Promise.all([
        getLocale(),
        getStoreCategories()
    ]);
    return <StoreCategoriesGrid locale={locale} categories={categories} />;
}
