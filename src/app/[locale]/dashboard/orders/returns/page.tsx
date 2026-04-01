import { getLocale } from "next-intl/server";
import { getReturns } from "@/app/actions/store-orders";
import { ReturnsGrid } from "@/components/cms/ReturnsGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function ReturnsWrapper({ locale }: { locale: string }) {
    const returns = await getReturns();
    return <ReturnsGrid locale={locale} returns={returns} />;
}

export default async function ReturnsPage() {
    const locale = await getLocale();
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "المرتجعات" : "Returns"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {locale === "ar" ? "إدارة طلبات استرجاع المنتجات" : "Manage product return requests"}
                    </p>
                </div>
            </div>
            <Suspense fallback={<TableSkeleton rowCount={6} />}>
                <ReturnsWrapper locale={locale} />
            </Suspense>
        </div>
    );
}
