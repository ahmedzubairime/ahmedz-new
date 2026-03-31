import { getLocale } from "next-intl/server";
import { getOrders } from "@/app/actions/store-orders";
import { getOrderStatuses } from "@/app/actions/store-orders";
import { OrdersListGrid } from "@/components/cms/OrdersListGrid";

export default async function OrdersPage() {
    const [locale, orders, statuses] = await Promise.all([
        getLocale(),
        getOrders(),
        getOrderStatuses()
    ]);
    return <OrdersListGrid locale={locale} orders={orders} statuses={statuses} />;
}
