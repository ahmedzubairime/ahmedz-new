import { getLocale } from "next-intl/server";
import { getHomepageSeo } from "@/app/actions/cms";
import { HomepageSeoForm } from "@/components/cms/HomepageSeoForm";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/ui/Skeletons";

async function SeoDataWrapper({ locale }: { locale: string }) {
    const initialData = await getHomepageSeo();
    return <HomepageSeoForm locale={locale} initialData={initialData} />;
}

export default async function SeoPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<FormSkeleton />}>
            {/* @ts-ignore */}
            <SeoDataWrapper locale={locale} />
        </Suspense>
    );
}
