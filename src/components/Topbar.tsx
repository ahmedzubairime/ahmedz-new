"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { SidebarIcon } from "@/components/SidebarIcon";
import type { UserAccount } from "@/lib/permissions";

type Props = {
    account: UserAccount;
    sectionLabel: string;
    pathMap: Record<string, string>;
};

export function Topbar({ account, sectionLabel, pathMap }: Props) {
    const pathname = usePathname();
    const locale = useLocale();

    // Build breadcrumbs from pathname using the pathMap for proper translation
    const rawPath = pathname.replace(`/${locale}`, "") || "/";
    const segments = rawPath.split("/").filter(Boolean);

    // Build progressive paths: ["dashboard"] → ["/dashboard"]
    // ["dashboard", "products", "attributes"] → ["/dashboard", "/dashboard/products", "/dashboard/products/attributes"]
    const breadcrumbs = segments.map((seg, i) => {
        const progressivePath = "/" + segments.slice(0, i + 1).join("/");
        const translatedLabel = pathMap[progressivePath];
        const fallbackLabel = seg
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

        return {
            label: translatedLabel || fallbackLabel,
            path: progressivePath,
            isFirst: i === 0,
            isLast: i === segments.length - 1,
        };
    });

    return (
        <header className="topbar-glass flex h-14 shrink-0 items-center justify-between px-4 sm:px-6">
            {/* Breadcrumbs (desktop) */}
            <nav className="hidden items-center gap-1 text-sm lg:flex" aria-label="Breadcrumb">
                <Link
                    href={breadcrumbs[0]?.path || "/"}
                    className="flex items-center gap-1.5 rounded-md px-2 py-1 font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800/60"
                >
                    <SidebarIcon name="home" className="size-3.5 text-zinc-400 dark:text-zinc-500" />
                    <span>{sectionLabel}</span>
                </Link>

                {breadcrumbs.length > 1 &&
                    breadcrumbs.slice(1).map((crumb) => (
                        <span key={crumb.path} className="flex items-center gap-1">
                            <SidebarIcon
                                name="chevron-down"
                                className="size-3 shrink-0 text-zinc-300 ltr:-rotate-90 rtl:rotate-90 dark:text-zinc-600"
                            />
                            {crumb.isLast ? (
                                <span className="rounded-md px-2 py-1 font-medium text-zinc-900 dark:text-zinc-100">
                                    {crumb.label}
                                </span>
                            ) : (
                                <Link
                                    href={crumb.path}
                                    className="rounded-md px-2 py-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-300"
                                >
                                    {crumb.label}
                                </Link>
                            )}
                        </span>
                    ))}
            </nav>

            {/* Mobile: show last segment with back icon */}
            <div className="flex items-center gap-2 lg:hidden">
                {breadcrumbs.length > 1 && (
                    <Link
                        href={breadcrumbs[breadcrumbs.length - 2]?.path || "/"}
                        className="flex size-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                        aria-label="Back"
                    >
                        <SidebarIcon name="chevron-down" className="size-4 ltr:rotate-90 rtl:-rotate-90" />
                    </Link>
                )}
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {breadcrumbs.length > 0
                        ? breadcrumbs[breadcrumbs.length - 1].label
                        : sectionLabel}
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
                <ThemeSwitcher />
                <LocaleSwitcher />

                {/* Divider */}
                <div className="mx-1.5 h-6 w-px bg-zinc-200 dark:bg-zinc-700/60" />

                {/* User avatar */}
                <div className="topbar-avatar relative flex size-8 items-center justify-center rounded-full text-xs font-bold text-white">
                    {account.full_name.charAt(0).toUpperCase()}
                </div>
            </div>
        </header>
    );
}
