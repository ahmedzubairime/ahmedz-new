import { getLocale } from "next-intl/server";
import { getSkills } from "@/app/actions/portfolio";
import { SkillsGrid } from "@/components/cms/resume/SkillsGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function SkillsDataWrapper({ locale }: { locale: string }) {
    const data = await getSkills();
    return <SkillsGrid locale={locale} skills={data} />;
}

export default async function SkillsPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={5} />}>
            {/* @ts-ignore */}
            <SkillsDataWrapper locale={locale} />
        </Suspense>
    );
}
