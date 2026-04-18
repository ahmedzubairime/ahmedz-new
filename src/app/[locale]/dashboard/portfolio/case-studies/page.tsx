import { getLocale } from "next-intl/server";
import { getCaseStudies, getProjects } from "@/app/actions/portfolio";
import { CaseStudiesGrid } from "@/components/cms/portfolio/CaseStudiesGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function CaseStudiesDataWrapper({ locale }: { locale: string }) {
    const [caseStudies, projects] = await Promise.all([
        getCaseStudies(),
        getProjects()
    ]);
    return <CaseStudiesGrid locale={locale} caseStudies={caseStudies} projects={projects} />;
}

export default async function CaseStudiesPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={5} />}>
            {/* @ts-ignore */}
            <CaseStudiesDataWrapper locale={locale} />
        </Suspense>
    );
}
