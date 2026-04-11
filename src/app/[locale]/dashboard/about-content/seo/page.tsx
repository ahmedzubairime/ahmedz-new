import { getLocale } from "next-intl/server";
import { getAboutSeo } from "@/app/actions/about";
import { AboutSeoForm } from "@/components/cms/about/AboutSeoForm";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/ui/Skeletons";

async function SeoDataWrapper({ locale }: { locale: string }) {
    const data = await getAboutSeo();
    return <AboutSeoForm locale={locale} initialData={data} />;
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
