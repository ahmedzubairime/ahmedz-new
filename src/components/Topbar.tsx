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

type NotificationType = "success" | "warning" | "info" | "error";

type MockNotification = {
    id: string;
    type: NotificationType;
    title: string;
    titleAr: string;
    message: string;
    messageAr: string;
    time: string;
    timeAr: string;
    read: boolean;
};

const MOCK_NOTIFICATIONS: MockNotification[] = [
    {
        id: "1",
        type: "success",
        title: "Order Confirmed",
        titleAr: "تم تأكيد الطلب",
        message: "Order #1042 has been successfully confirmed and is being processed.",
        messageAr: "تم تأكيد الطلب #1042 بنجاح وجاري معالجته.",
        time: "2 min ago",
        timeAr: "منذ دقيقتين",
        read: false,
    },
    {
        id: "2",
        type: "warning",
        title: "Low Stock Alert",
        titleAr: "تنبيه نقص المخزون",
        message: "Product 'Wireless Headset' is running low — only 3 units remaining.",
        messageAr: "المنتج 'سماعة لاسلكية' على وشك النفاد — 3 وحدات متبقية فقط.",
        time: "15 min ago",
        timeAr: "منذ 15 دقيقة",
        read: false,
    },
    {
        id: "3",
        type: "info",
        title: "New Team Member",
        titleAr: "عضو جديد في الفريق",
        message: "Sarah joined the Marketing team with Editor permissions.",
        messageAr: "انضمت سارة لفريق التسويق بصلاحيات محرر.",
        time: "1 hour ago",
        timeAr: "منذ ساعة",
        read: true,
    },
    {
        id: "4",
        type: "error",
        title: "Payment Failed",
        titleAr: "فشل الدفع",
        message: "Payment for invoice #INV-2024-089 was declined by the bank.",
        messageAr: "تم رفض الدفع للفاتورة #INV-2024-089 من قبل البنك.",
        time: "3 hours ago",
        timeAr: "منذ 3 ساعات",
        read: true,
    },
    {
        id: "5",
        type: "success",
        title: "Backup Complete",
        titleAr: "اكتمل النسخ الاحتياطي",
        message: "Daily database backup completed successfully (2.4 GB).",
        messageAr: "اكتمل النسخ الاحتياطي اليومي بنجاح (2.4 جيجابايت).",
        time: "5 hours ago",
        timeAr: "منذ 5 ساعات",
        read: true,
    },
];

