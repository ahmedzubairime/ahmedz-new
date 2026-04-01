import { getLocale } from "next-intl/server";
import { getMediaFolders } from "@/app/actions/media";
import { FoldersTree } from "@/components/media/FoldersTree";
import { Suspense } from "react";
import { StatsCardSkeleton } from "@/components/ui/Skeletons";

async function FoldersWrapper({ locale }: { locale: string }) {
    const folders = await getMediaFolders();
    return <FoldersTree folders={folders} locale={locale} />;
}

export default async function FoldersPage() {
    const locale = await getLocale();

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "المجلدات" : "Folders"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {locale === "ar"
                            ? "تصنيف وهيكلة ملفات المكتبة"
                            : "Structure and organize your media library"}
                    </p>
                </div>
            </div>
            <Suspense fallback={
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                </div>
            }>
                <FoldersWrapper locale={locale} />
            </Suspense>
        </div>
    );
}
