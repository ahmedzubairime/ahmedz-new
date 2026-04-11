import { getLocale } from "next-intl/server";
import { getAboutStats } from "@/app/actions/about";
import { AboutStatsGrid } from "@/components/cms/about/AboutStatsGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function StatsDataWrapper({ locale }: { locale: string }) {
    const data = await getAboutStats();
    return <AboutStatsGrid locale={locale} stats={data} />;
}

export default async function StatsPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={5} />}>
            {/* @ts-ignore */}
            <StatsDataWrapper locale={locale} />
        </Suspense>
    );
}
