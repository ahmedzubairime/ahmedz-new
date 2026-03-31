"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveOrderStatus, deleteOrderStatus } from "@/app/actions/store-orders";

type Props = { locale: string; statuses: any[]; };

export function OrderStatusesGrid({ locale, statuses }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);

    const [nameAr, setNameAr] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [color, setColor] = useState("#3b82f6");
    const [icon, setIcon] = useState("circle");
    const [isDefault, setIsDefault] = useState(false);
    const [isFinal, setIsFinal] = useState(false);
    const [sortOrder, setSortOrder] = useState("0");

    function openNew() {
        setEditing(null); setNameAr(""); setNameEn(""); setColor("#3b82f6"); setIcon("circle");
        setIsDefault(false); setIsFinal(false); setSortOrder("0"); setModalOpen(true);
    }

    function openEdit(s: any) {
        setEditing(s); setNameAr(s.name_ar || ""); setNameEn(s.name_en || ""); setColor(s.color || "#3b82f6");
        setIcon(s.icon || "circle"); setIsDefault(s.is_default); setIsFinal(s.is_final); setSortOrder(String(s.sort_order || 0));
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const payload = { name_ar: nameAr, name_en: nameEn, color, icon, is_default: isDefault, is_final: isFinal, sort_order: parseInt(sortOrder) || 0 };
            try { await saveOrderStatus(payload, editing?.id); close(); }
            catch (err) { console.error(err); alert(locale === "ar" ? "فشل الحفظ" : "Save failed"); }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "حذف هذه الحالة؟" : "Delete this status?")) return;
        startTransition(async () => { await deleteOrderStatus(id); });
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "حالات الطلبات" : "Order Statuses"}</h1>
                    <p className="mt-1 text-sm text-zinc-500">{locale === "ar" ? "خصّص مراحل سير عمل الطلبات." : "Customize your order pipeline stages."}</p>
                </div>
                <button onClick={openNew} className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "حالة جديدة" : "New Status"}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {statuses.map(s => (
                    <div key={s.id} className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: s.color + '20', color: s.color }}>
                            <SidebarIcon name={s.icon || "circle"} className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{locale === "ar" ? s.name_ar : s.name_en}</p>
                            <div className="flex gap-2 mt-1">
                                {s.is_default && <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded dark:bg-blue-500/10 dark:text-blue-400">{locale === "ar" ? "افتراضي" : "Default"}</span>}
                                {s.is_final && <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded dark:bg-zinc-700 dark:text-zinc-400">{locale === "ar" ? "نهائي" : "Final"}</span>}
                            </div>
                        </div>
                        <div className="flex size-5 rounded-full border-2" style={{ borderColor: s.color, backgroundColor: s.color }} />
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(s)} className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 transition-colors"><SidebarIcon name="edit" className="size-4" /></button>
                            <button onClick={() => handleDelete(s.id)} className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 text-zinc-400 transition-colors"><SidebarIcon name="trash" className="size-4" /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div onClick={close} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" />
                    <div className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-zinc-950 shadow-2xl flex flex-col rounded-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between border-b border-zinc-100 p-6 dark:border-zinc-800">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{editing ? (locale === "ar" ? "تعديل الحالة" : "Edit Status") : (locale === "ar" ? "حالة جديدة" : "New Status")}</h2>
                            <button onClick={close} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"><SidebarIcon name="x" className="size-5" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="status-form" onSubmit={handleSave} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الاسم (EN)" : "Name (EN)"}</label>
                                        <input required dir="ltr" value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الاسم (AR)" : "Name (AR)"}</label>
                                        <input required dir="rtl" value={nameAr} onChange={(e) => setNameAr(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "اللون" : "Color"}</label>
                                        <div className="flex gap-2 items-center">
                                            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="size-10 rounded-lg border border-zinc-200 cursor-pointer dark:border-zinc-700" />
                                            <input dir="ltr" value={color} onChange={(e) => setColor(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white font-mono" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الأيقونة" : "Icon"}</label>
                                        <div className="relative">
                                            <input dir="ltr" value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent pl-10 pr-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color }}><SidebarIcon name={icon as any} className="size-4" /></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "الترتيب" : "Order"}</label>
                                        <input dir="ltr" type="number" min="0" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="size-4 rounded accent-[var(--brand-primary)]" />
                                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "افتراضي" : "Default"}</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={isFinal} onChange={(e) => setIsFinal(e.target.checked)} className="size-4 rounded accent-[var(--brand-primary)]" />
                                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{locale === "ar" ? "حالة نهائية" : "Final State"}</span>
                                    </label>
                                </div>
                            </form>
                        </div>
                        <div className="border-t border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50 flex justify-end gap-3">
                            <button onClick={close} type="button" className="rounded-xl border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors">{locale === "ar" ? "إلغاء" : "Cancel"}</button>
                            <button type="submit" form="status-form" disabled={isPending} className="flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-2 text-sm font-bold text-white shadow-lg transition-all hover:brightness-110 hover:shadow-xl disabled:opacity-50">
                                {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                                {editing ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إنشاء" : "Create")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
