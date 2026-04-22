"use client";

import { AnimatedSection } from "@/components/public/AnimatedSection";
import {
    Shield,
    Heart,
    Calendar,
    CheckCircle2,
    Globe,
    Lightbulb,
    Target,
    TrendingUp,
    Building2,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────
interface PortfolioClientProps {
    isAr: boolean;
    projects: any[];
    caseStudies: any[];
}

// ── Featured project slugs ────────────────────────────────
const UNICEF_SLUG = "girls-protection-unicef";
const UNFPA_SLUG = "anti-fgm-campaign-unfpa";

export default function PortfolioClient({
    isAr,
    projects,
    caseStudies,
}: PortfolioClientProps) {

    // Separate featured from previous
    const unicefProject = projects.find((p: any) => p.slug === UNICEF_SLUG);
    const unfpaProject = projects.find((p: any) => p.slug === UNFPA_SLUG);
    const previousProjects = projects.filter(
        (p: any) => p.slug !== UNICEF_SLUG && p.slug !== UNFPA_SLUG && p.isActive
    );

    // Helper to split results into bullet items
    function parseResults(text: string | null | undefined): string[] {
        if (!text) return [];
        return text
            .split("\n")
            .map((l) => l.replace(/^[•\-\s]+/, "").trim())
            .filter(Boolean);
    }

    // Helper to split content into paragraphs
    function parseParagraphs(text: string | null | undefined): string[] {
        if (!text) return [];
        return text.split("\n\n").filter(Boolean);
    }

    return (
        <>
            {/* ═══════════════════════════════════════════════════════
                PAGE HERO
            ═══════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-slate-50 dark:bg-[#0b1326] transition-colors pt-20 pb-14 sm:pt-28 sm:pb-20">
                <div className="absolute -top-40 end-0 h-[500px] w-[500px] rounded-full bg-slate-200/50 dark:bg-[#1e293b]/30 blur-[120px] pointer-events-none" />
                <div className="absolute top-60 -start-20 h-[350px] w-[350px] rounded-full bg-[#d4af37]/10 dark:bg-[#312e81]/20 blur-[100px] pointer-events-none" />

                <AnimatedSection className="relative mx-auto max-w-5xl px-6 lg:px-8" animation="fade-up">
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-[#45474c] bg-white dark:bg-[#131b2e] px-4 py-1.5 font-['Inter'] text-xs font-semibold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176] shadow-sm dark:shadow-none">
                        {isAr ? "الأعمال والمشاريع" : "Portfolio"}
                    </span>
                    <h1
                        className="mt-8 font-['Manrope'] text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#dae2fd] sm:text-5xl lg:text-6xl"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        {isAr ? "مشاريع غيّرت حياة الآلاف" : "Projects That Changed Thousands of Lives"}
                    </h1>
                    <p className="mt-6 max-w-3xl font-['Inter'] text-lg leading-relaxed text-slate-600 dark:text-[#8f9097]">
                        {isAr
                            ? "على مدى أكثر من 15 عاماً، أدرت مشاريع تنموية وإنسانية مع منظمات الأمم المتحدة — من حماية الفتيات وتمكينهن، إلى مناهضة الممارسات الضارة، وبناء صمود المجتمعات."
                            : "Over 15+ years, I managed developmental and humanitarian projects with UN organizations — from protecting and empowering girls, to combating harmful practices, and building community resilience."}
                    </p>
                </AnimatedSection>
            </section>

            {/* ═══════════════════════════════════════════════════════
                SECTION 1: UNICEF — Girls Protection & Empowerment
            ═══════════════════════════════════════════════════════ */}
            {unicefProject && (
                <FeaturedProjectSection
                    project={unicefProject}
                    isAr={isAr}
                    icon={<Shield size={24} />}
                    bgClass="bg-white dark:bg-[#131b2e]"
                    borderClass="border-y border-slate-200 dark:border-[#222a3d]"
                    parseResults={parseResults}
                    parseParagraphs={parseParagraphs}
                    sectionIndex={1}
                />
            )}

            {/* ═══════════════════════════════════════════════════════
                SECTION 2: UNFPA — Anti-FGM Campaign
            ═══════════════════════════════════════════════════════ */}
            {unfpaProject && (
                <FeaturedProjectSection
                    project={unfpaProject}
                    isAr={isAr}
                    icon={<Heart size={24} />}
                    bgClass="bg-slate-50 dark:bg-[#0b1326]"
                    borderClass=""
                    parseResults={parseResults}
                    parseParagraphs={parseParagraphs}
                    sectionIndex={2}
                />
            )}

            {/* ═══════════════════════════════════════════════════════
                SECTION 3: Previous Projects
            ═══════════════════════════════════════════════════════ */}
            {previousProjects.length > 0 && (
                <section className="bg-white dark:bg-[#131b2e] transition-colors py-24 border-y border-slate-200 dark:border-[#222a3d]">
                    <div className="mx-auto max-w-6xl px-6 lg:px-8">
                        <AnimatedSection className="mb-14" animation="fade-up">
                            <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176]">
                                {isAr ? "مسيرة العطاء" : "A Journey of Impact"}
                            </span>
                            <h2 className="mt-3 font-['Manrope'] text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] sm:text-4xl">
                                {isAr ? "مشاريع سابقة" : "Previous Projects"}
                            </h2>
                            <p className="mt-4 max-w-2xl font-['Inter'] text-base text-slate-600 dark:text-[#8f9097]">
                                {isAr
                                    ? "محطات مهنية شكّلت الأساس لخبرتي في العمل التنموي والإنساني."
                                    : "Career milestones that formed the foundation of my expertise in development and humanitarian work."}
                            </p>
                        </AnimatedSection>

                        <AnimatedSection animation="stagger" delay={0.15}>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {previousProjects.map((project: any) => {
                                    const title = isAr ? project.titleAr : project.titleEn;
                                    const client = isAr ? project.clientAr : project.clientEn;
                                    const desc = isAr ? project.descriptionAr : project.descriptionEn;
                                    const year = project.completionDate
                                        ? new Date(project.completionDate).getFullYear()
                                        : null;

                                    return (
                                        <div
                                            key={project.id}
                                            className="group relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-[#0b1326] border border-slate-100 dark:border-[#171f33] p-6 sm:p-8 transition-all hover:border-slate-200 dark:hover:border-[#45474c] hover:shadow-lg dark:hover:shadow-none hover:-translate-y-1"
                                        >
                                            {/* Top: client pill + year */}
                                            <div className="flex items-center justify-between mb-5">
                                                {client && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d4af37]/8 dark:bg-[#e9c176]/8 px-3 py-1 font-['Inter'] text-[11px] font-semibold text-[#d4af37] dark:text-[#e9c176]">
                                                        <Building2 size={11} />
                                                        {client}
                                                    </span>
                                                )}
                                                {year && (
                                                    <span className="font-['Inter'] text-xs text-slate-400 dark:text-[#5a5b63]">
                                                        {year}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="font-['Manrope'] text-lg font-bold text-slate-900 dark:text-[#dae2fd] leading-snug mb-3">
                                                {title}
                                            </h3>

                                            {desc && (
                                                <p className="font-['Inter'] text-sm leading-relaxed text-slate-600 dark:text-[#8f9097] line-clamp-4">
                                                    {desc}
                                                </p>
                                            )}

                                            {/* Bottom accent line */}
                                            <div className="absolute bottom-0 start-0 end-0 h-0.5 bg-gradient-to-r from-[#d4af37]/0 via-[#d4af37]/40 to-[#d4af37]/0 dark:from-[#e9c176]/0 dark:via-[#e9c176]/30 dark:to-[#e9c176]/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    );
                                })}
                            </div>
                        </AnimatedSection>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════════
                SECTION 4: Case Studies
            ═══════════════════════════════════════════════════════ */}
            {caseStudies.length > 0 && (
                <section className="bg-slate-50 dark:bg-[#0b1326] transition-colors py-24">
                    <div className="mx-auto max-w-6xl px-6 lg:px-8">
                        <AnimatedSection className="mb-14" animation="fade-up">
                            <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176]">
                                {isAr ? "تحليل معمّق" : "In-Depth Analysis"}
                            </span>
                            <h2 className="mt-3 font-['Manrope'] text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] sm:text-4xl">
                                {isAr ? "دراسات حالة" : "Case Studies"}
                            </h2>
                            <p className="mt-4 max-w-2xl font-['Inter'] text-base text-slate-600 dark:text-[#8f9097]">
                                {isAr
                                    ? "نظرة معمّقة على التحديات والحلول والأثر الذي حققته مشاريعنا الرئيسية."
                                    : "A deeper look at the challenges, solutions, and impact of our key projects."}
                            </p>
                        </AnimatedSection>

                        <AnimatedSection animation="stagger" delay={0.15}>
                            <div className="grid gap-8 lg:grid-cols-2">
                                {caseStudies.map((study: any) => {
                                    const title = isAr ? study.titleAr : study.titleEn;
                                    const challenge = isAr ? study.challengeAr : study.challengeEn;
                                    const solution = isAr ? study.solutionAr : study.solutionEn;
                                    const impact = isAr ? study.impactAr : study.impactEn;
                                    const projectTitle = isAr
                                        ? study.project?.titleAr
                                        : study.project?.titleEn;

                                    return (
                                        <div
                                            key={study.id}
                                            className="group rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-[#222a3d] overflow-hidden transition-all hover:border-slate-300 dark:hover:border-[#45474c] hover:shadow-lg dark:hover:shadow-none hover:-translate-y-1"
                                        >
                                            {/* Header */}
                                            <div className="p-6 sm:p-8 pb-0">
                                                {projectTitle && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d4af37]/8 dark:bg-[#e9c176]/8 px-3 py-1 font-['Inter'] text-[11px] font-semibold text-[#d4af37] dark:text-[#e9c176] mb-4">
                                                        <Globe size={11} />
                                                        {projectTitle}
                                                    </span>
                                                )}
                                                <h3 className="font-['Manrope'] text-xl font-bold text-slate-900 dark:text-[#dae2fd] leading-snug">
                                                    {title}
                                                </h3>
                                            </div>

                                            {/* Three-phase content */}
                                            <div className="p-6 sm:p-8 pt-5 space-y-5">
                                                {/* Challenge */}
                                                {challenge && (
                                                    <div className="flex gap-3.5">
                                                        <div className="flex size-8 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-900/15 flex-shrink-0 mt-0.5">
                                                            <Lightbulb
                                                                size={15}
                                                                className="text-rose-500 dark:text-rose-400"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 mb-1">
                                                                {isAr ? "التحدي" : "Challenge"}
                                                            </p>
                                                            <p className="font-['Inter'] text-sm text-slate-600 dark:text-[#8f9097] leading-relaxed">
                                                                {challenge}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Solution */}
                                                {solution && (
                                                    <div className="flex gap-3.5">
                                                        <div className="flex size-8 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-900/15 flex-shrink-0 mt-0.5">
                                                            <Target
                                                                size={15}
                                                                className="text-sky-500 dark:text-sky-400"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-sky-500 dark:text-sky-400 mb-1">
                                                                {isAr ? "الحل" : "Solution"}
                                                            </p>
                                                            <p className="font-['Inter'] text-sm text-slate-600 dark:text-[#8f9097] leading-relaxed">
                                                                {solution}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Impact */}
                                                {impact && (
                                                    <div className="flex gap-3.5">
                                                        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/15 flex-shrink-0 mt-0.5">
                                                            <TrendingUp
                                                                size={15}
                                                                className="text-emerald-500 dark:text-emerald-400"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400 mb-1">
                                                                {isAr ? "الأثر" : "Impact"}
                                                            </p>
                                                            <p className="font-['Inter'] text-sm text-slate-600 dark:text-[#8f9097] leading-relaxed">
                                                                {impact}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </AnimatedSection>
                    </div>
                </section>
            )}
        </>
    );
}

/* ════════════════════════════════════════════════════════════
   Featured Project Section (Sections 1 & 2)
   — Storytelling layout with content + results
════════════════════════════════════════════════════════════ */
function FeaturedProjectSection({
    project,
    isAr,
    icon,
    bgClass,
    borderClass,
    parseResults,
    parseParagraphs,
    sectionIndex,
}: {
    project: any;
    isAr: boolean;
    icon: React.ReactNode;
    bgClass: string;
    borderClass: string;
    parseResults: (t: string | null | undefined) => string[];
    parseParagraphs: (t: string | null | undefined) => string[];
    sectionIndex: number;
}) {
    const title = isAr ? project.titleAr : project.titleEn;
    const client = isAr ? project.clientAr : project.clientEn;
    const description = isAr ? project.descriptionAr : project.descriptionEn;
    const contentParagraphs = parseParagraphs(isAr ? project.contentAr : project.contentEn);
    const results = parseResults(isAr ? project.resultsAr : project.resultsEn);
    const year = project.completionDate
        ? new Date(project.completionDate).getFullYear()
        : null;

    return (
        <section className={`${bgClass} ${borderClass} transition-colors py-24`}>
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
                <AnimatedSection animation="fade-up">
                    {/* Section header */}
                    <div className="flex items-start gap-4 mb-10">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#d4af37]/10 dark:bg-[#e9c176]/10 text-[#d4af37] dark:text-[#e9c176] flex-shrink-0">
                            {icon}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                {client && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d4af37]/8 dark:bg-[#e9c176]/8 px-3 py-1 font-['Inter'] text-[11px] font-semibold text-[#d4af37] dark:text-[#e9c176]">
                                        <Building2 size={11} />
                                        {client}
                                    </span>
                                )}
                                {year && (
                                    <span className="inline-flex items-center gap-1.5 font-['Inter'] text-xs text-slate-400 dark:text-[#5a5b63]">
                                        <Calendar size={12} />
                                        {year}
                                    </span>
                                )}
                            </div>
                            <h2 className="font-['Manrope'] text-2xl font-extrabold text-slate-900 dark:text-[#dae2fd] sm:text-3xl leading-snug">
                                {title}
                            </h2>
                        </div>
                    </div>

                    {/* Overview */}
                    {description && (
                        <p className="mb-8 font-['Inter'] text-base font-medium text-slate-700 dark:text-[#c5c6cd] leading-relaxed border-s-2 border-[#d4af37]/40 dark:border-[#e9c176]/30 ps-5">
                            {description}
                        </p>
                    )}
                </AnimatedSection>

                {/* Story content */}
                <AnimatedSection animation="fade-up" delay={0.15}>
                    <div className="grid gap-10 lg:grid-cols-5">
                        {/* Main content (3/5) */}
                        <div className="lg:col-span-3 space-y-5">
                            {contentParagraphs.map((p, i) => (
                                <p
                                    key={i}
                                    className="font-['Inter'] text-sm leading-[1.9] text-slate-600 dark:text-[#8f9097] sm:text-base"
                                >
                                    {p}
                                </p>
                            ))}
                        </div>

                        {/* Results sidebar (2/5) */}
                        {results.length > 0 && (
                            <div className="lg:col-span-2">
                                <div className="rounded-2xl bg-slate-50 dark:bg-[#0b1326] border border-slate-100 dark:border-[#171f33] p-6 sm:p-8 sticky top-28">
                                    <h3 className="flex items-center gap-2 font-['Manrope'] text-sm font-bold uppercase tracking-wider text-[#d4af37] dark:text-[#e9c176] mb-5">
                                        <TrendingUp size={16} />
                                        {isAr ? "النتائج الرئيسية" : "Key Results"}
                                    </h3>
                                    <ul className="space-y-3.5">
                                        {results.map((item, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-2.5 font-['Inter'] text-sm text-slate-700 dark:text-[#c5c6cd]"
                                            >
                                                <CheckCircle2
                                                    size={16}
                                                    className="text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5"
                                                />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
