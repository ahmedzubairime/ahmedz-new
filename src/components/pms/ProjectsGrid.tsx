"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveProject, deleteProject, addProjectMember, removeProjectMember } from "@/app/actions/pms-projects";
import type { CrudPermissions } from "@/lib/permissions";

type Props = {
    locale: string;
    projects: any[];
    accounts: any[];
    branches: any[];
    perms: CrudPermissions;
    currentAccountId: string;
};

const STATUS_MAP: Record<string, { ar: string; en: string; color: string }> = {
    planning: { ar: "تخطيط", en: "Planning", color: "#94a3b8" },
    active: { ar: "نشط", en: "Active", color: "#22c55e" },
    on_hold: { ar: "معلّق", en: "On Hold", color: "#f59e0b" },
    completed: { ar: "مكتمل", en: "Completed", color: "#3b82f6" },
    archived: { ar: "أرشيف", en: "Archived", color: "#6b7280" },
};

const PRIORITY_MAP: Record<string, { ar: string; en: string; color: string }> = {
    low: { ar: "منخفضة", en: "Low", color: "#94a3b8" },
    medium: { ar: "متوسطة", en: "Medium", color: "#3b82f6" },
    high: { ar: "عالية", en: "High", color: "#f59e0b" },
    critical: { ar: "حرجة", en: "Critical", color: "#ef4444" },
};

