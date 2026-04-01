import { getLocale } from "next-intl/server";
import { getCategories } from "@/app/actions/services-lists";
import { CategoriesGrid } from "@/components/cms/CategoriesGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function CategoriesWrapper({ locale }: { locale: string }) {
    const data = await getCategories();
    return <CategoriesGrid locale={locale} categories={data} />;
}

export default async function CategoriesPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={5} />}>
            {/* @ts-ignore */}
            <CategoriesWrapper locale={locale} />
        </Suspense>
    );
}
