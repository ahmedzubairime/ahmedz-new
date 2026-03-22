"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveCategory, deleteCategory } from "@/app/actions/services-lists";

type Props = {
    locale: string;
    categories: any[];
};

export function CategoriesGrid({ locale, categories }: Props) {
    const [isPending, startTransition] = useTransition();

    // Drawer State
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);

    // Form State for Drawer
    const [slug, setSlug] = useState("");
    const [nameAr, setNameAr] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [descAr, setDescAr] = useState("");
    const [descEn, setDescEn] = useState("");

    function openNew() {
        setEditingCategory(null);
        setSlug("");
        setNameAr("");
        setNameEn("");
        setDescAr("");
        setDescEn("");
        setDrawerOpen(true);
    }

    function openEdit(c: any) {
        setEditingCategory(c);
        setSlug(c.slug || "");
        setNameAr(c.name_ar || "");
        setNameEn(c.name_en || "");
        setDescAr(c.description_ar || "");
        setDescEn(c.description_en || "");
        setDrawerOpen(true);
    }

    function closeDrawer() {
        setDrawerOpen(false);
    }

    // Auto-generate slug from English Name if empty while typing
    function handleNameEnChange(val: string) {
        setNameEn(val);
        if (!editingCategory) {
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
    }

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const payload = {
                slug,
                name_ar: nameAr,
                name_en: nameEn,
                description_ar: descAr,
                description_en: descEn
            };

            try {
                if (editingCategory) {
                    await saveCategory(payload, editingCategory.id);
                } else {
                    await saveCategory(payload);
                }
                closeDrawer();
            } catch (err) {
                console.error(err);
                alert("Save failed, slug MUST be unique.");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this category? (May detach child services)")) return;
        startTransition(async () => {
            await deleteCategory(id);
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "تصنيفات الخدمات" : "Service Categories"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        {locale === "ar"
                            ? "قسّم خدماتك إلى فئات رئيسية ليسهل التصفح."
                            : "Group your services into super-categories."}
                    </p>
                </div>
                <button
                    onClick={openNew}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-600 hover:shadow-xl hover:-translate-y-0.5"
                >
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "إضافة تصنيف" : "New Category"}
                </button>
            </div>

            {/* Grid */}
            {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex size-16 items-center justify-center rounded-full bg-white dark:bg-zinc-800 mb-4 shadow-sm text-zinc-400">
                        <SidebarIcon name="folder" className="size-8" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "لا توجد تصنيفات بعد" : "No folders created yet"}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500 mb-6">
                        {locale === "ar" ? "اضغط على زر الإضافة لتصنيف خدماتك." : "Start organizing services by creating a category."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((c) => (
                        <div key={c.id} className="group flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5 dark:border-zinc-800 dark:bg-zinc-900">

                            <div className="flex items-start justify-between">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-500/10 transition-colors">
                                    <SidebarIcon name="folder" className="size-6" />
                                </div>

                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEdit(c)}
                                        className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors text-zinc-400"
                                    >
                                        <SidebarIcon name="edit" className="size-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(c.id)}
                                        disabled={isPending}
                                        className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-colors text-zinc-400"
                                    >
                                        <SidebarIcon name="trash" className="size-4" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                                    {locale === "ar" ? c.name_ar : c.name_en}
                                </h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                                    {locale === "ar" ? c.description_ar : c.description_en}
                                </p>
                            </div>

                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60">
                                <span className="text-xs font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">/{c.slug}</span>
                            </div>
                        </div>
                    ))}
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
                                {editingCategory
                                    ? (locale === "ar" ? "تعديل التصنيف" : "Edit Folder")
                                    : (locale === "ar" ? "تصنيف جديد" : "New Folder")}
                            </h2>
                            <button onClick={closeDrawer} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                                <SidebarIcon name="x" className="size-5" />
                            </button>
                        </div>

                        {/* Drawer Scrolling Form */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="category-form" onSubmit={handleSave} className="space-y-6">

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الرابط اللطيف (Slug)" : "URL Slug (Unique identifier)"}</label>
                                    <input
                                        required
                                        dir="ltr"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
                                        placeholder="e.g. consulting-services"
                                        className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-amber-500 dark:border-zinc-800 dark:text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الاسم (بالإنجليزية)" : "English Name"}</label>
                                        <input
                                            required
                                            dir="ltr"
                                            value={nameEn}
                                            onChange={(e) => handleNameEnChange(e.target.value)}
                                            className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-amber-500 dark:border-zinc-800 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الاسم (بالعربية)" : "Arabic Name"}</label>
                                        <input
                                            required
                                            dir="rtl"
                                            value={nameAr}
                                            onChange={(e) => setNameAr(e.target.value)}
                                            className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-amber-500 dark:border-zinc-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الوصف (بالإنجليزية)" : "English Description"}</label>
                                    <textarea
                                        dir="ltr"
                                        rows={3}
                                        value={descEn}
                                        onChange={(e) => setDescEn(e.target.value)}
                                        className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-amber-500 dark:border-zinc-800 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الوصف (بالعربية)" : "Arabic Description"}</label>
                                    <textarea
                                        dir="rtl"
                                        rows={3}
                                        value={descAr}
                                        onChange={(e) => setDescAr(e.target.value)}
                                        className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-amber-500 dark:border-zinc-800 dark:text-white"
                                    />
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
                                form="category-form"
                                disabled={isPending}
                                className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-amber-600 hover:shadow-xl disabled:opacity-50"
                            >
                                {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                                {editingCategory ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة قسم" : "Create Folder")}
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
