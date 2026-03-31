"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import type { CrudPermissions } from "@/lib/permissions";

type Props = {
    locale: string;
    branches: any[];
    perms: CrudPermissions;
};

export function BranchesGrid({ locale, branches, perms }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);

    const [nameAr, setNameAr] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [addressAr, setAddressAr] = useState("");
    const [addressEn, setAddressEn] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [isActive, setIsActive] = useState(true);

    const isAr = locale === "ar";

    function openNew() {
        setEditing(null); setNameAr(""); setNameEn(""); setAddressAr(""); setAddressEn("");
        setPhone(""); setEmail(""); setLat(""); setLng(""); setIsActive(true); setModalOpen(true);
    }

    function openEdit(b: any) {
        setEditing(b); setNameAr(b.name_ar || ""); setNameEn(b.name_en || "");
        setAddressAr(b.address_ar || ""); setAddressEn(b.address_en || "");
        setPhone(b.phone || ""); setEmail(b.email || "");
        setLat(b.latitude ? String(b.latitude) : ""); setLng(b.longitude ? String(b.longitude) : "");
        setIsActive(b.is_active); setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const payload: any = {
                name_ar: nameAr, name_en: nameEn, address_ar: addressAr, address_en: addressEn,
                phone: phone || null, email: email || null,
                latitude: lat ? parseFloat(lat) : null, longitude: lng ? parseFloat(lng) : null,
                is_active: isActive,
            };
            try {
                const { createClient } = await import("@/lib/supabase/client");
                const supabase = createClient();
                if (editing?.id) {
                    const { error } = await supabase.from("branches").update(payload).eq("id", editing.id);
                    if (error) throw error;
                } else {
                    const { error } = await supabase.from("branches").insert(payload);
                    if (error) throw error;
                }
                close();
                window.location.reload();
            } catch (err) { console.error(err); alert(isAr ? "فشل الحفظ" : "Save failed"); }
        });
    }

    async function handleDelete(id: string) {
        if (!confirm(isAr ? "حذف هذا الفرع؟" : "Delete this branch?")) return;
        startTransition(async () => {
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();
            await supabase.from("branches").delete().eq("id", id);
            window.location.reload();
        });
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{isAr ? "الفروع والمواقع" : "Branches & Locations"}</h1>
                    <p className="mt-1 text-sm text-zinc-500">{isAr ? "إدارة مواقع فروع المنظمة." : "Manage your organization branch locations."}</p>
                </div>
                {perms.can_create && (
                    <button onClick={openNew} className="flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5">
                        <SidebarIcon name="plus" className="size-5" />
                        {isAr ? "فرع جديد" : "New Branch"}
                    </button>
                )}
            </div>

            {branches.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <SidebarIcon name="map-pin" className="size-8 text-zinc-400 mb-3" />
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{isAr ? "لا توجد فروع" : "No branches yet"}</h3>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {branches.map((b: any) => (
                        <div key={b.id} className={`group relative rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-lg dark:bg-zinc-900 ${b.is_active ? 'border-zinc-200 dark:border-zinc-800' : 'border-zinc-300 dark:border-zinc-700 opacity-60'}`}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`flex size-10 items-center justify-center rounded-xl ${b.is_active ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'}`}>
                                        <SidebarIcon name="map-pin" className="size-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{isAr ? b.name_ar : b.name_en}</h3>
                                        {b.is_active ? (
                                            <span className="text-[10px] font-bold text-emerald-500">{isAr ? "نشط" : "Active"}</span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-zinc-400">{isAr ? "معطّل" : "Inactive"}</span>
                                        )}
                                    </div>
                                </div>
                                {(perms.can_update || perms.can_delete) && (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {perms.can_update && <button onClick={() => openEdit(b)} className="flex size-7 cursor-pointer items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400"><SidebarIcon name="edit" className="size-3.5" /></button>}
                                        {perms.can_delete && <button onClick={() => handleDelete(b.id)} className="flex size-7 cursor-pointer items-center justify-center rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 text-zinc-400"><SidebarIcon name="trash" className="size-3.5" /></button>}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-zinc-500 mb-2">{isAr ? b.address_ar : b.address_en}</p>
                            <div className="flex flex-wrap gap-3 text-xs text-zinc-400">
                                {b.phone && <span className="flex items-center gap-1"><SidebarIcon name="phone" className="size-3" />{b.phone}</span>}
                                {b.email && <span className="flex items-center gap-1"><SidebarIcon name="mail" className="size-3" />{b.email}</span>}
                            </div>
                            {(b.latitude && b.longitude) && (
                                <div className="mt-3 flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
                                    <SidebarIcon name="navigation" className="size-3" />
                                    {b.latitude.toFixed(4)}, {b.longitude.toFixed(4)}
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
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{editing ? (isAr ? "تعديل الفرع" : "Edit Branch") : (isAr ? "فرع جديد" : "New Branch")}</h2>
                            <button onClick={close} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><SidebarIcon name="x" className="size-5" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="branch-form" onSubmit={handleSave} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "اسم الفرع (EN)" : "Branch Name (EN)"}</label>
                                        <input required dir="ltr" value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "اسم الفرع (AR)" : "Branch Name (AR)"}</label>
                                        <input required dir="rtl" value={nameAr} onChange={(e) => setNameAr(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "العنوان (EN)" : "Address (EN)"}</label>
                                        <textarea required dir="ltr" rows={2} value={addressEn} onChange={(e) => setAddressEn(e.target.value)} className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "العنوان (AR)" : "Address (AR)"}</label>
                                        <textarea required dir="rtl" rows={2} value={addressAr} onChange={(e) => setAddressAr(e.target.value)} className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "هاتف" : "Phone"}</label>
                                        <input dir="ltr" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "بريد إلكتروني" : "Email"}</label>
                                        <input dir="ltr" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "خط العرض" : "Latitude"}</label>
                                        <input dir="ltr" type="number" step="0.000001" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="24.7136" className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "خط الطول" : "Longitude"}</label>
                                        <input dir="ltr" type="number" step="0.000001" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="46.6753" className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div onClick={() => setIsActive(!isActive)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${isActive ? 'bg-[var(--brand-primary)]' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                                        <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </div>
                                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "نشط" : "Active"}</span>
                                </div>
                            </form>
                        </div>
                        <div className="border-t border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50 flex justify-end gap-3">
                            <button onClick={close} type="button" className="rounded-xl border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">{isAr ? "إلغاء" : "Cancel"}</button>
                            <button type="submit" form="branch-form" disabled={isPending} className="flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-2 text-sm font-bold text-white shadow-lg hover:brightness-110 disabled:opacity-50">
                                {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                                {editing ? (isAr ? "حفظ" : "Save") : (isAr ? "إضافة فرع" : "Add Branch")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
