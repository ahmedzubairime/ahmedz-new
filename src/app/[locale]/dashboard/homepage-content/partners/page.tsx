import { getLocale } from "next-intl/server";
import { getPartners } from "@/app/actions/homepage-lists";
import { PartnersGrid } from "@/components/cms/PartnersGrid";

export default async function PartnersPage() {
    const locale = await getLocale();
    const data = await getPartners();

    return <PartnersGrid locale={locale} partners={data} />;
}
