import { getLocale } from "next-intl/server";
import { getPostCategories } from "@/app/actions/posts";
import { SidebarIcon } from "@/components/SidebarIcon";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function CategoriesWrapper({ locale }: { locale: string }) {
    const categories = await getPostCategories();

    if (categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-white/50 py-20 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-white shadow-sm dark:bg-zinc-800">
                    <SidebarIcon name="folder" className="size-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    {locale === "ar" ? "لا توجد تصنيفات بعد" : "No categories yet"}
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                    {locale === "ar" ? "أضف بضعة تصنيفات لتنظيم منشوراتك" : "Add some categories to organize your posts"}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(category => (
                <div key={category.id} className="relative flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white/60 p-5 transition-all hover:-translate-y-1 hover:border-[var(--brand-primary)]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">

                    <div className="flex items-start justify-between">
                        <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-mono text-zinc-500 dark:bg-zinc-800">
                            /{category.slug}
                        </span>

                        <div className="flex gap-1 text-zinc-400">
                            <button className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-zinc-100 hover:text-zinc-700 transition-colors dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
                                <SidebarIcon name="edit" className="size-4" />
                            </button>
                            <button className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors dark:hover:bg-rose-500/10 dark:hover:text-rose-400">
                                <SidebarIcon name="trash" className="size-4" />
                            </button>
                        </div>
                    </div>

                    <h3 className="mt-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        {locale === "ar" ? category.name_ar : category.name_en}
                    </h3>

                    <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                        {(locale === "ar" ? category.description_ar : category.description_en) ||
                            (locale === "ar" ? "لا يوجد وصف" : "No description")}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default async function PostCategoriesPage() {
    const locale = await getLocale();

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "تصنيفات المنشورات" : "Post Categories"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        {locale === "ar"
                            ? "أدر وهيكل تصنيفات المدونة لتسهيل الوصول للمحتوى."
                            : "Structure your blog content with organized, multilingual categories."}
                    </p>
                </div>
                <button
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:bg-zinc-800 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                >
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "تصنيف جديد" : "New Category"}
                </button>
            </div>

            <Suspense fallback={<TableSkeleton rowCount={4} />}>
                <CategoriesWrapper locale={locale} />
            </Suspense>
        </div>
    );
}
