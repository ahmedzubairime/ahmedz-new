import { getLocale } from "next-intl/server";
import { getUserAccount, getUserPagePermissions } from "@/lib/permissions";
import { getTeams } from "@/app/actions/pms-teams";
import { getAllAccounts } from "@/app/actions/pms-tasks";
import { TeamsGrid } from "@/components/pms/TeamsGrid";

export default async function TeamsPage() {
    const locale = await getLocale();
    const account = await getUserAccount();
    const perms = await getUserPagePermissions("pms.teams");

    if (!perms.can_read) {
        return (
            <div className="flex h-[50vh] items-center justify-center p-8 text-center text-zinc-500">
                {locale === 'ar' ? "ليس لديك صلاحية لعرض هذه الصفحة." : "You do not have permission to view this page."}
            </div>
        );
    }

    const [teams, accounts] = await Promise.all([
        getTeams(),
        getAllAccounts(),
    ]);

    return (
        <TeamsGrid
            locale={locale}
            teams={teams}
            accounts={accounts}
            perms={perms}
            currentAccountId={account?.id || ""}
        />
    );
}
