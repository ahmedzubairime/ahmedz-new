"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { SidebarIcon } from "@/components/SidebarIcon";
import type { SidebarSection, PagePermission } from "@/lib/permissions";

type Props = {
    section: SidebarSection;
    sectionLabel: string;
    sectionIcon: string;
};

export function DynamicSidebar({ section, sectionLabel, sectionIcon }: Props) {
    const pathname = usePathname();
    const locale = useLocale();
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({});
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Persist collapsed state
    useEffect(() => {
        const stored = localStorage.getItem("sidebar-collapsed");
        if (stored === "true") setIsCollapsed(true);
    }, []);

    function toggleSidebar() {
        const next = !isCollapsed;
        setIsCollapsed(next);
        localStorage.setItem("sidebar-collapsed", String(next));
    }

    function toggleGroup(groupId: string) {
        setCollapsed((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
    }

    function togglePage(pageId: string) {
        setExpandedPages((prev) => ({ ...prev, [pageId]: !prev[pageId] }));
    }

    function isActive(pagePath: string): boolean {
        return pathname === `/${locale}${pagePath}`;
    }

    function isParentActive(page: PagePermission): boolean {
        if (isActive(page.page_path)) return true;
        return page.children.some((child) => pathname === `/${locale}${child.page_path}`);
    }

    function renderPage(page: PagePermission, depth: number = 0) {
        const hasChildren = page.children.length > 0;
        const active = isActive(page.page_path);
        const parentActive = hasChildren && isParentActive(page);
        const isExpanded = expandedPages[page.page_id] ?? parentActive;

        if (isCollapsed && depth === 0) {
            return (
                <Link
                    key={page.page_id}
                    href={page.page_path}
                    title={locale === "ar" ? page.page_name_ar : page.page_name_en}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-center rounded-lg py-2.5 transition-all duration-150 ${active || parentActive
                            ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active)]"
                            : "text-[var(--sidebar-text-muted)] hover:bg-[var(--sidebar-active-bg)] hover:text-[var(--sidebar-text)]"
                        }`}
                >
                    <SidebarIcon name={page.page_icon || "file-text"} className="size-[18px]" />
                </Link>
            );
        }

        return (
            <div key={page.page_id}>
                <div className="flex items-center">
                    {hasChildren ? (
                        <div className="flex w-full items-center">
                            <Link
                                href={page.page_path}
                                onClick={() => setMobileOpen(false)}
                                className={`flex flex-1 items-center gap-2.5 rounded-lg py-2 text-[13px] font-medium transition-all duration-150 ${depth > 0 ? "ps-9" : "ps-3"
                                    } pe-1 ${active
                                        ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active)]"
                                        : "text-[var(--sidebar-text-muted)] hover:bg-[var(--sidebar-active-bg)] hover:text-[var(--sidebar-text)]"
                                    }`}
                            >
                                <SidebarIcon
                                    name={page.page_icon || "file-text"}
                                    className={`size-4 shrink-0 ${active ? "text-[var(--sidebar-active)]" : ""}`}
                                />
                                <span className="truncate">
                                    {locale === "ar" ? page.page_name_ar : page.page_name_en}
                                </span>
                            </Link>
                            <button
                                onClick={() => togglePage(page.page_id)}
                                className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded text-[var(--sidebar-text-muted)] hover:text-[var(--sidebar-text)]"
                            >
                                <SidebarIcon
                                    name="chevron-down"
                                    className={`size-3 transition-transform duration-200 ${isExpanded ? "" : "ltr:-rotate-90 rtl:rotate-90"}`}
                                />
                            </button>
                        </div>
                    ) : (
                        <Link
                            href={page.page_path}
                            onClick={() => setMobileOpen(false)}
                            className={`flex w-full items-center gap-2.5 rounded-lg py-2 text-[13px] font-medium transition-all duration-150 ${depth > 0 ? "ps-9" : "ps-3"
                                } pe-3 ${active
                                    ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active)]"
                                    : "text-[var(--sidebar-text-muted)] hover:bg-[var(--sidebar-active-bg)] hover:text-[var(--sidebar-text)]"
                                }`}
                        >
                            <SidebarIcon
                                name={page.page_icon || "file-text"}
                                className={`size-4 shrink-0 ${active ? "text-[var(--sidebar-active)]" : ""}`}
                            />
                            <span className="truncate">
                                {locale === "ar" ? page.page_name_ar : page.page_name_en}
                            </span>
                        </Link>
                    )}
                </div>

                {hasChildren && isExpanded && !isCollapsed && (
                    <div className="ms-5 border-s border-[var(--sidebar-border)]">
                        {page.children.map((child) => renderPage(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    }

    const sidebarContent = (
        <div className="flex h-full flex-col bg-[var(--sidebar-bg)]">
            {/* Header */}
            <div className="flex h-16 shrink-0 items-center border-b border-[var(--sidebar-border)] px-4">
                {!isCollapsed ? (
                    <Link href={section.path} className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-white/10">
                            <SidebarIcon name={sectionIcon} className="size-4 text-white" />
                        </div>
                        <span className="text-[15px] font-bold tracking-tight text-white">{sectionLabel}</span>
                    </Link>
                ) : (
                    <Link href={section.path} className="mx-auto flex size-8 items-center justify-center rounded-lg bg-white/10">
                        <SidebarIcon name={sectionIcon} className="size-4 text-white" />
                    </Link>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto custom-scrollbar p-2.5">
                <div className="space-y-1">
                    {section.groups.map((group, groupIndex) => {
                        const isGroupCollapsed = collapsed[group.id] ?? false;
                        const pageCount = group.pages.length;

                        if (isCollapsed) {
                            return (
                                <div key={group.id}>
                                    {groupIndex > 0 && <div className="sidebar-group-separator" />}
                                    {group.icon && (
                                        <div
                                            title={locale === "ar" ? group.name_ar : group.name_en}
                                            className="mx-auto my-1.5 flex size-8 items-center justify-center rounded-lg bg-[var(--sidebar-group-bg)] text-[var(--sidebar-text-muted)] transition-colors hover:bg-[var(--sidebar-group-bg-hover)] hover:text-[var(--sidebar-text)]"
                                        >
                                            <SidebarIcon name={group.icon} className="size-3.5" />
                                        </div>
                                    )}
                                    <div className="space-y-0.5">
                                        {group.pages.map((page) => renderPage(page))}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={group.id}>
                                {groupIndex > 0 && <div className="sidebar-group-separator" />}
                                <button
                                    onClick={() => toggleGroup(group.id)}
                                    className="sidebar-group-header flex w-full cursor-pointer items-center gap-2 rounded-lg bg-[var(--sidebar-group-bg)] px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--sidebar-text-muted)] transition-all duration-200 hover:bg-[var(--sidebar-group-bg-hover)] hover:text-[var(--sidebar-text)]"
                                >
                                    <span className="sidebar-group-dot" />
                                    {group.icon && <SidebarIcon name={group.icon} className="size-3.5" />}
                                    <span className="flex-1 truncate text-start">
                                        {locale === "ar" ? group.name_ar : group.name_en}
                                    </span>
                                    <span className="sidebar-group-badge">{pageCount}</span>
                                    <SidebarIcon
                                        name="chevron-down"
                                        className={`size-3 transition-transform duration-200 ${isGroupCollapsed ? "ltr:-rotate-90 rtl:rotate-90" : ""}`}
                                    />
                                </button>
                                <div
                                    className="sidebar-group-body"
                                    data-collapsed={isGroupCollapsed}
                                >
                                    <div>
                                        <div className="mt-0.5 space-y-0.5">
                                            {group.pages.map((page) => renderPage(page))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </nav>

            {/* Collapse toggle */}
            <div className="hidden shrink-0 border-t border-[var(--sidebar-border)] p-2.5 lg:block">
                <button
                    onClick={toggleSidebar}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg py-2 text-[13px] text-[var(--sidebar-text-muted)] transition-colors hover:bg-[var(--sidebar-active-bg)] hover:text-[var(--sidebar-text)]"
                >
                    <SidebarIcon
                        name="chevron-down"
                        className={`size-4 transition-transform duration-200 ${isCollapsed ? "ltr:-rotate-90 rtl:rotate-90" : "ltr:rotate-90 rtl:-rotate-90"}`}
                    />
                    {!isCollapsed && <span>{locale === "ar" ? "طي القائمة" : "Collapse"}</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className="sidebar-transition hidden shrink-0 lg:block"
                style={{ width: isCollapsed ? "var(--sidebar-collapsed-width)" : "var(--sidebar-width)" }}
            >
                {sidebarContent}
            </aside>

            {/* Mobile Toggle */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed bottom-4 start-4 z-40 flex size-12 items-center justify-center rounded-full bg-[var(--sidebar-bg)] text-white shadow-lg transition-transform hover:scale-105 lg:hidden"
                aria-label="Open menu"
            >
                <SidebarIcon name="menu" className="size-5" />
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
                    <aside className="fixed inset-y-0 start-0 z-50 w-72 shadow-2xl lg:hidden">
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="absolute end-3 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
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
