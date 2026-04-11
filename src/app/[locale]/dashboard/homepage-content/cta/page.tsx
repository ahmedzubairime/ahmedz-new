import { getLocale } from "next-intl/server";
import { getHomepageCta } from "@/app/actions/cms";
import { HomepageCtaForm } from "@/components/cms/HomepageCtaForm";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/ui/Skeletons";

async function CtaDataWrapper({ locale }: { locale: string }) {
    const initialData = await getHomepageCta();
    return <HomepageCtaForm locale={locale} initialData={initialData} />;
}

export default async function CtaPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<FormSkeleton />}>
            {/* @ts-ignore */}
            <CtaDataWrapper locale={locale} />
        </Suspense>
    );
}
