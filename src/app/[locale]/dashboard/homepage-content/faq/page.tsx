import { getLocale } from "next-intl/server";
import { getHomepageFaq } from "@/app/actions/homepage-lists";
import { HomepageFaqGrid } from "@/components/cms/HomepageFaqGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function FaqWrapper({ locale }: { locale: string }) {
    const data = await getHomepageFaq();
    return <HomepageFaqGrid locale={locale} faqs={data} />;
}

export default async function FaqPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={5} />}>
            {/* @ts-ignore */}
            <FaqWrapper locale={locale} />
        </Suspense>
    );
}
