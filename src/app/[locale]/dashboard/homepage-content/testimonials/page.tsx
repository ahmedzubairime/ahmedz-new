import { getLocale } from "next-intl/server";
import { getTestimonials } from "@/app/actions/homepage-lists";
import { TestimonialsGrid } from "@/components/cms/TestimonialsGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function TestimonialsWrapper({ locale }: { locale: string }) {
    const data = await getTestimonials();
    return <TestimonialsGrid locale={locale} testimonials={data} />;
}

export default async function TestimonialsPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={5} />}>
            {/* @ts-ignore */}
            <TestimonialsWrapper locale={locale} />
        </Suspense>
    );
}
