import { getLocale } from "next-intl/server";
import { getTestimonials } from "@/app/actions/homepage-lists";
import { TestimonialsGrid } from "@/components/cms/TestimonialsGrid";

export default async function TestimonialsPage() {
    const locale = await getLocale();
    const data = await getTestimonials();

    return <TestimonialsGrid locale={locale} testimonials={data} />;
}
