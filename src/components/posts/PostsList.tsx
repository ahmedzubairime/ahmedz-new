"use client";

import Link from "next/link";
import { SidebarIcon } from "@/components/SidebarIcon";
import { Post } from "@/app/actions/posts";
import { useTransition } from "react";
import { deletePost } from "@/app/actions/posts";

type Props = {
    locale: string;
    posts: any[]; // Using any to accommodate the joined 'category' and 'cover' fields easily without complex typing for now
};

export function PostsList({ locale, posts }: Props) {
    const [isPending, startTransition] = useTransition();

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا المنشور؟" : "Are you sure you want to delete this post?")) return;
        startTransition(() => {
            deletePost(id);
        });
    }

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex size-16 items-center justify-center rounded-full bg-white dark:bg-zinc-800 mb-4 shadow-sm">
                    <SidebarIcon name="file-text" className="size-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    {locale === "ar" ? "لا توجد منشورات بعد" : "No posts yet"}
                </h3>
                <p className="mt-2 text-sm text-zinc-500 mb-6">
                    {locale === "ar" ? "ابدأ بكتابة أول مقال لك لمدونتك" : "Start writing your first article"}
                </p>
                <Link
                    href={`/${locale}/dashboard/posts/create`}
                    className="flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[var(--brand-primary-light)] hover:shadow-lg hover:shadow-[var(--brand-primary)]/20"
                >
                    <SidebarIcon name="plus" className="size-4" />
                    {locale === "ar" ? "إنشاء منشور جديد" : "Create New Post"}
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((post) => {
                const title = locale === "ar" ? (post.title_ar || "بدون عنوان") : (post.title_en || "Untitled");
                const excerpt = locale === "ar" ? post.excerpt_ar : post.excerpt_en;
                const status = locale === "ar" ? post.status_ar : post.status_en;
                const catName = post.category ? (locale === "ar" ? post.category.name_ar : post.category.name_en) : null;

                // Construct the public URL for the cover image if it exists
                // Note: The Supabase join brings in cover details.
                const coverUrl = post.cover ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${post.cover.bucket}/${post.cover.storage_path}` : null;

                const statusStyles = {
                    published: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
                    draft: "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/10 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/20",
                    scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
                };

                return (
                    <div key={post.id} className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:border-[var(--brand-primary)]/30 hover:shadow-xl hover:shadow-[var(--brand-primary)]/5 dark:border-zinc-800 dark:bg-zinc-900">
                        {/* Cover Image Area */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                            {coverUrl ? (
                                <img src={coverUrl} alt={title} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            ) : (
                                <div className="flex size-full items-center justify-center">
                                    <SidebarIcon name="image" className="size-8 text-zinc-300 dark:text-zinc-700" />
                                </div>
                            )}

                            {/* Overlay Badges */}
                            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                                <span className={`rounded-md border px-2 py-1 text-xs font-semibold backdrop-blur-md ${statusStyles[status as keyof typeof statusStyles]}`}>
                                    {status.toUpperCase()}
                                </span>

                                {/* Quick Actions Dropdown substitute (just side-by-side buttons for simplicity here) */}
                                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Link
                                        href={`/${locale}/dashboard/posts/${post.id}`}
                                        className="flex size-8 items-center justify-center rounded-lg bg-white/90 text-zinc-700 drop-shadow-sm transition-colors hover:bg-[var(--brand-primary)] hover:text-white dark:bg-zinc-900/90 dark:text-zinc-300"
                                    >
                                        <SidebarIcon name="edit" className="size-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        disabled={isPending}
                                        className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-white/90 text-rose-600 drop-shadow-sm transition-colors hover:bg-rose-600 hover:text-white dark:bg-zinc-900/90 dark:text-rose-400"
                                    >
                                        <SidebarIcon name="trash" className="size-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex flex-1 flex-col p-4">
                            {catName && (
                                <span className="mb-2 text-xs font-medium text-[var(--brand-primary)]">
                                    {catName}
                                </span>
                            )}
                            <h3 className="line-clamp-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                                {title}
                            </h3>
                            <p className="mt-2 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                                {excerpt || (locale === "ar" ? "لا يوجد ملخص" : "No excerpt available")}
                            </p>

                            <div className="mt-auto pt-4 flex items-center justify-between text-xs text-zinc-400">
                                <span>{new Date(post.created_at).toLocaleDateString(locale)}</span>
                                <div className="flex items-center gap-1">
                                    {/* Dual status indicator */}
                                    <div className="flex items-center gap-1 rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800" title="Locales Supported">
                                        <span className={post.status_en === 'published' ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'opacity-30'}>EN</span>
                                        <span className="opacity-30">|</span>
                                        <span className={post.status_ar === 'published' ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'opacity-30'}>AR</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
