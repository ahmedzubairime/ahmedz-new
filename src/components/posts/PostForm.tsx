"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { savePost, Post, PostCategory } from "@/app/actions/posts";
import { SidebarIcon } from "@/components/SidebarIcon";
import { getMediaPublicUrl } from "@/app/actions/media";

type Folder = {
    id: string;
    name: string;
    parent_id: string | null;
};

type Props = {
    locale: string;
    categories: PostCategory[];
    mediaFolders: Folder[];
    initialData?: Partial<Post>;
};

export function PostForm({ locale, categories, mediaFolders, initialData = {} }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // UI State
    const [activeLocale, setActiveLocale] = useState<"en" | "ar">(locale as "en" | "ar");
    const [saving, setSaving] = useState(false);

    // Form State
    const [titleAr, setTitleAr] = useState(initialData.title_ar || "");
    const [titleEn, setTitleEn] = useState(initialData.title_en || "");
    const [slugAr, setSlugAr] = useState(initialData.slug_ar || "");
    const [slugEn, setSlugEn] = useState(initialData.slug_en || "");
    const [contentAr, setContentAr] = useState(initialData.content_ar || "");
    const [contentEn, setContentEn] = useState(initialData.content_en || "");
    const [categoryId, setCategoryId] = useState(initialData.category_id || "");

    // We can add Cover Image, Excerpt, SEO later. Just focusing on Rich Text + Core for now to prove structure.

    const isEn = activeLocale === "en";

    function handleSave(statusAr: "draft" | "published", statusEn: "draft" | "published") {
        setSaving(true);
        startTransition(async () => {
            try {
                await savePost({
                    id: initialData.id,
                    title_ar: titleAr,
                    title_en: titleEn,
                    slug_ar: slugAr,
                    slug_en: slugEn,
                    content_ar: contentAr,
                    content_en: contentEn,
                    category_id: categoryId || null,
                    status_ar: statusAr,
                    status_en: statusEn,
                });
                router.push(`/${locale}/dashboard/posts`);
                router.refresh();
            } catch (error) {
                console.error("Save failed:", error);
                alert("Failed to save post");
            } finally {
                setSaving(false);
            }
        });
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6">

            {/* Header & Glassmorphic Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="flex size-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                    >
                        <SidebarIcon name={locale === "ar" ? "arrow-right" : "arrow-left"} className="size-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                            {initialData.id
                                ? (locale === "ar" ? "تعديل المنشور" : "Edit Post")
                                : (locale === "ar" ? "منشور جديد" : "New Post")}
                        </h1>
                        <p className="text-sm text-zinc-500">
                            {locale === "ar" ? "أضف عنواناً و المحتوى أدناه" : "Add a title and content below"}
                        </p>
                    </div>
                </div>

                {/* The Floating Locale Toggle */}
                <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
                    <button
                        type="button"
                        onClick={() => setActiveLocale("en")}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${isEn
                            ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                            }`}
                    >
                        English
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveLocale("ar")}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${!isEn
                            ? "bg-white text-[var(--brand-primary)] shadow-sm dark:bg-zinc-700 dark:text-[var(--brand-primary-light)]"
                            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                            }`}
                    >
                        العربية
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Title Input */}
                    <input
                        type="text"
                        value={isEn ? titleEn : titleAr}
                        onChange={(e) => isEn ? setTitleEn(e.target.value) : setTitleAr(e.target.value)}
                        placeholder={isEn ? "Post Title..." : "عنوان المنشور..."}
                        dir={isEn ? "ltr" : "rtl"}
                        className="w-full text-4xl font-black bg-transparent border-none outline-none focus:ring-0 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 text-zinc-900 dark:text-zinc-50 transition-all font-sans"
                    />

                    {/* Slug Input */}
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <span>/posts/</span>
                        <input
                            type="text"
                            value={isEn ? slugEn : slugAr}
                            onChange={(e) => isEn ? setSlugEn(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))
                                : setSlugAr(e.target.value.toLowerCase().replace(/[^a-z0-9-\u0600-\u06FF]/g, '-'))}
                            placeholder={isEn ? "url-slug" : "رابط-المقال"}
                            dir={isEn ? "ltr" : "rtl"}
                            className="flex-1 bg-transparent border-b border-dashed border-zinc-300 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-700"
                        />
                    </div>

                    {/* Rich Text Editor */}
                    <div className="mt-8 transition-opacity duration-300 relative">
                        {isEn ? (
                            <RichTextEditor
                                content={contentEn}
                                onChange={setContentEn}
                                locale="en"
                                minHeight="min-h-[500px]"
                                placeholder="Start telling your story..."
                                mediaFolders={mediaFolders}
                            />
                        ) : (
                            <RichTextEditor
                                content={contentAr}
                                onChange={setContentAr}
                                locale="ar"
                                minHeight="min-h-[500px]"
                                placeholder="ابدأ بكتابة قصتك..."
                                mediaFolders={mediaFolders}
                            />
                        )}
                    </div>
                </div>

                {/* Sidebar Sticky Settings */}
                <div className="lg:col-span-1 border-t pt-6 lg:pt-0 lg:border-t-0 lg:border-s border-zinc-200 dark:border-zinc-800 lg:ps-6">
                    <div className="sticky top-6 space-y-6">

                        {/* Category Select */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                {locale === "ar" ? "التصنيف" : "Category"}
                            </label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--brand-primary)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            >
                                <option value="">{locale === "ar" ? "بدون تصنيف" : "Uncategorized"}</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {locale === "ar" ? c.name_ar : c.name_en}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                            <button
                                onClick={() => handleSave("published", "published")}
                                disabled={saving || isPending}
                                className="w-full cursor-pointer rounded-xl bg-[var(--brand-primary)] py-3 text-sm font-bold text-white transition-all hover:bg-[var(--brand-primary-light)] disabled:opacity-50"
                            >
                                {saving ? "..." : (locale === "ar" ? "نشر المقال (عربي & إنجليزي)" : "Publish (Both Locales)")}
                            </button>

                            <button
                                onClick={() => handleSave("draft", "draft")}
                                disabled={saving || isPending}
                                className="w-full cursor-pointer rounded-xl border border-zinc-200 bg-white py-3 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700/50"
                            >
                                {locale === "ar" ? "حفظ كمسودة" : "Save as Draft"}
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
