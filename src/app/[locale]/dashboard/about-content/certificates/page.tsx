import { getLocale } from "next-intl/server";
import { getAboutCertificates } from "@/app/actions/about";
import { AboutCertificatesGrid } from "@/components/cms/about/AboutCertificatesGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function CertificatesDataWrapper({ locale }: { locale: string }) {
    const data = await getAboutCertificates();
    return <AboutCertificatesGrid locale={locale} certificates={data} />;
}

export default async function CertificatesPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={5} />}>
            {/* @ts-ignore */}
            <CertificatesDataWrapper locale={locale} />
        </Suspense>
    );
}
