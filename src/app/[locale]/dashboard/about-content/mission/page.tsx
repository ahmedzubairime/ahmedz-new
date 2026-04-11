import { getLocale } from "next-intl/server";
import { getAboutMission } from "@/app/actions/about";
import { AboutMissionForm } from "@/components/cms/about/AboutMissionForm";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/ui/Skeletons";

async function MissionDataWrapper({ locale }: { locale: string }) {
    const data = await getAboutMission();
    return <AboutMissionForm locale={locale} initialData={data} />;
}

export default async function MissionVisionPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<FormSkeleton />}>
            {/* @ts-ignore */}
            <MissionDataWrapper locale={locale} />
        </Suspense>
    );
}
