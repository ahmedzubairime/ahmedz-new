import { getLocale } from "next-intl/server";
import { getProjects } from "@/app/actions/portfolio";
import { ProjectsGrid } from "@/components/cms/portfolio/ProjectsGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function ProjectsDataWrapper({ locale }: { locale: string }) {
    const data = await getProjects();
    return <ProjectsGrid locale={locale} projects={data} />;
}

export default async function ProjectsPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={5} />}>
            {/* @ts-ignore */}
            <ProjectsDataWrapper locale={locale} />
        </Suspense>
    );
}
