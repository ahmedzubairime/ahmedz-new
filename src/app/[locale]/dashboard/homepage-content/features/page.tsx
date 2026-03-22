import { getLocale } from "next-intl/server";
import { getFeatures } from "@/app/actions/homepage-lists";
import { FeaturesGrid } from "@/components/cms/FeaturesGrid";

export default async function FeaturesPage() {
    const locale = await getLocale();
    const data = await getFeatures();

    return <FeaturesGrid locale={locale} features={data} />;
}
