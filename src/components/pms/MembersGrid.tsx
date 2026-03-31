"use client";

import { useState } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import type { CrudPermissions } from "@/lib/permissions";

type Props = {
    locale: string;
    accounts: any[];
    perms: CrudPermissions;
    currentAccountId: string;
};

const ROLE_BADGE: Record<string, { ar: string; en: string; color: string }> = {
    "super-admin": { ar: "مدير النظام", en: "Super Admin", color: "#ef4444" },
    "admin": { ar: "مدير", en: "Admin", color: "#f59e0b" },
    "branch-manager": { ar: "مدير فرع", en: "Branch Manager", color: "#8b5cf6" },
    "team-leader": { ar: "قائد فريق", en: "Team Leader", color: "#3b82f6" },
    "team-member": { ar: "عضو فريق", en: "Team Member", color: "#22c55e" },
    "content-editor": { ar: "محرر محتوى", en: "Content Editor", color: "#06b6d4" },
    "viewer": { ar: "مشاهد", en: "Viewer", color: "#94a3b8" },
};

export function MembersGrid({ locale, accounts, perms, currentAccountId }: Props) {
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const isAr = locale === "ar";

    const filtered = accounts.filter((a: any) => {
        const q = search.toLowerCase();
        const matchSearch = !q || a.full_name?.toLowerCase().includes(q) || a.phone?.includes(q);
        const roles = (a.roles || []).map((r: any) => r.role_id);
        const matchRole = !filterRole || roles.includes(filterRole);
        return matchSearch && matchRole;
    });

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{isAr ? "أعضاء الفريق" : "Team Members"}</h1>
                    <p className="mt-1 text-sm text-zinc-500">{isAr ? "عرض أعضاء المؤسسة وأدوارهم." : "View organization members and their roles."}</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    <SidebarIcon name="users" className="size-5" />
                    <span>{accounts.length} {isAr ? "عضو" : "members"}</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <SidebarIcon name="search" className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={isAr ? "بحث بالاسم أو الهاتف..." : "Search by name or phone..."} className="w-full rounded-xl border border-zinc-200 bg-white ps-10 pe-4 py-2.5 text-sm outline-none focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white" />
                </div>
                <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
                    <option value="">{isAr ? "كل الأدوار" : "All Roles"}</option>
                    {Object.entries(ROLE_BADGE).map(([k, v]) => (
                        <option key={k} value={k}>{isAr ? v.ar : v.en}</option>
                    ))}
                </select>
            </div>

            {/* Members Grid */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <SidebarIcon name="users" className="size-8 text-zinc-400 mb-3" />
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{isAr ? "لا يوجد أعضاء" : "No members found"}</h3>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((a: any) => {
                        const roles = (a.roles || []).map((r: any) => r.role_id);
                        const isMe = a.id === currentAccountId;
                        return (
                            <div key={a.id} className={`group relative rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-lg dark:bg-zinc-900 ${isMe ? 'border-[var(--brand-primary)]/40 ring-1 ring-[var(--brand-primary)]/20' : 'border-zinc-200 dark:border-zinc-800'}`}>
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    {a.avatar_url ? (
                                        <img src={a.avatar_url} className="size-12 rounded-xl object-cover shrink-0" alt="" />
                                    ) : (
                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-lg font-bold text-zinc-500">{a.full_name?.charAt(0)}</div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{a.full_name}</h3>
                                            {isMe && <span className="text-[9px] font-bold text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 px-1.5 py-0.5 rounded">{isAr ? "أنت" : "You"}</span>}
                                        </div>
                                        {a.phone && (
                                            <p className="text-xs text-zinc-400 mt-0.5 font-mono" dir="ltr">{a.phone}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Roles */}
                                <div className="flex flex-wrap gap-1 mt-3">
                                    {roles.map((roleId: string) => {
                                        const badge = ROLE_BADGE[roleId] || { ar: roleId, en: roleId, color: '#94a3b8' };
                                        return (
                                            <span key={roleId} className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: badge.color + '15', color: badge.color }}>
                                                {isAr ? badge.ar : badge.en}
                                            </span>
                                        );
                                    })}
                                </div>

                                {/* Status indicator */}
                                <div className="absolute top-5 end-5">
                                    <span className={`flex size-2.5 rounded-full ${a.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
