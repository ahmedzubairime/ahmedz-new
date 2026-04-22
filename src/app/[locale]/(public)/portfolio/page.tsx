import { getLocale } from "next-intl/server";
import { Metadata } from "next";
import { getProjects, getCaseStudies } from "@/app/actions/portfolio";
import { AnimatedSection } from "@/components/public/AnimatedSection";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isAr = locale === "ar";
    return {
        title: isAr ? "الأعمال والمشاريع" : "Portfolio",
    };
}

export default async function PortfolioPage() {
    const locale = await getLocale();
    const isAr = locale === "ar";
    const [projects, caseStudies] = await Promise.all([getProjects(), getCaseStudies()]);
    const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

    return (
        <div className="bg-slate-50 dark:bg-[#0b1326] transition-colors py-20 pb-32 min-h-screen">
            <AnimatedSection className="mx-auto max-w-7xl px-6 lg:px-8" animation="fade-up">
                <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176]">
                    {isAr ? "الأعمال" : "Portfolio"}
                </span>
                <h1 className="mt-3 font-['Manrope'] text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#dae2fd]">
                    {isAr ? "المشاريع الرئيسية" : "Featured Projects"}
                </h1>
                <p className="mt-4 max-w-2xl font-['Inter'] text-lg text-slate-600 dark:text-[#8f9097]">
                    {isAr 
                        ? "مجموعة مختارة من المشاريع والمبادرات التي قمت بإدارتها والإشراف عليها." 
                        : "A curated selection of initiatives and projects managed and overseen."}
                </p>

                {/* Projects Grid */}
                <AnimatedSection className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3" animation="stagger" delay={0.2}>
                    {projects?.map((project: any) => (
                        <div key={project.id} className="group overflow-hidden rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-[#222a3d] transition-all hover:border-[#d4af37] dark:hover:border-[#45474c] hover:shadow-lg dark:hover:shadow-none hover:bg-slate-50 dark:hover:bg-[#171f33]">
                            {project.mainImage?.storagePath ? (
                                <div className="aspect-video w-full overflow-hidden">
                                    <img 
                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${project.mainImage.bucket}/${project.mainImage.storagePath}`} 
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt={isAr ? project.titleAr : project.titleEn}
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video w-full bg-slate-100 dark:bg-[#222a3d]" />
                            )}
                            <div className="p-6">
                                <h3 className="font-['Manrope'] text-lg font-bold text-slate-900 dark:text-[#dae2fd]">
                                    {isAr ? project.titleAr : project.titleEn}
                                </h3>
                                <p className="mt-2 line-clamp-3 font-['Inter'] text-sm text-slate-600 dark:text-[#8f9097]">
                                    {isAr ? project.descriptionAr : project.descriptionEn}
                                </p>
                            </div>
                        </div>
                    ))}
                </AnimatedSection>

                {/* Case Studies */}
                <AnimatedSection className="mt-32" animation="fade-up" delay={0.3}>
                    <h2 className="font-['Manrope'] text-3xl font-bold text-slate-900 dark:text-[#dae2fd] mb-12">
                        {isAr ? "دراسات الحالة" : "Case Studies"}
                    </h2>
                    <div className="grid gap-12 lg:grid-cols-2">
                        {caseStudies?.map((study: any) => (
                            <div key={study.id} className="rounded-xl bg-white dark:bg-[#131b2e] shadow-sm dark:shadow-none p-8 border border-slate-200 dark:border-[#222a3d] transition-all hover:shadow-md hover:bg-slate-50 dark:hover:bg-[#171f33] hover:-translate-y-1">
                                <h3 className="font-['Manrope'] text-2xl font-bold text-slate-900 dark:text-[#dae2fd]">
                                    {isAr ? study.titleAr : study.titleEn}
                                </h3>
                                <p className="mt-4 font-['Inter'] text-slate-600 dark:text-[#8f9097]">
                                    {isAr ? study.contentAr?.substring(0, 150) : study.contentEn?.substring(0, 150)}...
                                </p>
                                <button className="mt-6 inline-flex items-center gap-2 font-['Inter'] text-sm font-bold text-[#d4af37] dark:text-[#e9c176] transition-colors hover:text-slate-900 dark:hover:text-[#dae2fd]">
                                    {isAr ? "قرأءة المزيد" : "Read More"}
                                    <ArrowIcon size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </AnimatedSection>
        </div>
    );
}
