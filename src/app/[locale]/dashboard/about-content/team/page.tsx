import { getLocale } from "next-intl/server";
import { getAboutTeamMembers } from "@/app/actions/about";
import { AboutTeamGrid } from "@/components/cms/about/AboutTeamGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function TeamDataWrapper({ locale }: { locale: string }) {
    const data = await getAboutTeamMembers();
    return <AboutTeamGrid locale={locale} members={data} />;
}

export default async function TeamMembersPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={5} />}>
            {/* @ts-ignore */}
            <TeamDataWrapper locale={locale} />
        </Suspense>
    );
}
