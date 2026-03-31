import { getLocale } from "next-intl/server";
import { getCoupons } from "@/app/actions/store-marketing";
import { CouponsGrid } from "@/components/cms/CouponsGrid";

export default async function CouponsPage() {
    const [locale, coupons] = await Promise.all([
        getLocale(),
        getCoupons()
    ]);
    return <CouponsGrid locale={locale} coupons={coupons} />;
}
