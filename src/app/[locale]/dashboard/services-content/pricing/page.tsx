import { getLocale } from "next-intl/server";
import { getServicePricing, getServices } from "@/app/actions/services-lists";
import { ServicesPricingGrid } from "@/components/cms/ServicesPricingGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function DataWrapper({ locale }: { locale: string }) {
    const [plans, services] = await Promise.all([
        getServicePricing(),
        getServices()
    ]);
    return <ServicesPricingGrid locale={locale} plans={plans} services={services} />;
}

export default async function ServicesPricingPage() {
    const locale = await getLocale();
    return (
        <Suspense fallback={<TableSkeleton rowCount={5} />}>
            {/* @ts-ignore */}
            <DataWrapper locale={locale} />
        </Suspense>
    );
}
