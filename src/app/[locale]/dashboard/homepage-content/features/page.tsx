import { getLocale } from "next-intl/server";
import { getFeatures } from "@/app/actions/homepage-lists";
import { FeaturesGrid } from "@/components/cms/FeaturesGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function FeaturesWrapper({ locale }: { locale: string }) {
    const data = await getFeatures();
    return <FeaturesGrid locale={locale} features={data} />;
}

export default async function FeaturesPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={5} />}>
            {/* @ts-ignore */}
            <FeaturesWrapper locale={locale} />
        </Suspense>
    );
}
