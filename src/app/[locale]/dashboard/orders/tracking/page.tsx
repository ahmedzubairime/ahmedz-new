import { getLocale } from "next-intl/server";
import { getOrders } from "@/app/actions/store-orders";
import { getOrderStatuses } from "@/app/actions/store-orders";
import { OrderTrackingGrid } from "@/components/cms/OrderTrackingGrid";

export default async function TrackingPage() {
    const [locale, orders, statuses] = await Promise.all([
        getLocale(),
        getOrders(),
        getOrderStatuses()
    ]);
    return <OrderTrackingGrid locale={locale} orders={orders} statuses={statuses} />;
}
