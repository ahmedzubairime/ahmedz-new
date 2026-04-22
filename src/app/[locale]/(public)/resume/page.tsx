import { getLocale } from "next-intl/server";
import { Metadata } from "next";
import { getExperiences, getSkills } from "@/app/actions/portfolio";
import { AnimatedSection } from "@/components/public/AnimatedSection";
import { Download, Building, Star, MapPin, Calendar } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isAr = locale === "ar";
    return {
        title: isAr ? "السيرة المهنية" : "Resume",
    };
}

export default async function ResumePage() {
    const locale = await getLocale();
    const isAr = locale === "ar";
    const [experiences, skills] = await Promise.all([getExperiences(), getSkills()]);

    return (
        <div className="bg-slate-50 dark:bg-[#0b1326] transition-colors py-20 pb-32 min-h-screen">
            <AnimatedSection className="mx-auto max-w-5xl px-6 lg:px-8" animation="fade-up">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
                    <div>
                        <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176]">
                            {isAr ? "الخبرات والمؤهلات" : "Experience & Qualifications"}
                        </span>
                        <h1 className="mt-3 font-['Manrope'] text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#dae2fd]">
                            {isAr ? "المسار المهني" : "Professional Journey"}
                        </h1>
                    </div>
                    <a
                        href="/resume.pdf"
                        download
                        className="inline-flex items-center gap-2 rounded bg-white dark:bg-[#131b2e] border border-[#d4af37]/30 dark:border-[#e9c176]/30 px-6 py-3 font-['Inter'] text-sm font-bold text-[#d4af37] dark:text-[#e9c176] shadow-sm hover:shadow transition-all hover:bg-slate-50 dark:hover:bg-[#171f33] hover:border-[#d4af37] dark:hover:border-[#e9c176]"
                    >
                        <Download size={18} />
                        {isAr ? "تحميل السيرة الذاتية (PDF)" : "Download Full CV (PDF)"}
                    </a>
                </div>

                <div className="grid gap-16 lg:grid-cols-2">
                    {/* Experience section */}
                    <AnimatedSection animation="stagger" delay={0.2}>
                        <div className="flex items-center gap-3 mb-8">
                            <Building className="text-[#d4af37] dark:text-[#e9c176]" size={28} />
                            <h2 className="font-['Manrope'] text-2xl font-bold text-slate-800 dark:text-[#dae2fd]">
                                {isAr ? "الخبرات العملية" : "Work Experience"}
                            </h2>
                        </div>
                        <div className="space-y-8 border-l border-slate-200 dark:border-[#222a3d] pl-6 md:pl-8 ml-3">
                            {experiences?.map((exp: any) => (
                                <div key={exp.id} className="relative group">
                                    <div className="absolute -left-[45px] md:-left-[53px] top-1 size-5 rounded-full border-4 border-slate-50 dark:border-[#0b1326] bg-[#d4af37] dark:bg-[#e9c176] transition-transform group-hover:scale-125" />
                                    <h3 className="font-['Manrope'] text-lg font-bold text-slate-900 dark:text-[#dae2fd]">
                                        {isAr ? exp.titleAr : exp.titleEn}
                                    </h3>
                                    <p className="mt-1 font-['Inter'] text-sm font-medium text-slate-600 dark:text-[#c5c6cd]">
                                        {isAr ? exp.companyAr : exp.companyEn}
                                    </p>
                                    <div className="mt-3 flex flex-wrap items-center gap-4 font-['Inter'] text-xs text-slate-500 dark:text-[#45474c]">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            <span>
                                                {exp.startDate ? new Date(exp.startDate).getFullYear() : ""} - 
                                                {exp.isCurrent ? (isAr ? " الحاضر" : " Present") : (exp.endDate ? ` ${new Date(exp.endDate).getFullYear()}` : "")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={14} />
                                            <span>{isAr ? exp.locationAr : exp.locationEn}</span>
                                        </div>
                                    </div>
                                    {exp.descriptionEn && exp.descriptionAr && (
                                        <p className="mt-4 font-['Inter'] text-sm text-slate-600 dark:text-[#8f9097] leading-relaxed">
                                            {isAr ? exp.descriptionAr : exp.descriptionEn}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>

                    {/* Skills section */}
                    <AnimatedSection animation="stagger" delay={0.4}>
                        <div className="flex items-center gap-3 mb-8 lg:mt-0 mt-8">
                            <Star className="text-[#d4af37] dark:text-[#e9c176]" size={28} />
                            <h2 className="font-['Manrope'] text-2xl font-bold text-slate-800 dark:text-[#dae2fd]">
                                {isAr ? "المهارات والكفاءات" : "Core Competencies & Skills"}
                            </h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {skills?.map((skill: any) => (
                                <div key={skill.id} className="relative rounded bg-white dark:bg-[#131b2e] shadow-sm dark:shadow-none border border-slate-200 dark:border-[#222a3d] px-4 py-2 font-['Inter'] text-sm text-slate-700 dark:text-[#dae2fd] transition-all hover:-translate-y-1 hover:shadow-md hover:border-[#d4af37] dark:hover:border-[#e9c176]">
                                    {isAr ? skill.nameAr : skill.nameEn}
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </AnimatedSection>
        </div>
    );
}
