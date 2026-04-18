import { getLocale } from "next-intl/server";
import { getExperiences, getSkills } from "@/app/actions/portfolio";
import { Link } from "@/i18n/navigation";

export default async function ResumePage() {
    const locale = await getLocale();
    const isAr = locale === "ar";
    const experiences = await getExperiences();
    const skills = await getSkills();

    const hardSkills = skills.filter((s: any) => s.category === "hard_skill");
    const softSkills = skills.filter((s: any) => s.category === "soft_skill");

    return (
        <>
            <PageHero isAr={isAr} />
            <ExperienceTimeline experiences={experiences} isAr={isAr} />
            <SkillsDashboard hardSkills={hardSkills} softSkills={softSkills} isAr={isAr} />
            <LanguagesSection isAr={isAr} />
            <ServicesSection isAr={isAr} />
            <DownloadCTA isAr={isAr} />
        </>
    );
}

function PageHero({ isAr }: { isAr: boolean }) {
    return (
        <section className="bg-[#0b1326] py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                    {isAr ? "السيرة المهنية" : "Professional Resume"}
                </span>
                <h1 className="mt-3 font-['Manrope'] text-5xl font-extrabold tracking-tight text-[#dae2fd]" style={{ letterSpacing: "-0.02em" }}>
                    {isAr ? "الخبرات والمهارات" : "Experience & Expertise"}
                </h1>
                <p className="mt-4 max-w-2xl font-['Inter'] text-lg text-[#8f9097]">
                    {isAr ? "نظرة شاملة على خلفيتي المهنية ومهاراتي وخدماتي." : "A comprehensive overview of my professional background, skills, and services."}
                </p>
            </div>
        </section>
    );
}

