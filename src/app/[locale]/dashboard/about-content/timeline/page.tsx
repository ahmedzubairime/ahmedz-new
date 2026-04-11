import { getLocale } from "next-intl/server";
import { getAboutTimeline } from "@/app/actions/about";
import { AboutTimelineGrid } from "@/components/cms/about/AboutTimelineGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function TimelineDataWrapper({ locale }: { locale: string }) {
    const data = await getAboutTimeline();
    return <AboutTimelineGrid locale={locale} milestones={data} />;
}

export default async function TimelinePage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={5} />}>
            {/* @ts-ignore */}
            <TimelineDataWrapper locale={locale} />
        </Suspense>
    );
}
