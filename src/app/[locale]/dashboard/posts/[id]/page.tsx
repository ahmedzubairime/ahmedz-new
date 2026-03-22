import { getLocale } from "next-intl/server";
import { PostForm } from "@/components/posts/PostForm";
import { getPost, getPostCategories } from "@/app/actions/posts";
import { getMediaFolders } from "@/app/actions/media";
import { notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: { id: string } }) {
    const locale = await getLocale();
    const categories = await getPostCategories();
    const mediaFolders = await getMediaFolders();

    let post;
    try {
        post = await getPost(params.id);
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
