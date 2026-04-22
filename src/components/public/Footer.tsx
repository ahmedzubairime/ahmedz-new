import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

// Inline social SVGs
const Github = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
    </svg>
);
const Linkedin = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);
const Twitter = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
);
const Instagram = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

export function PublicFooter({ info, social }: { info: any, social: any }) {
    const t = useTranslations("public.footer");
    const tn = useTranslations("public.nav");
    const year = new Date().getFullYear();

    const renderSocialIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case "linkedin": return <Linkedin size={18} />;
            case "twitter":
            case "x": return <Twitter size={18} />;
            case "github": return <Github size={18} />;
            case "instagram": return <Instagram size={18} />;
            default: return <ExternalLink size={18} />;
        }
    };

    return (
        <footer className="bg-[#060e20]">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <h3 className="font-['Manrope'] text-xl font-extrabold text-[#dae2fd]">
                            Ahmed Al-Zubairi
                        </h3>
                        <p className="mt-4 max-w-md font-['Inter'] text-sm leading-relaxed text-[#8f9097]">
                            {info?.short_bio_en || "Sovereign authority in project management. Architecting sustainable solutions in complex environments."}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            {social && social.length > 0 ? (
                                social.map((item: any) => (
                                    <a
                                        key={item.id}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex size-10 items-center justify-center rounded-lg bg-[#131b2e] text-[#8f9097] transition-all hover:bg-[#222a3d] hover:text-[#e9c176] hover:-translate-y-1"
                                        aria-label={item.platform_name}
                                    >
                                        {renderSocialIcon(item.platform_name)}
                                    </a>
                                ))
                            ) : (
                                <a href="#" className="flex size-10 items-center justify-center rounded-lg bg-[#131b2e] text-[#8f9097] hover:bg-[#222a3d] hover:text-[#e9c176]">
                                    <Linkedin size={18} />
                                </a>
                            )}
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
                                        href={link.href as any}
                                        className="font-['Inter'] text-sm text-[#8f9097] transition-colors hover:text-[#dae2fd]"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-['Manrope'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                            Contact
                        </h4>
                        <ul className="mt-4 space-y-4 font-['Inter'] text-sm text-[#8f9097]">
                            {(info?.primary_email || info?.secondary_email) && (
                                <li className="flex items-start gap-3">
                                    <Mail size={16} className="mt-0.5 text-[#45474c]" />
                                    <div>
                                        {info?.primary_email && <a href={`mailto:${info.primary_email}`} className="block hover:text-[#dae2fd] transition-colors">{info.primary_email}</a>}
                                        {info?.secondary_email && <a href={`mailto:${info.secondary_email}`} className="block mt-1 hover:text-[#dae2fd] transition-colors">{info.secondary_email}</a>}
                                    </div>
                                </li>
                            )}
                            {(info?.primary_phone || info?.secondary_phone) && (
                                <li className="flex items-start gap-3">
                                    <Phone size={16} className="mt-0.5 text-[#45474c]" />
                                    <div>
                                        {info?.primary_phone && <a href={`tel:${info.primary_phone}`} className="block hover:text-[#dae2fd] transition-colors" dir="ltr">{info.primary_phone}</a>}
                                        {info?.secondary_phone && <a href={`tel:${info.secondary_phone}`} className="block mt-1 hover:text-[#dae2fd] transition-colors" dir="ltr">{info.secondary_phone}</a>}
                                    </div>
                                </li>
                            )}
                            {(info?.address_en || info?.address_ar) && (
                                <li className="flex items-start gap-3">
                                    <MapPin size={16} className="mt-0.5 text-[#45474c]" />
                                    <span className="leading-relaxed">
                                        {info?.address_en || info?.address_ar || "Sana'a, Yemen"}
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#45474c]/15 pt-8 sm:flex-row">
                    <p className="font-['Inter'] text-xs text-[#8f9097]">
                        &copy; {year} Ahmed Al-Zubairi. {t("rights")}
                    </p>
                    <p className="font-['Inter'] text-xs text-[#8f9097] flex items-center gap-1">
                        {t("builtWith")} <span className="text-[#e9c176]">❤</span> & Next.js
                    </p>
                </div>
            </div>
        </footer>
    );
}
