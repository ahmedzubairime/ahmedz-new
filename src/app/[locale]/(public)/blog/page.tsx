import { getLocale } from "next-intl/server";

export default async function BlogPage() {
    const locale = await getLocale();
    const isAr = locale === "ar";

    const articles = [
        { id: 1, category: isAr ? "إدارة المشاريع" : "Project Management", title: isAr ? "التعامل مع البيروقراطية في مناطق الأزمات" : "Navigating Bureaucracy in Crisis Zones", excerpt: isAr ? "نهج عملي للحفاظ على المرونة التشغيلية مع الالتزام بالأطر الدولية الصارمة أثناء سيناريوهات الاستجابة السريعة." : "A pragmatic approach to maintaining operational agility while adhering to rigid international frameworks during rapid response scenarios.", date: "Mar 15, 2026", readTime: isAr ? "5 دقائق" : "5 min", featured: true },
        { id: 2, category: isAr ? "المراقبة والتقييم" : "Monitoring & Evaluation", title: isAr ? "تقييم الأثر المبني على البيانات" : "Data-Driven Impact Assessment", excerpt: isAr ? "تجاوز القصص القصصية لتأسيس مقاييس شاملة وقابلة للقياس لتقييم مشاريع التنمية المجتمعية." : "Moving beyond anecdotal success stories to establish rigorous, quantifiable metrics for evaluating community development projects.", date: "Feb 28, 2026", readTime: isAr ? "7 دقائق" : "7 min", featured: false },
        { id: 3, category: isAr ? "القيادة" : "Leadership", title: isAr ? "بناء فرق محلية مرنة" : "Building Resilient Local Teams", excerpt: isAr ? "استراتيجيات لتمكين الموظفين المحليين وتقليل الاعتماد على المستشارين الدوليين وتعزيز الملكية الحقيقية." : "Strategies for empowering local staff, reducing reliance on expatriate consultants, and fostering genuine ownership.", date: "Jan 20, 2026", readTime: isAr ? "4 دقائق" : "4 min", featured: false },
        { id: 4, category: isAr ? "الشراكات" : "Partnerships", title: isAr ? "تعزيز الشراكات الاستراتيجية في القطاع الإنساني" : "Strengthening Strategic Partnerships in Humanitarian Sector", excerpt: isAr ? "كيفية بناء علاقات مستدامة مع المنظمات الدولية والمحلية لتحقيق أثر أكبر." : "How to build sustainable relationships with international and local organizations for greater impact.", date: "Dec 10, 2025", readTime: isAr ? "6 دقائق" : "6 min", featured: false },
        { id: 5, category: isAr ? "حماية الطفل" : "Child Protection", title: isAr ? "مقاربات مبتكرة في حماية الأطفال" : "Innovative Approaches in Child Protection", excerpt: isAr ? "استكشاف الأساليب الجديدة في حماية الأطفال في البيئات المتأثرة بالنزاعات." : "Exploring new methodologies in child protection within conflict-affected environments.", date: "Nov 5, 2025", readTime: isAr ? "5 دقائق" : "5 min", featured: false },
        { id: 6, category: isAr ? "التنمية المستدامة" : "Sustainable Development", title: isAr ? "مستقبل إدارة المشاريع الإنسانية" : "The Future of Humanitarian Project Management", excerpt: isAr ? "نظرة استشرافية لمستقبل إدارة المشاريع في القطاع الإنساني والتحولات المتوقعة." : "A forward-looking perspective on the future of project management in humanitarian work.", date: "Oct 18, 2025", readTime: isAr ? "8 دقائق" : "8 min", featured: false },
    ];

    const featured = articles.find((a) => a.featured);
    const rest = articles.filter((a) => !a.featured);

    return (
        <>
            {/* Page Hero */}
            <section className="bg-[#0b1326] py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                        {isAr ? "المدونة" : "Blog"}
                    </span>
                    <h1 className="mt-3 font-['Manrope'] text-5xl font-extrabold tracking-tight text-[#dae2fd]" style={{ letterSpacing: "-0.02em" }}>
                        {isAr ? "رؤى ومقالات مهنية" : "Insights & Professional Updates"}
                    </h1>
                    <p className="mt-4 max-w-2xl font-['Inter'] text-lg text-[#8f9097]">
                        {isAr ? "مشاركة المعارف والخبرات من العمل الإنساني والإدارة الاستراتيجية." : "Sharing knowledge and experience from humanitarian work and strategic management."}
                    </p>
                </div>
            </section>

            {/* Featured Article */}
            {featured && (
                <section className="bg-[#0b1326] pb-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid overflow-hidden rounded-xl bg-[#131b2e] lg:grid-cols-5">
                            <div className="aspect-video bg-[#222a3d] lg:col-span-3 lg:aspect-auto">
                                <div className="flex size-full items-center justify-center">
                                    <span className="material-symbols-outlined text-5xl text-[#45474c]">article</span>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center p-8 lg:col-span-2 lg:p-12">
                                <span className="font-['Inter'] text-xs font-bold text-[#e9c176]">{featured.category}</span>
                                <h2 className="mt-3 font-['Manrope'] text-2xl font-extrabold text-[#dae2fd] lg:text-3xl">{featured.title}</h2>
                                <p className="mt-4 font-['Inter'] text-sm leading-relaxed text-[#8f9097]">{featured.excerpt}</p>
                                <div className="mt-6 flex items-center gap-3 font-['Inter'] text-xs text-[#8f9097]">
                                    <span>{featured.date}</span>
                                    <span className="text-[#45474c]">·</span>
                                    <span>{featured.readTime}</span>
                                </div>
                                <span className="mt-6 inline-flex font-['Inter'] text-sm font-bold text-[#e9c176]">
                                    {isAr ? "اقرأ المقال" : "Read Article"} →
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Articles Grid */}
            <section className="bg-[#131b2e] py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {rest.map((article) => (
                            <article key={article.id} className="group rounded-xl bg-[#0b1326] p-1 transition-all hover:bg-[#171f33]">
                                <div className="aspect-[3/2] w-full rounded-lg bg-[#222a3d]">
                                    <div className="flex size-full items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl text-[#45474c]">article</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3">
                                        <span className="font-['Inter'] text-xs font-bold text-[#e9c176]">{article.category}</span>
                                        <span className="text-[#45474c]">·</span>
                                        <span className="font-['Inter'] text-xs text-[#8f9097]">{article.date}</span>
                                    </div>
                                    <h3 className="mt-3 font-['Manrope'] text-lg font-extrabold text-[#dae2fd] transition-colors group-hover:text-[#e9c176]">
                                        {article.title}
                                    </h3>
                                    <p className="mt-2 line-clamp-2 font-['Inter'] text-sm leading-relaxed text-[#8f9097]">{article.excerpt}</p>
                                    <span className="mt-4 inline-block font-['Inter'] text-xs text-[#8f9097]">{article.readTime}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="bg-[#0b1326] py-24">
                <div className="mx-auto max-w-2xl px-6 text-center lg:px-8">
                    <h2 className="font-['Manrope'] text-3xl font-extrabold tracking-tight text-[#dae2fd]">
                        {isAr ? "اشترك في التحديثات المهنية" : "Subscribe for Professional Insights"}
                    </h2>
                    <p className="mt-4 font-['Inter'] text-sm text-[#8f9097]">
                        {isAr ? "احصل على أحدث المقالات والرؤى مباشرة في بريدك الإلكتروني." : "Get the latest articles and insights delivered directly to your inbox."}
                    </p>
                    <div className="mt-8 flex gap-3">
                        <input
                            type="email"
                            placeholder={isAr ? "بريدك الإلكتروني" : "Your email address"}
                            className="flex-1 rounded bg-transparent border-b-2 border-[#45474c]/30 px-4 py-3 font-['Inter'] text-sm text-[#dae2fd] placeholder:text-[#8f9097] focus:border-[#e9c176] focus:outline-none transition-colors"
                        />
                        <button className="rounded bg-gradient-to-r from-[#e9c176] to-[#C5A059] px-6 py-3 font-['Inter'] text-sm font-bold text-[#0b1326] transition-all hover:shadow-lg hover:shadow-[#e9c176]/20">
                            {isAr ? "اشترك" : "Subscribe"}
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}
