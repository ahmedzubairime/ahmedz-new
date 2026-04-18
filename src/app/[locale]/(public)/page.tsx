import { Link } from "@/i18n/navigation";
import { getProjects, getCaseStudies } from "@/app/actions/portfolio";
import { getLocale } from "next-intl/server";

export default async function HomePage() {
    const locale = await getLocale();
    const isAr = locale === "ar";
    const projects = await getProjects();
    
    return (
        <>
            <HeroSection isAr={isAr} />
            <FeaturedProjects projects={projects.slice(0, 2)} isAr={isAr} />
            <InsightsSection isAr={isAr} />
            <TestimonialsSection isAr={isAr} />
            <CTABanner isAr={isAr} />
        </>
    );
}

function HeroSection({ isAr }: { isAr: boolean }) {
    return (
        <section className="relative overflow-hidden bg-[#0b1326]">
            {/* Gradient orbs */}
            <div className="absolute start-1/4 top-20 h-[500px] w-[500px] rounded-full bg-[#1e293b]/40 blur-[120px]" />
            <div className="absolute bottom-20 end-1/4 h-[400px] w-[400px] rounded-full bg-[#312E81]/20 blur-[120px]" />
            <div className="absolute end-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-[#C5A059]/10 blur-[100px]" />

            <div className="relative mx-auto flex min-h-[85vh] max-w-5xl flex-col items-center justify-center px-6 py-32 text-center">
                <span className="mb-8 inline-flex items-center gap-2 rounded bg-[#131b2e] px-4 py-2 font-['Inter'] text-xs font-semibold uppercase tracking-widest text-[#e9c176]">
                    ✦ {isAr ? "مستشار استراتيجي أول" : "Senior Strategic Consultant"}
                </span>

                <h1 className="mb-8 font-['Manrope'] text-5xl font-extrabold leading-[1.1] tracking-tight text-[#dae2fd] sm:text-6xl lg:text-7xl" style={{ letterSpacing: "-0.02em" }}>
                    {isAr
                        ? "قيادة التأثير من خلال الإدارة الاستراتيجية"
                        : "Driving Impact Through Strategic Leadership"}
                </h1>

                <p className="mb-12 max-w-2xl font-['Inter'] text-lg leading-relaxed text-[#8f9097] sm:text-xl">
                    {isAr
                        ? "أكثر من 15 عامًا من الخبرة المتفانية في تنسيق المبادرات الإنسانية المعقدة وتعزيز التنمية المستدامة في المناطق غير المستقرة."
                        : "Over 15 years of dedicated experience orchestrating complex humanitarian initiatives and driving sustainable development across volatile regions."}
                </p>

                <div className="flex flex-col gap-4 sm:flex-row">
                    <Link
                        href="/portfolio"
                        className="rounded bg-gradient-to-r from-[#e9c176] to-[#C5A059] px-8 py-3.5 font-['Inter'] text-sm font-bold text-[#0b1326] transition-all hover:shadow-lg hover:shadow-[#e9c176]/25"
                    >
                        {isAr ? "عرض المشاريع" : "View Projects"}
                    </Link>
                    <Link
                        href="/contact"
                        className="rounded border border-[#45474c]/30 px-8 py-3.5 font-['Inter'] text-sm font-semibold text-[#dae2fd] transition-all hover:border-[#e9c176]/50 hover:text-[#e9c176]"
                    >
                        {isAr ? "تواصل معي" : "Contact Me"}
                    </Link>
                </div>
            </div>
        </section>
    );
}

