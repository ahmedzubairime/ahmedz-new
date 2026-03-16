import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-zinc-100 dark:bg-zinc-950">
            <DashboardSidebar />
            <div className="flex flex-1 flex-col">
                <DashboardTopbar />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}

function DashboardSidebar() {
    const t = useTranslations("dashboard.nav");

    const navItems = [
        { icon: "◻", label: t("overview"), href: "/dashboard" },
        { icon: "✎", label: t("content"), href: "/dashboard" },
        { icon: "⬡", label: t("media"), href: "/dashboard" },
        { icon: "☰", label: t("pages"), href: "/dashboard" },
        { icon: "⚙", label: t("settings"), href: "/dashboard" },
    ];

    return (
        <aside className="hidden w-64 flex-col border-e border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:flex">
            <div className="flex h-16 items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
                <Link href="/dashboard" className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    ◈ CMS
                </Link>
            </div>
            <nav className="flex-1 space-y-1 p-3">
                {navItems.map((item, i) => (
                    <Link
                        key={i}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                    >
                        <span className="text-base">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}

function DashboardTopbar() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="lg:hidden">
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">◈ CMS</span>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
                <ThemeSwitcher />
                <LocaleSwitcher />
                <div className="ms-2 size-8 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </div>
        </header>
    );
}
