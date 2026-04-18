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
        <div className="flex min-h-screen flex-col bg-[#0b1326]">
            <PublicHeader />
            <main className="flex-1">{children}</main>
            <PublicFooter />
        </div>
    );
}

function PublicHeader() {
    const t = useTranslations("public.nav");

    const navLinks = [
        { href: "/", label: t("home") },
        { href: "/about", label: t("about") },
        { href: "/resume", label: t("resume") },
        { href: "/portfolio", label: t("portfolio") },
        { href: "/blog", label: t("blog") },
        { href: "/gallery", label: t("gallery") },
        { href: "/contact", label: t("contact") },
    ];

    return (
        <header className="sticky top-0 z-50 bg-[#171f33]/70 backdrop-blur-xl">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
                <Link
                    href="/"
                    className="font-['Manrope'] text-xl font-extrabold tracking-tight text-[#dae2fd]"
                >
                    Ahmed Al-Zubairi
                </Link>

                <nav className="hidden items-center gap-1 lg:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="rounded px-3 py-2 font-['Inter'] text-sm font-medium text-[#c5c6cd] transition-colors hover:text-[#e9c176]"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <ThemeSwitcher />
                    <LocaleSwitcher />
                    <Link
                        href="/contact"
                        className="hidden rounded bg-gradient-to-r from-[#bcc7de] to-[#1e293b] px-5 py-2.5 font-['Inter'] text-sm font-semibold text-[#0b1326] transition-all hover:shadow-lg hover:shadow-[#bcc7de]/20 sm:inline-flex"
                    >
                        {t("contact")}
                    </Link>
                </div>
            </div>
        </header>
    );
}

function PublicFooter() {
    const t = useTranslations("public.footer");
    const tn = useTranslations("public.nav");
    const year = new Date().getFullYear();

    return (
        <footer className="bg-[#060e20]">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <h3 className="font-['Manrope'] text-lg font-extrabold text-[#dae2fd]">
                            Ahmed Al-Zubairi
                        </h3>
                        <p className="mt-4 font-['Inter'] text-sm leading-relaxed text-[#8f9097]">
                            Sovereign authority in project management. Architecting sustainable solutions in complex environments.
                        </p>
                        <div className="mt-6 flex gap-3">
                            {["linkedin", "twitter", "mail"].map((icon) => (
                                <a
                                    key={icon}
                                    href="#"
                                    className="flex size-10 items-center justify-center rounded-lg bg-[#131b2e] text-[#8f9097] transition-colors hover:bg-[#222a3d] hover:text-[#e9c176]"
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        {icon === "twitter" ? "share" : icon === "linkedin" ? "share" : icon}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-['Manrope'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                            Quick Links
                        </h4>
                        <ul className="mt-4 space-y-3">
                            {[
                                { href: "/", label: tn("home") },
                                { href: "/about", label: tn("about") },
                                { href: "/resume", label: tn("resume") },
                                { href: "/portfolio", label: tn("portfolio") },
                                { href: "/blog", label: tn("blog") },
                                { href: "/contact", label: tn("contact") },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="font-['Inter'] text-sm text-[#8f9097] transition-colors hover:text-[#dae2fd]"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Expertise */}
                    <div>
                        <h4 className="font-['Manrope'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                            Expertise
                        </h4>
                        <ul className="mt-4 space-y-3">
                            {[
                                "Strategic Consulting",
                                "Project Management",
                                "Partnership Development",
                                "Crisis Management",
                            ].map((item) => (
                                <li
                                    key={item}
                                    className="font-['Inter'] text-sm text-[#8f9097]"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-['Manrope'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                            Contact
                        </h4>
                        <ul className="mt-4 space-y-3 font-['Inter'] text-sm text-[#8f9097]">
                            <li>ahmed@alzubairi.com</li>
                            <li>Sana&apos;a, Yemen</li>
                            <li>Open to remote work</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#45474c]/15 pt-8 sm:flex-row">
                    <p className="font-['Inter'] text-xs text-[#8f9097]">
                        © {year} Ahmed Al-Zubairi. {t("rights")}.
                    </p>
                    <p className="font-['Inter'] text-xs text-[#8f9097]">
                        {t("builtWith")} ❤️ &amp; Next.js
                    </p>
                </div>
            </div>
        </footer>
    );
}
