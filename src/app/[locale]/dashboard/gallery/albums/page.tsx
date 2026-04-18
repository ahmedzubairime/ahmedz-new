import { getLocale } from "next-intl/server";
import { getGalleryAlbums } from "@/app/actions/portfolio";
import { AlbumsGrid } from "@/components/cms/gallery/AlbumsGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function AlbumsDataWrapper({ locale }: { locale: string }) {
    const data = await getGalleryAlbums();
    return <AlbumsGrid locale={locale} albums={data} />;
}

export default async function AlbumsPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={5} />}>
            {/* @ts-ignore */}
            <AlbumsDataWrapper locale={locale} />
        </Suspense>
    );
}
