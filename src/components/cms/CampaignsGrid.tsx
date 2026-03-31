"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveCampaign, deleteCampaign } from "@/app/actions/store-marketing";

type Props = { locale: string; campaigns: any[]; };

export function CampaignsGrid({ locale, campaigns }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);

    const [nameAr, setNameAr] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [descAr, setDescAr] = useState("");
    const [descEn, setDescEn] = useState("");
    const [startsAt, setStartsAt] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const [isActive, setIsActive] = useState(true);

    function openNew() {
        setEditing(null); setNameAr(""); setNameEn(""); setDescAr(""); setDescEn("");
        setStartsAt(""); setExpiresAt(""); setIsActive(true); setModalOpen(true);
    }

    function openEdit(c: any) {
        setEditing(c); setNameAr(c.name_ar || ""); setNameEn(c.name_en || "");
        setDescAr(c.description_ar || ""); setDescEn(c.description_en || "");
        setStartsAt(c.starts_at ? c.starts_at.substring(0, 16) : "");
        setExpiresAt(c.expires_at ? c.expires_at.substring(0, 16) : "");
        setIsActive(c.is_active); setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const payload = {
                name_ar: nameAr, name_en: nameEn, description_ar: descAr, description_en: descEn,
                starts_at: startsAt || null, expires_at: expiresAt || null, is_active: isActive,
            };
            try { await saveCampaign(payload, editing?.id); close(); }
            catch (err) { console.error(err); alert(locale === "ar" ? "فشل الحفظ" : "Save failed"); }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "حذف هذه الحملة؟" : "Delete this campaign?")) return;
        startTransition(async () => { await deleteCampaign(id); });
    }

    const now = new Date();

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "الحملات التسويقية" : "Campaigns"}</h1>
                    <p className="mt-1 text-sm text-zinc-500">{locale === "ar" ? "أنشئ حملات ترويجية مؤقتة." : "Create time-limited promotional campaigns."}</p>
                </div>
                <button onClick={openNew} className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "حملة جديدة" : "New Campaign"}
                </button>
            </div>

            {campaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <SidebarIcon name="megaphone" className="size-8 text-zinc-400 mb-3" />
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد حملات" : "No campaigns yet"}</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {campaigns.map(c => {
                        const active = c.is_active && (!c.expires_at || new Date(c.expires_at) > now);
                        return (
                            <div key={c.id} className={`group rounded-2xl border bg-white p-5 shadow-sm hover:shadow-lg transition-all dark:bg-zinc-900 ${active ? 'border-zinc-200 dark:border-zinc-800' : 'border-zinc-300 dark:border-zinc-700 opacity-60'}`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`flex size-10 items-center justify-center rounded-xl ${active ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'}`}>
                                        <SidebarIcon name="megaphone" className="size-5" />
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(c)} className="flex size-7 cursor-pointer items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400"><SidebarIcon name="edit" className="size-3.5" /></button>
                                        <button onClick={() => handleDelete(c.id)} className="flex size-7 cursor-pointer items-center justify-center rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 text-zinc-400"><SidebarIcon name="trash" className="size-3.5" /></button>
                                    </div>
                                </div>
                                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">{locale === "ar" ? c.name_ar : c.name_en}</h3>
                                <p className="text-xs text-zinc-500 line-clamp-2">{locale === "ar" ? c.description_ar : c.description_en}</p>
                                {(c.starts_at || c.expires_at) && (
                                    <div className="flex gap-1 mt-3 text-[10px] text-zinc-400">
                                        {c.starts_at && <span>{new Date(c.starts_at).toLocaleDateString(locale === "ar" ? "ar" : "en")}</span>}
                                        {c.starts_at && c.expires_at && <span>→</span>}
                                        {c.expires_at && <span>{new Date(c.expires_at).toLocaleDateString(locale === "ar" ? "ar" : "en")}</span>}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div onClick={close} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" />
                    <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-950 shadow-2xl flex flex-col rounded-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between border-b border-zinc-100 p-6 dark:border-zinc-800">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{editing ? (locale === "ar" ? "تعديل الحملة" : "Edit Campaign") : (locale === "ar" ? "حملة جديدة" : "New Campaign")}</h2>
                            <button onClick={close} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><SidebarIcon name="x" className="size-5" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="campaign-form" onSubmit={handleSave} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "اسم الحملة (EN)" : "Campaign Name (EN)"}</label>
                                        <input required dir="ltr" value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "اسم الحملة (AR)" : "Campaign Name (AR)"}</label>
                                        <input required dir="rtl" value={nameAr} onChange={(e) => setNameAr(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الوصف (EN)" : "Description (EN)"}</label>
                                    <textarea dir="ltr" rows={2} value={descEn} onChange={(e) => setDescEn(e.target.value)} className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الوصف (AR)" : "Description (AR)"}</label>
                                    <textarea dir="rtl" rows={2} value={descAr} onChange={(e) => setDescAr(e.target.value)} className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "يبدأ من" : "Starts At"}</label>
                                        <input dir="ltr" type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "ينتهي في" : "Expires At"}</label>
                                        <input dir="ltr" type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div onClick={() => setIsActive(!isActive)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${isActive ? 'bg-[var(--brand-primary)]' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                                        <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </div>
                                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "مفعّل" : "Active"}</span>
                                </div>
                            </form>
                        </div>
                        <div className="border-t border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50 flex justify-end gap-3">
                            <button onClick={close} type="button" className="rounded-xl border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">{locale === "ar" ? "إلغاء" : "Cancel"}</button>
                            <button type="submit" form="campaign-form" disabled={isPending} className="flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-2 text-sm font-bold text-white shadow-lg hover:brightness-110 disabled:opacity-50">
                                {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                                {editing ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إنشاء حملة" : "Create Campaign")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
