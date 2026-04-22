import { getLocale } from "next-intl/server";
import { Metadata } from "next";
import { Briefcase, Target, GraduationCap } from "lucide-react";
import { AnimatedSection } from "@/components/public/AnimatedSection";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isAr = locale === "ar";
    return {
        title: isAr ? "من أنا" : "About Me",
    };
}

export default async function AboutPage() {
    const locale = await getLocale();
    const isAr = locale === "ar";

    return (
        <div className="bg-slate-50 dark:bg-[#0b1326] transition-colors py-20 pb-32 min-h-screen">
            <AnimatedSection className="mx-auto max-w-4xl px-6 lg:px-8" animation="fade-up">
                <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176]">
                    {isAr ? "السيرة الذاتية" : "About Me"}
                </span>
                <h1 className="mt-3 font-['Manrope'] text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#dae2fd]">
                    {isAr ? "رؤية شاملة، قيادة حكيمة" : "Comprehensive Vision, Prudent Leadership"}
                </h1>
                
                <div className="mt-10 space-y-6 font-['Inter'] text-lg leading-relaxed text-slate-600 dark:text-[#8f9097]">
                    <p>
                        {isAr
                            ? "على مدى 15 عاماً من العمل مع الأمم المتحدة، قدت فرق عمل متنوعة ومشاريع معقدة في بيئات صعبة ومتغيرة باستمرار."
                            : "With over 15 years working alongside the United Nations, I have led diverse teams and complex projects within challenging and ever-changing environments."}
                    </p>
                    <p>
                        {isAr
                            ? "أؤمن بأن التغيير الحقيقي يبدأ بفهم عميق لمتطلبات جميع أصحاب المصلحة والمواءمة الاستراتيجية للأهداف، وصولاً للتنفيذ عالي الدقة."
                            : "I believe that true change begins with a deep understanding of all stakeholder requirements, strategic alignment of goals, culminating in high-precision execution."}
                    </p>
                </div>

                <AnimatedSection className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3" animation="stagger" delay={0.2}>
                    {[
                        { icon: <Target className="text-[#d4af37] dark:text-[#e9c176]" />, tAr: "استراتيجية", tEn: "Strategy" },
                        { icon: <Briefcase className="text-[#d4af37] dark:text-[#e9c176]" />, tAr: "إدارة مشاريع", tEn: "Management" },
                        { icon: <GraduationCap className="text-[#d4af37] dark:text-[#e9c176]" />, tAr: "تمكين الفِرق", tEn: "Empowerment" },
                    ].map((val, idx) => (
                        <div key={idx} className="rounded-xl bg-white dark:bg-[#131b2e] p-6 text-center shadow-sm dark:shadow-none border border-slate-200 dark:border-[#222a3d] transition-transform hover:-translate-y-1">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 dark:bg-[#0b1326] mb-4">
                                {val.icon}
                            </div>
                            <h3 className="font-['Manrope'] font-bold text-slate-900 dark:text-[#dae2fd]">{isAr ? val.tAr : val.tEn}</h3>
                        </div>
                    ))}
                </AnimatedSection>
            </AnimatedSection>
        </div>
    );
}
