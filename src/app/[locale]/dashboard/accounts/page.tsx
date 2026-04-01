import { getAccounts, getRoles } from "@/app/actions/admin";
import { getLocale } from "next-intl/server";
import { AccountsTable } from "./AccountsTable";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function AccountsWrapper({ locale }: { locale: string }) {
    const [accounts, roles] = await Promise.all([getAccounts(), getRoles()]);
    return (
        <div className="space-y-4">
            <p className="text-sm text-zinc-500 font-medium">
                {locale === "ar"
                    ? `إجمالي ${accounts.length} حساب مسجل`
                    : `${accounts.length} registered accounts`}
            </p>
            <AccountsTable accounts={accounts} roles={roles} locale={locale} />
        </div>
    );
}

export default async function AccountsPage() {
    const locale = await getLocale();

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {locale === "ar" ? "الحسابات" : "Accounts"}
                </h1>
            </div>            
            <Suspense fallback={<TableSkeleton rowCount={5} />}>
                {/* @ts-ignore - Async Server Component */}
                <AccountsWrapper locale={locale} />
            </Suspense>
        </div>
    );
}
