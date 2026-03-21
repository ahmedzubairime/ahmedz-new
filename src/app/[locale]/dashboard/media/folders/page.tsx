import { getLocale } from "next-intl/server";
import { getMediaFolders } from "@/app/actions/media";
import { FoldersTree } from "@/components/media/FoldersTree";

export default async function FoldersPage() {
    const locale = await getLocale();
    const folders = await getMediaFolders();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {locale === "ar" ? "المجلدات" : "Folders"}
                </h1>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {locale === "ar"
                        ? `${folders.length} مجلد في المكتبة`
                        : `${folders.length} folders in your library`}
                </p>
            </div>
            <FoldersTree folders={folders} locale={locale} />
        </div>
    );
}
