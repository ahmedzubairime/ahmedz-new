"use client";

import { AnimatedSection } from "@/components/public/AnimatedSection";
import { Link } from "@/i18n/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Quote,
    Calendar,
    Briefcase,
    Globe,
    MapPin,
    Star,
    Clock,
    ChevronRight,
    ChevronLeft,
    Mail,
    Handshake,
    Users,
    DollarSign,
    MessageSquare,
    GraduationCap,
    FileText,
    BarChart3,
    Target,
    Award,
    BookOpen,
    Trophy,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ── Icon map for stats ────────────────────────────────────
const ICON_MAP: Record<string, React.ReactNode> = {
    Calendar: <Calendar size={22} />,
    Briefcase: <Briefcase size={22} />,
    Globe: <Globe size={22} />,
    MapPin: <MapPin size={22} />,
    Star: <Star size={22} />,
    Award: <Star size={22} />,
    Users: <Globe size={22} />,
};

// ── Expertise data ────────────────────────────────────────
const EXPERTISE_DATA = [
    {
        icon: <Briefcase size={24} />,
        titleAr: "إدارة المشاريع",
        titleEn: "Project Management",
        descAr: "تصميم وتنفيذ وإدارة المشاريع التنموية والإنسانية مع منظمات الأمم المتحدة والمنظمات الدولية.",
        descEn: "Designing, implementing, and managing developmental and humanitarian projects with UN and international organizations.",
    },
    {
        icon: <Handshake size={24} />,
        titleAr: "إدارة الشراكات",
        titleEn: "Partnership Management",
        descAr: "بناء وتعزيز الشراكات الاستراتيجية مع الجهات الحكومية والمنظمات المحلية والدولية.",
        descEn: "Building and strengthening strategic partnerships with government entities, local and international organizations.",
    },
    {
        icon: <Users size={24} />,
        titleAr: "إدارة الموارد البشرية",
        titleEn: "Human Resources Management",
        descAr: "قيادة وتطوير فرق العمل المتعددة الثقافات وبناء القدرات المؤسسية والبشرية.",
        descEn: "Leading and developing multicultural teams and building institutional and human capacity.",
    },
    {
        icon: <DollarSign size={24} />,
        titleAr: "إدارة المالية",
        titleEn: "Financial Management",
        descAr: "إعداد وإدارة الميزانيات التشغيلية وضمان الامتثال المالي وفقاً للمعايير الدولية.",
        descEn: "Preparing and managing operational budgets and ensuring financial compliance with international standards.",
    },
];

// ── Services data ─────────────────────────────────────────
const SERVICES_DATA = [
    {
        icon: <MessageSquare size={24} />,
        titleAr: "استشارات إدارة المشاريع",
        titleEn: "Project Management Consulting",
        descAr: "تقديم استشارات متخصصة في تصميم وإدارة المشاريع الإنسانية والتنموية بمنهجيات عالمية معتمدة.",
        descEn: "Providing specialized consulting in humanitarian and development project design and management using globally recognized methodologies.",
    },
    {
        icon: <GraduationCap size={24} />,
        titleAr: "تدريب وبناء القدرات",
        titleEn: "Training & Capacity Building",
        descAr: "تصميم وتنفيذ برامج تدريبية متخصصة لتعزيز قدرات الفرق والمؤسسات في إدارة المشاريع.",
        descEn: "Designing and delivering specialized training programs to enhance team and organizational project management capabilities.",
    },
    {
        icon: <BarChart3 size={24} />,
        titleAr: "تقييم المشاريع",
        titleEn: "Project Evaluation",
        descAr: "إجراء تقييمات شاملة للمشاريع والبرامج مع توصيات عملية لتحسين الأداء والأثر.",
        descEn: "Conducting comprehensive project and program evaluations with actionable recommendations for performance and impact improvement.",
    },
    {
        icon: <FileText size={24} />,
        titleAr: "تطوير المقترحات",
        titleEn: "Proposal Development",
        descAr: "إعداد مقترحات المشاريع والتمويل وفق أعلى المعايير لزيادة فرص القبول لدى الجهات المانحة.",
        descEn: "Preparing project and funding proposals to the highest standards to maximize acceptance rates with donor agencies.",
    },
];

