"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveSocialLink, deleteSocialLink } from "@/app/actions/external-lists";

type Props = {
    locale: string;
    links: any[];
};

const PLATFORMS = [
    { label: "Facebook", value: "facebook", icon: "facebook" },
    { label: "Twitter / X", value: "twitter", icon: "twitter" },
    { label: "Instagram", value: "instagram", icon: "instagram" },
    { label: "LinkedIn", value: "linkedin", icon: "linkedin" },
    { label: "YouTube", value: "youtube", icon: "youtube" },
    { label: "TikTok", value: "tiktok", icon: "video" },
    { label: "WhatsApp", value: "whatsapp", icon: "message-circle" },
    { label: "GitHub", value: "github", icon: "github" },
    { label: "Dribbble", value: "dribbble", icon: "dribbble" },
    { label: "Other Link", value: "link", icon: "link" }
];

export function SocialGrid({ locale, links }: Props) {
    const [isPending, startTransition] = useTransition();

    // Drawer State
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<any>(null);

    // Form State
    const [platform, setPlatform] = useState(PLATFORMS[0].value);
    const [url, setUrl] = useState("");
    const [isActive, setIsActive] = useState(true);

    function openNew() {
        setEditingLink(null);
        setPlatform(PLATFORMS[0].value);
        setUrl("");
        setIsActive(true);
        setDrawerOpen(true);
    }

    function openEdit(l: any) {
        setEditingLink(l);
        setPlatform(l.platform || PLATFORMS[0].value);
        setUrl(l.url || "");
        setIsActive(l.is_active);
        setDrawerOpen(true);
    }

    function closeDrawer() {
        setDrawerOpen(false);
    }

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const payload = { platform, url, is_active: isActive };

            try {
                if (editingLink) {
                    await saveSocialLink(payload, editingLink.id);
                } else {
                    await saveSocialLink(payload);
                }
                closeDrawer();
            } catch (err) {
                console.error(err);
                alert("Save failed, check console.");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this social link?")) return;
        startTransition(async () => {
            await deleteSocialLink(id);
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "وسائل التواصل الاجتماعي" : "Social Media Links"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        {locale === "ar"
                            ? "أدر الروابط لأيقونات التواصل في تذييل الموقع."
                            : "Manage your brand's presence across networks."}
                    </p>
                </div>
                <button
                    onClick={openNew}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 hover:shadow-xl hover:-translate-y-0.5"
                >
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "رابط جديد" : "Add Link"}
                </button>
            </div>

            {/* Grid */}
            {links.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex size-16 items-center justify-center rounded-full bg-white dark:bg-zinc-800 mb-4 shadow-sm text-zinc-400">
                        <SidebarIcon name="link" className="size-8" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "لا يوجد أي رابط بعد" : "No social links added"}
                    </h3>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6">
                    {links.map((l) => {
                        const platf = PLATFORMS.find(p => p.value === l.platform) || PLATFORMS[PLATFORMS.length - 1];

                        return (
                            <div key={l.id} className="group flex flex-col items-center rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 dark:border-zinc-800 dark:bg-zinc-900">

                                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button
                                        onClick={() => openEdit(l)}
                                        className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-zinc-600 shadow-md hover:bg-blue-500 hover:text-white dark:bg-zinc-800 dark:text-zinc-300 transition-colors"
                                    >
                                        <SidebarIcon name="edit" className="size-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(l.id)}
                                        disabled={isPending}
                                        className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-rose-600 shadow-md hover:bg-rose-600 hover:text-white dark:bg-zinc-800 transition-colors"
                                    >
                                        <SidebarIcon name="trash" className="size-4" />
                                    </button>
                                </div>

                                <div className="relative mb-4 flex size-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <SidebarIcon name={platf.icon as any} className="size-7" />
                                </div>

                                <h3 className="text-center font-bold text-zinc-900 dark:text-zinc-100 w-full text-sm">
                                    {platf.label}
                                </h3>

                                <a href={l.url} target="_blank" className="mt-1 text-xs text-zinc-400 hover:text-blue-500 underline decoration-transparent hover:decoration-blue-500 transition-all line-clamp-1 truncate w-full text-center block" title={l.url}>
                                    {l.url.replace(/^https?:\/\//, '')}
                                </a>

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
                                {editingLink
                                    ? (locale === "ar" ? "تعديل الرابط" : "Edit Link")
                                    : (locale === "ar" ? "رابط جديد" : "New Link")}
                            </h2>
                            <button onClick={closeDrawer} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                                <SidebarIcon name="x" className="size-5" />
                            </button>
                        </div>

                        {/* Drawer Scrolling Form */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="social-form" onSubmit={handleSave} className="space-y-6">

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "منصة التواصل الاجتماعي" : "Platform Network"}</label>
                                    <select
                                        required
                                        value={platform}
                                        onChange={(e) => setPlatform(e.target.value)}
                                        className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-zinc-800 dark:text-white"
                                    >
                                        {PLATFORMS.map(p => (
                                            <option key={p.value} value={p.value}>{p.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "رابط الحساب" : "Profile URL"}</label>
                                    <input
                                        required
                                        type="url"
                                        dir="ltr"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-zinc-800 dark:text-white"
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                    <div
                                        onClick={() => setIsActive(!isActive)}
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${isActive ? 'bg-blue-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                                    >
                                        <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </div>
                                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "نشط" : "Active"}</span>
                                </div>

                            </form>
                        </div>

                        {/* Drawer Footer */}
                        <div className="border-t border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50 flex justify-end gap-3 z-10">
                            <button
                                onClick={closeDrawer}
                                type="button"
                                className="rounded-xl border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 transition-colors text-center"
                            >{locale === "ar" ? "إلغاء" : "Cancel"}</button>
                            <button
                                type="submit"
                                form="social-form"
                                disabled={isPending}
                                className="flex-1 flex justify-center items-center gap-2 rounded-xl bg-blue-500 px-6 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-600 disabled:opacity-50"
                            >
                                {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                                Save Network
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
