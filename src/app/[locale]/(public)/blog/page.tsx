import { getLocale } from "next-intl/server";
import { Metadata } from "next";
import { getPosts } from "@/app/actions/posts";
import { AnimatedSection } from "@/components/public/AnimatedSection";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isAr = locale === "ar";
    return {
        title: isAr ? "المقالات" : "Blog",
    };
}

export default async function BlogPage() {
    const locale = await getLocale();
    const isAr = locale === "ar";
    const articles = await getPosts();

    return (
        <div className="bg-slate-50 dark:bg-[#0b1326] transition-colors py-20 pb-32 min-h-screen">
            <AnimatedSection className="mx-auto max-w-7xl px-6 lg:px-8" animation="fade-up">
                <span className=" text-xs font-bold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176]">
                    {isAr ? "المقالات والأفكار" : "Insights & Articles"}
                </span>
                <h1 className="mt-3  text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#dae2fd]">
                    {isAr ? "المدونة" : "The Blog"}
                </h1>

                <AnimatedSection className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3" animation="stagger" delay={0.2}>
                    {articles?.map((article: any) => (
                        <article key={article.id} className="group overflow-hidden rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-[#222a3d] transition-all hover:border-[#d4af37] dark:hover:border-[#45474c] hover:shadow-lg dark:hover:shadow-none hover:bg-slate-50 dark:hover:bg-[#171f33] hover:-translate-y-1">
                            {article.cover_image?.storage_path ? (
                                <div className="aspect-video w-full overflow-hidden">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${article.cover_image.bucket}/${article.cover_image.storage_path}`}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt={isAr ? article.title_ar : article.title_en}
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video w-full bg-slate-100 dark:bg-[#222a3d]" />
                            )}
                            <div className="p-6">
                                <div className="flex items-center justify-between  text-xs text-slate-500 dark:text-[#45474c] mb-3">
                                    <span className="font-medium text-[#facc15] dark:text-[#e9c176]">{new Date(article.published_at || article.created_at).toLocaleDateString(locale)}</span>
                                </div>
                                <h3 className=" text-lg font-bold text-slate-900 dark:text-[#dae2fd]">
                                    {isAr ? article.title_ar : article.title_en}
                                </h3>
                                <p className="mt-2 line-clamp-3  text-sm text-slate-600 dark:text-[#8f9097]">
                                    {isAr ? article.content_ar?.substring(0, 100) : article.content_en?.substring(0, 100)}...
                                </p>
                            </div>
                        </article>
                    ))}
                </AnimatedSection>
            </AnimatedSection>
        </div>
    );
}
