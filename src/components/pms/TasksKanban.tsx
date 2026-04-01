"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveTask, updateTaskStatus, deleteTask } from "@/app/actions/pms-tasks";
import type { CrudPermissions } from "@/lib/permissions";
import { TaskDetailDrawer } from "./TaskDetailDrawer";

type Props = {
    locale: string;
    tasks: any[];
    statuses: any[];
    labels: any[];
    projects: any[];
    accounts: any[];
    perms: CrudPermissions;
    currentAccountId: string;
    userRoles: string[];
};

const PRIORITY_BADGE: Record<string, { color: string; icon: string }> = {
    low: { color: "#94a3b8", icon: "arrow-down" },
    medium: { color: "#3b82f6", icon: "minus" },
    high: { color: "#f59e0b", icon: "arrow-up" },
    critical: { color: "#ef4444", icon: "alert-triangle" },
};

export function TasksKanban({ locale, tasks, statuses, labels, projects, accounts, perms, currentAccountId, userRoles }: Props) {
    const [openedTaskId, setOpenedTaskId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [filterProject, setFilterProject] = useState("");
    const [filterAssignee, setFilterAssignee] = useState("");

    // Form
    const [titleAr, setTitleAr] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [descAr, setDescAr] = useState("");
    const [descEn, setDescEn] = useState("");
    const [projectId, setProjectId] = useState("");
    const [statusId, setStatusId] = useState("");
    const [priority, setPriority] = useState("medium");
    const [assigneeId, setAssigneeId] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [estimatedHours, setEstimatedHours] = useState("");
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

    const isAr = locale === "ar";
    const isAdmin = userRoles.some(r => ["super-admin", "admin", "branch-manager"].includes(r));
    const isLeader = userRoles.includes("team-leader");
    const canManageTask = (task: any) => {
        if (isAdmin || isLeader) return true;
        return task.assignee_id === currentAccountId && perms.can_update;
    };

    function openNew() {
        setEditing(null); setTitleAr(""); setTitleEn(""); setDescAr(""); setDescEn("");
        setProjectId(filterProject || (projects[0]?.id || "")); setStatusId(statuses.find((s: any) => s.is_default)?.id || statuses[0]?.id || "");
        setPriority("medium"); setAssigneeId(""); setDueDate(""); setStartDate("");
        setEstimatedHours(""); setSelectedLabels([]); setModalOpen(true);
    }

    function openEdit(t: any) {
        setEditing(t); setTitleAr(t.title_ar || ""); setTitleEn(t.title_en || "");
        setDescAr(t.description_ar || ""); setDescEn(t.description_en || "");
        setProjectId(t.project_id || ""); setStatusId(t.status_id || "");
        setPriority(t.priority || "medium"); setAssigneeId(t.assignee_id || "");
        setDueDate(t.due_date || ""); setStartDate(t.start_date || "");
        setEstimatedHours(t.estimated_hours ? String(t.estimated_hours) : "");
        setSelectedLabels((t.labels || []).map((l: any) => l.label?.id).filter(Boolean));
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function toggleLabel(labelId: string) {
        setSelectedLabels(prev => prev.includes(labelId) ? prev.filter(l => l !== labelId) : [...prev, labelId]);
    }

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const payload: any = {
                title_ar: titleAr, title_en: titleEn,
                description_ar: descAr, description_en: descEn,
                project_id: projectId, status_id: statusId,
                priority, assignee_id: assigneeId || null,
                due_date: dueDate || null, start_date: startDate || null,
                estimated_hours: estimatedHours ? parseFloat(estimatedHours) : null,
                labels: selectedLabels,
            };
            try { await saveTask(payload, editing?.id); close(); }
            catch (err) { console.error(err); alert(isAr ? "فشل الحفظ" : "Save failed"); }
        });
    }

    function handleStatusChange(taskId: string, newStatusId: string) {
        startTransition(async () => { await updateTaskStatus(taskId, newStatusId); });
    }

    function handleDelete(id: string) {
        if (!confirm(isAr ? "حذف هذه المهمة؟" : "Delete this task?")) return;
        startTransition(async () => { await deleteTask(id); });
    }

    // Filter tasks
    const filteredTasks = tasks.filter((t: any) => {
        if (filterProject && t.project_id !== filterProject) return false;
        if (filterAssignee) {
            if (filterAssignee === "me" && t.assignee_id !== currentAccountId) return false;
            if (filterAssignee !== "me" && t.assignee_id !== filterAssignee) return false;
        }
        // Team members only see their assigned tasks board
        if (!isAdmin && !isLeader && t.assignee_id !== currentAccountId) return false;
        return true;
    });

    // Group by status for Kanban columns
    const columns = statuses.map((s: any) => ({
        ...s,
        tasks: filteredTasks.filter((t: any) => t.status_id === s.id),
    }));

    return (
        <div className="space-y-6 max-w-full mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{isAr ? "لوحة المهام" : "Task Board"}</h1>
                    <p className="mt-1 text-sm text-zinc-500">{isAr ? "سحب وإسقاط لتحديث حالة المهام." : "Drag-and-drop style task management."}</p>
                </div>
                {perms.can_create && (
                    <button onClick={openNew} className="flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5">
                        <SidebarIcon name="plus" className="size-5" />
                        {isAr ? "مهمة جديدة" : "New Task"}
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)} className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
                    <option value="">{isAr ? "كل المشاريع" : "All Projects"}</option>
                    {projects.map((p: any) => <option key={p.id} value={p.id}>{isAr ? p.title_ar : p.title_en}</option>)}
                </select>
                {(isAdmin || isLeader) && (
                    <select value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)} className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
                        <option value="">{isAr ? "كل الأعضاء" : "All Assignees"}</option>
                        <option value="me">{isAr ? "مهامي" : "My Tasks"}</option>
                        {accounts.map((a: any) => <option key={a.id} value={a.id}>{a.full_name}</option>)}
                    </select>
                )}
            </div>

            {/* Kanban */}
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                {columns.map((col: any) => (
                    <div key={col.id} className="flex flex-col min-w-[280px] max-w-[320px] rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/30 snap-start shrink-0">
                        {/* Column Header */}
                        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
                            <div className="flex items-center gap-2">
                                <div className="flex size-7 items-center justify-center rounded-lg" style={{ backgroundColor: col.color + '20', color: col.color }}>
                                    <SidebarIcon name={col.icon || "circle"} className="size-4" />
                                </div>
                                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{isAr ? col.name_ar : col.name_en}</span>
                            </div>
                            <span className="flex size-6 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-400">{col.tasks.length}</span>
                        </div>

                        {/* Task Cards */}
                        <div className="flex-1 p-3 space-y-2 max-h-[65vh] overflow-y-auto">
                            {col.tasks.length === 0 ? (
                                <div className="flex items-center justify-center py-8 text-xs text-zinc-400">{isAr ? "لا توجد مهام" : "No tasks"}</div>
                            ) : (
                                col.tasks.map((t: any) => {
                                    const pri = PRIORITY_BADGE[t.priority] || PRIORITY_BADGE.medium;
                                    return (
                                        <div key={t.id} onClick={() => setOpenedTaskId(t.id)} className="group cursor-pointer rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3.5 shadow-sm hover:shadow-md transition-all">
                                            {/* Top: Project + Priority */}
                                            <div className="flex items-center justify-between mb-2">
                                                {t.project && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: (t.project.color || '#3b82f6') + '15', color: t.project.color || '#3b82f6' }}>
                                                        {isAr ? t.project.title_ar : t.project.title_en}
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-0.5" style={{ color: pri.color }}>
                                                    <SidebarIcon name={pri.icon as any} className="size-3" />
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">{isAr ? t.title_ar : t.title_en}</p>

                                            {/* Labels */}
                                            {t.labels && t.labels.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-2">
                                                    {t.labels.map((tl: any) => tl.label && (
                                                        <span key={tl.label.id} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: tl.label.color + '20', color: tl.label.color }}>
                                                            {isAr ? tl.label.name_ar : tl.label.name_en}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Subtasks count */}
                                            {t.subtasks && t.subtasks.length > 0 && (
                                                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mb-2">
                                                    <SidebarIcon name="list" className="size-3" />
                                                    <span>{t.subtasks.filter((s: any) => s.completed_at).length}/{t.subtasks.length}</span>
                                                </div>
                                            )}

                                            {/* Bottom: Assignee + Date + Actions */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    {t.assignee ? (
                                                        t.assignee.avatar_url ? <img src={t.assignee.avatar_url} className="size-5 rounded-full object-cover" alt="" /> : <div className="flex size-5 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700 text-[8px] font-bold text-zinc-500">{t.assignee.full_name?.charAt(0)}</div>
                                                    ) : (
                                                        <div className="flex size-5 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400"><SidebarIcon name="user" className="size-3" /></div>
                                                    )}
                                                    {t.due_date && (
                                                        <span className={`text-[10px] ${new Date(t.due_date) < new Date() && !t.completed_at ? 'text-rose-500 font-bold' : 'text-zinc-400'}`}>
                                                            {new Date(t.due_date).toLocaleDateString(isAr ? "ar" : "en", { month: "short", day: "numeric" })}
                                                        </span>
                                                    )}
                                                </div>

                                                {canManageTask(t) && (
                                                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={(e) => { e.stopPropagation(); openEdit(t); }} className="flex size-6 cursor-pointer items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"><SidebarIcon name="edit" className="size-3" /></button>
                                                        {perms.can_delete && <button onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }} className="flex size-6 cursor-pointer items-center justify-center rounded hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 text-zinc-400"><SidebarIcon name="trash" className="size-3" /></button>}
                                                        {/* Quick move dropdown */}
                                                        <select onClick={(e) => e.stopPropagation()} onChange={(e) => { if (e.target.value) handleStatusChange(t.id, e.target.value); e.target.value = ""; }} value="" className="w-5 h-6 opacity-0 group-hover:opacity-100 cursor-pointer text-[10px] bg-transparent border-0 outline-none">
                                                            <option value="">→</option>
                                                            {statuses.filter((s: any) => s.id !== col.id).map((s: any) => (
                                                                <option key={s.id} value={s.id}>{isAr ? s.name_ar : s.name_en}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div onClick={close} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" />
                    <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-950 shadow-2xl flex flex-col rounded-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between border-b border-zinc-100 p-6 dark:border-zinc-800">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{editing ? (isAr ? "تعديل المهمة" : "Edit Task") : (isAr ? "مهمة جديدة" : "New Task")}</h2>
                            <button onClick={close} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><SidebarIcon name="x" className="size-5" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="task-form" onSubmit={handleSave} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "عنوان المهمة (EN)" : "Task Title (EN)"}</label>
                                        <input required dir="ltr" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "عنوان المهمة (AR)" : "Task Title (AR)"}</label>
                                        <input required dir="rtl" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                    </div>
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
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "المشروع" : "Project"}</label>
                                        <select required value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none dark:border-zinc-800 dark:text-white">
                                            <option value="">{isAr ? "-- اختر --" : "-- Select --"}</option>
                                            {projects.map((p: any) => <option key={p.id} value={p.id}>{isAr ? p.title_ar : p.title_en}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "الحالة" : "Status"}</label>
                                        <select value={statusId} onChange={(e) => setStatusId(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none dark:border-zinc-800 dark:text-white">
                                            {statuses.map((s: any) => <option key={s.id} value={s.id}>{isAr ? s.name_ar : s.name_en}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "الأولوية" : "Priority"}</label>
                                        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none dark:border-zinc-800 dark:text-white">
                                            <option value="low">{isAr ? "منخفضة" : "Low"}</option>
                                            <option value="medium">{isAr ? "متوسطة" : "Medium"}</option>
                                            <option value="high">{isAr ? "عالية" : "High"}</option>
                                            <option value="critical">{isAr ? "حرجة" : "Critical"}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "المُسند إليه" : "Assignee"}</label>
                                        <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none dark:border-zinc-800 dark:text-white">
                                            <option value="">{isAr ? "-- لم يُسند --" : "-- Unassigned --"}</option>
                                            {accounts.map((a: any) => <option key={a.id} value={a.id}>{a.full_name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "تاريخ التسليم" : "Due Date"}</label>
                                        <input dir="ltr" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none dark:border-zinc-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "ساعات مقدّرة" : "Est. Hours"}</label>
                                        <input dir="ltr" type="number" step="0.5" min="0" value={estimatedHours} onChange={(e) => setEstimatedHours(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 outline-none dark:border-zinc-800 dark:text-white" />
                                    </div>
                                </div>
                                {/* Labels */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "التصنيفات" : "Labels"}</label>
                                    <div className="flex flex-wrap gap-2">
                                        {labels.map((l: any) => (
                                            <button key={l.id} type="button" onClick={() => toggleLabel(l.id)}
                                                className={`cursor-pointer rounded-full px-3 py-1 text-xs font-bold transition-all ${selectedLabels.includes(l.id) ? 'ring-2 ring-offset-1' : 'opacity-60 hover:opacity-100'}`}
                                                style={{ backgroundColor: l.color + '20', color: l.color, outlineColor: selectedLabels.includes(l.id) ? l.color : undefined }}>
                                                {isAr ? l.name_ar : l.name_en}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="border-t border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50 flex justify-end gap-3">
                            <button onClick={close} type="button" className="rounded-xl border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">{isAr ? "إلغاء" : "Cancel"}</button>
                            <button type="submit" form="task-form" disabled={isPending} className="flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-2 text-sm font-bold text-white shadow-lg hover:brightness-110 disabled:opacity-50">
                                {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                                {editing ? (isAr ? "حفظ" : "Save") : (isAr ? "إنشاء مهمة" : "Create Task")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {openedTaskId && (
                <TaskDetailDrawer
                    locale={locale}
                    taskId={openedTaskId}
                    onClose={() => setOpenedTaskId(null)}
                    onUpdated={() => {}}
                    currentAccountId={currentAccountId}
                    isAdmin={isAdmin}
                    statuses={statuses}
                    accounts={accounts}
                />
            )}
        </div>
    );
}
