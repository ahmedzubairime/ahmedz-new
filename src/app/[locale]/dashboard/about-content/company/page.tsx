import { getLocale } from "next-intl/server";
import { getAboutHero, getAboutCompany } from "@/app/actions/about";
import { AboutCompanyForm } from "@/components/cms/about/AboutCompanyForm";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/ui/Skeletons";

async function CompanyDataWrapper({ locale }: { locale: string }) {
    const [hero, company] = await Promise.all([getAboutHero(), getAboutCompany()]);
    return <AboutCompanyForm locale={locale} heroData={hero} companyData={company} />;
}

export default async function CompanyInfoPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<FormSkeleton />}>
            {/* @ts-ignore */}
            <CompanyDataWrapper locale={locale} />
        </Suspense>
    );
}
