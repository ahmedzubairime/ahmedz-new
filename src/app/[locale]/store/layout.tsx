import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
            <StoreHeader />
            <main className="flex-1">{children}</main>
        </div>
    );
}

function StoreHeader() {
    const t = useTranslations("store.nav");

    const tabs = [
        { label: t("all"), href: "/store" },
        { label: t("featured"), href: "/store" },
        { label: t("new"), href: "/store" },
        { label: t("sale"), href: "/store" },
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/store" className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        ✦ STORE
                    </Link>
                    <div className="flex items-center gap-2">
                        <ThemeSwitcher />
                        <LocaleSwitcher />
                    </div>
                </div>
                <nav className="flex gap-1 pb-3 -mb-px overflow-x-auto">
                    {tabs.map((tab, i) => (
                        <Link
                            key={i}
                            href={tab.href}
                            className="rounded-full px-4 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                        >
                            {tab.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
