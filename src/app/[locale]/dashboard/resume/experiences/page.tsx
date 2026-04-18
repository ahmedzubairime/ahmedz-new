import { getLocale } from "next-intl/server";
import { getExperiences } from "@/app/actions/portfolio";
import { ExperiencesGrid } from "@/components/cms/resume/ExperiencesGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function ExperiencesDataWrapper({ locale }: { locale: string }) {
    const data = await getExperiences();
    return <ExperiencesGrid locale={locale} experiences={data} />;
}

export default async function ExperiencesPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={5} />}>
            {/* @ts-ignore */}
            <ExperiencesDataWrapper locale={locale} />
        </Suspense>
    );
}
