"use client";

import { useState, useEffect } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { uploadMedia } from "@/app/actions/media";

type Folder = {
    id: string;
    parent_id: string | null;
    name: string;
};

type StagedFile = {
    id: string;
    file: File;
    status: "waiting" | "uploading" | "success" | "error";
    progress: number;
    errorMsg?: string;
    altAr: string;
    altEn: string;
    width: number | null;
    height: number | null;
    previewUrl: string | null;
};

type Props = {
    initialFiles?: File[];
    folders: Folder[];
    bucket: string;
    defaultFolderId: string | "all";
    locale: string;
    onClose: () => void;
    onSuccess: (urls?: string[]) => void;
};

export function UploadDialog({ initialFiles = [], folders, bucket, defaultFolderId, locale, onClose, onSuccess }: Props) {
    const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
    const [targetFolder, setTargetFolder] = useState<string>(
        defaultFolderId === "all" ? "" : defaultFolderId
    );
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // Process new files into StagedFile array
    const processFiles = async (filesToAdd: File[]) => {
        const mapped = await Promise.all(
            filesToAdd.map(async (f) => {
                const isImage = f.type.startsWith("image/");
                let width = null, height = null, previewUrl = null;

                if (isImage) {
                    try {
                        previewUrl = URL.createObjectURL(f);
                        const img = new Image();
                        img.src = previewUrl;
                        await new Promise((resolve) => {
                            img.onload = () => {
                                width = img.width;
                                height = img.height;
                                resolve(null);
                            };
                        });
                    } catch (e) {
                        console.error("Failed to parse image data:", e);
                    }
                }

                return {
                    id: Math.random().toString(36).substring(7),
                    file: f,
                    status: "waiting" as const,
                    progress: 0,
                    altAr: "",
                    altEn: "",
                    width,
                    height,
                    previewUrl,
                };
            })
        );
        setStagedFiles((prev) => [...prev, ...mapped]);
    };

    // Extract file info on mount for initial files
    useEffect(() => {
        if (initialFiles.length > 0) {
            processFiles(initialFiles);
        }
        return () => {
            stagedFiles.forEach(f => {
                if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files?.length) {
            processFiles(Array.from(e.dataTransfer.files));
        }
    };

    function updateFile(id: string, updates: Partial<StagedFile>) {
        setStagedFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
        );
    }

    function removeFile(id: string) {
        setStagedFiles((prev) => {
            const file = prev.find(f => f.id === id);
            if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);
            return prev.filter(f => f.id !== id);
        });
    }

    async function handleUpload() {
        if (stagedFiles.length === 0) return;
        setUploading(true);

        const uploadedUrls: string[] = [];

        const uploadPromises = stagedFiles
            .filter((f) => f.status !== "success")
            .map(async (staged) => {
                const formData = new FormData();
                formData.append("file", staged.file);
                formData.append("bucket", bucket);
                if (targetFolder) formData.append("folderId", targetFolder);
                formData.append("altAr", staged.altAr);
                formData.append("altEn", staged.altEn);
                if (staged.width) formData.append("width", staged.width.toString());
                if (staged.height) formData.append("height", staged.height.toString());

                try {
                    updateFile(staged.id, { status: "uploading", progress: 0 });

                    let progress = 0;
                    const interval = setInterval(() => {
                        progress = Math.min(progress + 15, 90);
                        updateFile(staged.id, { progress });
                    }, 200);

                    const result = await uploadMedia(formData);
                    if (result && result.publicUrl) {
                        uploadedUrls.push(result.publicUrl);
                    }

                    clearInterval(interval);
                    updateFile(staged.id, { status: "success", progress: 100 });
                } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : "Upload failed";
                    updateFile(staged.id, { status: "error", errorMsg: message });
                }
            });

        await Promise.all(uploadPromises);
        setUploading(false);

        // Check if all succeeded
        setStagedFiles((current) => {
            const allSuccess = current.every((f) => f.status === "success");
            if (allSuccess) {
                setTimeout(() => onSuccess(uploadedUrls), 1000); // Close automatically after 1s
            }
            return current;
        });
    }

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1048576).toFixed(1)} MB`;
    };

    const acceptMap: Record<string, string> = {
        images: "image/*",
        videos: "video/*",
        documents: ".pdf,.doc,.docx,.xls,.xlsx,.txt",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !uploading && onClose()} />

            <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-100 p-5 dark:border-zinc-800">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                            {locale === "ar" ? "رفع الملفات" : "Upload Files"}
                        </h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            {stagedFiles.length} {locale === "ar" ? "ملفات محددة" : "files selected"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={uploading}
                        className="cursor-pointer rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
                    >
                        <SidebarIcon name="x" className="size-5" />
                    </button>
                </div>

                {/* Body */}
                <div
                    className={`flex-1 overflow-y-auto p-5 custom-scrollbar transition-colors ${dragActive ? 'bg-zinc-50 dark:bg-zinc-800/20' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                >
                    {/* Unified Settings */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                        <div className="flex-1">
                            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                {locale === "ar" ? "المجلد الوجهة (اختياري)" : "Destination Folder (Optional)"}
                            </label>
                            <select
                                value={targetFolder}
                                onChange={(e) => setTargetFolder(e.target.value)}
                                disabled={uploading}
                                className="w-full max-w-md rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--brand-primary)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            >
                                <option value="">{locale === "ar" ? "بدون مجلد (الرئيسي)" : "No internal folder (Root)"}</option>
                                {folders.map(f => (
                                    <option key={f.id} value={f.id}>{f.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="shrink-0 flex items-center justify-center">
                            <label className="cursor-pointer rounded-lg border border-[var(--brand-primary)] text-[var(--brand-primary)] px-4 py-2 text-sm font-medium hover:bg-[var(--brand-primary)]/5 transition-colors">
                                {locale === "ar" ? "إضافة ملفات +" : "Add Files +"}
                                <input
                                    type="file"
                                    multiple
                                    accept={acceptMap[bucket]}
                                    className="hidden"
                                    onChange={(e) => e.target.files && processFiles(Array.from(e.target.files))}
                                />
                            </label>
                        </div>
                    </div>

                    {stagedFiles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/50">
                            <div className="flex size-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
                                <SidebarIcon name="upload" className="size-8 text-zinc-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                                {locale === "ar" ? "اسحب وأفلت الملفات هنا" : "Drag & Drop files here"}
                            </h3>
                            <p className="max-w-sm mt-2 text-sm text-zinc-500">
                                {locale === "ar" ? "قم بسحب الملفات إلى هذه المنطقة لإضافتها إلى قائمة الرفع" : "Drag any file into this area to add it to the upload queue."}
                            </p>
                            <label className="mt-6 cursor-pointer rounded-lg bg-[var(--brand-primary)] text-white px-6 py-2.5 text-sm font-medium hover:bg-[var(--brand-primary-light)] transition-colors shadow-lg shadow-[var(--brand-primary)]/20">
                                {locale === "ar" ? "اختيار الملفات" : "Choose Files"}
                                <input
                                    type="file"
                                    multiple
                                    accept={acceptMap[bucket]}
                                    className="hidden"
                                    onChange={(e) => e.target.files && processFiles(Array.from(e.target.files))}
                                />
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {stagedFiles.map((staged) => (
                                <div key={staged.id} className="relative flex flex-col gap-4 rounded-xl border border-zinc-200 p-4 transition-colors hover:border-[var(--brand-primary)]/30 dark:border-zinc-800 dark:bg-zinc-900/50 sm:flex-row sm:items-start">
                                    {/* Preview Thumbnail */}
                                    <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                                        {staged.previewUrl ? (
                                            <img src={staged.previewUrl} alt="Preview" className="size-full object-cover" />
                                        ) : (
                                            <SidebarIcon name="file-text" className="size-8 text-zinc-400" />
                                        )}
                                    </div>

                                    {/* Details & Inputs */}
                                    <div className="flex-1 space-y-3 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                    {staged.file.name}
                                                </p>
                                                <div className="mt-1 flex flex-wrap gap-2 text-xs text-zinc-500">
                                                    <span>{formatSize(staged.file.size)}</span>
                                                    {staged.width && staged.height && (
                                                        <span className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">
                                                            {staged.width}x{staged.height}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {!uploading && staged.status !== "success" && (
                                                <button
                                                    onClick={() => removeFile(staged.id)}
                                                    className="shrink-0 p-1 text-zinc-400 hover:text-red-500"
                                                >
                                                    <SidebarIcon name="x" className="size-4" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Sub Items (Progress or Inputs) */}
                                        {staged.status === "waiting" || staged.status === "error" ? (
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder={locale === "ar" ? "النص البديل (عربي)" : "Alt Text (Arabic)"}
                                                        value={staged.altAr}
                                                        onChange={e => updateFile(staged.id, { altAr: e.target.value })}
                                                        className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1.5 text-xs outline-none focus:border-[var(--brand-primary)] dark:border-zinc-700 dark:text-zinc-100"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder={locale === "ar" ? "النص البديل (إنجليزي)" : "Alt Text (English)"}
                                                        value={staged.altEn}
                                                        onChange={e => updateFile(staged.id, { altEn: e.target.value })}
                                                        className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1.5 text-xs outline-none focus:border-[var(--brand-primary)] dark:border-zinc-700 dark:text-zinc-100"
                                                    />
                                                </div>
                                                {staged.errorMsg && (
                                                    <p className="col-span-2 text-xs text-red-500">{staged.errorMsg}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-1.5 py-2">
                                                <div className="flex items-center justify-between text-xs font-medium">
                                                    <span className={staged.status === "success" ? "text-emerald-500" : "text-[var(--brand-primary)]"}>
                                                        {staged.status === "success"
                                                            ? (locale === "ar" ? "اكتمل" : "Completed")
                                                            : (locale === "ar" ? "جاري الرفع..." : "Uploading...")}
                                                    </span>
                                                    <span className="text-zinc-500">{staged.progress}%</span>
                                                </div>
                                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                                    <div
                                                        className={`h-full transition-all duration-300 ${staged.status === "success" ? "bg-emerald-500" : "bg-[var(--brand-primary)]"}`}
                                                        style={{ width: `${staged.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Actons */}
                <div className="border-t border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            disabled={uploading}
                            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                        >
                            {locale === "ar" ? "إلغاء" : "Cancel"}
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={uploading || stagedFiles.length === 0}
                            className={`cursor-pointer rounded-lg px-6 py-2 text-sm font-medium text-white transition-all ${uploading ? "cursor-not-allowed bg-[var(--brand-primary)]/70" : "bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-light)] hover:shadow-lg hover:shadow-[var(--brand-primary)]/20"
                                }`}
                        >
                            {uploading
                                ? (locale === "ar" ? "جاري المعالجة..." : "Processing...")
                                : (locale === "ar" ? "بدء الرفع" : "Start Upload")}
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}
