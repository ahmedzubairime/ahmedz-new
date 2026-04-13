import { getLocale } from "next-intl/server";
import { getServiceProcess, getServices } from "@/app/actions/services-lists";
import { ServicesProcessGrid } from "@/components/cms/ServicesProcessGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function DataWrapper({ locale }: { locale: string }) {
    const [steps, services] = await Promise.all([
        getServiceProcess(),
        getServices()
    ]);
    return <ServicesProcessGrid locale={locale} steps={steps} services={services} />;
}

export default async function ServicesProcessPage() {
    const locale = await getLocale();
    return (
        <Suspense fallback={<TableSkeleton rowCount={5} />}>
            {/* @ts-ignore */}
            <DataWrapper locale={locale} />
        </Suspense>
    );
}
