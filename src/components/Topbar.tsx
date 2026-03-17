import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import type { UserAccount } from "@/lib/permissions";

type Props = {
    account: UserAccount;
    sectionLabel: string;
};

export function Topbar({ account, sectionLabel }: Props) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="lg:hidden">
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{sectionLabel}</span>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
                <ThemeSwitcher />
                <LocaleSwitcher />
                <div className="ms-2 flex size-8 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                    {account.full_name.charAt(0).toUpperCase()}
                </div>
            </div>
        </header>
    );
}
