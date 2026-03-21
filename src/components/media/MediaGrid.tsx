"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadMedia, deleteMedia } from "@/app/actions/media";
import { SidebarIcon } from "@/components/SidebarIcon";
import { UploadDialog } from "./UploadDialog";

type MediaFile = {
    id: string;
    folder_id: string | null;
    bucket: string;
    storage_path: string;
    filename: string;
    original_name: string;
    mime_type: string;
    size_bytes: number;
    width: number | null;
    height: number | null;
    alt_ar: string;
    alt_en: string;
    created_at: string;
};

type Folder = {
    id: string;
    parent_id: string | null;
    name: string;
};

type Props = {
    files: MediaFile[];
    folders: Folder[];
    bucket: string;
    locale: string;
    totalCount: number;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function getFileUrl(file: MediaFile): string {
    if (file.bucket === "images") {
        return `${SUPABASE_URL}/storage/v1/object/public/images/${file.storage_path}`;
    }
    return "#";
}

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
}

function getFileIcon(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.includes("pdf")) return "file-text";
    if (mimeType.includes("word") || mimeType.includes("document")) return "file-text";
    if (mimeType.includes("excel") || mimeType.includes("sheet")) return "file-text";
    return "file-text";
}

export function MediaGrid({ files, folders, bucket, locale, totalCount }: Props) {
    const [search, setSearch] = useState("");
    const [selectedFolder, setSelectedFolder] = useState<string | "all">("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<MediaFile | null>(null);
    const [isPending, startTransition] = useTransition();
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const [stagedFiles, setStagedFiles] = useState<File[]>([]);

    const bucketFolders = folders.filter((f) => {
        // Show root-level folders
        return !f.parent_id;
    });

    const filtered = files.filter((f) => {
        const matchesSearch = !search || f.original_name.toLowerCase().includes(search.toLowerCase());
        const matchesFolder = selectedFolder === "all" || f.folder_id === selectedFolder;
        return matchesSearch && matchesFolder;
    });

    function handleUpload(fileList: FileList) {
        setStagedFiles(Array.from(fileList));
        setDragActive(false);
        setIsUploadDialogOpen(true);
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "هل تريد حذف هذا الملف؟" : "Delete this file?")) return;
        startTransition(async () => {
            await deleteMedia(id);
            router.refresh();
        });
    }

    function copyUrl(file: MediaFile) {
        const url = getFileUrl(file);
        navigator.clipboard.writeText(url);
    }

    const acceptMap: Record<string, string> = {
        images: "image/*",
        videos: "video/*",
        documents: ".pdf,.doc,.docx,.xls,.xlsx,.txt",
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={locale === "ar" ? "بحث..." : "Search..."}
                    className="w-full max-w-xs rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />

                {/* Folder filter */}
                <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                >
                    <option value="all">{locale === "ar" ? "كل المجلدات" : "All folders"}</option>
                    {bucketFolders.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                </select>

                {/* View mode */}
                <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`cursor-pointer px-3 py-2 text-sm ${viewMode === "grid" ? "bg-[var(--brand-primary)] text-white" : "text-zinc-400 hover:text-zinc-600"}`}
                    >
                        <SidebarIcon name="grid" className="size-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`cursor-pointer px-3 py-2 text-sm ${viewMode === "list" ? "bg-[var(--brand-primary)] text-white" : "text-zinc-400 hover:text-zinc-600"}`}
                    >
                        <SidebarIcon name="list-ordered" className="size-4" />
                    </button>
                </div>

                {/* Upload button */}
                <button
                    onClick={() => {
                        setStagedFiles([]);
                        setIsUploadDialogOpen(true);
                    }}
                    disabled={uploading}
                    className="ms-auto cursor-pointer rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-primary-light)] disabled:opacity-50"
                >
                    {uploading
                        ? (locale === "ar" ? "جاري الرفع..." : "Uploading...")
                        : (locale === "ar" ? "رفع ملف" : "Upload")}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptMap[bucket]}
                    className="hidden"
                    onChange={(e) => e.target.files && handleUpload(e.target.files)}
                />
            </div>

            {/* Drop Zone / Grid */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`relative min-h-[300px] rounded-xl border-2 border-dashed transition-colors ${dragActive
                    ? "border-[var(--brand-primary)] bg-[var(--brand-primary-50)] dark:bg-[var(--brand-primary)]/5"
                    : "border-zinc-200 dark:border-zinc-800"
                    }`}
            >
                {dragActive && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-[var(--brand-primary-50)]/80 dark:bg-zinc-900/80">
                        <div className="text-center">
                            <SidebarIcon name="upload" className="mx-auto mb-2 size-10 text-[var(--brand-primary)]" />
                            <p className="text-sm font-medium text-[var(--brand-primary)]">
                                {locale === "ar" ? "أفلت الملفات هنا" : "Drop files here"}
                            </p>
                        </div>
                    </div>
                )}

                {filtered.length === 0 && !dragActive ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <SidebarIcon name={getFileIcon("")} className="mb-3 size-12 text-zinc-300 dark:text-zinc-600" />
                        <p className="text-sm text-zinc-400 dark:text-zinc-500">
                            {locale === "ar" ? "لا توجد ملفات بعد" : "No files yet"}
                        </p>
                        <p className="mt-1 text-xs text-zinc-300 dark:text-zinc-600">
                            {locale === "ar" ? "اسحب وأفلت أو استخدم زر الرفع" : "Drag & drop or use the upload button"}
                        </p>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {filtered.map((file) => (
                            <div
                                key={file.id}
                                className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white transition-all hover:border-[var(--brand-primary)]/30 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                            >
                                {/* Preview */}
                                <button
                                    onClick={() => setPreview(file)}
                                    className="block w-full cursor-pointer"
                                >
                                    {file.mime_type.startsWith("image/") ? (
                                        <div className="relative aspect-square">
                                            <img
                                                src={getFileUrl(file)}
                                                alt={locale === "ar" ? file.alt_ar : file.alt_en}
                                                className="size-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex aspect-square items-center justify-center bg-zinc-50 dark:bg-zinc-800">
                                            <SidebarIcon name={getFileIcon(file.mime_type)} className="size-10 text-zinc-300 dark:text-zinc-600" />
                                        </div>
                                    )}
                                </button>

                                {/* Info */}
                                <div className="p-2">
                                    <p className="truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">{file.original_name}</p>
                                    <p className="text-[10px] text-zinc-400">{formatSize(file.size_bytes)}</p>
                                </div>

                                {/* Actions overlay */}
                                <div className="absolute end-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                    {bucket === "images" && (
                                        <button
                                            onClick={() => copyUrl(file)}
                                            className="flex size-7 cursor-pointer items-center justify-center rounded-md bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
                                            title={locale === "ar" ? "نسخ الرابط" : "Copy URL"}
                                        >
                                            <SidebarIcon name="link" className="size-3.5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(file.id)}
                                        disabled={isPending}
                                        className="flex size-7 cursor-pointer items-center justify-center rounded-md bg-red-500/80 text-white backdrop-blur-sm hover:bg-red-600"
                                        title={locale === "ar" ? "حذف" : "Delete"}
                                    >
                                        <SidebarIcon name="x" className="size-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* List View */
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {filtered.map((file) => (
                            <div key={file.id} className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                                {file.mime_type.startsWith("image/") ? (
                                    <img
                                        src={getFileUrl(file)}
                                        alt=""
                                        className="size-10 shrink-0 rounded-lg object-cover"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                                        <SidebarIcon name={getFileIcon(file.mime_type)} className="size-5 text-zinc-400" />
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{file.original_name}</p>
                                    <p className="text-xs text-zinc-400">{formatSize(file.size_bytes)} · {file.mime_type}</p>
                                </div>
                                <div className="flex gap-1.5">
                                    {bucket === "images" && (
                                        <button onClick={() => copyUrl(file)} className="cursor-pointer rounded-lg px-3 py-1.5 text-xs text-[var(--brand-primary)] hover:bg-[var(--brand-primary-50)]">
                                            {locale === "ar" ? "نسخ" : "Copy"}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(file.id)}
                                        disabled={isPending}
                                        className="cursor-pointer rounded-lg px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        {locale === "ar" ? "حذف" : "Delete"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* File Preview Modal */}
            {preview && (
                <>
                    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setPreview(null)} />
                    <div className="fixed inset-4 z-50 flex items-center justify-center">
                        <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
                            <button
                                onClick={() => setPreview(null)}
                                className="absolute end-4 top-4 flex size-8 cursor-pointer items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                            >
                                <SidebarIcon name="x" className="size-4" />
                            </button>
                            {preview.mime_type.startsWith("image/") && (
                                <img
                                    src={getFileUrl(preview)}
                                    alt={locale === "ar" ? preview.alt_ar : preview.alt_en}
                                    className="mb-4 max-h-96 w-full rounded-lg object-contain"
                                />
                            )}
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{preview.original_name}</h3>
                                <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                                    <span className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">{preview.mime_type}</span>
                                    <span className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">{formatSize(preview.size_bytes)}</span>
                                    {preview.width && preview.height && (
                                        <span className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">{preview.width}×{preview.height}</span>
                                    )}
                                    <span className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
                                        {new Date(preview.created_at).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}
                                    </span>
                                </div>
                                {bucket === "images" && (
                                    <button
                                        onClick={() => copyUrl(preview)}
                                        className="mt-3 cursor-pointer rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-primary-light)]"
                                    >
                                        {locale === "ar" ? "نسخ رابط الصورة" : "Copy Image URL"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Upload Dialog */}
            {isUploadDialogOpen && (
                <UploadDialog
                    initialFiles={stagedFiles}
                    folders={folders}
                    bucket={bucket}
                    defaultFolderId={selectedFolder}
                    locale={locale}
                    onClose={() => {
                        setIsUploadDialogOpen(false);
                        setStagedFiles([]);
                    }}
                    onSuccess={() => {
                        setIsUploadDialogOpen(false);
                        setStagedFiles([]);
                        router.refresh();
                    }}
                />
            )}
        </div>
    );
}
