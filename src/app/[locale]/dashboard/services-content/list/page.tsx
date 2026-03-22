import { getLocale } from "next-intl/server";
import { getServices, getCategories } from "@/app/actions/services-lists";
import { ServicesGrid } from "@/components/cms/ServicesGrid";

export default async function ServicesListPage() {
    const locale = await getLocale();

    // We execute these concurrently using Promise.all to prevent waterfalls
    const [servicesData, categoriesData] = await Promise.all([
        getServices(),
        getCategories()
    ]);

    return (
        <ServicesGrid
            locale={locale}
            services={servicesData}
            categories={categoriesData}
        />
    );
}
