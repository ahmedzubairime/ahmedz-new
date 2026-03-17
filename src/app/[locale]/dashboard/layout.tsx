import { redirect } from "next/navigation";
import { getUserSidebar, getUserAccount } from "@/lib/permissions";
import { DynamicSidebar } from "@/components/DynamicSidebar";
import { Topbar } from "@/components/Topbar";
import { getLocale } from "next-intl/server";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();
    const account = await getUserAccount();

    if (!account) {
        // User is authenticated (middleware passed them through) but has no account record.
        // Redirect to setup-account, NOT login — redirecting to login would cause
        // an infinite loop because middleware redirects authenticated users back here.
        redirect(`/${locale}/setup-account`);
    }

    if (account.status === "pending_setup") {
        redirect(`/${locale}/setup-account`);
    }

    const section = await getUserSidebar("dashboard");

    if (!section) {
        redirect(`/${locale}/not-authorized`);
    }

    const sectionLabel = locale === "ar" ? section.name_ar : section.name_en;

    return (
        <div className="flex min-h-screen bg-zinc-100 dark:bg-zinc-950">
            <DynamicSidebar
                section={section}
                account={account}
                sectionLabel={sectionLabel}
                sectionIcon={section.icon || "layout-dashboard"}
            />
            <div className="flex flex-1 flex-col">
                <Topbar account={account} sectionLabel={sectionLabel} />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
