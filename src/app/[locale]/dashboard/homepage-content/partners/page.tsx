import { getLocale } from "next-intl/server";
import { getPartners } from "@/app/actions/homepage-lists";
import { PartnersGrid } from "@/components/cms/PartnersGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function PartnersWrapper({ locale }: { locale: string }) {
    const data = await getPartners();
    return <PartnersGrid locale={locale} partners={data} />;
}

export default async function PartnersPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={5} />}>
            {/* @ts-ignore */}
            <PartnersWrapper locale={locale} />
        </Suspense>
    );
}
