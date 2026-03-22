import { getLocale } from "next-intl/server";
import { getSocialLinks } from "@/app/actions/external-lists";
import { SocialGrid } from "@/components/cms/SocialGrid";

export default async function SocialPage() {
    const locale = await getLocale();
    const data = await getSocialLinks();

    return <SocialGrid locale={locale} links={data} />;
}