export function ProjectsGrid({ locale, projects, accounts, branches, perms, currentAccountId }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    // Form state
    const [titleAr, setTitleAr] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [slug, setSlug] = useState("");
    const [descAr, setDescAr] = useState("");
    const [descEn, setDescEn] = useState("");
    const [status, setStatus] = useState("planning");
    const [priority, setPriority] = useState("medium");
    const [color, setColor] = useState("#3b82f6");
    const [branchId, setBranchId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [budget, setBudget] = useState("");

    const isAr = locale === "ar";

    function openNew() {
        setEditing(null); setTitleAr(""); setTitleEn(""); setSlug(""); setDescAr(""); setDescEn("");
        setStatus("planning"); setPriority("medium"); setColor("#3b82f6"); setBranchId("");
        setStartDate(""); setDueDate(""); setBudget(""); setModalOpen(true);
    }

    function openEdit(p: any) {
        setEditing(p); setTitleAr(p.title_ar || ""); setTitleEn(p.title_en || ""); setSlug(p.slug || "");
        setDescAr(p.description_ar || ""); setDescEn(p.description_en || "");
        setStatus(p.status); setPriority(p.priority); setColor(p.color || "#3b82f6");
        setBranchId(p.branch_id || ""); setStartDate(p.start_date || ""); setDueDate(p.due_date || "");
        setBudget(p.budget ? String(p.budget) : ""); setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function handleTitleEnChange(val: string) {
        setTitleEn(val);
        if (!editing) setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const payload: any = {
                title_ar: titleAr, title_en: titleEn, slug,
                description_ar: descAr, description_en: descEn,
                status, priority, color,
                branch_id: branchId || null,
                start_date: startDate || null, due_date: dueDate || null,
                budget: budget ? parseFloat(budget) : null,
            };
            try { await saveProject(payload, editing?.id); close(); }
            catch (err) { console.error(err); alert(isAr ? "فشل الحفظ" : "Save failed"); }
        });
    }

    function handleArchive(id: string) {
        if (!confirm(isAr ? "أرشفة هذا المشروع؟" : "Archive this project?")) return;
        startTransition(async () => { await deleteProject(id); });
    }

    const filtered = projects.filter((p: any) => {
        const q = search.toLowerCase();
        const matchSearch = !q || p.title_en?.toLowerCase().includes(q) || p.title_ar?.includes(q) || p.slug?.includes(q);
        const matchStatus = !filterStatus || p.status === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{isAr ? "جميع المشاريع" : "All Projects"}</h1>
                    <p className="mt-1 text-sm text-zinc-500">{isAr ? "إنشاء وإدارة مشاريع فريقك." : "Create and manage your team projects."}</p>
                </div>
                {perms.can_create && (
                    <button onClick={openNew} className="flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5">
                        <SidebarIcon name="plus" className="size-5" />
                        {isAr ? "مشروع جديد" : "New Project"}
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <SidebarIcon name="search" className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={isAr ? "بحث بالاسم..." : "Search projects..."} className="w-full rounded-xl border border-zinc-200 bg-white ps-10 pe-4 py-2.5 text-sm outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white" />
                </div>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
                    <option value="">{isAr ? "كل الحالات" : "All Statuses"}</option>
                    {Object.entries(STATUS_MAP).map(([key, val]) => (
                        <option key={key} value={key}>{isAr ? val.ar : val.en}</option>
                    ))}
                </select>
            </div>

            {/* Projects Grid */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <SidebarIcon name="folder-kanban" className="size-8 text-zinc-400 mb-3" />
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{isAr ? "لا توجد مشاريع" : "No projects found"}</h3>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((p: any) => {
                        const st = STATUS_MAP[p.status] || STATUS_MAP.planning;
                        const pri = PRIORITY_MAP[p.priority] || PRIORITY_MAP.medium;
                        return (
                            <div key={p.id} className="group relative rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                                {/* Color bar */}
                                <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl" style={{ backgroundColor: p.color || '#3b82f6' }} />

                                <div className="flex items-start justify-between mb-3 pt-1">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-9 items-center justify-center rounded-lg" style={{ backgroundColor: (p.color || '#3b82f6') + '15', color: p.color || '#3b82f6' }}>
                                            <SidebarIcon name="folder" className="size-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{isAr ? p.title_ar : p.title_en}</h3>
                                            <p className="text-xs text-zinc-400 font-mono">/{p.slug}</p>
                                        </div>
                                    </div>
                                    {(perms.can_update || perms.can_delete) && (
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {perms.can_update && <button onClick={() => openEdit(p)} className="flex size-7 cursor-pointer items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400"><SidebarIcon name="edit" className="size-3.5" /></button>}
                                            {perms.can_delete && <button onClick={() => handleArchive(p.id)} className="flex size-7 cursor-pointer items-center justify-center rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 text-zinc-400"><SidebarIcon name="archive" className="size-3.5" /></button>}
                                        </div>
                                    )}
                                </div>

                                {p.description_ar || p.description_en ? (
                                    <p className="text-xs text-zinc-500 line-clamp-2 mb-3">{isAr ? p.description_ar : p.description_en}</p>
                                ) : null}

                                <div className="flex items-center gap-2 flex-wrap mb-3">
                                    <span className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: st.color + '20', color: st.color }}>{isAr ? st.ar : st.en}</span>
                                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: pri.color + '15', color: pri.color }}>
                                        <SidebarIcon name={pri.color === '#ef4444' ? 'alert-triangle' : 'arrow-up'} className="size-2.5" />
                                        {isAr ? pri.ar : pri.en}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs text-zinc-400">
                                    <div className="flex items-center gap-1.5">
                                        {p.creator?.avatar_url ? <img src={p.creator.avatar_url} className="size-5 rounded-full object-cover" alt="" /> : <div className="flex size-5 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700 text-[8px] font-bold">{p.creator?.full_name?.charAt(0)}</div>}
                                        <span>{p.creator?.full_name}</span>
                                    </div>
                                    {p.due_date && (
                                        <span className={new Date(p.due_date) < new Date() && p.status !== 'completed' ? 'text-rose-500 font-bold' : ''}>
                                            {new Date(p.due_date).toLocaleDateString(isAr ? "ar" : "en", { month: "short", day: "numeric" })}
                                        </span>
                                    )}
                                </div>
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
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{editing ? (isAr ? "تعديل المشروع" : "Edit Project") : (isAr ? "مشروع جديد" : "New Project")}</h2>
                            <button onClick={close} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><SidebarIcon name="x" className="size-5" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="project-form" onSubmit={handleSave} className="space-y-5">
                                {/* Bilingual Names */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "اسم المشروع (EN)" : "Project Name (EN)"}</label>
                                        <input required dir="ltr" value={titleEn} onChange={(e) => handleTitleEnChange(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "اسم المشروع (AR)" : "Project Name (AR)"}</label>
                                        <input required dir="rtl" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "الرابط" : "Slug"}</label>
                                    <input required dir="ltr" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white font-mono text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "الوصف (EN)" : "Description (EN)"}</label>
                                    <textarea dir="ltr" rows={2} value={descEn} onChange={(e) => setDescEn(e.target.value)} className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "الوصف (AR)" : "Description (AR)"}</label>
                                    <textarea dir="rtl" rows={2} value={descAr} onChange={(e) => setDescAr(e.target.value)} className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "الحالة" : "Status"}</label>
                                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none dark:border-zinc-800 dark:text-white">
                                            {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{isAr ? v.ar : v.en}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "الأولوية" : "Priority"}</label>
                                        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none dark:border-zinc-800 dark:text-white">
                                            {Object.entries(PRIORITY_MAP).map(([k, v]) => <option key={k} value={k}>{isAr ? v.ar : v.en}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "اللون" : "Color"}</label>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="size-10 rounded-lg border border-zinc-200 cursor-pointer dark:border-zinc-700" />
                                            <input dir="ltr" value={color} onChange={(e) => setColor(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:text-white font-mono" />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "الفرع" : "Branch"}</label>
                                        <select value={branchId} onChange={(e) => setBranchId(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none dark:border-zinc-800 dark:text-white">
                                            <option value="">{isAr ? "-- بدون --" : "-- None --"}</option>
                                            {branches.map((b: any) => <option key={b.id} value={b.id}>{isAr ? b.name_ar : b.name_en}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "تاريخ البدء" : "Start Date"}</label>
                                        <input dir="ltr" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "تاريخ التسليم" : "Due Date"}</label>
                                        <input dir="ltr" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "الميزانية (SAR)" : "Budget (SAR)"}</label>
                                    <input dir="ltr" type="number" step="0.01" min="0" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="0.00" className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none dark:border-zinc-800 dark:text-white" />
                                </div>
                            </form>
                        </div>
                        <div className="border-t border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50 flex justify-end gap-3">
                            <button onClick={close} type="button" className="rounded-xl border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">{isAr ? "إلغاء" : "Cancel"}</button>
                            <button type="submit" form="project-form" disabled={isPending} className="flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-2 text-sm font-bold text-white shadow-lg hover:brightness-110 disabled:opacity-50">
                                {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                                {editing ? (isAr ? "حفظ" : "Save") : (isAr ? "إنشاء مشروع" : "Create Project")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
