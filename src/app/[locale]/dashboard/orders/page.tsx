import { getLocale } from "next-intl/server";
import { getOrders } from "@/app/actions/store-orders";
import { getOrderStatuses } from "@/app/actions/store-orders";
import { OrdersListGrid } from "@/components/cms/OrdersListGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function OrdersDataWrapper({ locale }: { locale: string }) {
    const [orders, statuses] = await Promise.all([
        getOrders(),
        getOrderStatuses()
    ]);
    return <OrdersListGrid locale={locale} orders={orders} statuses={statuses} />;
}

export default async function OrdersPage() {
    const locale = await getLocale();
    
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <Suspense fallback={
                <div className="space-y-6">
                    {/* Placeholder Header - Renders Instantly */}
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                {locale === "ar" ? "الطلبات" : "Orders"}
                            </h1>
                            <p className="mt-1 text-sm text-zinc-500">
                                {locale === "ar" ? "تتبع جميع طلبات العملاء." : "Track all customer orders."}
                            </p>
                        </div>
                        <div className="h-6 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                    {/* Placeholder Table */}
                    <TableSkeleton rowCount={5} />
                </div>
            }>
                {/* @ts-ignore - Async Server Component */}
                <OrdersDataWrapper locale={locale} />
            </Suspense>
        </div>
    );
}
