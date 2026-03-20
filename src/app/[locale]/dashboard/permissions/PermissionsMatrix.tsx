"use client";

import { useState, useTransition } from "react";
import { updatePermission } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

type MatrixRow = {
    role_id: string;
    role_name_en: string;
    role_name_ar: string;
    page_id: string;
    page_name_en: string;
    page_name_ar: string;
    group_name_en: string;
    group_name_ar: string;
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
};

type Role = { id: string; name_en: string; name_ar: string };

type Props = {
    matrix: MatrixRow[];
    roles: Role[];
    locale: string;
};

const PERM_COLS = ["can_create", "can_read", "can_update", "can_delete"] as const;
const PERM_LABELS: Record<string, { ar: string; en: string }> = {
    can_create: { ar: "إنشاء", en: "C" },
    can_read: { ar: "قراءة", en: "R" },
    can_update: { ar: "تعديل", en: "U" },
    can_delete: { ar: "حذف", en: "D" },
};

export function PermissionsMatrix({ matrix, roles, locale }: Props) {
    const [selectedRole, setSelectedRole] = useState(roles[0]?.id || "");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // Filter matrix for selected role
    const rolePerms = matrix.filter((r) => r.role_id === selectedRole);

    // Group by page group
    const grouped = rolePerms.reduce((acc, row) => {
        const groupKey = locale === "ar" ? row.group_name_ar : row.group_name_en;
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(row);
        return acc;
    }, {} as Record<string, MatrixRow[]>);

    function handleToggle(row: MatrixRow, col: typeof PERM_COLS[number]) {
        const newVal = !row[col];
        startTransition(async () => {
            await updatePermission(
                row.role_id,
                row.page_id,
                col === "can_create" ? newVal : row.can_create,
                col === "can_read" ? newVal : row.can_read,
                col === "can_update" ? newVal : row.can_update,
                col === "can_delete" ? newVal : row.can_delete
            );
            router.refresh();
        });
    }

    return (
        <div className="space-y-4">
            {/* Role selector tabs */}
            <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                    <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors ${selectedRole === role.id
                                ? "bg-[var(--brand-primary)] text-white shadow-sm"
                                : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                            }`}
                    >
                        {locale === "ar" ? role.name_ar : role.name_en}
                    </button>
                ))}
            </div>

            {/* Permission matrix */}
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                                <th className="px-4 py-3 text-start font-semibold text-zinc-600 dark:text-zinc-400">
                                    {locale === "ar" ? "الصفحة" : "Page"}
                                </th>
                                {PERM_COLS.map((col) => (
                                    <th
                                        key={col}
                                        className="px-3 py-3 text-center font-semibold text-zinc-600 dark:text-zinc-400"
                                        title={col.replace("can_", "")}
                                    >
                                        {locale === "ar" ? PERM_LABELS[col].ar : PERM_LABELS[col].en}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(grouped).map(([groupName, rows]) => (
                                <tbody key={groupName}>
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="bg-zinc-50/50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:bg-zinc-800/30 dark:text-zinc-500"
                                        >
                                            {groupName}
                                        </td>
                                    </tr>
                                    {rows.map((row) => (
                                        <tr
                                            key={row.page_id}
                                            className="border-t border-zinc-50 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/30"
                                        >
                                            <td className="px-4 py-2.5 font-medium text-zinc-800 dark:text-zinc-200">
                                                {locale === "ar" ? row.page_name_ar : row.page_name_en}
                                            </td>
                                            {PERM_COLS.map((col) => (
                                                <td key={col} className="px-3 py-2.5 text-center">
                                                    <button
                                                        onClick={() => handleToggle(row, col)}
                                                        disabled={isPending}
                                                        className={`inline-flex size-7 cursor-pointer items-center justify-center rounded-md transition-all ${row[col]
                                                                ? "bg-[var(--brand-primary)] text-white shadow-sm"
                                                                : "bg-zinc-100 text-zinc-300 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-600 dark:hover:bg-zinc-700"
                                                            } ${isPending ? "opacity-50" : ""}`}
                                                    >
                                                        {row[col] ? "✓" : ""}
                                                    </button>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
