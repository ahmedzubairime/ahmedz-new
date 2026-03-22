"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveFeature, deleteFeature } from "@/app/actions/homepage-lists";

type Props = {
    locale: string;
    features: any[];
};

export function FeaturesGrid({ locale, features }: Props) {
    const [isPending, startTransition] = useTransition();

    // Drawer State
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState<any>(null);

    // Form State for Drawer
    const [titleAr, setTitleAr] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [descAr, setDescAr] = useState("");
    const [descEn, setDescEn] = useState("");
    const [iconName, setIconName] = useState("star");
    const [isActive, setIsActive] = useState(true);

    function openNew() {
        setEditingFeature(null);
        setTitleAr("");
        setTitleEn("");
        setDescAr("");
        setDescEn("");
        setIconName("star");
        setIsActive(true);
        setDrawerOpen(true);
    }

    function openEdit(f: any) {
        setEditingFeature(f);
        setTitleAr(f.title_ar || "");
        setTitleEn(f.title_en || "");
        setDescAr(f.description_ar || "");
        setDescEn(f.description_en || "");
        setIconName(f.icon_name || "star");
        setIsActive(f.is_active);
        setDrawerOpen(true);
    }

    function closeDrawer() {
        setDrawerOpen(false);
    }

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const payload = {
                title_ar: titleAr,
                title_en: titleEn,
                description_ar: descAr,
                description_en: descEn,
                icon_name: iconName,
                is_active: isActive
            };

            try {
                if (editingFeature) {
                    await saveFeature(payload, editingFeature.id);
                } else {
                    await saveFeature(payload);
                }
                closeDrawer();
            } catch (err) {
                console.error(err);
                alert("Save failed, check console.");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this feature?")) return;
        startTransition(async () => {
            await deleteFeature(id);
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "المميزات الأساسية" : "Core Features"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        {locale === "ar"
                            ? "أدر قائمة المميزات التي تظهر كبطاقات تعريفية."
                            : "Manage the feature cards displayed on the public landing page."}
                    </p>
                </div>
                <button
                    onClick={openNew}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:bg-[var(--brand-primary-light)] hover:shadow-xl hover:-translate-y-0.5"
                >
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "إضافة ميزة" : "Add Feature"}
                </button>
            </div>

            {/* Grid */}
            {features.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex size-16 items-center justify-center rounded-full bg-white dark:bg-zinc-800 mb-4 shadow-sm text-zinc-400">
                        <SidebarIcon name="box" className="size-8" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "لا توجد مميزات بعد" : "No features added yet"}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500 mb-6">
                        {locale === "ar" ? "اضغط على زر الإضافة لإضافة ميزتك الأولى." : "Click Add Feature to highlight your system."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((f) => (
                        <div key={f.id} className="group flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-[var(--brand-primary)]/30 hover:shadow-xl hover:shadow-[var(--brand-primary)]/5 dark:border-zinc-800 dark:bg-zinc-900">

                            <div className="flex items-start justify-between">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 group-hover:bg-[var(--brand-primary)]/10 group-hover:text-[var(--brand-primary)] transition-colors">
                                    <SidebarIcon name={f.icon_name || 'star'} className="size-6" />
                                </div>

                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEdit(f)}
                                        className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors text-zinc-400"
                                    >
                                        <SidebarIcon name="edit" className="size-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(f.id)}
                                        disabled={isPending}
                                        className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-colors text-zinc-400"
                                    >
                                        <SidebarIcon name="trash" className="size-4" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                                    {locale === "ar" ? f.title_ar : f.title_en}
                                </h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3">
                                    {locale === "ar" ? f.description_ar : f.description_en}
                                </p>
                            </div>

                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60">
                                <span className="text-xs font-semibold text-zinc-400">Order: {f.sort_order}</span>
                                <span className={`flex size-3 rounded-full ${f.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
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
                                {editingFeature
                                    ? (locale === "ar" ? "تعديل الميزة" : "Edit Feature")
                                    : (locale === "ar" ? "ميزة جديدة" : "New Feature")}
                            </h2>
                            <button onClick={closeDrawer} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                                <SidebarIcon name="x" className="size-5" />
                            </button>
                        </div>

                        {/* Drawer Scrolling Form */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="feature-form" onSubmit={handleSave} className="space-y-6">

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "العنوان (بالإنجليزية)" : "English Title"}</label>
                                        <input
                                            required
                                            dir="ltr"
                                            value={titleEn}
                                            onChange={(e) => setTitleEn(e.target.value)}
                                            className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "العنوان (بالعربية)" : "Arabic Title"}</label>
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
                                        required
                                        dir="ltr"
                                        rows={3}
                                        value={descEn}
                                        onChange={(e) => setDescEn(e.target.value)}
                                        className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الوصف (بالعربية)" : "Arabic Description"}</label>
                                    <textarea
                                        required
                                        dir="rtl"
                                        rows={3}
                                        value={descAr}
                                        onChange={(e) => setDescAr(e.target.value)}
                                        className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "اسم الأيقونة (Lucide)" : "Icon Name"}</label>
                                        <div className="relative">
                                            <input
                                                required
                                                dir="ltr"
                                                value={iconName}
                                                onChange={(e) => setIconName(e.target.value)}
                                                placeholder="e.g. star or box"
                                                className="w-full rounded-xl border border-zinc-200 bg-transparent pl-10 pr-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white"
                                            />
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                                                <SidebarIcon name={iconName as any} className="size-4" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-8">
                                        <div
                                            onClick={() => setIsActive(!isActive)}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${isActive ? 'bg-[var(--brand-primary)]' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                                        >
                                            <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </div>
                                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "مرئي بالموقع" : "Visible on Site"}</span>
                                    </div>
                                </div>

                            </form>
                        </div>

                        {/* Drawer Footer */}
                        <div className="border-t border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50 flex justify-end gap-3">
                            <button
                                onClick={closeDrawer}
                                type="button"
                                className="rounded-xl border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                            >{locale === "ar" ? "إلغاء" : "Cancel"}</button>
                            <button
                                type="submit"
                                form="feature-form"
                                disabled={isPending}
                                className="flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-[var(--brand-primary-light)] hover:shadow-xl disabled:opacity-50"
                            >
                                {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                                {editingFeature ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة ميزة" : "Create Feature")}
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
