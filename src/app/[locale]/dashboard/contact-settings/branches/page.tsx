import { getLocale } from "next-intl/server";
import { getBranches } from "@/app/actions/external-lists";
import { BranchesGrid } from "@/components/cms/BranchesGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function BranchesWrapper({ locale }: { locale: string }) {
    const data = await getBranches();
    return <BranchesGrid locale={locale} branches={data} />;
}

export default async function BranchesPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={4} />}>
            {/* @ts-ignore */}
            <BranchesWrapper locale={locale} />
        </Suspense>
    );
}
