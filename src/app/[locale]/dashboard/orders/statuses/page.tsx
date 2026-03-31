import { getLocale } from "next-intl/server";
import { getOrderStatuses } from "@/app/actions/store-orders";
import { OrderStatusesGrid } from "@/components/cms/OrderStatusesGrid";

export default async function OrderStatusesPage() {
    const [locale, statuses] = await Promise.all([
        getLocale(),
        getOrderStatuses()
    ]);
    return <OrderStatusesGrid locale={locale} statuses={statuses} />;
}