function FeaturedProjects({ projects, isAr }: { projects: any[]; isAr: boolean }) {
    return (
        <section className="bg-[#0b1326] py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-16">
                    <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                        {isAr ? "أعمال مميزة" : "Featured Work"}
                    </span>
                    <h2 className="mt-3 font-['Manrope'] text-4xl font-extrabold tracking-tight text-[#dae2fd]" style={{ letterSpacing: "-0.02em" }}>
                        {isAr ? "مشاريع مختارة" : "Selected Projects"}
                    </h2>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="group relative overflow-hidden rounded-xl bg-[#131b2e] transition-all hover:bg-[#171f33]"
                        >
                            {/* Image placeholder */}
                            <div className="aspect-video w-full bg-[#222a3d]">
                                {project.coverImage ? (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${project.coverImage.bucket}/${project.coverImage.storagePath}`}
                                        alt={isAr ? project.titleAr : project.titleEn}
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl text-[#45474c]">image</span>
                                    </div>
                                )}
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-transparent to-transparent opacity-60" />
                            </div>

                            <div className="p-8">
                                <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                                    {isAr ? project.clientAr : project.clientEn}
                                </span>
                                <h3 className="mt-2 font-['Manrope'] text-2xl font-extrabold text-[#dae2fd]">
                                    {isAr ? project.titleAr : project.titleEn}
                                </h3>
                                <p className="mt-3 line-clamp-2 font-['Inter'] text-sm leading-relaxed text-[#8f9097]">
                                    {isAr ? project.descriptionAr : project.descriptionEn}
                                </p>
                                <Link
                                    href={`/portfolio`}
                                    className="mt-6 inline-flex items-center gap-2 font-['Inter'] text-sm font-bold text-[#e9c176] transition-colors hover:text-[#ffdea5]"
                                >
                                    {isAr ? "عرض دراسة الحالة" : "View Case Study"} →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function InsightsSection({ isAr }: { isAr: boolean }) {
    const articles = [
        {
            category: isAr ? "إدارة المشاريع" : "Project Management",
            title: isAr ? "التعامل مع البيروقراطية في مناطق الأزمات" : "Navigating Bureaucracy in Crisis Zones",
            excerpt: isAr
                ? "نهج عملي للحفاظ على المرونة التشغيلية مع الالتزام بالأطر الدولية الصارمة."
                : "A pragmatic approach to maintaining operational agility while adhering to rigid international frameworks.",
            date: "Mar 2026",
            readTime: isAr ? "5 دقائق" : "5 min read",
        },
        {
            category: isAr ? "المراقبة والتقييم" : "M&E",
            title: isAr ? "تقييم الأثر المبني على البيانات" : "Data-Driven Impact Assessment",
            excerpt: isAr
                ? "تجاوز قصص النجاح القصصية لتأسيس مقاييس صارمة وقابلة للقياس."
                : "Moving beyond anecdotal success stories to establish rigorous, quantifiable metrics.",
            date: "Feb 2026",
            readTime: isAr ? "7 دقائق" : "7 min read",
        },
        {
            category: isAr ? "القيادة" : "Leadership",
            title: isAr ? "بناء فرق محلية مرنة" : "Building Resilient Local Teams",
            excerpt: isAr
                ? "استراتيجيات لتمكين الموظفين المحليين وتعزيز الملكية الحقيقية."
                : "Strategies for empowering local staff and fostering genuine ownership of developmental initiatives.",
            date: "Jan 2026",
            readTime: isAr ? "4 دقائق" : "4 min read",
        },
    ];

    return (
        <section className="bg-[#131b2e] py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-16 flex items-end justify-between">
                    <div>
                        <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                            {isAr ? "رؤى ومقالات" : "Insights & Articles"}
                        </span>
                        <h2 className="mt-3 font-['Manrope'] text-4xl font-extrabold tracking-tight text-[#dae2fd]" style={{ letterSpacing: "-0.02em" }}>
                            {isAr ? "أحدث الأفكار" : "Latest Thinking"}
                        </h2>
                    </div>
                    <Link
                        href="/blog"
                        className="hidden font-['Inter'] text-sm font-bold text-[#e9c176] transition-colors hover:text-[#ffdea5] sm:inline-flex"
                    >
                        {isAr ? "عرض الكل" : "Read All"} →
                    </Link>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article, i) => (
                        <article
                            key={i}
                            className="group rounded-xl bg-[#0b1326] p-1 transition-all hover:bg-[#171f33]"
                        >
                            <div className="aspect-[3/2] w-full rounded-lg bg-[#222a3d]">
                                <div className="flex size-full items-center justify-center">
                                    <span className="material-symbols-outlined text-3xl text-[#45474c]">article</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-3">
                                    <span className="font-['Inter'] text-xs font-bold text-[#e9c176]">
                                        {article.category}
                                    </span>
                                    <span className="text-[#45474c]">·</span>
                                    <span className="font-['Inter'] text-xs text-[#8f9097]">
                                        {article.date}
                                    </span>
                                </div>
                                <h3 className="mt-3 font-['Manrope'] text-lg font-extrabold text-[#dae2fd] group-hover:text-[#e9c176] transition-colors">
                                    {article.title}
                                </h3>
                                <p className="mt-2 line-clamp-2 font-['Inter'] text-sm leading-relaxed text-[#8f9097]">
                                    {article.excerpt}
                                </p>
                                <span className="mt-4 inline-block font-['Inter'] text-xs text-[#8f9097]">
                                    {article.readTime}
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TestimonialsSection({ isAr }: { isAr: boolean }) {
    const testimonials = [
        {
            quote: isAr
                ? "قدرة أحمد على تجميع الحقائق الجيوسياسية المعقدة في أطر استراتيجية قابلة للتنفيذ لا مثيل لها."
                : "Ahmed's ability to synthesize complex geopolitical realities into actionable strategic frameworks is unparalleled.",
            name: "Sarah Davies",
            title: isAr ? "مديرة البرامج الإقليمية" : "Regional Programs Director",
            org: "UNICEF",
        },
        {
            quote: isAr
                ? "في أصعب بيئات النشر، وفرت سلطة أحمد الهادئة وتخطيطه الدقيق الاستقرار الذي احتاجته فرقنا."
                : "In the most challenging deployment environments, Ahmed's quiet authority and meticulous planning provided the stability our teams needed.",
            name: "Marcus Jensen",
            title: isAr ? "رئيس العمليات الميدانية" : "Head of Field Operations",
            org: "UNFPA",
        },
        {
            quote: isAr
                ? "حول أحمد نهجنا في المراقبة والتقييم بالكامل. نتائج عمله لا تزال تؤثر في صنع القرار لدينا."
                : "Ahmed completely transformed our approach to M&E. The results of his work continue to influence our decision-making today.",
            name: "Amira Khalil",
            title: isAr ? "مسؤولة التنمية المستدامة" : "Sustainable Development Officer",
            org: "UNDP",
        },
    ];

    return (
        <section className="bg-[#0b1326] py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                        {isAr ? "ماذا يقول الشركاء" : "What Partners Say"}
                    </span>
                    <h2 className="mt-3 font-['Manrope'] text-4xl font-extrabold tracking-tight text-[#dae2fd]" style={{ letterSpacing: "-0.02em" }}>
                        {isAr ? "شهادات موثوقة" : "Trusted Testimonials"}
                    </h2>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="rounded-xl bg-[#131b2e] p-8 transition-all hover:bg-[#171f33]"
                        >
                            <span className="font-['Manrope'] text-5xl leading-none text-[#e9c176]/30">"</span>
                            <p className="mt-2 font-['Inter'] text-sm leading-relaxed text-[#c5c6cd]">
                                {t.quote}
                            </p>
                            <div className="mt-8 flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-full bg-[#222a3d] font-['Manrope'] text-sm font-bold text-[#e9c176]">
                                    {t.name.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <div>
                                    <p className="font-['Manrope'] text-sm font-bold text-[#dae2fd]">
                                        {t.name}
                                    </p>
                                    <p className="font-['Inter'] text-xs text-[#8f9097]">
                                        {t.title}, <span className="text-[#e9c176]">{t.org}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTABanner({ isAr }: { isAr: boolean }) {
    return (
        <section className="relative overflow-hidden bg-[#131b2e] py-24">
            <div className="absolute start-1/4 top-0 h-[300px] w-[300px] rounded-full bg-[#e9c176]/5 blur-[100px]" />
            <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
                <h2 className="font-['Manrope'] text-4xl font-extrabold tracking-tight text-[#dae2fd]" style={{ letterSpacing: "-0.02em" }}>
                    {isAr ? "لنصنع التأثير معًا" : "Let's Create Impact Together"}
                </h2>
                <p className="mt-6 font-['Inter'] text-lg leading-relaxed text-[#8f9097]">
                    {isAr
                        ? "متاح للاستشارات الاستراتيجية والأدوار الاستشارية رفيعة المستوى والتحدث في المناسبات."
                        : "Available for strategic consulting, high-level advisory roles, and speaking engagements on international development."}
                </p>
                <Link
                    href="/contact"
                    className="mt-10 inline-flex rounded bg-gradient-to-r from-[#e9c176] to-[#C5A059] px-10 py-4 font-['Inter'] text-sm font-bold text-[#0b1326] transition-all hover:shadow-xl hover:shadow-[#e9c176]/20"
                >
                    {isAr ? "تواصل معي" : "Get In Touch"}
                </Link>
            </div>
        </section>
    );
}
