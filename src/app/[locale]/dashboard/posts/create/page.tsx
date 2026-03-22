import { getLocale } from "next-intl/server";
import { PostForm } from "@/components/posts/PostForm";
import { getPostCategories } from "@/app/actions/posts";
import { getMediaFolders } from "@/app/actions/media";

export default async function CreatePostPage() {
    const locale = await getLocale();
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
