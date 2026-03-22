"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveBranch, deleteBranch } from "@/app/actions/external-lists";

type Props = {
    locale: string;
    branches: any[];
};

export function BranchesGrid({ locale, branches }: Props) {
    const [isPending, startTransition] = useTransition();

    // Drawer State
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<any>(null);

    // Form State
    const [nameAr, setNameAr] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [addressAr, setAddressAr] = useState("");
    const [addressEn, setAddressEn] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [latitude, setLatitude] = useState<number | "">("");
    const [longitude, setLongitude] = useState<number | "">("");
    const [isActive, setIsActive] = useState(true);

    function openNew() {
        setEditingBranch(null);
        setNameAr("");
        setNameEn("");
        setAddressAr("");
        setAddressEn("");
        setPhone("");
        setEmail("");
        setLatitude("");
        setLongitude("");
        setIsActive(true);
        setDrawerOpen(true);
    }

    function openEdit(b: any) {
        setEditingBranch(b);
        setNameAr(b.name_ar || "");
        setNameEn(b.name_en || "");
        setAddressAr(b.address_ar || "");
        setAddressEn(b.address_en || "");
        setPhone(b.phone || "");
        setEmail(b.email || "");
        setLatitude(b.latitude ?? "");
        setLongitude(b.longitude ?? "");
        setIsActive(b.is_active);
        setDrawerOpen(true);
    }

    function closeDrawer() {
        setDrawerOpen(false);
    }

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const payload = {
                name_ar: nameAr,
                name_en: nameEn,
                address_ar: addressAr,
                address_en: addressEn,
                phone: phone || null,
                email: email || null,
                latitude: latitude === "" ? null : parseFloat(latitude.toString()),
                longitude: longitude === "" ? null : parseFloat(longitude.toString()),
                is_active: isActive
            };

            try {
                if (editingBranch) {
                    await saveBranch(payload, editingBranch.id);
                } else {
                    await saveBranch(payload);
                }
                closeDrawer();
            } catch (err) {
                console.error(err);
                alert("Save failed, check console.");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this branch location?")) return;
        startTransition(async () => {
            await deleteBranch(id);
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "إدارة الفروع والمقرات" : "Branch Locations"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        {locale === "ar"
                            ? "أضف فروع شركتك عالمياً لتظهر على الخريطة التفاعلية."
                            : "Manage your physical office locations across the globe."}
                    </p>
                </div>
                <button
                    onClick={openNew}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 hover:shadow-xl hover:-translate-y-0.5"
                >
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "فرع جديد" : "Add Branch"}
                </button>
            </div>

            {/* Grid */}
            {branches.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex size-16 items-center justify-center rounded-full bg-white dark:bg-zinc-800 mb-4 shadow-sm text-zinc-400">
                        <SidebarIcon name="map-pin" className="size-8" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "لا توجد فروع مسجلة" : "No branches configured"}
                    </h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {branches.map((b) => (
                        <div key={b.id} className="group relative flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 dark:border-zinc-800 dark:bg-zinc-900">

                            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button
                                    onClick={() => openEdit(b)}
                                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white dark:bg-zinc-800 dark:text-zinc-300 transition-colors"
                                >
                                    <SidebarIcon name="edit" className="size-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(b.id)}
                                    disabled={isPending}
                                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white dark:bg-zinc-800 transition-colors"
                                >
                                    <SidebarIcon name="trash" className="size-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                                    <SidebarIcon name="building" className="size-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                                        {locale === "ar" ? b.name_ar : b.name_en}
                                    </h3>
                                    {(b.latitude && b.longitude) ? (
                                        <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
                                            <SidebarIcon name="map-pin" className="size-3" />
                                            {b.latitude.toFixed(3)}, {b.longitude.toFixed(3)}
                                        </div>
                                    ) : (
                                        <div className="text-[10px] text-zinc-400">No map coords</div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    {locale === "ar" ? b.address_ar : b.address_en}
                                </p>
                                <div className="mt-3 flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                                    {b.phone && <div className="flex items-center gap-2"><SidebarIcon name="phone" className="size-3" /> {b.phone}</div>}
                                    {b.email && <div className="flex items-center gap-2"><SidebarIcon name="mail" className="size-3" /> {b.email}</div>}
                                </div>
                            </div>

                            <div className="mt-auto pt-2 flex items-center justify-between">
                                <span className={`flex size-3 rounded-full ${b.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sliding Drawer Overlay */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div onClick={closeDrawer} className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" />

                    {/* Drawer Panel */}
                    <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-950 shadow-2xl flex flex-col rounded-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden border border-zinc-200 dark:border-zinc-800">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between border-b border-zinc-100 p-6 dark:border-zinc-800">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                {editingBranch
                                    ? (locale === "ar" ? "تعديل الفرع" : "Edit Branch")
                                    : (locale === "ar" ? "فرع جديد" : "New Branch")}
                            </h2>
                            <button onClick={closeDrawer} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                                <SidebarIcon name="x" className="size-5" />
                            </button>
                        </div>

                        {/* Drawer Scrolling Form */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="branch-form" onSubmit={handleSave} className="space-y-6">

                                <div className="grid grid-cols-2 gap-4 border-b border-zinc-100 pb-6 dark:border-zinc-800">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الاسم (بالإنجليزية)" : "English Name"}</label>
                                        <input
                                            required
                                            dir="ltr"
                                            value={nameEn}
                                            onChange={(e) => setNameEn(e.target.value)}
                                            placeholder="e.g. Dubai Main Office"
                                            className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-emerald-500 dark:border-zinc-800 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "اسم المكتب (بالعربية)" : "Arabic Branch Name"}</label>
                                        <input
                                            required
                                            dir="rtl"
                                            value={nameAr}
                                            onChange={(e) => setNameAr(e.target.value)}
                                            className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-emerald-500 dark:border-zinc-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "رقم الهاتف" : "Contact Phone"}</label>
                                        <input
                                            type="tel"
                                            dir="ltr"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-emerald-500 dark:border-zinc-800 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "البريد الإلكتروني" : "Contact Email"}</label>
                                        <input
                                            type="email"
                                            dir="ltr"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-emerald-500 dark:border-zinc-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "عنوان المقر (بالإنجليزية)" : "English Physical Address"}</label>
                                    <textarea
                                        required
                                        dir="ltr"
                                        rows={3}
                                        value={addressEn}
                                        onChange={(e) => setAddressEn(e.target.value)}
                                        className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-emerald-500 dark:border-zinc-800 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "عنوان المقر (بالعربية)" : "Arabic Physical Address"}</label>
                                    <textarea
                                        required
                                        dir="rtl"
                                        rows={3}
                                        value={addressAr}
                                        onChange={(e) => setAddressAr(e.target.value)}
                                        className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-emerald-500 dark:border-zinc-800 dark:text-white"
                                    />
                                </div>

                                <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 dark:border-blue-500/20">
                                    <h4 className="mb-3 text-sm font-bold text-blue-600 dark:text-blue-400">{locale === "ar" ? "إحداثيات الخريطة (اختياري)" : "Map Coordinates (Optional)"}</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{locale === "ar" ? "خط العرض (Latitude)" : "Latitude"}</label>
                                            <input
                                                type="number"
                                                step="any"
                                                dir="ltr"
                                                value={latitude}
                                                onChange={(e) => setLatitude(e.target.value ? Number(e.target.value) : "")}
                                                placeholder="25.2048"
                                                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{locale === "ar" ? "خط الطول (Longitude)" : "Longitude"}</label>
                                            <input
                                                type="number"
                                                step="any"
                                                dir="ltr"
                                                value={longitude}
                                                onChange={(e) => setLongitude(e.target.value ? Number(e.target.value) : "")}
                                                placeholder="55.2708"
                                                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <div
                                        onClick={() => setIsActive(!isActive)}
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${isActive ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                                    >
                                        <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </div>
                                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "مقر نشط" : "Active Location"}</span>
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
                                form="branch-form"
                                disabled={isPending}
                                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-emerald-600 disabled:opacity-50"
                            >
                                {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                                Save Branch
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