function ExperienceTimeline({ experiences, isAr }: { experiences: any[]; isAr: boolean }) {
    return (
        <section className="bg-[#131b2e] py-24">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
                <div className="mb-16">
                    <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                        {isAr ? "الخبرات المهنية" : "Professional Experience"}
                    </span>
                    <h2 className="mt-3 font-['Manrope'] text-3xl font-extrabold tracking-tight text-[#dae2fd]">
                        {isAr ? "المسار الوظيفي" : "Career Path"}
                    </h2>
                </div>

                <div className="relative">
                    <div className="absolute start-8 top-0 h-full w-px bg-gradient-to-b from-[#e9c176]/50 via-[#45474c]/30 to-transparent" />

                    <div className="space-y-10">
                        {experiences.map((exp: any, i: number) => (
                            <div key={exp.id || i} className="relative flex gap-8">
                                <div className="z-10 flex size-16 shrink-0 items-center justify-center rounded-lg bg-[#222a3d] font-['Manrope'] text-xs font-extrabold text-[#e9c176]">
                                    {exp.startDate ? new Date(exp.startDate).getFullYear() : "—"}
                                </div>
                                <div className="flex-1 rounded-xl bg-[#0b1326] p-8">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="font-['Inter'] text-xs font-bold text-[#e9c176]">
                                            {isAr ? exp.companyAr : exp.companyEn}
                                        </span>
                                        {exp.isCurrent && (
                                            <span className="rounded bg-[#e9c176]/10 px-2 py-0.5 font-['Inter'] text-[10px] font-bold text-[#e9c176]">
                                                {isAr ? "الحالي" : "Current"}
                                            </span>
                                        )}
                                        <span className="rounded bg-[#222a3d] px-2 py-0.5 font-['Inter'] text-[10px] text-[#8f9097]">
                                            {isAr ? exp.sectorAr : exp.sectorEn}
                                        </span>
                                    </div>
                                    <h3 className="mt-2 font-['Manrope'] text-xl font-extrabold text-[#dae2fd]">
                                        {isAr ? exp.roleAr : exp.roleEn}
                                    </h3>
                                    <p className="mt-3 font-['Inter'] text-sm leading-relaxed text-[#8f9097]">
                                        {isAr ? exp.descriptionAr : exp.descriptionEn}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function SkillsDashboard({ hardSkills, softSkills, isAr }: { hardSkills: any[]; softSkills: any[]; isAr: boolean }) {
    return (
        <section className="bg-[#0b1326] py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-16">
                    <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                        {isAr ? "المهارات" : "Skills"}
                    </span>
                    <h2 className="mt-3 font-['Manrope'] text-3xl font-extrabold tracking-tight text-[#dae2fd]">
                        {isAr ? "لوحة الكفاءات" : "Competency Dashboard"}
                    </h2>
                </div>

                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Hard Skills */}
                    <div>
                        <h3 className="mb-6 font-['Manrope'] text-lg font-extrabold text-[#dae2fd]">
                            {isAr ? "المهارات التقنية" : "Hard Skills"}
                        </h3>
                        <div className="space-y-6">
                            {hardSkills.map((skill: any) => (
                                <div key={skill.id}>
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="font-['Inter'] text-sm font-medium text-[#c5c6cd]">
                                            {isAr ? skill.nameAr : skill.nameEn}
                                        </span>
                                        <span className="font-['Manrope'] text-sm font-bold text-[#e9c176]">
                                            {skill.proficiencyLevel}%
                                        </span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-[#222a3d]">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-[#e9c176] to-[#C5A059]"
                                            style={{ width: `${skill.proficiencyLevel}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Soft Skills */}
                    <div>
                        <h3 className="mb-6 font-['Manrope'] text-lg font-extrabold text-[#dae2fd]">
                            {isAr ? "المهارات الشخصية" : "Soft Skills"}
                        </h3>
                        <div className="space-y-6">
                            {softSkills.map((skill: any) => (
                                <div key={skill.id}>
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="font-['Inter'] text-sm font-medium text-[#c5c6cd]">
                                            {isAr ? skill.nameAr : skill.nameEn}
                                        </span>
                                        <span className="font-['Manrope'] text-sm font-bold text-[#e9c176]">
                                            {skill.proficiencyLevel}%
                                        </span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-[#222a3d]">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-[#e9c176] to-[#C5A059]"
                                            style={{ width: `${skill.proficiencyLevel}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function LanguagesSection({ isAr }: { isAr: boolean }) {
    const languages = [
        { name: isAr ? "العربية" : "Arabic", level: isAr ? "اللغة الأم" : "Native", percent: 100 },
        { name: isAr ? "الإنجليزية" : "English", level: isAr ? "طلاقة" : "Fluent", percent: 90 },
        { name: isAr ? "الفرنسية" : "French", level: isAr ? "أساسي" : "Basic", percent: 30 },
    ];

    return (
        <section className="bg-[#131b2e] py-24">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
                <div className="mb-12">
                    <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                        {isAr ? "اللغات" : "Languages"}
                    </span>
                </div>
                <div className="grid gap-6 sm:grid-cols-3">
                    {languages.map((lang) => (
                        <div key={lang.name} className="rounded-xl bg-[#0b1326] p-8 text-center">
                            <h3 className="font-['Manrope'] text-xl font-extrabold text-[#dae2fd]">{lang.name}</h3>
                            <p className="mt-1 font-['Inter'] text-sm text-[#e9c176]">{lang.level}</p>
                            <div className="mx-auto mt-4 h-2 w-full overflow-hidden rounded-full bg-[#222a3d]">
                                <div className="h-full rounded-full bg-gradient-to-r from-[#e9c176] to-[#C5A059]" style={{ width: `${lang.percent}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ServicesSection({ isAr }: { isAr: boolean }) {
    const services = [
        { icon: "folder_managed", title: isAr ? "إدارة المشاريع" : "Project Management", desc: isAr ? "تخطيط وتنفيذ ومراقبة المشاريع المعقدة." : "Planning, executing, and monitoring complex projects." },
        { icon: "handshake", title: isAr ? "تطوير الشراكات" : "Partnership Development", desc: isAr ? "بناء علاقات استراتيجية مع أصحاب المصلحة." : "Building strategic relationships with stakeholders." },
        { icon: "groups", title: isAr ? "إدارة الموارد البشرية" : "HR Management", desc: isAr ? "توظيف وتدريب وتطوير الكفاءات." : "Recruiting, training, and developing talent." },
        { icon: "account_balance", title: isAr ? "إدارة الموارد" : "Resource Management", desc: isAr ? "تخصيص الموارد بكفاءة لتحقيق الأهداف." : "Efficiently allocating resources to achieve goals." },
    ];

    return (
        <section className="bg-[#0b1326] py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-16">
                    <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                        {isAr ? "الخدمات" : "Services Offered"}
                    </span>
                    <h2 className="mt-3 font-['Manrope'] text-3xl font-extrabold tracking-tight text-[#dae2fd]">
                        {isAr ? "ما أقدمه" : "What I Offer"}
                    </h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {services.map((s) => (
                        <div key={s.title} className="rounded-xl bg-[#131b2e] p-8 transition-all hover:bg-[#171f33]">
                            <div className="flex size-12 items-center justify-center rounded-lg bg-[#222a3d]">
                                <span className="material-symbols-outlined text-xl text-[#e9c176]">{s.icon}</span>
                            </div>
                            <h3 className="mt-4 font-['Manrope'] text-lg font-extrabold text-[#dae2fd]">{s.title}</h3>
                            <p className="mt-2 font-['Inter'] text-sm leading-relaxed text-[#8f9097]">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function DownloadCTA({ isAr }: { isAr: boolean }) {
    return (
        <section className="bg-[#131b2e] py-16">
            <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
                <Link
                    href="/contact"
                    className="inline-flex items-center gap-3 rounded bg-gradient-to-r from-[#e9c176] to-[#C5A059] px-10 py-4 font-['Inter'] text-sm font-bold text-[#0b1326] transition-all hover:shadow-xl hover:shadow-[#e9c176]/20"
                >
                    <span className="material-symbols-outlined text-lg">download</span>
                    {isAr ? "تحميل السيرة الذاتية الكاملة" : "Download Full CV"}
                </Link>
            </div>
        </section>
    );
}
