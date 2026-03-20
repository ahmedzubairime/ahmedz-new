import { getAccounts, getRoles } from "@/app/actions/admin";
import { getLocale } from "next-intl/server";
import { AccountsTable } from "./AccountsTable";

export default async function AccountsPage() {
    const locale = await getLocale();
    const [accounts, roles] = await Promise.all([getAccounts(), getRoles()]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {locale === "ar" ? "الحسابات" : "Accounts"}
                </h1>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {locale === "ar"
                        ? `إجمالي ${accounts.length} حساب مسجل`
                        : `${accounts.length} registered accounts`}
                </p>
            </div>
            <AccountsTable accounts={accounts} roles={roles} locale={locale} />
        </div>
    );
}
