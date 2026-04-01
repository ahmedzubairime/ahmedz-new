"use client";

import { useState, useEffect, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { getTask, saveTask, addComment, addTimeEntry, updateTaskStatus } from "@/app/actions/pms-tasks";

type Props = {
    locale: string;
    taskId: string;
    onClose: () => void;
    onUpdated: () => void;
    currentAccountId: string;
    isAdmin: boolean;
    statuses: any[];
    accounts: any[];
};

export function TaskDetailDrawer({ locale, taskId, onClose, onUpdated, currentAccountId, isAdmin, statuses, accounts }: Props) {
    const isAr = locale === "ar";
    const [task, setTask] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    // Tabs: details, subtasks, comments, time
    const [activeTab, setActiveTab] = useState("details");

    // Subtask form
    const [subtaskTitleEn, setSubtaskTitleEn] = useState("");
    const [subtaskTitleAr, setSubtaskTitleAr] = useState("");

    // Comment form
    const [commentText, setCommentText] = useState("");

    // Time entry form
    const [timeDuration, setTimeDuration] = useState("");
    const [timeDesc, setTimeDesc] = useState("");

    useEffect(() => {
        loadTask();
    }, [taskId]);

    async function loadTask() {
        setLoading(true);
        try {
            const data = await getTask(taskId);
            setTask(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddSubtask(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const defaultStatus = statuses.find(s => s.is_default)?.id || statuses[0]?.id;
            try {
                await saveTask({
                    parent_task_id: taskId,
                    title_en: subtaskTitleEn,
                    title_ar: subtaskTitleAr || subtaskTitleEn,
                    project_id: task.project_id,
                    status_id: defaultStatus,
                    priority: "medium",
                });
                setSubtaskTitleEn("");
                setSubtaskTitleAr("");
                await loadTask();
                onUpdated();
            } catch (err) { console.error(err); }
        });
    }

    async function handleToggleSubtask(subtaskId: string, isCompleted: boolean) {
        startTransition(async () => {
            const targetStatus = isCompleted 
                ? statuses.find((s: any) => s.is_final)?.id 
                : (statuses.find((s: any) => s.is_default)?.id || statuses[0]?.id);
                
            if (targetStatus) {
                await updateTaskStatus(subtaskId, targetStatus);
                await loadTask();
                onUpdated();
            }
        });
    }

    async function handleAddComment(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            try {
                await addComment(taskId, commentText);
                setCommentText("");
                await loadTask();
            } catch (err) { console.error(err); }
        });
    }

    async function handleAddTimeEntry(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            if (!timeDuration) return;
            try {
                await addTimeEntry(taskId, parseInt(timeDuration), timeDesc);
                setTimeDuration("");
                setTimeDesc("");
                await loadTask();
                onUpdated();
            } catch (err) { console.error(err); }
        });
    }

    if (loading || !task) {
        return (
            <div className="fixed inset-y-0 end-0 z-[60] w-full max-w-md bg-white shadow-2xl dark:bg-zinc-950 flex flex-col pt-safe-top">
                <div className="flex flex-col items-center justify-center p-12 h-full text-zinc-400">
                    <SidebarIcon name="loader-2" className="size-8 animate-spin mb-4" />
                </div>
            </div>
        );
    }

    const { status, project, labels, assignee, reporter, subtasks, comments, time_entries, attachments } = task;
    const isCompleted = !!task.completed_at;

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
            <div className={`relative w-full max-w-md h-full bg-white dark:bg-zinc-950 shadow-2xl flex flex-col animate-in duration-300 slide-in-from-[100%] ${isAr ? 'slide-in-from-[-100%]' : ''}`}>
                
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                    <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: (project?.color || '#3b82f6') + '15', color: project?.color || '#3b82f6' }}>
                                {isAr ? project?.title_ar : project?.title_en}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1" style={{ backgroundColor: (status?.color || '#94a3b8') + '15', color: status?.color || '#94a3b8' }}>
                                <SidebarIcon name={status?.icon as any || "circle"} className="size-3" />
                                {isAr ? status?.name_ar : status?.name_en}
                            </span>
                        </div>
                        <h2 className={`text-xl font-bold ${isCompleted ? 'text-zinc-400 line-through' : 'text-zinc-900 dark:text-zinc-50'}`}>
                            {isAr ? task.title_ar : task.title_en}
                        </h2>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 shrink-0"><SidebarIcon name="x" className="size-5" /></button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 border-b border-zinc-100 px-4 py-2 overflow-x-auto dark:border-zinc-800 shrink-0 hide-scrollbar">
                    {[
                        { id: "details", label: isAr ? "تفاصيل" : "Details", icon: "info" },
                        { id: "subtasks", label: isAr ? "مهام فرعية" : "Subtasks", icon: "check-square", count: subtasks?.length },
                        { id: "comments", label: isAr ? "تعليقات" : "Comments", icon: "message-square", count: comments?.length },
                        { id: "time", label: isAr ? "تتبع الوقت" : "Time", icon: "clock", count: time_entries?.length },
                        { id: "attachments", label: isAr ? "مرفقات" : "Attachments", icon: "paperclip", count: attachments?.length },
                    ].map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === t.id ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                            <SidebarIcon name={t.icon as any} className="size-4" />
                            {t.label}
                            {t.count !== undefined && t.count > 0 && <span className="text-[10px] bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded-full">{t.count}</span>}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-zinc-900/20">
                    
                    {/* DETAILS TAB */}
                    {activeTab === "details" && (
                        <div className="space-y-6">
                            {/* Description */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{isAr ? "الوصف" : "Description"}</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                                    {(isAr ? task.description_ar : task.description_en) || (isAr ? "لا يوجد وصف." : "No description provided.")}
                                </p>
                            </div>

                            {/* Meta Grid */}
                            <div className="grid grid-cols-2 gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                                <div>
                                    <span className="text-xs text-zinc-400 block mb-1">{isAr ? "المُسند إليه" : "Assignee"}</span>
                                    <div className="flex items-center gap-2">
                                        {assignee?.avatar_url ? (
                                            <img src={assignee.avatar_url} className="size-6 rounded-full" alt="" />
                                        ) : (
                                            <div className="flex size-6 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] font-bold">{assignee?.full_name?.charAt(0) || '?'}</div>
                                        )}
                                        <span className="text-sm font-medium">{assignee?.full_name || (isAr ? "غير محدد" : "Unassigned")}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs text-zinc-400 block mb-1">{isAr ? "المُنشئ" : "Reporter"}</span>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <span>{reporter?.full_name || (isAr ? "مجهول" : "Unknown")}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs text-zinc-400 block mb-1">{isAr ? "تاريخ التسليم" : "Due Date"}</span>
                                    <span className={`text-sm font-medium ${task.due_date && new Date(task.due_date) < new Date() && !isCompleted ? 'text-rose-500' : ''}`}>
                                        {task.due_date ? new Date(task.due_date).toLocaleDateString(isAr ? 'ar' : 'en', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-zinc-400 block mb-1">{isAr ? "ساعات العمل" : "Hours Logged"}</span>
                                    <span className="text-sm font-medium">
                                        {task.logged_hours || 0} / {task.estimated_hours || '-'} {isAr ? "س" : "h"}
                                    </span>
                                </div>
                            </div>

                            {/* Labels */}
                            {labels?.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{isAr ? "التصنيفات" : "Labels"}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {labels.map((l: any) => l.label && (
                                            <span key={l.label.id} className="text-xs font-bold px-2 py-1 rounded-md" style={{ backgroundColor: l.label.color + '20', color: l.label.color }}>
                                                {isAr ? l.label.name_ar : l.label.name_en}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SUBTASKS TAB */}
                    {activeTab === "subtasks" && (
                        <div className="space-y-4">
                            {/* Subtasks List */}
                            <div className="space-y-2">
                                {subtasks?.length === 0 ? (
                                    <div className="text-center py-6 text-sm text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                                        {isAr ? "لا توجد مهام فرعية." : "No subtasks yet."}
                                    </div>
                                ) : (
                                    subtasks?.map((st: any) => {
                                        const stCompleted = !!st.completed_at;
                                        return (
                                            <div key={st.id} className="flex flex-col gap-2 p-3 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => handleToggleSubtask(st.id, !stCompleted)} className={`flex size-5 shrink-0 items-center justify-center rounded border transition-colors ${stCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-300 hover:border-emerald-500 focus:border-emerald-500 dark:border-zinc-600'}`}>
                                                        {stCompleted && <SidebarIcon name="check" className="size-3.5" />}
                                                    </button>
                                                    <span className={`text-sm font-medium flex-1 ${stCompleted ? 'text-zinc-400 line-through' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                                        {isAr ? st.title_ar : st.title_en}
                                                    </span>
                                                </div>
                                                {st.assignee && (
                                                   <div className="flex items-center gap-1.5 ml-8 text-xs text-zinc-400">
                                                       <SidebarIcon name="user" className="size-3" />
                                                       <span>{st.assignee.full_name}</span>
                                                   </div> 
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Add Subtask Form */}
                            <form onSubmit={handleAddSubtask} className="flex flex-col gap-2 p-3 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                                <input required value={subtaskTitleEn} onChange={e => setSubtaskTitleEn(e.target.value)} placeholder={isAr ? "عنوان المهمة الفرعية (EN)..." : "Subtask title (EN)..."} className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400 dark:text-white" dir="ltr" />
                                {isAr && (
                                    <input value={subtaskTitleAr} onChange={e => setSubtaskTitleAr(e.target.value)} placeholder={"عنوان المهمة الفرعية (AR)..."} className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400 dark:text-white border-t border-zinc-100 dark:border-zinc-800 pt-2" dir="rtl" />
                                )}
                                <div className="flex justify-end pt-2">
                                    <button type="submit" disabled={isPending || !subtaskTitleEn} className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50 flex items-center gap-1.5">
                                        {isPending ? <SidebarIcon name="loader-2" className="size-3 animate-spin"/> : <SidebarIcon name="plus" className="size-3"/>}
                                        {isAr ? "إضافة" : "Add"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* COMMENTS TAB */}
                    {activeTab === "comments" && (
                        <div className="space-y-4 flex flex-col h-full">
                            <div className="flex-1 space-y-4">
                                {comments?.length === 0 ? (
                                    <div className="text-center py-6 text-sm text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                                        {isAr ? "لا توجد تعليقات حتى الآن." : "No comments yet."}
                                    </div>
                                ) : (
                                    comments?.map((c: any) => (
                                        <div key={c.id} className="flex gap-3">
                                            {c.author?.avatar_url ? (
                                                <img src={c.author.avatar_url} className="size-8 rounded-full shrink-0" alt="" />
                                            ) : (
                                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-xs font-bold">{c.author?.full_name?.charAt(0) || '?'}</div>
                                            )}
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{c.author?.full_name}</span>
                                                    <span className="text-[10px] text-zinc-400">
                                                        {new Date(c.created_at).toLocaleDateString(isAr ? 'ar' : 'en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="p-3 rounded-2xl rounded-tl-none bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-700 dark:text-zinc-300">
                                                    {c.content_text}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            
                            {/* Add Comment Form */}
                            <form onSubmit={handleAddComment} className="flex items-end gap-2 shrink-0">
                                <textarea required rows={1} value={commentText} onChange={e => setCommentText(e.target.value)} placeholder={isAr ? "اكتب تعليقاً..." : "Write a comment..."} className="flex-1 resize-none bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm outline-none focus:border-[var(--brand-primary)]" />
                                <button type="submit" disabled={isPending || !commentText.trim()} className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white disabled:opacity-50">
                                    {isPending ? <SidebarIcon name="loader-2" className="size-5 animate-spin"/> : <SidebarIcon name="send" className="size-5"/>}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* TIME TAB */}
                    {activeTab === "time" && (
                        <div className="space-y-6">
                            {/* Summary Card */}
                            <div className="flex items-center justify-between rounded-xl bg-[var(--brand-primary)]/10 p-4 border border-[var(--brand-primary)]/20">
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--brand-primary)]">{isAr ? "إجمالي الساعات" : "Total Logged Time"}</h4>
                                    <p className="text-xs text-[var(--brand-primary)]/80 mt-1">{isAr ? "مقارنة بالوقت المقدر" : "Compared to estimated time"}</p>
                                </div>
                                <div className="text-2xl font-black text-[var(--brand-primary)]">
                                    {task.logged_hours || 0} <span className="text-base">/ {task.estimated_hours || '-'} h</span>
                                </div>
                            </div>

                            {/* Add Time Form */}
                            <form onSubmit={handleAddTimeEntry} className="space-y-3 p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{isAr ? "تسجيل وقت" : "Log Time"}</h4>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <input required type="number" min="1" value={timeDuration} onChange={e => setTimeDuration(e.target.value)} placeholder={isAr ? "المدة (بالدقائق)" : "Duration (minutes)"} className="w-full bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--brand-primary)]" />
                                    </div>
                                    <div className="flex-[2]">
                                        <input value={timeDesc} onChange={e => setTimeDesc(e.target.value)} placeholder={isAr ? "الوصف (اختياري)" : "Description (optional)"} className="w-full bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--brand-primary)]" />
                                    </div>
                                    <button type="submit" disabled={isPending || !timeDuration} className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-4 rounded-lg text-sm font-bold disabled:opacity-50 flex items-center justify-center shrink-0">
                                        {isPending ? <SidebarIcon name="loader-2" className="size-4 animate-spin"/> : <SidebarIcon name="plus" className="size-4"/>}
                                    </button>
                                </div>
                            </form>

                            {/* Entries List */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{isAr ? "سجل الوقت" : "Time Log"}</h4>
                                {time_entries?.length === 0 ? (
                                    <div className="text-center py-6 text-sm text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                                        {isAr ? "لا توجد سجلات." : "No time entries yet."}
                                    </div>
                                ) : (
                                    time_entries?.map((te: any) => (
                                        <div key={te.id} className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-zinc-800">
                                                    <SidebarIcon name="clock" className="size-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                        {te.duration_minutes >= 60 ? `${Math.floor(te.duration_minutes/60)}h ${te.duration_minutes%60}m` : `${te.duration_minutes}m`}
                                                    </p>
                                                    <p className="text-[10px] text-zinc-500">{te.account?.full_name} • {new Date(te.created_at).toLocaleDateString(isAr?'ar':'en')} {te.description && `• ${te.description}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* ATTACHMENTS TAB */}
                    {activeTab === "attachments" && (
                        <div className="space-y-4">
                            {attachments?.length === 0 ? (
                                <div className="text-center py-6 text-sm text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                                    {isAr ? "لا توجد مرفقات." : "No attachments yet."}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    {attachments?.map((att: any) => (
                                        <a href={att.media_url || '#'} target="_blank" rel="noopener noreferrer" key={att.id} className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 aspect-square flex flex-col items-center justify-center p-2 text-center transition-colors">
                                            {att.media_url?.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                                                <img src={att.media_url} alt={att.file_name} className="absolute inset-0 w-full h-full object-cover" />
                                            ) : (
                                                <SidebarIcon name="file" className="size-8 text-zinc-300 dark:text-zinc-600 mb-2 relative z-10" />
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-left">
                                                <p className="text-[10px] font-bold text-white truncate drop-shadow-sm">{att.file_name}</p>
                                                <p className="text-[9px] text-zinc-300 truncate">{att.uploader?.full_name}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                            <div className="flex justify-center pt-4">
                                <button type="button" onClick={() => alert(isAr ? "جاري تطوير النظام المركزي للملفات" : "Media gallery integration coming soon")} className="text-sm font-bold text-[var(--brand-primary)] hover:underline">
                                    {isAr ? "+ رفع مرفق جديد" : "+ Upload new file"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
