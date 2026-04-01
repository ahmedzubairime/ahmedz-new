import { getLocale } from "next-intl/server";
import { getServices, getCategories } from "@/app/actions/services-lists";
import { ServicesGrid } from "@/components/cms/ServicesGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function ServicesWrapper({ locale }: { locale: string }) {
    const [servicesData, categoriesData] = await Promise.all([
        getServices(),
        getCategories()
    ]);
    return (
        <ServicesGrid
            locale={locale}
            services={servicesData}
            categories={categoriesData}
        />
    );
}

export default async function ServicesListPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={5} />}>
            {/* @ts-ignore */}
            <ServicesWrapper locale={locale} />
        </Suspense>
    );
}
