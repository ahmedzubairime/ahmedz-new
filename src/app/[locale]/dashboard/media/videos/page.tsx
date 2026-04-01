import { getLocale } from "next-intl/server";
import { getMediaFiles, getMediaFolders } from "@/app/actions/media";
import { MediaGrid } from "@/components/media/MediaGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function VideosWrapper({ locale }: { locale: string }) {
    const { files, count } = await getMediaFiles({ bucket: "videos", limit: 50 });
    const folders = await getMediaFolders();

    return (
        <MediaGrid
            files={files}
            folders={folders}
            bucket="videos"
            locale={locale}
            totalCount={count}
        />
    );
}

export default async function VideosPage() {
    const locale = await getLocale();

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "الفيديوهات" : "Videos"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {locale === "ar" ? "إدارة فيديوهات النظام" : "Manage system videos"}
                    </p>
                </div>
            </div>
            <Suspense fallback={<TableSkeleton rowCount={6} />}>
                <VideosWrapper locale={locale} />
            </Suspense>
        </div>
    );
}
