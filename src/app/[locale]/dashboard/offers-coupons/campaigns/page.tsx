import { getLocale } from "next-intl/server";
import { getCampaigns } from "@/app/actions/store-marketing";
import { CampaignsGrid } from "@/components/cms/CampaignsGrid";

export default async function CampaignsPage() {
    const [locale, campaigns] = await Promise.all([
        getLocale(),
        getCampaigns()
    ]);
    return <CampaignsGrid locale={locale} campaigns={campaigns} />;
}
