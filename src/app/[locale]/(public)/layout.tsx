import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <PublicHeader />
            <main className="flex-1">{children}</main>
            <PublicFooter />
        </div>
    );
}

function PublicHeader() {
    const t = useTranslations("public.nav");

    return (
        <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    PLATFORM
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                    {[
                        { href: "/", label: t("home") },
                        { href: "/dashboard", label: t("dashboard") },
                        { href: "/projects-management", label: t("projects") },
                        { href: "/store", label: t("store") },
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <ThemeSwitcher />
                    <LocaleSwitcher />
                    <Link
                        href="/login"
                        className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
                    >
                        {t("login")}
                    </Link>
                </div>
            </div>
        </header>
    );
}

function PublicFooter() {
    const t = useTranslations("public.footer");
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    © {year} PLATFORM. {t("rights")}.
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {t("builtWith")} ❤️ & Next.js
                </p>
            </div>
        </footer>
    );
}
