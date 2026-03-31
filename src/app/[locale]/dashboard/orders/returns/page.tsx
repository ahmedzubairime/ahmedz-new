import { getLocale } from "next-intl/server";
import { getReturns } from "@/app/actions/store-orders";
import { ReturnsGrid } from "@/components/cms/ReturnsGrid";

export default async function ReturnsPage() {
    const [locale, returns] = await Promise.all([
        getLocale(),
        getReturns()
    ]);
    return <ReturnsGrid locale={locale} returns={returns} />;
}
