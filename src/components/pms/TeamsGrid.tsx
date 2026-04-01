"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveTeam, deleteTeam, addTeamMember, removeTeamMember, updateTeamMemberRole } from "@/app/actions/pms-teams";
import type { CrudPermissions } from "@/lib/permissions";

type Props = {
    locale: string;
    teams: any[];
    accounts: any[]; // for assignments
    perms: CrudPermissions;
    currentAccountId: string;
};

export function TeamsGrid({ locale, teams, accounts, perms, currentAccountId }: Props) {
    const isAr = locale === "ar";
    const [search, setSearch] = useState("");
    const [isPending, startTransition] = useTransition();

    // Modal state
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<any>(null);
    const [nameEn, setNameEn] = useState("");
    const [nameAr, setNameAr] = useState("");
    const [descEn, setDescEn] = useState("");
    const [descAr, setDescAr] = useState("");
    const [color, setColor] = useState("#3b82f6");

    // Detail Drawer state
    const [openedTeam, setOpenedTeam] = useState<any>(null);

    const filtered = teams.filter(t => {
        const q = search.toLowerCase();
        return !q || t.name_en?.toLowerCase().includes(q) || t.name_ar?.toLowerCase().includes(q);
    });

    function openNew() {
        setEditingTeam(null);
        setNameEn(""); setNameAr("");
        setDescEn(""); setDescAr("");
        setColor("#3b82f6");
        setModalOpen(true);
    }

    function openEdit(t: any, e: React.MouseEvent) {
        e.stopPropagation();
        setEditingTeam(t);
        setNameEn(t.name_en || ""); setNameAr(t.name_ar || "");
        setDescEn(t.description_en || ""); setDescAr(t.description_ar || "");
        setColor(t.color || "#3b82f6");
        setModalOpen(true);
    }

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const payload = { name_en: nameEn, name_ar: nameAr, description_en: descEn, description_ar: descAr, color };
            try {
                await saveTeam(payload, editingTeam?.id);
                setModalOpen(false);
            } catch (err) { console.error(err); }
        });
    }

    function handleDelete(id: string, e: React.MouseEvent) {
        e.stopPropagation();
        if (confirm(isAr ? "هل أنت متأكد من حذف هذا الفريق؟" : "Are you sure you want to delete this team?")) {
            startTransition(async () => { await deleteTeam(id); });
        }
    }

    // Inside Drawer Form
    function handleAddMember(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const accountId = data.get("accountId") as string;
        const role = data.get("role") as string;
        if (!accountId || !role || !openedTeam) return;

        startTransition(async () => {
            await addTeamMember(openedTeam.id, accountId, role);
            // Refresh logic handled via revalidatePath
            e.currentTarget?.reset();
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{isAr ? "إدارة الفِرَق" : "Teams Management"}</h1>
                    <p className="mt-1 text-sm text-zinc-500">{isAr ? "قم بتقسيم الأعضاء إلى فرق وتخصيصهم للمشاريع" : "Group members into teams and assign them to projects"}</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        <SidebarIcon name="briefcase" className="size-5" />
                        <span>{teams.length} {isAr ? "فريق" : "teams"}</span>
                    </div>
                    {perms.can_create && (
                        <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 py-2 text-sm font-bold text-white shadow hover:brightness-110">
                            <SidebarIcon name="plus" className="size-4" />
                            {isAr ? "فريق جديد" : "New Team"}
                        </button>
                    )}
                </div>
            </div>

            {/* Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map(t => (
                    <div key={t.id} onClick={() => setOpenedTeam(t)} className="group cursor-pointer relative rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl font-bold text-white" style={{ backgroundColor: t.color || '#3b82f6' }}>
                                    {(isAr ? t.name_ar : t.name_en)?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{isAr ? t.name_ar : t.name_en}</h3>
                                    <p className="text-xs text-zinc-500 line-clamp-1">{isAr ? t.description_ar : t.description_en}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="text-center p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                                <span className="block text-lg font-black text-zinc-900 dark:text-zinc-100">{t.members?.length || 0}</span>
                                <span className="text-[10px] uppercase font-bold text-zinc-400">{isAr ? "عضو" : "Members"}</span>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                                <span className="block text-lg font-black text-zinc-900 dark:text-zinc-100">{t.projects?.length || 0}</span>
                                <span className="text-[10px] uppercase font-bold text-zinc-400">{isAr ? "مشروع" : "Projects"}</span>
                            </div>
                        </div>

                        {perms.can_update && (
                            <div className="absolute top-4 end-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                <button onClick={(e) => openEdit(t, e)} className="flex size-7 items-center justify-center rounded-lg bg-white shadow hover:text-[var(--brand-primary)] dark:bg-zinc-800"><SidebarIcon name="edit" className="size-3.5" /></button>
                                {perms.can_delete && <button onClick={(e) => handleDelete(t.id, e)} className="flex size-7 items-center justify-center rounded-lg bg-white shadow hover:text-rose-500 dark:bg-zinc-800"><SidebarIcon name="trash" className="size-3.5" /></button>}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* CREATE/EDIT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
                    <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-950 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{editingTeam ? (isAr ? "تعديل فريق" : "Edit Team") : (isAr ? "إنشاء فريق" : "Create Team")}</h2>
                            <button onClick={() => setModalOpen(false)} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"><SidebarIcon name="x" className="size-5" /></button>
                        </div>
                        <form id="team-form" onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">English Name</label>
                                    <input required dir="ltr" value={nameEn} onChange={e => setNameEn(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">الاسم العربي</label>
                                    <input required dir="rtl" value={nameAr} onChange={e => setNameAr(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" />
                                </div>
                                <div className="col-span-2 flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{isAr ? "اللون" : "Color"}</label>
                                        <div className="mt-2 flex gap-2">
                                            {['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'].map(c => (
                                                <button key={c} type="button" onClick={() => setColor(c)} className={`size-8 rounded-full border-2 transition-all ${color === c ? 'border-zinc-900 dark:border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`} style={{ backgroundColor: c }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">English Description</label>
                                    <textarea dir="ltr" value={descEn} onChange={e => setDescEn(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" rows={2}/>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">الوصف العربي</label>
                                    <textarea dir="rtl" value={descAr} onChange={e => setDescAr(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2 outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:text-white" rows={2}/>
                                </div>
                            </div>
                        </form>
                        <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-4 flex justify-end gap-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                            <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl px-4 py-2 font-bold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">{isAr ? "إلغاء" : "Cancel"}</button>
                            <button type="submit" form="team-form" disabled={isPending} className="flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-2 font-bold text-white shadow hover:brightness-110 disabled:opacity-50">
                                {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin"/>} {isAr ? "حفظ" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TEAM DETAIL & MEMBERS DRAWER */}
            {openedTeam && (
                <div className="fixed inset-0 z-[60] flex justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setOpenedTeam(null)} />
                    <div className={`relative w-full max-w-md h-full bg-white dark:bg-zinc-950 shadow-2xl flex flex-col animate-in slide-in-from-[100%] duration-300 ${isAr ? "slide-in-from-[-100%]" : ""}`}>
                        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <span className="inline-block size-4 rounded-full" style={{ backgroundColor: openedTeam.color }} />
                                    {isAr ? openedTeam.name_ar : openedTeam.name_en}
                                </h2>
                                <p className="text-sm text-zinc-500 mt-1">{isAr ? openedTeam.description_ar : openedTeam.description_en}</p>
                            </div>
                            <button onClick={() => setOpenedTeam(null)} className="p-2 hover:bg-zinc-100 rounded-full dark:hover:bg-zinc-800 -mr-2"><SidebarIcon name="x" className="size-5"/></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {perms.can_update && (
                                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                                    <h3 className="font-bold text-sm mb-3">{isAr ? "إضافة عضو للفريق" : "Add Member to Team"}</h3>
                                    <form onSubmit={handleAddMember} className="flex gap-2">
                                        <select name="accountId" required className="flex-[2] rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900">
                                            <option value="">{isAr ? "اختر مستخدماً..." : "Select user..."}</option>
                                            {accounts.filter(a => !(openedTeam.members||[]).find((m:any) => m.account_id===a.id)).map((a: any) => (
                                                <option key={a.id} value={a.id}>{a.full_name}</option>
                                            ))}
                                        </select>
                                        <select name="role" required className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900">
                                            <option value="member">Member</option>
                                            <option value="manager">Manager</option>
                                            <option value="owner">Owner</option>
                                        </select>
                                        <button type="submit" disabled={isPending} className="rounded-lg bg-[var(--brand-primary)] px-3 text-white shrink-0">
                                            {isPending ? <SidebarIcon name="loader-2" className="size-4 animate-spin"/> : <SidebarIcon name="plus" className="size-4"/>}
                                        </button>
                                    </form>
                                </div>
                            )}

                            <div>
                                <h3 className="font-bold mb-3">{isAr ? "أعضاء الفريق" : "Team Members"} ({openedTeam.members?.length || 0})</h3>
                                <div className="space-y-2">
                                    {(openedTeam.members || []).map((m: any) => {
                                        const profile = accounts.find(a => a.id === m.account_id);
                                        if(!profile) return null;
                                        return (
                                            <div key={m.account_id} className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                                                <div className="flex items-center gap-3">
                                                    {profile.avatar_url ? (
                                                        <img src={profile.avatar_url} className="size-8 rounded-full object-cover" alt=""/>
                                                    ) : (
                                                        <div className="flex size-8 items-center justify-center rounded-full bg-zinc-100 font-bold dark:bg-zinc-800">{profile.full_name?.charAt(0)}</div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-bold text-zinc-900 dark:text-white">{profile.full_name}</p>
                                                        <p className="text-[10px] text-zinc-500 uppercase">{m.role || 'Member'}</p>
                                                    </div>
                                                </div>
                                                {perms.can_update && (
                                                    <button onClick={() => startTransition(async () => { await removeTeamMember(openedTeam.id, profile.id); setOpenedTeam({...openedTeam, members: openedTeam.members.filter((mem:any)=>mem.account_id!==profile.id)}) })} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg dark:hover:bg-rose-500/10">
                                                        <SidebarIcon name="trash" className="size-4"/>
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