const NOTIF_STYLE: Record<NotificationType, { icon: string; dotColor: string; bgColor: string }> = {
    success: { icon: "check", dotColor: "bg-emerald-500", bgColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    warning: { icon: "alert-triangle", dotColor: "bg-amber-500", bgColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
    info: { icon: "info", dotColor: "bg-sky-500", bgColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
    error: { icon: "alert-circle", dotColor: "bg-red-500", bgColor: "bg-red-500/10 text-red-600 dark:text-red-400" },
};

type Props = {
    account: UserAccount;
    sectionLabel: string;
    pathMap: Record<string, string>;
};

export function Topbar({ account, sectionLabel, pathMap }: Props) {
    const pathname = usePathname();
    const locale = useLocale();
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on click outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        }
        if (profileOpen || notifOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [profileOpen, notifOpen]);

    // Close on route change
    useEffect(() => {
        setProfileOpen(false);
        setNotifOpen(false);
    }, [pathname]);

    // Build breadcrumbs
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

    const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

    return (
        <header className="topbar-glass flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
            {/* Breadcrumbs (desktop) */}
            <nav className="hidden items-center gap-1 text-sm lg:flex" aria-label="Breadcrumb">
                <Link
                    href={breadcrumbs[0]?.path || "/"}
                    className="topbar-breadcrumb-root flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-semibold transition-colors"
                >
                    <SidebarIcon name="home" className="size-3.5 opacity-60" />
                    <span>{sectionLabel}</span>
                </Link>

                {breadcrumbs.length > 1 &&
                    breadcrumbs.slice(1).map((crumb) => (
                        <span key={crumb.path} className="flex items-center gap-1">
                            <SidebarIcon
                                name="chevron-down"
                                className="size-3 shrink-0 opacity-30 ltr:-rotate-90 rtl:rotate-90"
                            />
                            {crumb.isLast ? (
                                <span className="topbar-breadcrumb-active rounded-lg px-2.5 py-1.5 text-[13px] font-medium">
                                    {crumb.label}
                                </span>
                            ) : (
                                <Link
                                    href={crumb.path}
                                    className="topbar-breadcrumb-link rounded-lg px-2.5 py-1.5 text-[13px] transition-colors"
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
                        className="topbar-action-btn flex size-8 items-center justify-center rounded-xl transition-colors"
                        aria-label="Back"
                    >
                        <SidebarIcon name="chevron-down" className="size-4 ltr:rotate-90 rtl:-rotate-90" />
                    </Link>
                )}
                <span className="topbar-breadcrumb-active text-sm font-semibold">
                    {breadcrumbs.length > 0
                        ? breadcrumbs[breadcrumbs.length - 1].label
                        : sectionLabel}
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-0.5">
                <ThemeSwitcher />
                <LocaleSwitcher />

                {/* Notifications */}
                <div ref={notifRef} className="relative">
                    <button
                        onClick={() => { setNotifOpen((p) => !p); setProfileOpen(false); }}
                        className="topbar-action-btn relative flex size-9 cursor-pointer items-center justify-center rounded-xl transition-all"
                        aria-label={locale === "ar" ? "الإشعارات" : "Notifications"}
                        aria-expanded={notifOpen}
                    >
                        <SidebarIcon name="bell" className="size-[18px]" />
                        {unreadCount > 0 && (
                            <span className="absolute end-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-zinc-900">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {notifOpen && (
                        <div className="profile-dropdown absolute end-0 top-full z-50 mt-2 w-96 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xl dark:border-zinc-700/60 dark:bg-zinc-900">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                    {locale === "ar" ? "الإشعارات" : "Notifications"}
                                </h3>
                                {unreadCount > 0 && (
                                    <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-600 dark:text-red-400">
                                        {unreadCount} {locale === "ar" ? "جديد" : "new"}
                                    </span>
                                )}
                            </div>

                            {/* Notification items */}
                            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                {MOCK_NOTIFICATIONS.map((notif) => {
                                    const style = NOTIF_STYLE[notif.type];
                                    return (
                                        <div
                                            key={notif.id}
                                            className={`flex gap-3 border-b border-zinc-50 px-4 py-3 transition-colors last:border-b-0 hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/40 ${!notif.read ? "bg-[var(--brand-primary-50)]/30 dark:bg-sky-950/20" : ""}`}
                                        >
                                            {/* Icon */}
                                            <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${style.bgColor}`}>
                                                <SidebarIcon name={style.icon} className="size-4" />
                                            </div>

                                            {/* Content */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={`text-[13px] font-medium ${!notif.read ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-700 dark:text-zinc-300"}`}>
                                                        {locale === "ar" ? notif.titleAr : notif.title}
                                                    </p>
                                                    {!notif.read && (
                                                        <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${style.dotColor}`} />
                                                    )}
                                                </div>
                                                <p className="mt-0.5 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                                                    {locale === "ar" ? notif.messageAr : notif.message}
                                                </p>
                                                <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                                                    {locale === "ar" ? notif.timeAr : notif.time}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Footer */}
                            <div className="border-t border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
                                <button className="w-full cursor-pointer rounded-lg py-1.5 text-center text-[13px] font-medium text-[var(--brand-primary)] transition-colors hover:bg-[var(--brand-primary-50)] dark:hover:bg-sky-950/30">
                                    {locale === "ar" ? "عرض جميع الإشعارات" : "View all notifications"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="mx-2 h-6 w-px bg-zinc-200/80 dark:bg-zinc-700/40" />

                {/* Profile dropdown */}
                <div ref={profileRef} className="relative">
                    <button
                        onClick={() => { setProfileOpen((p) => !p); setNotifOpen(false); }}
                        className="topbar-avatar relative flex size-9 cursor-pointer items-center justify-center rounded-full text-xs font-bold text-white transition-transform hover:scale-105 active:scale-95"
                        aria-label={locale === "ar" ? "قائمة الحساب" : "Account menu"}
                        aria-expanded={profileOpen}
                    >
                        {initials}
                    </button>

                    {profileOpen && (
                        <div className="profile-dropdown absolute end-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xl dark:border-zinc-700/60 dark:bg-zinc-900">
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
