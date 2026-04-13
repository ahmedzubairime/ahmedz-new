import { getLocale } from "next-intl/server";
import { getServicesHero } from "@/app/actions/cms";
import { ServicesHeroForm } from "@/components/cms/ServicesHeroForm";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function DataWrapper({ locale }: { locale: string }) {
    const data = await getServicesHero();
    return <ServicesHeroForm locale={locale} initialData={data} />;
}

export default async function ServicesHeroPage() {
    const locale = await getLocale();
    return (
        <Suspense fallback={<TableSkeleton rowCount={3} />}>
            {/* @ts-ignore */}
            <DataWrapper locale={locale} />
        </Suspense>
    );
}
