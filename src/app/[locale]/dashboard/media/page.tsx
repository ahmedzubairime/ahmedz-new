import { getLocale } from "next-intl/server";
import { getMediaFiles, getMediaFolders } from "@/app/actions/media";
import { SidebarIcon } from "@/components/SidebarIcon";
import Link from "next/link";
import { Suspense } from "react";
import { StatsCardSkeleton } from "@/components/ui/Skeletons";

async function MediaWrapper({ locale }: { locale: string }) {
    const folders = await getMediaFolders();
    const [{ count: imageCount }, { count: videoCount }, { count: docCount }] = await Promise.all([
        getMediaFiles({ bucket: "images", limit: 0 }),
        getMediaFiles({ bucket: "videos", limit: 0 }),
        getMediaFiles({ bucket: "documents", limit: 0 })
    ]);

    const rootFolders = folders.filter((f: { parent_id: string | null }) => !f.parent_id);
    const totalFiles = imageCount + videoCount + docCount;

    const bucketCards = [
        {
            name: locale === "ar" ? "الصور" : "Images",
            icon: "image",
            count: imageCount,
            href: `/${locale}/dashboard/media/images`,
            color: "from-sky-500 to-cyan-400",
            bgLight: "bg-sky-50 dark:bg-sky-900/20",
        },
        {
            name: locale === "ar" ? "الفيديوهات" : "Videos",
            icon: "video",
            count: videoCount,
            href: `/${locale}/dashboard/media/videos`,
            color: "from-violet-500 to-purple-400",
            bgLight: "bg-violet-50 dark:bg-violet-900/20",
        },
        {
            name: locale === "ar" ? "المستندات" : "Documents",
            icon: "file-text",
            count: docCount,
            href: `/${locale}/dashboard/media/documents`,
            color: "from-amber-500 to-orange-400",
            bgLight: "bg-amber-50 dark:bg-amber-900/20",
        },
        {
            name: locale === "ar" ? "المجلدات" : "Folders",
            icon: "folder",
            count: rootFolders.length,
            href: `/${locale}/dashboard/media/folders`,
            color: "from-emerald-500 to-green-400",
            bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
        },
    ];

    return (
        <div className="space-y-8">
            <p className="mt-1 text-sm font-medium text-zinc-500">
                {locale === "ar"
                    ? `${totalFiles} ملف في المكتبة`
                    : `${totalFiles} files in your library`}
            </p>

            {/* Bucket Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {bucketCards.map((card) => (
                    <Link
                        key={card.icon}
                        href={card.href}
                        className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/60 p-5 backdrop-blur-xl transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 dark:border-white/10 dark:bg-zinc-900/60"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 transition-opacity group-hover:opacity-5`} />
                        <div className="flex items-center gap-4">
                            <div className={`flex size-12 items-center justify-center rounded-xl ${card.bgLight}`}>
                                <SidebarIcon name={card.icon} className={`size-6 bg-gradient-to-br ${card.color} bg-clip-text`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{card.count}</p>
                                <p className="text-sm font-medium text-zinc-500">{card.name}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Access Folders */}
            <div>
                <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {locale === "ar" ? "المجلدات الرئيسية" : "Root Folders"}
                </h2>
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {rootFolders.map((folder: { id: string; name: string; created_at: string }) => {
                        const subCount = folders.filter(
                            (f: { parent_id: string | null }) => f.parent_id === folder.id
                        ).length;

                        return (
                            <Link
                                key={folder.id}
                                href={`/${locale}/dashboard/media/folders?folder=${folder.id}`}
                                className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white/60 p-4 transition-all hover:border-[var(--brand-primary)]/30 hover:shadow-sm dark:border-white/10 dark:bg-zinc-900/60"
                            >
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
                                    <SidebarIcon name="folder" className="size-5 text-amber-500" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                        {folder.name}
                                    </p>
                                    {subCount > 0 && (
                                        <p className="text-xs font-medium text-zinc-500">
                                            {subCount} {locale === "ar" ? "مجلد فرعي" : "sub-folders"}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default async function MediaPage() {
    const locale = await getLocale();

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {locale === "ar" ? "مكتبة الوسائط" : "Media Library"}
                </h1>
            </div>

            <Suspense fallback={
                <div className="space-y-8">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatsCardSkeleton />
                        <StatsCardSkeleton />
                        <StatsCardSkeleton />
                        <StatsCardSkeleton />
                    </div>
                </div>
            }>
                {/* @ts-ignore */}
                <MediaWrapper locale={locale} />
            </Suspense>
        </div>
    );
}
