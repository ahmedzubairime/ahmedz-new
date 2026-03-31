"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveStoreCategory, deleteStoreCategory } from "@/app/actions/store-categories";

type Props = {
    locale: string;
    categories: any[];
};

export function StoreCategoriesGrid({ locale, categories }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);

    const [nameAr, setNameAr] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [slug, setSlug] = useState("");
    const [descAr, setDescAr] = useState("");
    const [descEn, setDescEn] = useState("");
    const [parentId, setParentId] = useState<string>("");
    const [icon, setIcon] = useState("folder");
    const [isActive, setIsActive] = useState(true);

    function openNew() {
        setEditing(null);
        setNameAr(""); setNameEn(""); setSlug(""); setDescAr(""); setDescEn("");
        setParentId(""); setIcon("folder"); setIsActive(true);
        setModalOpen(true);
    }

    function openEdit(c: any) {
        setEditing(c);
        setNameAr(c.name_ar || ""); setNameEn(c.name_en || ""); setSlug(c.slug || "");
        setDescAr(c.description_ar || ""); setDescEn(c.description_en || "");
        setParentId(c.parent_id || ""); setIcon(c.icon || "folder"); setIsActive(c.is_active);
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function handleNameEnChange(val: string) {
        setNameEn(val);
        if (!editing) setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const payload: any = {
                name_ar: nameAr, name_en: nameEn, slug,
                description_ar: descAr, description_en: descEn,
                icon, is_active: isActive,
                parent_id: parentId || null
            };
            try {
                await saveStoreCategory(payload, editing?.id);
                close();
            } catch (err) {
                console.error(err);
                alert(locale === "ar" ? "فشل الحفظ. تأكد من عدم تكرار الرابط (Slug)." : "Save failed. Ensure slug is unique.");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا التصنيف؟" : "Delete this category?")) return;
        startTransition(async () => { await deleteStoreCategory(id); });
    }

    // Build tree for display  
    const rootCats = categories.filter(c => !c.parent_id);
    const childrenOf = (parentId: string) => categories.filter(c => c.parent_id === parentId);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "تصنيفات المتجر" : "Store Categories"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        {locale === "ar" ? "نظّم منتجاتك في تصنيفات هرمية (رئيسية وفرعية)." : "Organize products with hierarchical categories."}
                    </p>
                </div>
                <button onClick={openNew} className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "تصنيف جديد" : "New Category"}
                </button>
            </div>

            {/* Grid */}
            {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex size-16 items-center justify-center rounded-full bg-white dark:bg-zinc-800 mb-4 shadow-sm text-zinc-400"><SidebarIcon name="folder-tree" className="size-8" /></div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد تصنيفات بعد" : "No categories yet"}</h3>
                    <p className="mt-2 text-sm text-zinc-500 mb-6">{locale === "ar" ? "أنشئ أول تصنيف لتنظيم منتجاتك." : "Create your first category to organize products."}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {rootCats.map((cat) => (
                        <div key={cat.id} className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
                            {/* Root Category */}
                            <div className="group flex items-center gap-4 p-5 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                                    <SidebarIcon name={cat.icon || "folder"} className="size-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">{locale === "ar" ? cat.name_ar : cat.name_en}</h3>
                                    <p className="text-xs text-zinc-400 truncate font-mono">/{cat.slug}</p>
                                </div>
                                <span className={`flex size-2.5 rounded-full ${cat.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(cat)} className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 transition-colors"><SidebarIcon name="edit" className="size-4" /></button>
                                    <button onClick={() => handleDelete(cat.id)} disabled={isPending} className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 text-zinc-400 transition-colors"><SidebarIcon name="trash" className="size-4" /></button>
                                </div>
                            </div>
                            {/* Children */}
                            {childrenOf(cat.id).length > 0 && (
                                <div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/80">
                                    {childrenOf(cat.id).map(child => (
                                        <div key={child.id} className="group flex items-center gap-4 px-5 py-3 ps-14 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800/50 last:border-b-0">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-200/60 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                                                <SidebarIcon name={child.icon || "folder"} className="size-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">{locale === "ar" ? child.name_ar : child.name_en}</span>
                                            </div>
                                            <span className={`flex size-2 rounded-full ${child.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(child)} className="flex size-7 cursor-pointer items-center justify-center rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 transition-colors"><SidebarIcon name="edit" className="size-3.5" /></button>
                                                <button onClick={() => handleDelete(child.id)} className="flex size-7 cursor-pointer items-center justify-center rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 text-zinc-400 transition-colors"><SidebarIcon name="trash" className="size-3.5" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div onClick={close} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" />
                    <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-950 shadow-2xl flex flex-col rounded-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between border-b border-zinc-100 p-6 dark:border-zinc-800">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                {editing ? (locale === "ar" ? "تعديل التصنيف" : "Edit Category") : (locale === "ar" ? "تصنيف جديد" : "New Category")}
                            </h2>
                            <button onClick={close} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"><SidebarIcon name="x" className="size-5" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="store-cat-form" onSubmit={handleSave} className="space-y-5">
                                {/* Parent */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "التصنيف الأب (اختياري)" : "Parent Category (optional)"}</label>
                                    <select value={parentId} onChange={(e) => setParentId(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white">
                                        <option value="">{locale === "ar" ? "-- تصنيف رئيسي --" : "-- Root Category --"}</option>
                                        {categories.filter(c => c.id !== editing?.id).map(c => (
                                            <option key={c.id} value={c.id}>{locale === "ar" ? c.name_ar : c.name_en}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Bilingual Names */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الاسم (بالإنجليزية)" : "English Name"}</label>
                                        <input required dir="ltr" value={nameEn} onChange={(e) => handleNameEnChange(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الاسم (بالعربية)" : "Arabic Name"}</label>
                                        <input required dir="rtl" value={nameAr} onChange={(e) => setNameAr(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                {/* Slug */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الرابط اللطيف (Slug)" : "URL Slug"}</label>
                                    <input required dir="ltr" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))} placeholder="e.g. electronics" className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white font-mono text-sm" />
                                </div>
                                {/* Bilingual Descriptions */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الوصف (بالإنجليزية)" : "English Description"}</label>
                                    <textarea dir="ltr" rows={2} value={descEn} onChange={(e) => setDescEn(e.target.value)} className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الوصف (بالعربية)" : "Arabic Description"}</label>
                                    <textarea dir="rtl" rows={2} value={descAr} onChange={(e) => setDescAr(e.target.value)} className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                </div>
                                {/* Icon + Toggle */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الأيقونة" : "Icon"}</label>
                                        <div className="relative">
                                            <input dir="ltr" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="folder" className="w-full rounded-xl border border-zinc-200 bg-transparent pl-10 pr-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"><SidebarIcon name={icon as any} className="size-4" /></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 pt-8">
                                        <div onClick={() => setIsActive(!isActive)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${isActive ? 'bg-[var(--brand-primary)]' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                                            <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </div>
                                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "مفعّل" : "Active"}</span>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="border-t border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50 flex justify-end gap-3">
                            <button onClick={close} type="button" className="rounded-xl border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors">{locale === "ar" ? "إلغاء" : "Cancel"}</button>
                            <button type="submit" form="store-cat-form" disabled={isPending} className="flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-2 text-sm font-bold text-white shadow-lg transition-all hover:brightness-110 hover:shadow-xl disabled:opacity-50">
                                {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                                {editing ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إنشاء تصنيف" : "Create Category")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
