import { getLocale } from "next-intl/server";
import { PostForm } from "@/components/posts/PostForm";
import { getPost, getPostCategories } from "@/app/actions/posts";
import { getMediaFolders } from "@/app/actions/media";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FormSkeleton, PageHeaderSkeleton } from "@/components/ui/Skeletons";

// Separate async component
async function EditPostFormWrapper({ id, locale }: { id: string, locale: string }) {
    const categories = await getPostCategories();
    const mediaFolders = await getMediaFolders();

    let post;
    try {
        post = await getPost(id);
    } catch {
        return notFound();
    }

    return (
        <PostForm
            locale={locale}
            categories={categories}
            mediaFolders={mediaFolders}
            initialData={post}
        />
    );
}

export default async function EditPostPage({ params }: { params: { id: string } }) {
    const locale = await getLocale();

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Suspense fallback={
                <div className="space-y-6">
                    <PageHeaderSkeleton />
                    <FormSkeleton fieldCount={4} />
                </div>
            }>
                {/* @ts-ignore - Async Server Component */}
                <EditPostFormWrapper id={params.id} locale={locale} />
            </Suspense>
        </div>
    );
}
