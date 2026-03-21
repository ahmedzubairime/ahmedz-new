"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ==================== FOLDERS ====================

export async function getMediaFolders() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("media_folders")
        .select("*")
        .order("name");
    if (error) throw new Error(error.message);
    return data;
}

export async function createMediaFolder(name: string, parentId: string | null) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("media_folders").insert({
        name,
        parent_id: parentId,
        created_by: user?.id,
    });
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/media");
}

export async function deleteMediaFolder(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("media_folders").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/media");
}

// ==================== MEDIA FILES ====================

export async function getMediaFiles(filters?: {
    bucket?: string;
    folderId?: string | null;
    search?: string;
    limit?: number;
    offset?: number;
}) {
    const supabase = await createClient();
    let query = supabase
        .from("media")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

    if (filters?.bucket) query = query.eq("bucket", filters.bucket);
    if (filters?.folderId) query = query.eq("folder_id", filters.folderId);
    if (filters?.folderId === null) query = query.is("folder_id", null);
    if (filters?.search) query = query.ilike("original_name", `%${filters.search}%`);
    if (filters?.limit) query = query.limit(filters.limit);
    if (filters?.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);
    return { files: data, count: count || 0 };
}

export async function uploadMedia(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const file = formData.get("file") as File;
    const bucket = formData.get("bucket") as string;
    const folderId = formData.get("folderId") as string | null;
    const altAr = (formData.get("altAr") as string) || "";
    const altEn = (formData.get("altEn") as string) || "";
    const wStr = formData.get("width");
    const hStr = formData.get("height");
    const width = wStr ? parseInt(wStr as string, 10) : null;
    const height = hStr ? parseInt(hStr as string, 10) : null;

    if (!file || !bucket) throw new Error("File and bucket are required");

    // Build storage path: folder/timestamp_filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = folderId
        ? `${folderId}/${timestamp}_${safeName}`
        : `${timestamp}_${safeName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(storagePath, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (uploadError) throw new Error(uploadError.message);

    // Get the public URL for images
    let publicUrl: string | undefined;
    if (bucket === "images") {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
        publicUrl = urlData.publicUrl;
    }

    // Save metadata to media table
    const { error: dbError } = await supabase.from("media").insert({
        folder_id: folderId || null,
        bucket,
        storage_path: storagePath,
        filename: `${timestamp}_${safeName}`,
        original_name: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        width,
        height,
        alt_ar: altAr,
        alt_en: altEn,
        created_by: user.id,
    });

    if (dbError) throw new Error(dbError.message);

    revalidatePath("/dashboard/media");
    return { storagePath, publicUrl };
}

export async function deleteMedia(id: string) {
    const supabase = await createClient();

    // Get file info first
    const { data: file } = await supabase
        .from("media")
        .select("bucket, storage_path")
        .eq("id", id)
        .single();

    if (file) {
        // Delete from storage
        await supabase.storage.from(file.bucket).remove([file.storage_path]);
    }

    // Delete metadata
    const { error } = await supabase.from("media").delete().eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/dashboard/media");
}

export async function updateMediaAlt(id: string, altAr: string, altEn: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("media")
        .update({ alt_ar: altAr, alt_en: altEn })
        .eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/media");
}

export async function getMediaPublicUrl(bucket: string, path: string) {
    const supabase = await createClient();
    if (bucket === "images") {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
    }
    // For private buckets, generate a signed URL
    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 3600);
    if (error) throw new Error(error.message);
    return data.signedUrl;
}
