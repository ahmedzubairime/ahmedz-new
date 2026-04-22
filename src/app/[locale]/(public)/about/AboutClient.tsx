"use client";

import { AnimatedSection } from "@/components/public/AnimatedSection";
import {
    Briefcase,
    Award,
    GraduationCap,
    Calendar,
    Building2,
    Globe,
    Star,
    Languages,
} from "lucide-react";

// ── Icon map for dynamic skill icons ──────────────────────
const SKILL_ICON: Record<string, React.ReactNode> = {
    briefcase: <Briefcase size={18} />,
    target: <Star size={18} />,
    users: <Globe size={18} />,
    activity: <Award size={18} />,
    handshake: <Globe size={18} />,
    languages: <Languages size={18} />,
};

interface AboutClientProps {
    isAr: boolean;
    hero: any;
    company: any;
    experiences: any[];
    certificates: any[];
    skills: any[];
}

export default function AboutClient({
    isAr,
    hero,
    company,
    experiences,
    certificates,
    skills,
}: AboutClientProps) {
    const heroTitle = isAr ? hero?.title_ar : hero?.title_en;
    const heroSubtitle = isAr ? hero?.subtitle_ar : hero?.subtitle_en;
    const storyText = isAr ? company?.story_ar : company?.story_en;
    const storyParagraphs = storyText ? storyText.split("\n\n").filter(Boolean) : [];

    // Split skills by category
    const professionalSkills = (skills || []).filter(
        (s: any) => s.category === "hard_skill" || s.category === "soft_skill"
    );
    const languageSkills = (skills || []).filter((s: any) => s.category === "language");

    // Sort experiences by start_date descending (newest first)
    const sortedExperiences = (experiences || [])
        .filter((e: any) => e.isActive)
        .sort((a: any, b: any) => {
            const da = a.startDate ? new Date(a.startDate).getTime() : 0;
            const db = b.startDate ? new Date(b.startDate).getTime() : 0;
            return db - da;
        });

    const activeCerts = (certificates || []).filter((c: any) => c.is_active);

    return (
        <>
            {/* ═══════════════════════════════════════════════
                SECTION 1: السيرة الذاتية — Biography
            ═══════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-slate-50 dark:bg-[#0b1326] transition-colors pt-20 pb-16 sm:pt-28 sm:pb-20">
                {/* Decorative orbs */}
                <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-slate-200/50 dark:bg-[#1e293b]/30 blur-[120px] pointer-events-none transition-colors" />
                <div className="absolute top-60 -left-20 h-[350px] w-[350px] rounded-full bg-[#d4af37]/10 dark:bg-[#312e81]/20 blur-[100px] pointer-events-none transition-colors" />

                <AnimatedSection className="relative mx-auto max-w-4xl px-6 lg:px-8" animation="fade-up">
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-[#45474c] bg-white dark:bg-[#131b2e] px-4 py-1.5 font-['Inter'] text-xs font-semibold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176] shadow-sm dark:shadow-none">
                        {isAr ? "السيرة الذاتية" : "Biography"}
                    </span>

                    <h1
                        className="mt-8 font-['Manrope'] text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#dae2fd] sm:text-5xl lg:text-6xl"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        {heroTitle || (isAr ? "أحمد الزبيري" : "Ahmed Al-Zubairi")}
                    </h1>

                    {heroSubtitle && (
                        <p className="mt-4 font-['Inter'] text-lg font-medium text-[#d4af37] dark:text-[#e9c176]">
                            {heroSubtitle}
                        </p>
                    )}

                    {storyParagraphs.length > 0 && (
                        <div className="mt-10 space-y-5">
                            {storyParagraphs.map((p: string, i: number) => (
                                <p
                                    key={i}
                                    className="font-['Inter'] text-base leading-[1.85] text-slate-600 dark:text-[#8f9097] sm:text-lg"
                                >
                                    {p}
                                </p>
                            ))}
                        </div>
                    )}
                </AnimatedSection>
            </section>

            {/* ═══════════════════════════════════════════════
                SECTION 2: الخبرات المهنية — Professional Experience
            ═══════════════════════════════════════════════ */}
            {sortedExperiences.length > 0 && (
                <section className="bg-white dark:bg-[#131b2e] transition-colors py-24 border-y border-slate-200 dark:border-[#222a3d]">
                    <div className="mx-auto max-w-5xl px-6 lg:px-8">
                        <AnimatedSection className="mb-14" animation="fade-up">
                            <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176]">
                                {isAr ? "المسار المهني" : "Career Path"}
                            </span>
                            <h2 className="mt-3 font-['Manrope'] text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] sm:text-4xl">
                                {isAr ? "الخبرات المهنية" : "Professional Experience"}
                            </h2>
                        </AnimatedSection>

                        <AnimatedSection animation="stagger" delay={0.15}>
                            <div className="relative">
                                {/* Vertical timeline line */}
                                <div className="absolute start-[17px] top-2 bottom-2 w-px bg-gradient-to-b from-[#d4af37]/60 via-slate-200 to-transparent dark:from-[#e9c176]/40 dark:via-[#222a3d]" />

                                <div className="space-y-10">
                                    {sortedExperiences.map((exp: any, idx: number) => {
                                        const role = isAr ? exp.roleAr : exp.roleEn;
                                        const company = isAr ? exp.companyAr : exp.companyEn;
                                        const sector = isAr ? exp.sectorAr : exp.sectorEn;
                                        const desc = isAr ? exp.descriptionAr : exp.descriptionEn;
                                        const startYear = exp.startDate
                                            ? new Date(exp.startDate).getFullYear()
                                            : "";
                                        const endLabel = exp.isCurrent
                                            ? isAr
                                                ? "الحاضر"
                                                : "Present"
                                            : exp.endDate
                                            ? new Date(exp.endDate).getFullYear()
                                            : "";

                                        return (
                                            <div key={exp.id} className="relative ps-12 group">
                                                {/* Timeline dot */}
                                                <div
                                                    className={`absolute start-0 top-1 flex size-[34px] items-center justify-center rounded-full border-4 border-slate-50 dark:border-[#131b2e] transition-transform group-hover:scale-110 ${
                                                        exp.isCurrent
                                                            ? "bg-[#d4af37] dark:bg-[#e9c176]"
                                                            : "bg-slate-200 dark:bg-[#222a3d]"
                                                    }`}
                                                >
                                                    <Building2
                                                        size={14}
                                                        className={
                                                            exp.isCurrent
                                                                ? "text-white dark:text-[#0b1326]"
                                                                : "text-slate-500 dark:text-[#8f9097]"
                                                        }
                                                    />
                                                </div>

                                                <div className="rounded-2xl bg-slate-50 dark:bg-[#0b1326] border border-slate-100 dark:border-[#171f33] p-6 sm:p-8 transition-all hover:border-slate-200 dark:hover:border-[#45474c] hover:shadow-md dark:hover:shadow-none hover:-translate-y-0.5">
                                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                                                        <div>
                                                            <h3 className="font-['Manrope'] text-lg font-bold text-slate-900 dark:text-[#dae2fd]">
                                                                {role}
                                                            </h3>
                                                            <p className="mt-1 font-['Inter'] text-sm font-semibold text-[#d4af37] dark:text-[#e9c176]">
                                                                {company}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-3 flex-shrink-0">
                                                            {exp.isCurrent && (
                                                                <span className="rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 px-3 py-0.5 font-['Inter'] text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                                                                    {isAr ? "حالي" : "Current"}
                                                                </span>
                                                            )}
                                                            <span className="inline-flex items-center gap-1.5 font-['Inter'] text-xs text-slate-500 dark:text-[#5a5b63]">
                                                                <Calendar size={13} />
                                                                {startYear} — {endLabel}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {sector && (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d4af37]/8 dark:bg-[#e9c176]/8 px-3 py-1 font-['Inter'] text-[11px] font-semibold text-[#d4af37] dark:text-[#e9c176] mb-4">
                                                            <Globe size={11} />
                                                            {sector}
                                                        </span>
                                                    )}

                                                    {desc && (
                                                        <p className="font-['Inter'] text-sm leading-relaxed text-slate-600 dark:text-[#8f9097]">
                                                            {desc}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════
                SECTION 3: الشهادات والمؤهلات — Certificates
            ═══════════════════════════════════════════════ */}
            {activeCerts.length > 0 && (
                <section className="bg-slate-50 dark:bg-[#0b1326] transition-colors py-24">
                    <div className="mx-auto max-w-5xl px-6 lg:px-8">
                        <AnimatedSection className="mb-14" animation="fade-up">
                            <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176]">
                                {isAr ? "التطوير المهني" : "Professional Development"}
                            </span>
                            <h2 className="mt-3 font-['Manrope'] text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] sm:text-4xl">
                                {isAr ? "الشهادات والمؤهلات" : "Certificates & Qualifications"}
                            </h2>
                        </AnimatedSection>

                        <AnimatedSection animation="stagger" delay={0.15}>
                            <div className="grid gap-5 sm:grid-cols-2">
                                {activeCerts.map((cert: any) => {
                                    const title = isAr ? cert.title_ar : cert.title_en;
                                    const issuer = isAr ? cert.issuer_ar : cert.issuer_en;

                                    return (
                                        <div
                                            key={cert.id}
                                            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-[#222a3d] p-6 sm:p-8 transition-all hover:border-slate-300 dark:hover:border-[#45474c] hover:shadow-lg dark:hover:shadow-none hover:-translate-y-1"
                                        >
                                            {/* Gold left accent */}
                                            <div className="absolute start-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#d4af37] to-[#d4af37]/30 dark:from-[#e9c176] dark:to-[#e9c176]/30 rounded-s-2xl" />

                                            <div className="flex items-start gap-4">
                                                <div className="flex size-12 items-center justify-center rounded-xl bg-[#d4af37]/10 dark:bg-[#e9c176]/10 flex-shrink-0">
                                                    <GraduationCap
                                                        size={22}
                                                        className="text-[#d4af37] dark:text-[#e9c176]"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-['Manrope'] text-base font-bold text-slate-900 dark:text-[#dae2fd] leading-snug">
                                                        {title}
                                                    </h3>
                                                    {issuer && (
                                                        <p className="mt-1.5 font-['Inter'] text-sm text-slate-500 dark:text-[#8f9097]">
                                                            {issuer}
                                                        </p>
                                                    )}
                                                    {cert.year && (
                                                        <span className="mt-3 inline-flex items-center gap-1.5 font-['Inter'] text-xs text-slate-400 dark:text-[#5a5b63]">
                                                            <Calendar size={12} />
                                                            {cert.year}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </AnimatedSection>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════
                SECTION 4: المهارات واللغات — Skills & Languages
            ═══════════════════════════════════════════════ */}
            <section className="bg-white dark:bg-[#131b2e] transition-colors py-24 border-t border-slate-200 dark:border-[#222a3d]">
                <div className="mx-auto max-w-5xl px-6 lg:px-8">
                    <AnimatedSection className="mb-14" animation="fade-up">
                        <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176]">
                            {isAr ? "الكفاءات والقدرات" : "Competencies & Abilities"}
                        </span>
                        <h2 className="mt-3 font-['Manrope'] text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] sm:text-4xl">
                            {isAr ? "المهارات واللغات" : "Skills & Languages"}
                        </h2>
                    </AnimatedSection>

                    <AnimatedSection animation="stagger" delay={0.15}>
                        <div className="grid gap-12 lg:grid-cols-2">
                            {/* Professional Skills */}
                            {professionalSkills.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2.5 mb-6">
                                        <Star size={20} className="text-[#d4af37] dark:text-[#e9c176]" />
                                        <h3 className="font-['Manrope'] text-lg font-bold text-slate-900 dark:text-[#dae2fd]">
                                            {isAr ? "المهارات المهنية" : "Professional Skills"}
                                        </h3>
                                    </div>
                                    <div className="space-y-4">
                                        {professionalSkills.map((skill: any) => {
                                            const label = isAr ? skill.nameAr : skill.nameEn;
                                            const level = skill.proficiencyLevel || 80;

                                            return (
                                                <div key={skill.id} className="group">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2.5">
                                                            <span className="flex size-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-[#0b1326] text-[#d4af37] dark:text-[#e9c176]">
                                                                {SKILL_ICON[skill.iconName] || (
                                                                    <Star size={14} />
                                                                )}
                                                            </span>
                                                            <span className="font-['Inter'] text-sm font-medium text-slate-800 dark:text-[#dae2fd]">
                                                                {label}
                                                            </span>
                                                        </div>
                                                        <span className="font-['Inter'] text-xs font-semibold text-slate-400 dark:text-[#5a5b63]">
                                                            {level}%
                                                        </span>
                                                    </div>
                                                    <div className="h-2 rounded-full bg-slate-100 dark:bg-[#0b1326] overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8972c] dark:from-[#e9c176] dark:to-[#C5A059] transition-all duration-700 ease-out group-hover:opacity-90"
                                                            style={{ width: `${level}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Languages */}
                            {languageSkills.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2.5 mb-6">
                                        <Languages size={20} className="text-[#d4af37] dark:text-[#e9c176]" />
                                        <h3 className="font-['Manrope'] text-lg font-bold text-slate-900 dark:text-[#dae2fd]">
                                            {isAr ? "اللغات" : "Languages"}
                                        </h3>
                                    </div>
                                    <div className="space-y-5">
                                        {languageSkills.map((lang: any) => {
                                            const label = isAr ? lang.nameAr : lang.nameEn;
                                            const level = lang.proficiencyLevel || 50;
                                            const levelLabel =
                                                level >= 95
                                                    ? isAr
                                                        ? "اللغة الأم / طلاقة"
                                                        : "Native / Fluent"
                                                    : level >= 80
                                                    ? isAr
                                                        ? "متقدم"
                                                        : "Advanced"
                                                    : level >= 60
                                                    ? isAr
                                                        ? "متوسط"
                                                        : "Intermediate"
                                                    : isAr
                                                    ? "مبتدئ"
                                                    : "Beginner";

                                            return (
                                                <div key={lang.id} className="group">
                                                    <div className="flex items-center justify-between mb-2.5">
                                                        <span className="font-['Manrope'] text-base font-bold text-slate-900 dark:text-[#dae2fd]">
                                                            {label}
                                                        </span>
                                                        <span className="rounded-full bg-slate-100 dark:bg-[#0b1326] px-3 py-0.5 font-['Inter'] text-[11px] font-semibold text-slate-600 dark:text-[#c5c6cd]">
                                                            {levelLabel}
                                                        </span>
                                                    </div>
                                                    <div className="h-3 rounded-full bg-slate-100 dark:bg-[#0b1326] overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#997a15] dark:from-[#e9c176] dark:to-[#C5A059] transition-all duration-700 ease-out"
                                                            style={{ width: `${level}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </>
    );
}
