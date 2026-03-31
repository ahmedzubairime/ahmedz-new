import { getLocale } from "next-intl/server";
import { getUserAccount, getUserPagePermissions } from "@/lib/permissions";
import { getAllAccounts } from "@/app/actions/pms-tasks";
import { MembersGrid } from "@/components/pms/MembersGrid";

export default async function MembersPage() {
    const locale = await getLocale();
    const account = await getUserAccount();
    if (!account) return null;

    const perms = await getUserPagePermissions("pms.members");
    const accounts = await getAllAccounts();

    return (
        <MembersGrid
            locale={locale}
            accounts={accounts}
            perms={perms}
            currentAccountId={account.id}
        />
    );
}