// ── CountUp component ─────────────────────────────────────
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const duration = 2000;
                    const startTime = performance.now();
                    const step = (now: number) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * target));
                        if (progress < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    );
}

// ── Types ─────────────────────────────────────────────────
interface HomeClientProps {
    isAr: boolean;
    hero: any;
    testimonials: any[];
    stats: any[];
    latestPosts: any[];
    latestProjects: any[];
    cta: any;
    skills: any[];
    certificates: any[];
}

export default function HomeClient({
    isAr,
    hero,
    testimonials,
    stats,
    latestPosts,
    latestProjects,
    cta,
    skills,
    certificates,
}: HomeClientProps) {
    const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
    const ChevIcon = isAr ? ChevronLeft : ChevronRight;

    const heroTitle = isAr ? hero?.title_ar : hero?.title_en;
    const heroSubtitle = isAr ? hero?.subtitle_ar : hero?.subtitle_en;
    const heroBadge = isAr ? hero?.badge_text_ar : hero?.badge_text_en;
    const heroCta1Text = isAr ? hero?.cta_primary_text_ar : hero?.cta_primary_text_en;
    const heroCta1Link = hero?.cta_primary_link || "/portfolio";
    const heroCta2Text = isAr ? hero?.cta_secondary_text_ar : hero?.cta_secondary_text_en;
    const heroCta2Link = hero?.cta_secondary_link || "/contact";

    const ctaTitle = (isAr ? cta?.title_ar : cta?.title_en) || (isAr ? "هل لديك مشروع يتطلب قيادة خبيرة؟" : "Have a project that requires expert leadership?");
    const ctaSubtitle = (isAr ? cta?.subtitle_ar : cta?.subtitle_en) || "";
    const ctaBtnText = (isAr ? cta?.button_text_ar : cta?.button_text_en) || (isAr ? "ابدأ المحادثة" : "Start the Conversation");
    const ctaBtnLink = cta?.button_link || "/contact";

    // Group skills for display (top 4 hard_skills)
    const topSkills = (skills || [])
        .filter((s: any) => s.category === "hard_skill")
        .slice(0, 4);

    // Group certificates by category
    const professionalCerts = (certificates || []).filter((c: any) => c.category === "professional");
    const trainingCerts = (certificates || []).filter((c: any) => c.category === "training");
    const awardCerts = (certificates || []).filter((c: any) => c.category === "award");

    return (
        <>
            {/* ═══════════════════════════════════════════════
                SECTION 1: نبذة موجزة — Hero + Stats
            ═══════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-slate-50 dark:bg-[#0b1326] transition-colors pt-20 pb-12 sm:pt-28 sm:pb-16">
                <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-slate-200/50 dark:bg-[#1e293b]/30 blur-[120px] pointer-events-none transition-colors" />
                <div className="absolute top-40 -left-20 h-[400px] w-[400px] rounded-full bg-[#d4af37]/10 dark:bg-[#312e81]/20 blur-[100px] pointer-events-none transition-colors" />

                <AnimatedSection className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center" animation="fade-up">
                    {heroBadge && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-[#45474c] bg-white dark:bg-[#131b2e] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176] shadow-sm dark:shadow-none">
                            {heroBadge}
                        </span>
                    )}
                    <h1
                        className="mt-8 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#dae2fd] sm:text-6xl lg:text-7xl"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        {heroTitle || "Ahmed Al-Zubairi"}
                    </h1>
                    {heroSubtitle && (
                        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-[#8f9097] sm:text-xl">
                            {heroSubtitle}
                        </p>
                    )}
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href={heroCta1Link as any}
                            className="w-full sm:w-auto rounded-lg bg-gradient-to-r from-[#d4af37] to-[#997a15] dark:from-[#e9c176] dark:to-[#C5A059] px-8 py-4 text-sm font-bold text-white dark:text-[#0b1326] transition-all hover:shadow-lg dark:hover:shadow-[#e9c176]/20 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {heroCta1Text || (isAr ? "شاهد الأعمال" : "View Portfolio")}
                        </Link>
                        <Link
                            href={heroCta2Link as any}
                            className="w-full sm:w-auto rounded-lg bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-[#222a3d] px-8 py-4 text-sm font-bold text-slate-900 dark:text-[#dae2fd] shadow-sm dark:shadow-none transition-all hover:bg-slate-50 dark:hover:bg-[#171f33] hover:border-slate-300 dark:hover:border-[#45474c]"
                        >
                            {heroCta2Text || (isAr ? "تواصل معي" : "Get in Touch")}
                        </Link>
                    </div>
                </AnimatedSection>

                {stats && stats.length > 0 && (
                    <AnimatedSection className="relative mx-auto max-w-5xl px-6 lg:px-8 mt-20" animation="stagger" delay={0.3}>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                            {stats.map((s: any) => (
                                <div
                                    key={s.id}
                                    className="group rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-100 dark:border-[#222a3d] p-6 text-center transition-all hover:border-slate-200 dark:hover:border-[#45474c] hover:shadow-md dark:hover:shadow-none hover:-translate-y-1"
                                >
                                    <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-xl bg-slate-50 dark:bg-[#0b1326] text-[#d4af37] dark:text-[#e9c176] group-hover:scale-110 transition-transform">
                                        {ICON_MAP[s.icon_name] || <Star size={22} />}
                                    </div>
                                    <div className="text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd]">
                                        <CountUp target={s.numeric_value} suffix={s.suffix || ""} />
                                    </div>
                                    <p className="mt-1 text-xs font-medium text-slate-500 dark:text-[#8f9097]">
                                        {isAr ? s.label_ar : s.label_en}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                )}
            </section>

            {/* ═══════════════════════════════════════════════
                SECTION 2: الخبرات — Expertise Areas
            ═══════════════════════════════════════════════ */}
            <section className="bg-white dark:bg-[#131b2e] transition-colors py-24 border-y border-slate-200 dark:border-[#222a3d]">
                <div className="mx-auto max-w-6xl px-6 lg:px-8">
                    <AnimatedSection className="text-center mb-16" animation="fade-up">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176]">
                            {isAr ? "مجالات التخصص" : "Areas of Expertise"}
                        </span>
                        <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] sm:text-4xl">
                            {isAr ? "الخبرات" : "Expertise"}
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 dark:text-[#8f9097]">
                            {isAr
                                ? "أكثر من 15 عاماً من الخبرة المتراكمة في إدارة المشاريع الدولية والعمل الإنساني."
                                : "Over 15 years of accumulated experience in international project management and humanitarian work."}
                        </p>
                    </AnimatedSection>

                    <AnimatedSection animation="stagger" delay={0.15}>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {EXPERTISE_DATA.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="group rounded-2xl bg-slate-50 dark:bg-[#0b1326] border border-slate-100 dark:border-[#171f33] p-7 transition-all hover:border-slate-200 dark:hover:border-[#45474c] hover:shadow-lg dark:hover:shadow-none hover:-translate-y-1"
                                >
                                    <div className="flex size-12 items-center justify-center rounded-xl bg-[#d4af37]/10 dark:bg-[#e9c176]/10 text-[#d4af37] dark:text-[#e9c176] mb-5 group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-[#dae2fd] mb-2">
                                        {isAr ? item.titleAr : item.titleEn}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-slate-500 dark:text-[#8f9097]">
                                        {isAr ? item.descAr : item.descEn}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
                SECTION 3: الخدمات — Services
            ═══════════════════════════════════════════════ */}
            <section className="bg-slate-50 dark:bg-[#0b1326] transition-colors py-24">
                <div className="mx-auto max-w-6xl px-6 lg:px-8">
                    <AnimatedSection className="text-center mb-16" animation="fade-up">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176]">
                            {isAr ? "ما أقدمه" : "What I Offer"}
                        </span>
                        <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] sm:text-4xl">
                            {isAr ? "الخدمات" : "Services"}
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 dark:text-[#8f9097]">
                            {isAr
                                ? "خدمات استشارية متخصصة مبنية على خبرة ميدانية حقيقية مع المنظمات الدولية."
                                : "Specialized consulting services built on real field experience with international organizations."}
                        </p>
                    </AnimatedSection>

                    <AnimatedSection animation="stagger" delay={0.15}>
                        <div className="grid gap-6 sm:grid-cols-2">
                            {SERVICES_DATA.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="group relative overflow-hidden rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-[#222a3d] p-8 transition-all hover:border-slate-300 dark:hover:border-[#45474c] hover:shadow-lg dark:hover:shadow-none hover:-translate-y-1"
                                >
                                    {/* Numbered tag */}
                                    <span className="absolute top-6 end-6 text-5xl font-black text-slate-100 dark:text-[#1e293b]/50 select-none">
                                        {String(idx + 1).padStart(2, "0")}
                                    </span>

                                    <div className="relative z-10">
                                        <div className="flex size-12 items-center justify-center rounded-xl bg-[#d4af37]/10 dark:bg-[#e9c176]/10 text-[#d4af37] dark:text-[#e9c176] mb-5 group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-[#dae2fd] mb-3">
                                            {isAr ? item.titleAr : item.titleEn}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-slate-500 dark:text-[#8f9097]">
                                            {isAr ? item.descAr : item.descEn}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>

                    <AnimatedSection className="mt-10 text-center" animation="fade-up" delay={0.3}>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-[#222a3d] px-8 py-3.5 text-sm font-bold text-slate-900 dark:text-[#dae2fd] shadow-sm dark:shadow-none transition-all hover:bg-slate-50 dark:hover:bg-[#171f33] hover:border-slate-300 dark:hover:border-[#45474c] hover:-translate-y-0.5"
                        >
                            {isAr ? "اطلب استشارة" : "Request a Consultation"}
                            <ArrowIcon size={16} />
                        </Link>
                    </AnimatedSection>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
                SECTION 4: المهارات — Skills
            ═══════════════════════════════════════════════ */}
            {topSkills.length > 0 && (
                <section className="bg-white dark:bg-[#131b2e] transition-colors py-24 border-y border-slate-200 dark:border-[#222a3d]">
                    <div className="mx-auto max-w-6xl px-6 lg:px-8">
                        <AnimatedSection className="text-center mb-16" animation="fade-up">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176]">
                                {isAr ? "الكفاءات الأساسية" : "Core Competencies"}
                            </span>
                            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] sm:text-4xl">
                                {isAr ? "المهارات" : "Skills"}
                            </h2>
                        </AnimatedSection>

                        <AnimatedSection animation="stagger" delay={0.15}>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {topSkills.map((skill: any) => {
                                    const name = isAr ? skill.name_ar : skill.name_en;
                                    const level = skill.proficiency_level || 80;

                                    return (
                                        <div
                                            key={skill.id}
                                            className="group rounded-2xl bg-slate-50 dark:bg-[#0b1326] border border-slate-100 dark:border-[#171f33] p-7 transition-all hover:border-slate-200 dark:hover:border-[#45474c] hover:shadow-lg dark:hover:shadow-none hover:-translate-y-1"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex size-10 items-center justify-center rounded-lg bg-[#d4af37]/10 dark:bg-[#e9c176]/10 text-[#d4af37] dark:text-[#e9c176]">
                                                    <Target size={18} />
                                                </div>
                                                <span className="text-2xl font-extrabold text-[#d4af37] dark:text-[#e9c176]">
                                                    {level}%
                                                </span>
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-[#dae2fd] mb-3">
                                                {name}
                                            </h3>
                                            <div className="h-2 rounded-full bg-slate-200 dark:bg-[#222a3d] overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8972c] dark:from-[#e9c176] dark:to-[#C5A059] transition-all duration-700 ease-out"
                                                    style={{ width: `${level}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </AnimatedSection>

                        <AnimatedSection className="mt-10 text-center" animation="fade-up" delay={0.3}>
                            <Link
                                href="/about"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#d4af37] dark:text-[#e9c176] hover:underline underline-offset-4"
                            >
                                {isAr ? "عرض جميع المهارات" : "View All Skills"}
                                <ChevIcon size={16} />
                            </Link>
                        </AnimatedSection>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════
                SECTION 5: الشهادات — Certificates
            ═══════════════════════════════════════════════ */}
            {certificates && certificates.length > 0 && (
                <section className="bg-slate-50 dark:bg-[#0b1326] transition-colors py-24">
                    <div className="mx-auto max-w-6xl px-6 lg:px-8">
                        <AnimatedSection className="text-center mb-16" animation="fade-up">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176]">
                                {isAr ? "التطوير المهني" : "Professional Development"}
                            </span>
                            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] sm:text-4xl">
                                {isAr ? "الشهادات" : "Certificates"}
                            </h2>
                        </AnimatedSection>

                        <AnimatedSection animation="stagger" delay={0.15}>
                            <div className="grid gap-10 lg:grid-cols-3">
                                {/* Professional Certificates */}
                                {professionalCerts.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2.5 mb-6">
                                            <div className="flex size-9 items-center justify-center rounded-lg bg-[#d4af37]/10 dark:bg-[#e9c176]/10">
                                                <Award size={18} className="text-[#d4af37] dark:text-[#e9c176]" />
                                            </div>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-[#dae2fd]">
                                                {isAr ? "الشهادات المهنية" : "Professional Certificates"}
                                            </h3>
                                        </div>
                                        <div className="space-y-3">
                                            {professionalCerts.map((cert: any) => (
                                                <div
                                                    key={cert.id}
                                                    className="rounded-xl bg-white dark:bg-[#131b2e] border border-slate-100 dark:border-[#171f33] p-4 transition-all hover:border-slate-200 dark:hover:border-[#45474c]"
                                                >
                                                    <p className="text-sm font-bold text-slate-900 dark:text-[#dae2fd]">
                                                        {isAr ? cert.title_ar : cert.title_en}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-xs text-slate-500 dark:text-[#8f9097]">
                                                            {isAr ? cert.issuer_ar : cert.issuer_en}
                                                        </span>
                                                        {cert.year && (
                                                            <span className="text-xs text-slate-400 dark:text-[#5a5b63]">
                                                                {cert.year}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Training Courses */}
                                {trainingCerts.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2.5 mb-6">
                                            <div className="flex size-9 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-900/15">
                                                <BookOpen size={18} className="text-sky-500 dark:text-sky-400" />
                                            </div>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-[#dae2fd]">
                                                {isAr ? "الدورات التدريبية" : "Training Courses"}
                                            </h3>
                                        </div>
                                        <div className="space-y-3">
                                            {trainingCerts.map((cert: any) => (
                                                <div
                                                    key={cert.id}
                                                    className="rounded-xl bg-white dark:bg-[#131b2e] border border-slate-100 dark:border-[#171f33] p-4 transition-all hover:border-slate-200 dark:hover:border-[#45474c]"
                                                >
                                                    <p className="text-sm font-bold text-slate-900 dark:text-[#dae2fd]">
                                                        {isAr ? cert.title_ar : cert.title_en}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-xs text-slate-500 dark:text-[#8f9097]">
                                                            {isAr ? cert.issuer_ar : cert.issuer_en}
                                                        </span>
                                                        {cert.year && (
                                                            <span className="text-xs text-slate-400 dark:text-[#5a5b63]">
                                                                {cert.year}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Awards */}
                                {awardCerts.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2.5 mb-6">
                                            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/15">
                                                <Trophy size={18} className="text-amber-500 dark:text-amber-400" />
                                            </div>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-[#dae2fd]">
                                                {isAr ? "الجوائز والتكريمات" : "Awards & Recognitions"}
                                            </h3>
                                        </div>
                                        <div className="space-y-3">
                                            {awardCerts.map((cert: any) => (
                                                <div
                                                    key={cert.id}
                                                    className="rounded-xl bg-white dark:bg-[#131b2e] border border-slate-100 dark:border-[#171f33] p-4 transition-all hover:border-slate-200 dark:hover:border-[#45474c]"
                                                >
                                                    <p className="text-sm font-bold text-slate-900 dark:text-[#dae2fd]">
                                                        {isAr ? cert.title_ar : cert.title_en}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-xs text-slate-500 dark:text-[#8f9097]">
                                                            {isAr ? cert.issuer_ar : cert.issuer_en}
                                                        </span>
                                                        {cert.year && (
                                                            <span className="text-xs text-slate-400 dark:text-[#5a5b63]">
                                                                {cert.year}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </AnimatedSection>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════
                SECTION 6: أحدث الأخبار والمشاريع
            ═══════════════════════════════════════════════ */}
            <section className="bg-white dark:bg-[#131b2e] transition-colors py-24 border-y border-slate-200 dark:border-[#222a3d]">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <AnimatedSection className="text-center mb-16" animation="fade-up">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176]">
                            {isAr ? "آخر المستجدات" : "Latest Updates"}
                        </span>
                        <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] sm:text-4xl">
                            {isAr ? "أحدث الأخبار والمشاريع" : "Latest News & Projects"}
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 dark:text-[#8f9097]">
                            {isAr
                                ? "تابع آخر المقالات والمشاريع التي أعمل عليها في مجال إدارة المشاريع الدولية."
                                : "Stay up to date with my latest articles and projects in international project management."}
                        </p>
                    </AnimatedSection>

                    {latestPosts && latestPosts.length > 0 && (
                        <AnimatedSection className="mb-16" animation="stagger" delay={0.15}>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-[#dae2fd] flex items-center gap-2">
                                    <Clock size={20} className="text-[#d4af37] dark:text-[#e9c176]" />
                                    {isAr ? "أحدث المقالات" : "Latest Articles"}
                                </h3>
                                <Link
                                    href="/blog"
                                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#d4af37] dark:text-[#e9c176] hover:underline underline-offset-4"
                                >
                                    {isAr ? "عرض الكل" : "View All"}
                                    <ChevIcon size={16} className="transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                                </Link>
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {latestPosts.map((post: any) => {
                                    const title = isAr ? post.title_ar : post.title_en;
                                    const excerpt = isAr ? post.excerpt_ar : post.excerpt_en;
                                    const date = post.published_at
                                        ? new Date(post.published_at).toLocaleDateString(isAr ? "ar-SA" : "en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })
                                        : "";

                                    return (
                                        <Link
                                            key={post.id}
                                            href={`/blog/${post.slug}` as any}
                                            className="group block rounded-2xl bg-slate-50 dark:bg-[#0b1326] border border-slate-100 dark:border-[#171f33] p-6 transition-all hover:bg-white dark:hover:bg-[#171f33] hover:border-slate-200 dark:hover:border-[#45474c] hover:shadow-md dark:hover:shadow-none hover:-translate-y-1"
                                        >
                                            <div className="flex items-center gap-2 mb-4">
                                                <Calendar size={14} className="text-slate-400 dark:text-[#45474c]" />
                                                <time className="text-xs text-slate-400 dark:text-[#5a5b63]">
                                                    {date}
                                                </time>
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-[#dae2fd] group-hover:text-[#d4af37] dark:group-hover:text-[#e9c176] transition-colors line-clamp-2">
                                                {title}
                                            </h4>
                                            {excerpt && (
                                                <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-[#8f9097] line-clamp-3">
                                                    {excerpt}
                                                </p>
                                            )}
                                            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#d4af37] dark:text-[#e9c176]">
                                                {isAr ? "اقرأ المزيد" : "Read More"}
                                                <ChevIcon size={14} />
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </AnimatedSection>
                    )}

                    {latestProjects && latestProjects.length > 0 && (
                        <AnimatedSection animation="stagger" delay={0.2}>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-[#dae2fd] flex items-center gap-2">
                                    <Briefcase size={20} className="text-[#d4af37] dark:text-[#e9c176]" />
                                    {isAr ? "مشاريع مميزة" : "Featured Projects"}
                                </h3>
                                <Link
                                    href="/portfolio"
                                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#d4af37] dark:text-[#e9c176] hover:underline underline-offset-4"
                                >
                                    {isAr ? "عرض الكل" : "View All"}
                                    <ChevIcon size={16} className="transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                                </Link>
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2">
                                {latestProjects.map((project: any) => {
                                    const title = isAr ? project.title_ar : project.title_en;
                                    const client = isAr ? project.client_ar : project.client_en;
                                    const desc = isAr ? project.description_ar : project.description_en;

                                    return (
                                        <Link
                                            key={project.id}
                                            href={`/portfolio/${project.slug}` as any}
                                            className="group relative rounded-2xl bg-slate-50 dark:bg-[#0b1326] border border-slate-100 dark:border-[#171f33] p-8 transition-all hover:bg-white dark:hover:bg-[#171f33] hover:border-slate-200 dark:hover:border-[#45474c] hover:shadow-md dark:hover:shadow-none hover:-translate-y-1"
                                        >
                                            {client && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d4af37]/10 dark:bg-[#e9c176]/10 px-3 py-1 text-xs font-semibold text-[#d4af37] dark:text-[#e9c176] mb-4">
                                                    <Globe size={12} />
                                                    {client}
                                                </span>
                                            )}
                                            <h4 className="text-xl font-bold text-slate-900 dark:text-[#dae2fd] group-hover:text-[#d4af37] dark:group-hover:text-[#e9c176] transition-colors">
                                                {title}
                                            </h4>
                                            {desc && (
                                                <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-[#8f9097] line-clamp-3">
                                                    {desc}
                                                </p>
                                            )}
                                            <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-[#d4af37] dark:text-[#e9c176]">
                                                {isAr ? "عرض التفاصيل" : "View Details"}
                                                <ChevIcon size={14} />
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </AnimatedSection>
                    )}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
                SECTION 7: شهادات العملاء — Client Testimonials
            ═══════════════════════════════════════════════ */}
            {testimonials && testimonials.length > 0 && (
                <section className="bg-slate-50 dark:bg-[#0b1326] transition-colors py-24 relative">
                    <AnimatedSection className="mx-auto max-w-7xl px-6 lg:px-8" animation="fade-up" delay={0.15}>
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176]">
                                {isAr ? "آراء الشركاء" : "Client Endorsements"}
                            </span>
                            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] sm:text-4xl">
                                {isAr ? "ماذا يقول شركاؤنا" : "What Our Partners Say"}
                            </h2>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {testimonials.map((t: any) => {
                                const name = (isAr ? t.author_name_ar : t.author_name_en) || "User";
                                const role = isAr ? t.role_ar : t.role_en;
                                const quote = isAr ? t.content_ar : t.content_en;
                                const rating = t.rating || 5;

                                return (
                                    <div
                                        key={t.id}
                                        className="group rounded-2xl bg-white dark:bg-[#131b2e] p-8 border border-slate-200 dark:border-[#222a3d] shadow-sm dark:shadow-none transition-all hover:shadow-lg dark:hover:shadow-none hover:-translate-y-1 relative"
                                    >
                                        <Quote
                                            className="absolute top-6 end-6 text-slate-100 dark:text-[#1e293b] opacity-60"
                                            size={44}
                                        />
                                        <div className="flex gap-0.5 mb-5">
                                            {Array.from({ length: rating }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className="fill-[#d4af37] text-[#d4af37] dark:fill-[#e9c176] dark:text-[#e9c176]"
                                                />
                                            ))}
                                        </div>
                                        <p className=" text-sm leading-relaxed italic text-slate-600 dark:text-[#c5c6cd] relative z-10">
                                            &ldquo;{quote}&rdquo;
                                        </p>
                                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-[#222a3d] flex items-center gap-4">
                                            <div className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 dark:from-[#e9c176]/20 dark:to-[#e9c176]/5  font-bold text-[#d4af37] dark:text-[#e9c176] text-sm">
                                                {name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className=" text-sm font-bold text-slate-900 dark:text-[#dae2fd]">
                                                    {name}
                                                </h4>
                                                {role && (
                                                    <p className=" text-xs text-slate-500 dark:text-[#8f9097] mt-0.5">
                                                        {role}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </AnimatedSection>
                </section>
            )}

            {/* ═══════════════════════════════════════════════
                SECTION 8: دعوة للتواصل — Contact CTA
            ═══════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-white dark:bg-[#131b2e] transition-colors py-24 border-t border-slate-200 dark:border-[#222a3d]">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#d4af37]/5 dark:bg-[#e9c176]/5 blur-[100px]" />
                </div>

                <AnimatedSection className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8" animation="fade-in" delay={0.2}>
                    <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-2xl bg-[#d4af37]/10 dark:bg-[#e9c176]/10">
                        <Mail className="text-[#d4af37] dark:text-[#e9c176]" size={28} />
                    </div>

                    <h2 className=" text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] sm:text-4xl">
                        {ctaTitle}
                    </h2>

                    {ctaSubtitle && (
                        <p className="mx-auto mt-4 max-w-2xl  text-lg text-slate-600 dark:text-[#8f9097]">
                            {ctaSubtitle}
                        </p>
                    )}

                    <div className="mt-10">
                        <Link
                            href={ctaBtnLink as any}
                            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#997a15] dark:from-[#e9c176] dark:to-[#C5A059] px-10 py-4  text-sm font-bold text-white dark:text-[#0b1326] transition-all hover:shadow-xl hover:shadow-[#d4af37]/20 dark:hover:shadow-[#e9c176]/20 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {ctaBtnText}
                            <ArrowIcon size={18} />
                        </Link>
                    </div>
                </AnimatedSection>
            </section>
        </>
    );
}
