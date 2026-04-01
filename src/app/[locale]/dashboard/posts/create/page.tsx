import { getLocale } from "next-intl/server";
import { PostForm } from "@/components/posts/PostForm";
import { getPostCategories } from "@/app/actions/posts";
import { getMediaFolders } from "@/app/actions/media";
import { Suspense } from "react";
import { FormSkeleton, PageHeaderSkeleton } from "@/components/ui/Skeletons";

// Separate async component
async function CreatePostFormWrapper({ locale }: { locale: string }) {
    const categories = await getPostCategories();
    // Pre-fetch media folders for the Rich Text Image Uploader
    const mediaFolders = await getMediaFolders();

    return (
        <PostForm
            locale={locale}
            categories={categories}
            mediaFolders={mediaFolders}
        />
    );
}

export default async function CreatePostPage() {
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
                <CreatePostFormWrapper locale={locale} />
            </Suspense>
        </div>
    );
}
