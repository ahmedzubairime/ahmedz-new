import { redirect } from "next/navigation";
import { getUserSidebar, getUserAccount, buildPathMap } from "@/lib/permissions";
import { DynamicSidebar } from "@/components/DynamicSidebar";
import { Topbar } from "@/components/Topbar";
import { getLocale } from "next-intl/server";

export default async function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();
    const account = await getUserAccount();

    if (!account) {
        redirect(`/${locale}/setup-account`);
    }

    if (account.status === "pending_setup") {
        redirect(`/${locale}/setup-account`);
    }

    const section = await getUserSidebar("pms");

    if (!section) {
        redirect(`/${locale}/not-authorized`);
    }

    const sectionLabel = locale === "ar" ? section.name_ar : section.name_en;
    const pathMap = buildPathMap(section, locale);

    return (
        <div className="flex h-screen overflow-hidden bg-zinc-100 dark:bg-zinc-950">
            <DynamicSidebar
                section={section}
                account={account}
                sectionLabel={sectionLabel}
                sectionIcon={section.icon || "folder-kanban"}
            />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar account={account} sectionLabel={sectionLabel} pathMap={pathMap} />
                <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">{children}</main>
            </div>
        </div>
    );
}

