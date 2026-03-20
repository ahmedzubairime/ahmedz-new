"use client";

import { useState, useTransition } from "react";
import { updateAccountStatus, updateAccountRoles } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

type Account = {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    status: string;
    created_at: string;
    roles: string[];
};

type Role = {
    id: string;
    name_en: string;
    name_ar: string;
};

type Props = {
    accounts: Account[];
    roles: Role[];
    locale: string;
};

const STATUS_CONFIG: Record<string, { label: { ar: string; en: string }; color: string }> = {
    active: { label: { ar: "نشط", en: "Active" }, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
    suspended: { label: { ar: "موقوف", en: "Suspended" }, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    pending_setup: { label: { ar: "بانتظار الإعداد", en: "Pending" }, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
};

export function AccountsTable({ accounts, roles, locale }: Props) {
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editRoles, setEditRoles] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const filtered = accounts.filter(
        (a) =>
            a.full_name.toLowerCase().includes(search.toLowerCase()) ||
            a.email.toLowerCase().includes(search.toLowerCase())
    );

    function handleStatusChange(accountId: string, newStatus: string) {
        startTransition(async () => {
            await updateAccountStatus(accountId, newStatus);
            router.refresh();
        });
    }

    function startEditRoles(account: Account) {
        setEditingId(account.id);
        setEditRoles([...account.roles]);
    }

    function saveRoles(accountId: string) {
        startTransition(async () => {
            await updateAccountRoles(accountId, editRoles);
            setEditingId(null);
            router.refresh();
        });
    }

    function toggleRole(roleId: string) {
        setEditRoles((prev) =>
            prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId]
        );
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={locale === "ar" ? "بحث بالاسم أو الإيميل..." : "Search by name or email..."}
                className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                                <th className="px-4 py-3 text-start font-semibold text-zinc-600 dark:text-zinc-400">
                                    {locale === "ar" ? "المستخدم" : "User"}
                                </th>
                                <th className="px-4 py-3 text-start font-semibold text-zinc-600 dark:text-zinc-400">
                                    {locale === "ar" ? "الحالة" : "Status"}
                                </th>
                                <th className="px-4 py-3 text-start font-semibold text-zinc-600 dark:text-zinc-400">
                                    {locale === "ar" ? "الأدوار" : "Roles"}
                                </th>
                                <th className="px-4 py-3 text-start font-semibold text-zinc-600 dark:text-zinc-400">
                                    {locale === "ar" ? "تاريخ الإنشاء" : "Created"}
                                </th>
                                <th className="px-4 py-3 text-end font-semibold text-zinc-600 dark:text-zinc-400">
                                    {locale === "ar" ? "إجراءات" : "Actions"}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {filtered.map((account) => {
                                const status = STATUS_CONFIG[account.status] || STATUS_CONFIG.active;
                                const isEditing = editingId === account.id;

                                return (
                                    <tr key={account.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                        {/* User */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)] text-xs font-bold text-white">
                                                    {account.full_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{account.full_name}</p>
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{account.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <select
                                                value={account.status}
                                                onChange={(e) => handleStatusChange(account.id, e.target.value)}
                                                disabled={isPending}
                                                className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold ${status.color} border-0 outline-none`}
                                            >
                                                <option value="active">{locale === "ar" ? "نشط" : "Active"}</option>
                                                <option value="suspended">{locale === "ar" ? "موقوف" : "Suspended"}</option>
                                                <option value="pending_setup">{locale === "ar" ? "بانتظار الإعداد" : "Pending"}</option>
                                            </select>
                                        </td>

                                        {/* Roles */}
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {roles.map((role) => (
                                                        <button
                                                            key={role.id}
                                                            onClick={() => toggleRole(role.id)}
                                                            className={`cursor-pointer rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${editRoles.includes(role.id)
                                                                    ? "bg-[var(--brand-primary)] text-white"
                                                                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                                                                }`}
                                                        >
                                                            {locale === "ar" ? role.name_ar : role.name_en}
                                                        </button>
                                                    ))}
                                                    <button
                                                        onClick={() => saveRoles(account.id)}
                                                        disabled={isPending}
                                                        className="cursor-pointer rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-medium text-white hover:bg-emerald-700"
                                                    >
                                                        {locale === "ar" ? "حفظ" : "Save"}
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="cursor-pointer rounded-full bg-zinc-200 px-3 py-0.5 text-xs text-zinc-600 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300"
                                                    >
                                                        {locale === "ar" ? "إلغاء" : "Cancel"}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-1">
                                                    {account.roles.map((role) => (
                                                        <span
                                                            key={role}
                                                            className="rounded-full bg-[var(--brand-primary-100)] px-2.5 py-0.5 text-xs font-medium text-[var(--brand-primary-900)] dark:bg-[var(--brand-primary)]/20 dark:text-[var(--brand-primary-light)]"
                                                        >
                                                            {role}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>

                                        {/* Created */}
                                        <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                                            {new Date(account.created_at).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3 text-end">
                                            {!isEditing && (
                                                <button
                                                    onClick={() => startEditRoles(account)}
                                                    className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--brand-primary)] transition-colors hover:bg-[var(--brand-primary-50)] dark:hover:bg-[var(--brand-primary)]/10"
                                                >
                                                    {locale === "ar" ? "تعديل الأدوار" : "Edit Roles"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="py-12 text-center text-sm text-zinc-400">
                        {locale === "ar" ? "لا توجد نتائج" : "No results found"}
                    </div>
                )}
            </div>
        </div>
    );
}
