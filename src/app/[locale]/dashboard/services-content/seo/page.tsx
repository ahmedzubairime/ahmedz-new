import { getLocale } from "next-intl/server";
import { getServicesSeo } from "@/app/actions/cms";
import { ServicesSeoForm } from "@/components/cms/ServicesSeoForm";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function DataWrapper({ locale }: { locale: string }) {
    const data = await getServicesSeo();
    return <ServicesSeoForm locale={locale} initialData={data} />;
}

export default async function ServicesSeoPage() {
    const locale = await getLocale();
    return (
        <Suspense fallback={<TableSkeleton rowCount={3} />}>
            {/* @ts-ignore */}
            <DataWrapper locale={locale} />
        </Suspense>
    );
}
