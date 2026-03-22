import { getLocale } from "next-intl/server";
import { getPosts } from "@/app/actions/posts";
import { PostsList } from "@/components/posts/PostsList";
import Link from "next/link";
import { SidebarIcon } from "@/components/SidebarIcon";

export default async function PostsPage({ searchParams }: { searchParams: { status?: string; search?: string } }) {
    const locale = await getLocale();
    const posts = await getPosts(searchParams);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "إدارة المنشورات" : "Post Management"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        {locale === "ar"
                            ? "أدر كافة المقالات، واكتب محتوى جديداً ينشر بالتزامن للمشتركين."
                            : "Manage entries, author new content, and broadcast to subscribers."}
                    </p>
                </div>

                <Link
                    href={`/${locale}/dashboard/posts/create`}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:bg-[var(--brand-primary-light)] hover:shadow-xl hover:-translate-y-0.5"
                >
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "منشور جديد" : "New Post"}
                </Link>
            </div>

            {/* In a real scenario, we'd add filters here (Search, Status Draft/Published dropdowns) */}

            <PostsList locale={locale} posts={posts} />
        </div>
    );
}
