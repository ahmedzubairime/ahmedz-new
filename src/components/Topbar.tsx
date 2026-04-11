"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { SidebarIcon } from "@/components/SidebarIcon";
import { signOut } from "@/app/actions/auth";
import type { UserAccount } from "@/lib/permissions";

type Props = {
    account: UserAccount;
    sectionLabel: string;
    pathMap: Record<string, string>;
};

export function Topbar({ account, sectionLabel, pathMap }: Props) {
    const pathname = usePathname();
    const locale = useLocale();
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        }
        if (profileOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [profileOpen]);

    // Close on route change
    useEffect(() => {
        setProfileOpen(false);
    }, [pathname]);

    // Build breadcrumbs from pathname using the pathMap for proper translation
    const rawPath = pathname.replace(`/${locale}`, "") || "/";
    const segments = rawPath.split("/").filter(Boolean);

    const breadcrumbs = segments.map((seg, i) => {
        const progressivePath = "/" + segments.slice(0, i + 1).join("/");
        const translatedLabel = i === 0 ? sectionLabel : pathMap[progressivePath];
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

    const initials = account.full_name
        .split(" ")
        .slice(0, 2)
        .map((w) => w.charAt(0).toUpperCase())
        .join("");

    const greeting = locale === "ar"
        ? `مرحباً، ${account.full_name}!`
        : `Hi, ${account.full_name}!`;

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

                {/* Profile dropdown */}
                <div ref={profileRef} className="relative">
                    <button
                        onClick={() => setProfileOpen((prev) => !prev)}
                        className="topbar-avatar relative flex size-9 cursor-pointer items-center justify-center rounded-full text-xs font-bold text-white transition-transform hover:scale-105 active:scale-95"
                        aria-label={locale === "ar" ? "قائمة الحساب" : "Account menu"}
                        aria-expanded={profileOpen}
                    >
                        {initials}
                    </button>

                    {/* Dropdown panel */}
                    {profileOpen && (
                        <div className="profile-dropdown absolute end-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700/60 dark:bg-zinc-900">
                            {/* Close button */}
                            <button
                                onClick={() => setProfileOpen(false)}
                                className="absolute end-3 top-3 z-10 flex size-7 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                                aria-label={locale === "ar" ? "إغلاق" : "Close"}
                            >
                                <SidebarIcon name="x" className="size-3.5" />
                            </button>

                            {/* Roles badge */}
                            <div className="px-6 pt-5 pb-1 text-center">
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {account.roles.join(" · ")}
                                </p>
                            </div>

                            {/* Avatar */}
                            <div className="flex flex-col items-center pb-4">
                                <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-xl font-bold text-white shadow-lg">
                                    {initials}
                                </div>
                                <h3 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                                    {greeting}
                                </h3>
                            </div>

                            {/* Divider */}
                            <div className="mx-4 h-px bg-zinc-100 dark:bg-zinc-800" />

                            {/* Actions */}
                            <div className="flex items-center gap-2 p-3">
                                <form action={signOut} className="flex-1">
                                    <button
                                        type="submit"
                                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-[13px] font-medium text-red-600 transition-all hover:border-red-200 hover:bg-red-50 dark:border-zinc-700 dark:text-red-400 dark:hover:border-red-900/40 dark:hover:bg-red-950/30"
                                    >
                                        <SidebarIcon name="log-out" className="size-4" />
                                        <span>{locale === "ar" ? "تسجيل الخروج" : "Sign out"}</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
