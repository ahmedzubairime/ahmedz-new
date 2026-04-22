"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { Menu, X } from "lucide-react";

export function PublicHeader() {
    const t = useTranslations("public.nav");
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: "/", label: t("home") },
        { href: "/about", label: t("about") },
        { href: "/resume", label: t("resume") },
        { href: "/portfolio", label: t("portfolio") },
        { href: "/blog", label: t("blog") },
        { href: "/gallery", label: t("gallery") },
    ];

    return (
        <header className="sticky top-0 z-50 bg-[#171f33]/70 backdrop-blur-xl border-b border-[#45474c]/20">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
                {/* Logo */}
                <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className=" px-2 py-1 text-xl font-extrabold tracking-tight text-[#dae2fd]"
                >
                    Ahmed Al-Zubairi
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-2 lg:flex">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href as any}
                                className={`rounded px-3 py-2  text-sm font-medium transition-colors ${isActive ? "text-[#e9c176] bg-[#131b2e]/50" : "text-[#c5c6cd] hover:text-[#e9c176]"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <LocaleSwitcher />
                    <Link
                        href="/contact"
                        className="hidden rounded bg-gradient-to-r from-[#e9c176] to-[#C5A059] px-5 py-2.5  text-sm font-bold text-[#0b1326] transition-all hover:shadow-lg hover:shadow-[#e9c176]/20 lg:inline-flex"
                    >
                        {t("contact")}
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 text-[#dae2fd] hover:text-[#e9c176] transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Dropdown */}
            {isOpen && (
                <div className="lg:hidden absolute top-20 left-0 w-full bg-[#171f33] border-b border-[#45474c]/20 shadow-2xl">
                    <nav className="flex flex-col px-6 py-6 gap-4">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href as any}
                                    onClick={() => setIsOpen(false)}
                                    className={` text-base font-medium transition-colors ${isActive ? "text-[#e9c176]" : "text-[#dae2fd]"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        <hr className="border-[#45474c]/20 my-2" />
                        <Link
                            href="/contact"
                            onClick={() => setIsOpen(false)}
                            className="text-center rounded bg-gradient-to-r from-[#e9c176] to-[#C5A059] px-5 py-3  text-base font-bold text-[#0b1326]"
                        >
                            {t("contact")}
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
