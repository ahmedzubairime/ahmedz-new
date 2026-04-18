import { getLocale } from "next-intl/server";

export default async function AboutPage() {
    const locale = await getLocale();
    const isAr = locale === "ar";

    return (
        <>
            <BioHeader isAr={isAr} />
            <JourneyTimeline isAr={isAr} />
            <CertificatesGrid isAr={isAr} />
            <ValuesSection isAr={isAr} />
        </>
    );
}

function BioHeader({ isAr }: { isAr: boolean }) {
    const stats = [
        { value: "15+", label: isAr ? "سنوات خبرة" : "Years Experience" },
        { value: "50+", label: isAr ? "مشروع منجز" : "Projects Delivered" },
        { value: "100K+", label: isAr ? "حياة تأثرت" : "Lives Impacted" },
    ];

    return (
        <section className="bg-[#0b1326] py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    {/* Photo placeholder */}
                    <div className="relative">
                        <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#131b2e]">
                            <div className="flex size-full items-center justify-center">
                                <span className="material-symbols-outlined text-6xl text-[#45474c]">person</span>
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -end-6 h-[200px] w-[200px] rounded-xl bg-[#e9c176]/10 blur-[60px]" />
                    </div>

                    {/* Bio content */}
                    <div>
                        <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                            {isAr ? "من أنا" : "About Me"}
                        </span>
                        <h1 className="mt-3 font-['Manrope'] text-5xl font-extrabold tracking-tight text-[#dae2fd]" style={{ letterSpacing: "-0.02em" }}>
                            Ahmed Al-Zubairi
                        </h1>
                        <p className="mt-6 font-['Inter'] text-base leading-relaxed text-[#c5c6cd]">
                            {isAr
                                ? "مدير مشاريع أول ومستشار استراتيجي يتمتع بخبرة تزيد عن 15 عامًا في القطاع الإنساني والتنموي. عملت مع منظمات الأمم المتحدة الرائدة بما في ذلك اليونيسف وصندوق الأمم المتحدة للسكان، حيث قدت مبادرات معقدة في حماية الأطفال وتمكين المرأة وتعزيز حقوق الإنسان."
                                : "A senior project manager and strategic consultant with over 15 years of experience in the humanitarian and development sector. I have collaborated with leading UN organizations including UNICEF and UNFPA, spearheading complex initiatives in child protection, women's empowerment, and human rights advocacy."}
                        </p>
                        <p className="mt-4 font-['Inter'] text-base leading-relaxed text-[#8f9097]">
                            {isAr
                                ? "أؤمن بأن القيادة الحقيقية تتجلى في القدرة على تحويل التحديات المعقدة إلى فرص مستدامة للتأثير الإيجابي."
                                : "I believe true leadership manifests in the ability to transform complex challenges into sustainable opportunities for positive impact."}
                        </p>

                        {/* Stats */}
                        <div className="mt-10 grid grid-cols-3 gap-6">
                            {stats.map((stat) => (
                                <div key={stat.label} className="rounded-lg bg-[#131b2e] p-5 text-center">
                                    <p className="font-['Manrope'] text-3xl font-extrabold text-[#e9c176]">{stat.value}</p>
                                    <p className="mt-1 font-['Inter'] text-xs text-[#8f9097]">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function JourneyTimeline({ isAr }: { isAr: boolean }) {
    const milestones = [
        { year: "2021", title: isAr ? "مدير مشروع" : "Project Manager", org: "UNICEF", desc: isAr ? "قيادة برنامج حماية وتمكين الفتيات في المناطق المتضررة" : "Leading the Girls Protection & Empowerment Program in affected areas" },
        { year: "2016", title: isAr ? "منسق برامج" : "Program Coordinator", org: "UNFPA", desc: isAr ? "تنسيق حملات مناهضة الممارسات الضارة والتوعية الصحية" : "Coordinating anti-harmful practices campaigns and health awareness" },
        { year: "2012", title: isAr ? "مسؤول مشاريع" : "Project Officer", org: isAr ? "منظمة التنمية المحلية" : "Local Development Org", desc: isAr ? "تصميم وتنفيذ مشاريع تنموية مجتمعية" : "Designing and implementing community development projects" },
        { year: "2008", title: isAr ? "باحث ميداني" : "Field Researcher", org: isAr ? "جامعة صنعاء" : "Sana'a University", desc: isAr ? "البحث الميداني في التنمية المستدامة والحوكمة" : "Field research in sustainable development and governance" },
    ];

    return (
        <section className="bg-[#131b2e] py-24">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                        {isAr ? "المسيرة المهنية" : "Professional Journey"}
                    </span>
                    <h2 className="mt-3 font-['Manrope'] text-4xl font-extrabold tracking-tight text-[#dae2fd]" style={{ letterSpacing: "-0.02em" }}>
                        {isAr ? "محطات بارزة" : "Key Milestones"}
                    </h2>
                </div>

                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute start-8 top-0 h-full w-px bg-gradient-to-b from-[#e9c176]/50 via-[#45474c]/30 to-transparent lg:start-1/2" />

                    <div className="space-y-12">
                        {milestones.map((m, i) => (
                            <div key={i} className={`relative flex items-start gap-8 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                                {/* Year badge */}
                                <div className="absolute start-0 z-10 flex size-16 items-center justify-center rounded-lg bg-[#222a3d] font-['Manrope'] text-sm font-extrabold text-[#e9c176] lg:start-1/2 lg:-translate-x-1/2">
                                    {m.year}
                                </div>

                                {/* Content */}
                                <div className={`ms-24 rounded-xl bg-[#0b1326] p-8 lg:ms-0 lg:w-[calc(50%-4rem)] ${i % 2 === 0 ? "lg:me-auto" : "lg:ms-auto"}`}>
                                    <span className="font-['Inter'] text-xs font-bold text-[#e9c176]">{m.org}</span>
                                    <h3 className="mt-1 font-['Manrope'] text-xl font-extrabold text-[#dae2fd]">{m.title}</h3>
                                    <p className="mt-2 font-['Inter'] text-sm leading-relaxed text-[#8f9097]">{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function CertificatesGrid({ isAr }: { isAr: boolean }) {
    const certs = [
        { name: isAr ? "شهادة إدارة المشاريع" : "PMP Certification", org: "PMI", year: "2018" },
        { name: isAr ? "أخصائي المراقبة والتقييم" : "M&E Specialist", org: "UNDP", year: "2019" },
        { name: isAr ? "شهادة القيادة الإنسانية" : "Humanitarian Leadership", org: "OCHA", year: "2020" },
        { name: isAr ? "إدارة المخاطر" : "Risk Management", org: "ISO", year: "2017" },
        { name: isAr ? "التخطيط الاستراتيجي" : "Strategic Planning", org: "Harvard Online", year: "2021" },
        { name: isAr ? "حماية الطفل" : "Child Protection", org: "UNICEF", year: "2022" },
    ];

    return (
        <section className="bg-[#0b1326] py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                        {isAr ? "الشهادات والمؤهلات" : "Certificates & Qualifications"}
                    </span>
                    <h2 className="mt-3 font-['Manrope'] text-4xl font-extrabold tracking-tight text-[#dae2fd]" style={{ letterSpacing: "-0.02em" }}>
                        {isAr ? "التطوير المهني" : "Professional Development"}
                    </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {certs.map((cert) => (
                        <div key={cert.name} className="rounded-xl bg-[#131b2e] p-8 transition-all hover:bg-[#171f33]">
                            <div className="flex size-12 items-center justify-center rounded-lg bg-[#222a3d]">
                                <span className="material-symbols-outlined text-xl text-[#e9c176]">workspace_premium</span>
                            </div>
                            <h3 className="mt-4 font-['Manrope'] text-lg font-extrabold text-[#dae2fd]">{cert.name}</h3>
                            <p className="mt-1 font-['Inter'] text-sm text-[#8f9097]">{cert.org}</p>
                            <p className="mt-2 font-['Inter'] text-xs text-[#e9c176]">{cert.year}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ValuesSection({ isAr }: { isAr: boolean }) {
    const values = [
        { icon: "verified", title: isAr ? "النزاهة" : "Integrity", desc: isAr ? "الالتزام بأعلى المعايير الأخلاقية والمهنية في كل مشروع." : "Commitment to the highest ethical and professional standards in every project." },
        { icon: "trending_up", title: isAr ? "التأثير المستدام" : "Impact-Driven", desc: isAr ? "التركيز على تحقيق نتائج ملموسة وقابلة للقياس تترك أثرًا دائمًا." : "Focused on delivering tangible, measurable results that leave a lasting mark." },
        { icon: "groups", title: isAr ? "القيادة التعاونية" : "Collaborative Leadership", desc: isAr ? "بناء فرق قوية وشراكات فعالة لتحقيق أهداف مشتركة." : "Building strong teams and effective partnerships to achieve shared goals." },
    ];

    return (
        <section className="bg-[#131b2e] py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                        {isAr ? "القيم الجوهرية" : "Core Values"}
                    </span>
                </div>
                <div className="grid gap-8 lg:grid-cols-3">
                    {values.map((v) => (
                        <div key={v.title} className="rounded-xl bg-[#0b1326] p-10 text-center transition-all hover:bg-[#171f33]">
                            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#222a3d]">
                                <span className="material-symbols-outlined text-2xl text-[#e9c176]">{v.icon}</span>
                            </div>
                            <h3 className="mt-6 font-['Manrope'] text-xl font-extrabold text-[#dae2fd]">{v.title}</h3>
                            <p className="mt-3 font-['Inter'] text-sm leading-relaxed text-[#8f9097]">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
