"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createMediaFolder, deleteMediaFolder } from "@/app/actions/media";
import { SidebarIcon } from "@/components/SidebarIcon";

type Folder = {
    id: string;
    parent_id: string | null;
    name: string;
    created_at: string;
};

type Props = {
    folders: Folder[];
    locale: string;
};

export function FoldersTree({ folders, locale }: Props) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [newFolderParent, setNewFolderParent] = useState<string | null>(null);
    const [newFolderName, setNewFolderName] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const rootFolders = folders.filter((f) => !f.parent_id);

    function getChildren(parentId: string): Folder[] {
        return folders.filter((f) => f.parent_id === parentId);
    }

    function toggleExpand(id: string) {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    function handleCreate() {
        if (!newFolderName.trim()) return;
        startTransition(async () => {
            await createMediaFolder(newFolderName.trim(), newFolderParent);
            setNewFolderName("");
            setShowCreate(false);
            setNewFolderParent(null);
            router.refresh();
        });
    }

    function handleDelete(id: string) {
        const hasChildren = folders.some((f) => f.parent_id === id);
        const msg = hasChildren
            ? (locale === "ar" ? "هذا المجلد يحتوي على مجلدات فرعية. هل تريد الحذف؟" : "This folder has sub-folders. Delete anyway?")
            : (locale === "ar" ? "هل تريد حذف هذا المجلد؟" : "Delete this folder?");
        if (!confirm(msg)) return;
        startTransition(async () => {
            await deleteMediaFolder(id);
            router.refresh();
        });
    }

    function renderFolder(folder: Folder, depth: number = 0) {
        const children = getChildren(folder.id);
        const isExpanded = expanded[folder.id] ?? false;

        return (
            <div key={folder.id}>
                <div
                    className={`group flex items-center gap-2 rounded-lg py-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30 ${depth > 0 ? "ms-6" : ""}`}
                    style={{ paddingInlineStart: `${depth * 8 + 12}px` }}
                >
                    {/* Expand toggle */}
                    {children.length > 0 ? (
                        <button
                            onClick={() => toggleExpand(folder.id)}
                            className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded text-zinc-400 hover:text-zinc-600"
                        >
                            <SidebarIcon
                                name="chevron-down"
                                className={`size-3.5 transition-transform ${isExpanded ? "" : "ltr:-rotate-90 rtl:rotate-90"}`}
                            />
                        </button>
                    ) : (
                        <div className="size-6 shrink-0" />
                    )}

                    {/* Folder icon */}
                    <SidebarIcon
                        name={isExpanded ? "folder" : "folder"}
                        className="size-5 shrink-0 text-amber-500"
                    />

                    {/* Name */}
                    <span className="flex-1 truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {folder.name}
                    </span>

                    {/* Child count */}
                    {children.length > 0 && (
                        <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-400 dark:bg-zinc-800">
                            {children.length}
                        </span>
                    )}

                    {/* Actions */}
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                            onClick={() => { setNewFolderParent(folder.id); setShowCreate(true); }}
                            className="flex size-6 cursor-pointer items-center justify-center rounded text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700"
                            title={locale === "ar" ? "مجلد فرعي" : "Add sub-folder"}
                        >
                            <SidebarIcon name="folder" className="size-3" />
                        </button>
                        <button
                            onClick={() => handleDelete(folder.id)}
                            disabled={isPending}
                            className="flex size-6 cursor-pointer items-center justify-center rounded text-zinc-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/20"
                            title={locale === "ar" ? "حذف" : "Delete"}
                        >
                            <SidebarIcon name="x" className="size-3" />
                        </button>
                    </div>
                </div>

                {/* Children */}
                {isExpanded && children.map((child) => renderFolder(child, depth + 1))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Create folder bar */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => { setNewFolderParent(null); setShowCreate(true); }}
                    className="cursor-pointer rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-primary-light)]"
                >
                    {locale === "ar" ? "مجلد جديد" : "New Folder"}
                </button>
            </div>

            {/* Create form */}
            {showCreate && (
                <div className="flex items-center gap-2 rounded-lg border border-[var(--brand-primary)]/30 bg-[var(--brand-primary-50)] p-3 dark:bg-[var(--brand-primary)]/5">
                    <SidebarIcon name="folder" className="size-5 text-amber-500" />
                    <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        placeholder={locale === "ar" ? "اسم المجلد..." : "Folder name..."}
                        className="flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
                        autoFocus
                    />
                    {newFolderParent && (
                        <span className="rounded bg-zinc-200 px-2 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                            {locale === "ar" ? "داخل" : "in"}: {folders.find(f => f.id === newFolderParent)?.name}
                        </span>
                    )}
                    <button
                        onClick={handleCreate}
                        disabled={isPending || !newFolderName.trim()}
                        className="cursor-pointer rounded-lg bg-[var(--brand-primary)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--brand-primary-light)] disabled:opacity-50"
                    >
                        {locale === "ar" ? "إنشاء" : "Create"}
                    </button>
                    <button
                        onClick={() => { setShowCreate(false); setNewFolderName(""); }}
                        className="cursor-pointer rounded-lg px-2 py-1.5 text-xs text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    >
                        {locale === "ar" ? "إلغاء" : "Cancel"}
                    </button>
                </div>
            )}

            {/* Folder tree */}
            <div className="rounded-xl border border-zinc-200 bg-white py-2 dark:border-zinc-800 dark:bg-zinc-900">
                {rootFolders.length > 0 ? (
                    rootFolders.map((folder) => renderFolder(folder))
                ) : (
                    <div className="py-12 text-center text-sm text-zinc-400">
                        {locale === "ar" ? "لا توجد مجلدات بعد" : "No folders yet"}
                    </div>
                )}
            </div>
        </div>
    );
}
