import { getLocale } from "next-intl/server";
import { getHomepageHero } from "@/app/actions/cms";
import { HeroForm } from "@/components/cms/HeroForm";

export default async function HeroPage() {
    const locale = await getLocale();

    // Fetch directly from the strict single-row table
    const initialData = await getHomepageHero();

    return (
        <HeroForm locale={locale} initialData={initialData} />
    );
}
