import { getLocale } from "next-intl/server";
import { getCoupons } from "@/app/actions/store-marketing";
import { CouponsGrid } from "@/components/cms/CouponsGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function CouponsWrapper({ locale }: { locale: string }) {
    const coupons = await getCoupons();
    return <CouponsGrid locale={locale} coupons={coupons} />;
}

export default async function CouponsPage() {
    const locale = await getLocale();
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "الكوبونات" : "Coupons"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {locale === "ar" ? "إدارة كوبونات الخصم للمتجر" : "Manage store discount coupons"}
                    </p>
                </div>
            </div>
            <Suspense fallback={<TableSkeleton rowCount={6} />}>
                <CouponsWrapper locale={locale} />
            </Suspense>
        </div>
    );
}
