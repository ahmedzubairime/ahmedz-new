import { getLocale } from "next-intl/server";
import { getAboutValues } from "@/app/actions/about";
import { AboutValuesGrid } from "@/components/cms/about/AboutValuesGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function ValuesDataWrapper({ locale }: { locale: string }) {
    const data = await getAboutValues();
    return <AboutValuesGrid locale={locale} values={data} />;
}

export default async function ValuesPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={5} />}>
            {/* @ts-ignore */}
            <ValuesDataWrapper locale={locale} />
        </Suspense>
    );
}
