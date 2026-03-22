"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveService, deleteService } from "@/app/actions/services-lists";
import { UploadDialog } from "@/components/media/UploadDialog";

type Props = {
    locale: string;
    services: any[];
    categories: any[];
};

export function ServicesGrid({ locale, services, categories }: Props) {
    const [isPending, startTransition] = useTransition();

    // Drawer State
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);

    // Form State for Drawer
    const [slug, setSlug] = useState("");
    const [titleAr, setTitleAr] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [descAr, setDescAr] = useState("");
    const [descEn, setDescEn] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [isActive, setIsActive] = useState(true);

    // Media State
    const [imageId, setImageId] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

    function openNew() {
        setEditingService(null);
        setSlug("");
        setTitleAr("");
        setTitleEn("");
        setDescAr("");
        setDescEn("");
        setCategoryId("");
        setIsActive(true);
        setImageId(null);
        setImageUrl(null);
        setDrawerOpen(true);
    }

    function openEdit(s: any) {
        setEditingService(s);
        setSlug(s.slug || "");
        setTitleAr(s.title_ar || "");
        setTitleEn(s.title_en || "");
        setDescAr(s.description_ar || "");
        setDescEn(s.description_en || "");
        setCategoryId(s.category_id || "");
        setIsActive(s.is_active);
        setImageId(s.image_id || null);

        if (s.image) {
            setImageUrl(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${s.image.bucket}/${s.image.storage_path}`);
        } else {
            setImageUrl(null);
        }

        setDrawerOpen(true);
    }

    function closeDrawer() {
        setDrawerOpen(false);
    }

    function handleTitleEnChange(val: string) {
        setTitleEn(val);
        if (!editingService) {
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
    }

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const payload = {
                slug,
                title_ar: titleAr,
                title_en: titleEn,
                description_ar: descAr,
                description_en: descEn,
                category_id: categoryId || null,
                image_id: imageId,
                is_active: isActive
            };

            try {
                if (editingService) {
                    await saveService(payload, editingService.id);
                } else {
                    await saveService(payload);
                }
                closeDrawer();
            } catch (err) {
                console.error(err);
                alert("Save failed, ensure slug is unique.");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this service?")) return;
        startTransition(async () => {
            await deleteService(id);
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "قائمة الخدمات" : "Services Overview"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        {locale === "ar"
                            ? "أدر قائمة الخدمات التي تقدمها شركتك للعملاء."
                            : "Manage the core offerings provided by your company."}
                    </p>
                </div>
                <button
                    onClick={openNew}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:bg-[var(--brand-primary-light)] hover:shadow-xl hover:-translate-y-0.5"
                >
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "إضافة خدمة" : "New Service"}
                </button>
            </div>

            {/* Grid */}
            {services.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex size-16 items-center justify-center rounded-full bg-white dark:bg-zinc-800 mb-4 shadow-sm text-zinc-400">
                        <SidebarIcon name="briefcase" className="size-8" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "لا توجد خدمات بعد" : "No services created yet"}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500 mb-6">
                        {locale === "ar" ? "ابدأ بإضافة أول خدمة تقدمها." : "Build your portfolio by defining a core service."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((s) => {
                        const compiledImage = s.image
                            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${s.image.bucket}/${s.image.storage_path}`
                            : null;

                        return (
                            <div key={s.id} className="group relative flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:border-[var(--brand-primary)]/30 hover:shadow-xl hover:shadow-[var(--brand-primary)]/5 dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">

                                {/* Image Map */}
                                <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800">
                                    {compiledImage ? (
                                        <img src={compiledImage} alt={s.title_en} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="flex size-full items-center justify-center">
                                            <SidebarIcon name="image" className="size-10 text-zinc-300 dark:text-zinc-700" />
                                        </div>
                                    )}

                                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button
                                            onClick={() => openEdit(s)}
                                            className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-white/80 text-zinc-600 hover:bg-[var(--brand-primary)] hover:text-white dark:bg-zinc-800/80 dark:text-zinc-300 transition-colors backdrop-blur-md"
                                        >
                                            <SidebarIcon name="edit" className="size-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(s.id)}
                                            disabled={isPending}
                                            className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-white/80 text-rose-600 hover:bg-rose-500 hover:text-white dark:bg-zinc-800/80 transition-colors backdrop-blur-md"
                                        >
                                            <SidebarIcon name="trash" className="size-4" />
                                        </button>
                                    </div>

                                    {s.category && (
                                        <div className="absolute bottom-4 left-4 rounded-md bg-black/60 backdrop-blur-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                                            {locale === "ar" ? s.category.name_ar : s.category.name_en}
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 mb-1">
                                        {locale === "ar" ? s.title_ar : s.title_en}
                                    </h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                                        {locale === "ar" ? s.description_ar : s.description_en}
                                    </p>

                                    <div className="mt-auto pt-4 flex items-center justify-between">
                                        <span className="text-xs font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">/{s.slug}</span>
                                        <span className={`flex size-3 rounded-full ${s.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Sliding Drawer Overlay */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">

                    {/* Backdrop */}
                    <div
                        onClick={closeDrawer}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                    />

                    {/* Drawer Panel */}
                    <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-950 shadow-2xl flex flex-col rounded-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden border border-zinc-200 dark:border-zinc-800">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between border-b border-zinc-100 p-6 dark:border-zinc-800">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                {editingService
                                    ? (locale === "ar" ? "تعديل الخدمة" : "Edit Service")
                                    : (locale === "ar" ? "خدمة جديدة" : "New Service")}
                            </h2>
                            <button onClick={closeDrawer} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                                <SidebarIcon name="x" className="size-5" />
                            </button>
                        </div>

                        {/* Drawer Scrolling Form */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="service-form" onSubmit={handleSave} className="space-y-6">

                                {/* Cover Upload Area */}
                                <div className="space-y-2 flex flex-col border-b border-zinc-100 dark:border-zinc-800 pb-6">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 w-full mb-2">{locale === "ar" ? "صورة الغلاف للخدمة" : "Service Cover Image"}</label>
                                    {imageUrl ? (
                                        <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 group shadow-md bg-zinc-50 dark:bg-zinc-900">
                                            <img src={imageUrl} alt="Cover preview" className="size-full object-cover transition-transform group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex flex-col items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsImageDialogOpen(true)}
                                                    className="px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-bold shadow-xl hover:scale-105 transition-transform"
                                                >
                                                    Replace Image
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { setImageUrl(null); setImageId(null); }}
                                                    className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold shadow-xl hover:scale-105 transition-transform"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => setIsImageDialogOpen(true)}
                                            className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 transition-colors hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 dark:border-zinc-700 dark:bg-zinc-900"
                                        >
                                            <div className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-zinc-800 mb-3 text-zinc-400">
                                                <SidebarIcon name="image" className="size-5" />
                                            </div>
                                            <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                                                Select amazing cover photo
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "التصنيف التابع" : "Category Mapping"}</label>
                                        <select
                                            value={categoryId}
                                            onChange={(e) => setCategoryId(e.target.value)}
                                            className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white"
                                        >
                                            <option value="">{locale === "ar" ? "-- بدون تصنيف --" : "-- No Category --"}</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>
                                                    {locale === "ar" ? c.name_ar : c.name_en}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الرابط اللطيف (Slug)" : "URL Slug"}</label>
                                        <input
                                            required
                                            dir="ltr"
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
                                            className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "العنوان (بالإنجليزية)" : "English Title"}</label>
                                        <input
                                            required
                                            dir="ltr"
                                            value={titleEn}
                                            onChange={(e) => handleTitleEnChange(e.target.value)}
                                            className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الاسم (بالعربية)" : "Arabic Name"}</label>
                                        <input
                                            required
                                            dir="rtl"
                                            value={titleAr}
                                            onChange={(e) => setTitleAr(e.target.value)}
                                            className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الوصف (بالإنجليزية)" : "English Description"}</label>
                                    <textarea
                                        dir="ltr"
                                        rows={4}
                                        value={descEn}
                                        onChange={(e) => setDescEn(e.target.value)}
                                        className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الوصف (بالعربية)" : "Arabic Description"}</label>
                                    <textarea
                                        dir="rtl"
                                        rows={4}
                                        value={descAr}
                                        onChange={(e) => setDescAr(e.target.value)}
                                        className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white"
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-4">
                                    <div
                                        onClick={() => setIsActive(!isActive)}
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${isActive ? 'bg-[var(--brand-primary)]' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                                    >
                                        <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </div>
                                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "مفعل بالموقع" : "Active Listing"}</span>
                                </div>

                            </form>
                        </div>

                        {/* Drawer Footer */}
                        <div className="border-t border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50 flex justify-end gap-3 z-10">
                            <button
                                onClick={closeDrawer}
                                type="button"
                                className="rounded-xl border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                            >{locale === "ar" ? "إلغاء" : "Cancel"}</button>
                            <button
                                type="submit"
                                form="service-form"
                                disabled={isPending}
                                className="flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-[var(--brand-primary-light)] hover:shadow-xl disabled:opacity-50"
                            >
                                {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                                {editingService ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة خدمة" : "Create Service")}
                            </button>
                        </div>
                    </div>

                </div>
            )}

            {/* Modal for Cover Picker */}
            {isImageDialogOpen && (
                <UploadDialog
                    folders={[]}
                    bucket="images"
                    defaultFolderId="all"
                    locale={locale}
                    onClose={() => setIsImageDialogOpen(false)}
                    onSuccess={(urls) => {
                        setIsImageDialogOpen(false);
                        if (urls && urls[0]) {
                            setImageUrl(urls[0]);
                        }
                    }}
                />
            )}
        </div>
    );
}
