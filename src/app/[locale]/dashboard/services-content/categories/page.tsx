import { getLocale } from "next-intl/server";
import { getCategories } from "@/app/actions/services-lists";
import { CategoriesGrid } from "@/components/cms/CategoriesGrid";

export default async function CategoriesPage() {
    const locale = await getLocale();
    const data = await getCategories();

    return <CategoriesGrid locale={locale} categories={data} />;
}
