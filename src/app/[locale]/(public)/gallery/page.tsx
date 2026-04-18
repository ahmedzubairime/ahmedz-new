import { getLocale } from "next-intl/server";
import { getGalleryAlbums } from "@/app/actions/portfolio";

export default async function GalleryPage() {
    const locale = await getLocale();
    const isAr = locale === "ar";
    const albums = await getGalleryAlbums();

    return (
        <>
            {/* Page Hero */}
            <section className="bg-[#0b1326] py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                        {isAr ? "المعرض" : "Gallery"}
                    </span>
                    <h1 className="mt-3 font-['Manrope'] text-5xl font-extrabold tracking-tight text-[#dae2fd]" style={{ letterSpacing: "-0.02em" }}>
                        {isAr ? "توثيق التأثير" : "Documenting Impact"}
                    </h1>
                    <p className="mt-4 max-w-2xl font-['Inter'] text-lg text-[#8f9097]">
                        {isAr ? "لقطات من العمل الميداني والفعاليات المهنية." : "Capturing moments from the field and professional events."}
                    </p>
                </div>
            </section>

            {/* Albums */}
            <section className="bg-[#0b1326] pb-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {albums.length > 0 ? (
                        <div className="space-y-16">
                            {albums.map((album: any) => (
                                <div key={album.id}>
                                    <div className="mb-8">
                                        <h2 className="font-['Manrope'] text-2xl font-extrabold text-[#dae2fd]">
                                            {isAr ? album.titleAr : album.titleEn}
                                        </h2>
                                        <p className="mt-2 font-['Inter'] text-sm text-[#8f9097]">
                                            {isAr ? album.descriptionAr : album.descriptionEn}
                                        </p>
                                    </div>

                                    {/* Masonry-style placeholder grid */}
                                    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
                                        {[1, 2, 3, 4, 5, 6].map((item) => (
                                            <div
                                                key={item}
                                                className="group mb-4 break-inside-avoid overflow-hidden rounded-lg bg-[#131b2e] transition-all hover:bg-[#171f33]"
                                                style={{ height: `${150 + Math.random() * 150}px` }}
                                            >
                                                <div className="flex size-full items-center justify-center">
                                                    <span className="material-symbols-outlined text-3xl text-[#45474c] transition-colors group-hover:text-[#e9c176]">
                                                        photo
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <span className="material-symbols-outlined text-5xl text-[#45474c]">photo_library</span>
                            <p className="mt-4 font-['Inter'] text-lg text-[#8f9097]">
                                {isAr ? "لا توجد ألبومات بعد" : "No albums yet"}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
