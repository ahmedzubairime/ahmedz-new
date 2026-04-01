import { getLocale } from "next-intl/server";
import { getContactInfo } from "@/app/actions/cms";
import { ContactInfoForm } from "@/components/cms/ContactInfoForm";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/ui/Skeletons";

async function InfoWrapper({ locale }: { locale: string }) {
    const initialData = await getContactInfo();
    return <ContactInfoForm locale={locale} initialData={initialData} />;
}

export default async function ContactInfoPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<FormSkeleton />}>
            {/* @ts-ignore */}
            <InfoWrapper locale={locale} />
        </Suspense>
    );
}
