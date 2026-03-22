"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveTestimonial, deleteTestimonial } from "@/app/actions/homepage-lists";
import { UploadDialog } from "@/components/media/UploadDialog";

type Props = {
    locale: string;
    testimonials: any[];
};

export function TestimonialsGrid({ locale, testimonials }: Props) {
    const [isPending, startTransition] = useTransition();

    // Drawer State
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<any>(null);

    // Form State for Drawer
    const [authorNameAr, setAuthorNameAr] = useState("");
    const [authorNameEn, setAuthorNameEn] = useState("");
    const [roleAr, setRoleAr] = useState("");
    const [roleEn, setRoleEn] = useState("");
    const [contentAr, setContentAr] = useState("");
    const [contentEn, setContentEn] = useState("");
    const [isActive, setIsActive] = useState(true);

    // Media State
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarId, setAvatarId] = useState<string | null>(null);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

    function openNew() {
        setEditingTestimonial(null);
        setAuthorNameAr("");
        setAuthorNameEn("");
        setRoleAr("");
        setRoleEn("");
        setContentAr("");
        setContentEn("");
        setIsActive(true);
        setAvatarId(null);
        setAvatarUrl(null);
        setDrawerOpen(true);
    }

    function openEdit(t: any) {
        setEditingTestimonial(t);
        setAuthorNameAr(t.author_name_ar || "");
        setAuthorNameEn(t.author_name_en || "");
        setRoleAr(t.role_ar || "");
        setRoleEn(t.role_en || "");
        setContentAr(t.content_ar || "");
        setContentEn(t.content_en || "");
        setIsActive(t.is_active);
        setAvatarId(t.avatar_id || null);

        if (t.avatar) {
            setAvatarUrl(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${t.avatar.bucket}/${t.avatar.storage_path}`);
        } else {
            setAvatarUrl(null);
        }

        setDrawerOpen(true);
    }

    function closeDrawer() {
        setDrawerOpen(false);
    }

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const payload = {
                author_name_ar: authorNameAr,
                author_name_en: authorNameEn,
                role_ar: roleAr,
                role_en: roleEn,
                content_ar: contentAr,
                content_en: contentEn,
                avatar_id: avatarId,
                is_active: isActive
            };

            try {
                if (editingTestimonial) {
                    await saveTestimonial(payload, editingTestimonial.id);
                } else {
                    await saveTestimonial(payload);
                }
                closeDrawer();
            } catch (err) {
                console.error(err);
                alert("Save failed, check console.");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;
        startTransition(async () => {
            await deleteTestimonial(id);
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "آراء العملاء" : "Client Testimonials"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        {locale === "ar"
                            ? "شارك المراجعات وتقييمات عملائك لزيادة الموثوقية."
                            : "Share reviews and ratings from your past customers."}
                    </p>
                </div>
                <button
                    onClick={openNew}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:bg-[var(--brand-primary-light)] hover:shadow-xl hover:-translate-y-0.5"
                >
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "إضافة مراجعة" : "Add Testimonial"}
                </button>
            </div>

            {/* Grid */}
            {testimonials.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex size-16 items-center justify-center rounded-full bg-white dark:bg-zinc-800 mb-4 shadow-sm text-zinc-400">
                        <SidebarIcon name="message-square-quote" className="size-8" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "لا توجد مراجعات بعد" : "No testimonials yet"}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500 mb-6">
                        {locale === "ar" ? "دع عملائك يتحدثون عن تجربتك المميزة." : "Let your customers speak for your brand."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((t) => {
                        const compiledAvatar = t.avatar
                            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${t.avatar.bucket}/${t.avatar.storage_path}`
                            : null;

                        return (
                            <div key={t.id} className="group relative flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-[var(--brand-primary)]/30 hover:shadow-xl hover:shadow-[var(--brand-primary)]/5 dark:border-zinc-800 dark:bg-zinc-900">

                                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button
                                        onClick={() => openEdit(t)}
                                        className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-zinc-100/80 text-zinc-600 hover:bg-[var(--brand-primary)] hover:text-white dark:bg-zinc-800/80 dark:text-zinc-300 transition-colors backdrop-blur-md"
                                    >
                                        <SidebarIcon name="edit" className="size-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(t.id)}
                                        disabled={isPending}
                                        className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-white/80 text-rose-600 hover:bg-rose-500 hover:text-white dark:bg-zinc-800/80 transition-colors backdrop-blur-md"
                                    >
                                        <SidebarIcon name="trash" className="size-4" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4">
                                    {compiledAvatar ? (
                                        <img src={compiledAvatar} className="size-14 rounded-full object-cover shadow-sm border border-zinc-100 dark:border-zinc-800" alt="avatar" />
                                    ) : (
                                        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                                            <SidebarIcon name="user" className="size-6" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                                            {locale === "ar" ? t.author_name_ar : t.author_name_en}
                                        </h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">
                                            {locale === "ar" ? t.role_ar : t.role_en}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 italic line-clamp-4 relative">
                                    <span className="text-4xl text-zinc-200 dark:text-zinc-800 absolute -top-4 -left-2 -z-10 font-serif">"</span>
                                    {locale === "ar" ? t.content_ar : t.content_en}
                                </div>

                                <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60">
                                    <span className="text-xs font-semibold text-zinc-400">Order: {t.sort_order}</span>
                                    <span className={`flex size-3 rounded-full ${t.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
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
                                {editingTestimonial
                                    ? (locale === "ar" ? "تعديل المراجعة" : "Edit Testimonial")
                                    : (locale === "ar" ? "مراجعة جديدة" : "New Testimonial")}
                            </h2>
                            <button onClick={closeDrawer} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                                <SidebarIcon name="x" className="size-5" />
                            </button>
                        </div>

                        {/* Drawer Scrolling Form */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="testimonial-form" onSubmit={handleSave} className="space-y-6">

                                {/* Avatar Upload Area */}
                                <div className="space-y-2 flex flex-col items-center border-b border-zinc-100 dark:border-zinc-800 pb-6">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 w-full mb-2">{locale === "ar" ? "الصورة الشخصية" : "Author Avatar"}</label>
                                    {avatarUrl ? (
                                        <div className="relative size-24 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 group shadow-md">
                                            <img src={avatarUrl} alt="Avatar preview" className="size-full object-cover transition-transform group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex flex-col items-center justify-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsImageDialogOpen(true)}
                                                    className="p-1 px-3 bg-white text-zinc-900 rounded-md text-[10px] uppercase font-bold hover:scale-105 transition-transform"
                                                >
                                                    Change
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { setAvatarUrl(null); setAvatarId(null); }}
                                                    className="p-1 px-3 bg-rose-600 text-white rounded-md text-[10px] uppercase font-bold hover:scale-105 transition-transform"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => setIsImageDialogOpen(true)}
                                            className="flex size-24 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-zinc-300 bg-zinc-50 transition-colors hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 dark:border-zinc-700 dark:bg-zinc-900"
                                        >
                                            <SidebarIcon name="camera" className="size-6 text-zinc-400" />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الاسم (بالإنجليزية)" : "English Name"}</label>
                                        <input
                                            required
                                            dir="ltr"
                                            value={authorNameEn}
                                            onChange={(e) => setAuthorNameEn(e.target.value)}
                                            className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الاسم (بالعربية)" : "Arabic Name"}</label>
                                        <input
                                            required
                                            dir="rtl"
                                            value={authorNameAr}
                                            onChange={(e) => setAuthorNameAr(e.target.value)}
                                            className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "المنصب (بالإنجليزية)" : "English Role (Company)"}</label>
                                        <input
                                            dir="ltr"
                                            value={roleEn}
                                            onChange={(e) => setRoleEn(e.target.value)}
                                            placeholder="e.g. CEO, Acme Corp"
                                            className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "المنصب (بالعربية)" : "Arabic Role"}</label>
                                        <input
                                            dir="rtl"
                                            value={roleAr}
                                            onChange={(e) => setRoleAr(e.target.value)}
                                            className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "نص المراجعة (بالإنجليزية)" : "English Testimonial"}</label>
                                    <textarea
                                        required
                                        dir="ltr"
                                        rows={4}
                                        value={contentEn}
                                        onChange={(e) => setContentEn(e.target.value)}
                                        className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "نص المراجعة (بالعربية)" : "Arabic Testimonial"}</label>
                                    <textarea
                                        required
                                        dir="rtl"
                                        rows={4}
                                        value={contentAr}
                                        onChange={(e) => setContentAr(e.target.value)}
                                        className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white"
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                    <div
                                        onClick={() => setIsActive(!isActive)}
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${isActive ? 'bg-[var(--brand-primary)]' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                                    >
                                        <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </div>
                                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "مرئي بالموقع" : "Visible on Site"}</span>
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
                                form="testimonial-form"
                                disabled={isPending}
                                className="flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-[var(--brand-primary-light)] hover:shadow-xl disabled:opacity-50"
                            >
                                {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                                {editingTestimonial ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة مراجعة" : "Create Testimonial")}
                            </button>
                        </div>
                    </div>

                </div>
            )}

            {/* Modal for Avatar */}
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
                            setAvatarUrl(urls[0]);
                        }
                    }}
                />
            )}
        </div>
    );
}
