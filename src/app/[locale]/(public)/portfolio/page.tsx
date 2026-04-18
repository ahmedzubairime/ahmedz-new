import { getLocale } from "next-intl/server";
import { getProjects, getCaseStudies } from "@/app/actions/portfolio";
import { Link } from "@/i18n/navigation";

export default async function PortfolioPage() {
    const locale = await getLocale();
    const isAr = locale === "ar";
    const projects = await getProjects();
    const caseStudies = await getCaseStudies();

    return (
        <>
            <PageHero isAr={isAr} />
            <ProjectsGrid projects={projects} isAr={isAr} />
            <CaseStudiesSection caseStudies={caseStudies} isAr={isAr} />
            <ImpactMetrics isAr={isAr} />
        </>
    );
}

function PageHero({ isAr }: { isAr: boolean }) {
    return (
        <section className="relative overflow-hidden bg-[#0b1326] py-20">
            <div className="absolute end-1/4 top-10 h-[300px] w-[300px] rounded-full bg-[#312E81]/15 blur-[100px]" />
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                    {isAr ? "الحافظة المهنية" : "Portfolio"}
                </span>
                <h1 className="mt-3 font-['Manrope'] text-5xl font-extrabold tracking-tight text-[#dae2fd]" style={{ letterSpacing: "-0.02em" }}>
                    {isAr ? "المشاريع ودراسات الحالة" : "Projects & Case Studies"}
                </h1>
                <p className="mt-4 max-w-2xl font-['Inter'] text-lg text-[#8f9097]">
                    {isAr ? "نظرة على المشاريع التي قدتها في القطاع الإنساني والتنموي." : "A look at the projects I have led across the humanitarian and development sector."}
                </p>
            </div>
        </section>
    );
}

function ProjectsGrid({ projects, isAr }: { projects: any[]; isAr: boolean }) {
    return (
        <section className="bg-[#0b1326] pb-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project: any) => (
                        <div
                            key={project.id}
                            className="group overflow-hidden rounded-xl bg-[#131b2e] transition-all hover:bg-[#171f33]"
                        >
                            <div className="aspect-video w-full bg-[#222a3d]">
                                {project.coverImage ? (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${project.coverImage.bucket}/${project.coverImage.storagePath}`}
                                        alt={isAr ? project.titleAr : project.titleEn}
                                        className="size-full object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl text-[#45474c]">image</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <span className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-[#e9c176]">
                                    {isAr ? project.clientAr : project.clientEn}
                                </span>
                                <h3 className="mt-2 font-['Manrope'] text-lg font-extrabold text-[#dae2fd] group-hover:text-[#e9c176] transition-colors">
                                    {isAr ? project.titleAr : project.titleEn}
                                </h3>
                                <p className="mt-2 line-clamp-2 font-['Inter'] text-sm leading-relaxed text-[#8f9097]">
                                    {isAr ? project.descriptionAr : project.descriptionEn}
                                </p>
                                <span className="mt-4 inline-flex items-center gap-1 font-['Inter'] text-sm font-bold text-[#e9c176]">
                                    {isAr ? "التفاصيل" : "View Details"} →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <span className="material-symbols-outlined text-5xl text-[#45474c]">folder_open</span>
                        <p className="mt-4 font-['Inter'] text-lg text-[#8f9097]">
                            {isAr ? "لا توجد مشاريع بعد" : "No projects yet"}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

function CaseStudiesSection({ caseStudies, isAr }: { caseStudies: any[]; isAr: boolean }) {
    if (!caseStudies.length) return null;

    return (
        <section className="bg-[#131b2e] py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-16">
                    <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                        {isAr ? "دراسات حالة متعمقة" : "In-Depth Case Studies"}
                    </span>
                    <h2 className="mt-3 font-['Manrope'] text-3xl font-extrabold tracking-tight text-[#dae2fd]">
                        {isAr ? "تحليل معمق" : "Deep Analysis"}
                    </h2>
                </div>

                <div className="space-y-10">
                    {caseStudies.map((cs: any, i: number) => (
                        <div key={cs.id || i} className="grid gap-8 rounded-xl bg-[#0b1326] p-8 lg:grid-cols-2 lg:p-12">
                            {/* Image placeholder */}
                            <div className="aspect-video overflow-hidden rounded-lg bg-[#222a3d]">
                                <div className="flex size-full items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-[#45474c]">cases</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col justify-center">
                                <span className="font-['Inter'] text-xs font-bold text-[#e9c176]">
                                    {cs.project ? (isAr ? cs.project.titleAr : cs.project.titleEn) : ""}
                                </span>
                                <h3 className="mt-2 font-['Manrope'] text-2xl font-extrabold text-[#dae2fd]">
                                    {isAr ? cs.titleAr : cs.titleEn}
                                </h3>

                                <div className="mt-6 space-y-4">
                                    <div className="rounded-lg bg-[#131b2e] p-4">
                                        <p className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-[#8f9097]">
                                            {isAr ? "التحدي" : "Challenge"}
                                        </p>
                                        <p className="mt-1 font-['Inter'] text-sm text-[#c5c6cd]">
                                            {isAr ? cs.challengeAr : cs.challengeEn}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-[#131b2e] p-4">
                                        <p className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-[#8f9097]">
                                            {isAr ? "الحل" : "Solution"}
                                        </p>
                                        <p className="mt-1 font-['Inter'] text-sm text-[#c5c6cd]">
                                            {isAr ? cs.solutionAr : cs.solutionEn}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-[#222a3d] p-4">
                                        <p className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-[#e9c176]">
                                            {isAr ? "الأثر" : "Impact"}
                                        </p>
                                        <p className="mt-1 font-['Manrope'] text-sm font-bold text-[#e9c176]">
                                            {isAr ? cs.impactAr : cs.impactEn}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ImpactMetrics({ isAr }: { isAr: boolean }) {
    const metrics = [
        { value: "50+", label: isAr ? "مشروع" : "Projects" },
        { value: "15+", label: isAr ? "سنوات" : "Years" },
        { value: "100K+", label: isAr ? "حياة تأثرت" : "Lives Impacted" },
        { value: "20+", label: isAr ? "شريك" : "Partners" },
    ];

    return (
        <section className="bg-[#060e20] py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                    {metrics.map((m) => (
                        <div key={m.label} className="text-center">
                            <p className="font-['Manrope'] text-4xl font-extrabold text-[#e9c176] lg:text-5xl">{m.value}</p>
                            <p className="mt-2 font-['Inter'] text-sm text-[#8f9097]">{m.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
