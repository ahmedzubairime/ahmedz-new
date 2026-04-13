import { getLocale } from "next-intl/server";
import { getServicesCta } from "@/app/actions/cms";
import { ServicesCtaForm } from "@/components/cms/ServicesCtaForm";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function DataWrapper({ locale }: { locale: string }) {
    const data = await getServicesCta();
    return <ServicesCtaForm locale={locale} initialData={data} />;
}

export default async function ServicesCtaPage() {
    const locale = await getLocale();
    return (
        <Suspense fallback={<TableSkeleton rowCount={3} />}>
            {/* @ts-ignore */}
            <DataWrapper locale={locale} />
        </Suspense>
    );
}
