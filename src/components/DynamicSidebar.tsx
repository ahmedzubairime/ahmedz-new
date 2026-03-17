"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { SidebarIcon } from "@/components/SidebarIcon";
import { signOut } from "@/app/actions/auth";
import type { SidebarSection, UserAccount } from "@/lib/permissions";

type Props = {
    section: SidebarSection;
    account: UserAccount;
    sectionLabel: string;
    sectionIcon: string;
};

export function DynamicSidebar({ section, account, sectionLabel, sectionIcon }: Props) {
    const pathname = usePathname();
    const locale = useLocale();
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const [mobileOpen, setMobileOpen] = useState(false);

    function toggleGroup(groupId: string) {
        setCollapsed((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
    }

    function isActive(pagePath: string): boolean {
        const localePath = `/${locale}${pagePath}`;
        return pathname === localePath || pathname.startsWith(localePath + "/");
    }

    const sidebarContent = (
        <>
            {/* Logo / Section Header */}
            <div className="flex h-16 shrink-0 items-center border-b border-zinc-200 px-5 dark:border-zinc-800">
                <Link href={section.path} className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    <SidebarIcon name={sectionIcon} className="size-5" />
                    <span>{sectionLabel}</span>
                </Link>
            </div>

            {/* Navigation Groups */}
            <nav className="flex-1 overflow-y-auto p-3">
                <div className="space-y-1">
                    {section.groups.map((group) => {
                        const isGroupCollapsed = collapsed[group.id] ?? false;
                        const hasActivePage = group.pages.some((p) => isActive(p.page_path));

                        return (
                            <div key={group.id}>
                                {/* Group Header (collapsible) */}
                                <button
                                    onClick={() => toggleGroup(group.id)}
                                    className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                                >
                                    <div className="flex items-center gap-2">
                                        {group.icon && <SidebarIcon name={group.icon} className="size-3.5" />}
                                        <span>{locale === "ar" ? group.name_ar : group.name_en}</span>
                                    </div>
                                    <SidebarIcon
                                        name="chevron-down"
                                        className={`size-3.5 transition-transform duration-200 ${isGroupCollapsed ? "ltr:-rotate-90 rtl:rotate-90" : ""}`}
                                    />
                                </button>

                                {/* Group Pages */}
                                {!isGroupCollapsed && (
                                    <div className="mt-0.5 space-y-0.5">
                                        {group.pages.map((page) => {
                                            const active = isActive(page.page_path);
                                            return (
                                                <Link
                                                    key={page.page_id}
                                                    href={page.page_path}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active
                                                            ? "bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400"
                                                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                                                        }`}
                                                >
                                                    {page.page_icon && (
                                                        <SidebarIcon
                                                            name={page.page_icon}
                                                            className={`size-4 ${active ? "text-sky-600 dark:text-sky-400" : ""}`}
                                                        />
                                                    )}
                                                    <span>{locale === "ar" ? page.page_name_ar : page.page_name_en}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </nav>

            {/* User Profile + Sign Out */}
            <div className="shrink-0 border-t border-zinc-200 p-3 dark:border-zinc-800">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                        {account.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 truncate">
                        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {account.full_name}
                        </p>
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                            {account.roles.join(", ")}
                        </p>
                    </div>
                </div>
                <form action={signOut}>
                    <button
                        type="submit"
                        className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
                    >
                        <SidebarIcon name="log-out" className="size-4" />
                        <span>{locale === "ar" ? "تسجيل الخروج" : "Sign Out"}</span>
                    </button>
                </form>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 shrink-0 flex-col border-e border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:flex">
                {sidebarContent}
            </aside>

            {/* Mobile Toggle Button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed bottom-4 start-4 z-40 flex size-12 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg transition-transform hover:scale-105 lg:hidden dark:bg-sky-500"
                aria-label="Open menu"
            >
                <SidebarIcon name="menu" className="size-5" />
            </button>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside className="fixed inset-y-0 start-0 z-50 flex w-72 flex-col bg-white shadow-2xl dark:bg-zinc-900 lg:hidden">
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="absolute end-3 top-4 flex size-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            aria-label="Close menu"
                        >
                            <SidebarIcon name="x" className="size-4" />
                        </button>
                        {sidebarContent}
                    </aside>
                </>
            )}
        </>
    );
}
