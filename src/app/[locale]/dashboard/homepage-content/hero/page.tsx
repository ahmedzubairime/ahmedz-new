import { getLocale } from "next-intl/server";
import { getHomepageHero } from "@/app/actions/cms";
import { HeroForm } from "@/components/cms/HeroForm";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/ui/Skeletons";

async function HeroDataWrapper({ locale }: { locale: string }) {
    const initialData = await getHomepageHero();
    return <HeroForm locale={locale} initialData={initialData} />;
}

export default async function HeroPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<FormSkeleton />}>
            {/* @ts-ignore */}
            <HeroDataWrapper locale={locale} />
        </Suspense>
    );
}
