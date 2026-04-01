import { getLocale } from "next-intl/server";
import { getReviews } from "@/app/actions/store-products";
import { ReviewsGrid } from "@/components/cms/ReviewsGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function ReviewsWrapper({ locale }: { locale: string }) {
    const reviews = await getReviews();
    return <ReviewsGrid locale={locale} reviews={reviews} />;
}

export default async function ReviewsPage() {
    const locale = await getLocale();
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "التقييمات" : "Reviews"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {locale === "ar" ? "إدارة تقييمات المنتجات" : "Manage product reviews"}
                    </p>
                </div>
            </div>
            <Suspense fallback={<TableSkeleton rowCount={6} />}>
                <ReviewsWrapper locale={locale} />
            </Suspense>
        </div>
    );
}
