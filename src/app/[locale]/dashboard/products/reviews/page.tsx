import { getLocale } from "next-intl/server";
import { getReviews } from "@/app/actions/store-products";
import { ReviewsGrid } from "@/components/cms/ReviewsGrid";

export default async function ReviewsPage() {
    const [locale, reviews] = await Promise.all([
        getLocale(),
        getReviews()
    ]);
    return <ReviewsGrid locale={locale} reviews={reviews} />;
}
