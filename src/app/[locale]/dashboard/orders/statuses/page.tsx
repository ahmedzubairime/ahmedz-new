import { getLocale } from "next-intl/server";
import { getOrderStatuses } from "@/app/actions/store-orders";
import { OrderStatusesGrid } from "@/components/cms/OrderStatusesGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function StatusesWrapper({ locale }: { locale: string }) {
    const statuses = await getOrderStatuses();
    return <OrderStatusesGrid locale={locale} statuses={statuses} />;
}

export default async function OrderStatusesPage() {
    const locale = await getLocale();
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "حالات الطلبات" : "Order Statuses"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {locale === "ar" ? "إعداد وإدارة دورة حياة الطلب" : "Configure order lifecycle statuses"}
                    </p>
                </div>
            </div>
            <Suspense fallback={<TableSkeleton rowCount={6} />}>
                <StatusesWrapper locale={locale} />
            </Suspense>
        </div>
    );
}
