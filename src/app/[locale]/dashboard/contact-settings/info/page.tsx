import { getLocale } from "next-intl/server";
import { getContactInfo } from "@/app/actions/cms";
import { ContactInfoForm } from "@/components/cms/ContactInfoForm";

export default async function ContactInfoPage() {
    const locale = await getLocale();

    // Fetch directly from the strict single-row table
    const initialData = await getContactInfo();

    return (
        <ContactInfoForm locale={locale} initialData={initialData} />
    );
}
