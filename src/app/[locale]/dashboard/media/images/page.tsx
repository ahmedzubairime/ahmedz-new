import { getLocale } from "next-intl/server";
import { getMediaFiles, getMediaFolders } from "@/app/actions/media";
import { MediaGrid } from "@/components/media/MediaGrid";

export default async function ImagesPage() {
    const locale = await getLocale();
    const { files, count } = await getMediaFiles({ bucket: "images", limit: 50 });
    const folders = await getMediaFolders();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {locale === "ar" ? "الصور" : "Images"}
                </h1>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {locale === "ar" ? `${count} صورة` : `${count} images`}
                </p>
            </div>
            <MediaGrid
                files={files}
                folders={folders}
                bucket="images"
                locale={locale}
                totalCount={count}
            />
        </div>
    );
}
