"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { SidebarIcon } from "@/components/SidebarIcon";
import type { UserAccount } from "@/lib/permissions";

type Props = {
    account: UserAccount;
    sectionLabel: string;
};

export function Topbar({ account, sectionLabel }: Props) {
    const pathname = usePathname();
    const locale = useLocale();

    // Build breadcrumbs from pathname
    const segments = pathname
        .replace(`/${locale}`, "")
        .split("/")
        .filter(Boolean);

    const breadcrumbs = segments.map((seg, i) => ({
        label: seg
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()),
        isLast: i === segments.length - 1,
    }));

    return (
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-900">
            {/* Breadcrumbs (desktop) / Section label (mobile) */}
            <div className="flex items-center gap-1.5 text-sm">
                <span className="hidden font-semibold text-zinc-900 lg:inline dark:text-zinc-100">
                    {sectionLabel}
                </span>
                {breadcrumbs.length > 1 && (
                    <>
                        <span className="hidden text-zinc-300 lg:inline dark:text-zinc-600">/</span>
                        {breadcrumbs.slice(1).map((crumb, i) => (
                            <span key={i} className="hidden items-center gap-1.5 lg:flex">
                                {i > 0 && <span className="text-zinc-300 dark:text-zinc-600">/</span>}
                                <span
                                    className={
                                        crumb.isLast
                                            ? "font-medium text-zinc-900 dark:text-zinc-100"
                                            : "text-zinc-400 dark:text-zinc-500"
                                    }
                                >
                                    {crumb.label}
                                </span>
                            </span>
                        ))}
                    </>
                )}
                {/* Mobile: just show last segment */}
                <span className="font-semibold text-zinc-900 lg:hidden dark:text-zinc-100">
                    {breadcrumbs.length > 0
                        ? breadcrumbs[breadcrumbs.length - 1].label
                        : sectionLabel}
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
                <ThemeSwitcher />
                <LocaleSwitcher />

                {/* User avatar */}
                <div className="ms-1.5 flex size-8 items-center justify-center rounded-full bg-[var(--brand-primary)] text-xs font-bold text-white">
                    {account.full_name.charAt(0).toUpperCase()}
                </div>
            </div>
        </header>
    );
}
