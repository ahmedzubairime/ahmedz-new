import { getLocale } from "next-intl/server";

export default async function ContactSettingsPage() {
    const locale = await getLocale();
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {locale === "ar" ? "إعدادات التواصل" : "Contact Settings"}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
                {locale === "ar" ? "إدارة معلومات التواصل والروابط الاجتماعية" : "Manage contact info and social links"}
            </p>
        </div>
    );
}
