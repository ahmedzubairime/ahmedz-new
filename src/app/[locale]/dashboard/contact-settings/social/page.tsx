import { getLocale } from "next-intl/server";
import { getSocialLinks } from "@/app/actions/external-lists";
import { SocialGrid } from "@/components/cms/SocialGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function SocialWrapper({ locale }: { locale: string }) {
    const data = await getSocialLinks();
    return <SocialGrid locale={locale} links={data} />;
}

export default async function SocialPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={4} />}>
            {/* @ts-ignore */}
            <SocialWrapper locale={locale} />
        </Suspense>
    );
}
