import { getLocale } from "next-intl/server";
import { getContactInfo } from "@/app/actions/cms";
import ContactClient from "./ContactClient";

export const metadata = {
    title: "Contact",
};

export default async function ContactPage() {
    const locale = await getLocale();
    const isAr = locale === "ar";
    const info = await getContactInfo();

    return <ContactClient isAr={isAr} info={info} />;
}
