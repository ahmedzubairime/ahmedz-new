import { getLocale } from "next-intl/server";
import { Metadata } from "next";
import { getGalleryAlbums } from "@/app/actions/portfolio";
import { AnimatedSection } from "@/components/public/AnimatedSection";
import { ImageIcon } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isAr = locale === "ar";
    return {
        title: isAr ? "معرض الصور" : "Gallery",
    };
}

export default async function GalleryPage() {
    const locale = await getLocale();
    const isAr = locale === "ar";
    const albums = await getGalleryAlbums();

    return (
        <div className="bg-slate-50 dark:bg-[#0b1326] transition-colors py-20 pb-32 min-h-screen">
            <AnimatedSection className="mx-auto max-w-7xl px-6 lg:px-8" animation="fade-up">
                <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176]">
                    {isAr ? "لحظات وتوثيقات" : "Moments & Captures"}
                </span>
                <h1 className="mt-3 font-['Manrope'] text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#dae2fd]">
                    {isAr ? "معرض الصور" : "Gallery"}
                </h1>

                <AnimatedSection className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" animation="stagger" delay={0.2}>
                    {albums?.map((album: any) => (
                        <div key={album.id} className="group relative overflow-hidden rounded-xl bg-slate-200 dark:bg-[#222a3d] aspect-[4/3] border border-slate-200 dark:border-[#45474c]/20 shadow-sm hover:shadow-md transition-shadow">
                            {album.coverImage?.storagePath ? (
                                <img 
                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${album.coverImage.bucket}/${album.coverImage.storagePath}`} 
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    alt={isAr ? album.titleAr : album.titleEn}
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center flex-col text-slate-400 dark:text-[#45474c] gap-2">
                                    <ImageIcon size={32} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 dark:from-[#060e20] via-transparent to-transparent opacity-70 dark:opacity-80 transition-opacity group-hover:opacity-90" />
                            <div className="absolute bottom-0 p-6 w-full text-white dark:text-[#dae2fd] transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                                <h3 className="font-['Manrope'] text-xl font-bold">
                                    {isAr ? album.titleAr : album.titleEn}
                                </h3>
                                {album.date && (
                                    <p className="mt-1 font-['Inter'] text-xs font-medium text-[#facc15] dark:text-[#e9c176]">
                                        {new Date(album.date).toLocaleDateString(locale)}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </AnimatedSection>
            </AnimatedSection>
        </div>
    );
}
