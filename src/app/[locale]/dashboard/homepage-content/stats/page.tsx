import { getLocale } from "next-intl/server";
import { getHomepageStats } from "@/app/actions/homepage-lists";
import { HomepageStatsGrid } from "@/components/cms/HomepageStatsGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function StatsWrapper({ locale }: { locale: string }) {
    const data = await getHomepageStats();
    return <HomepageStatsGrid locale={locale} stats={data} />;
}

export default async function StatsPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={4} />}>
            {/* @ts-ignore */}
            <StatsWrapper locale={locale} />
        </Suspense>
    );
}
