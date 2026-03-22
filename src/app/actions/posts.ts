"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type PostCategory = {
    id: string;
    slug: string;
    name_ar: string;
    name_en: string;
    description_ar: string | null;
    description_en: string | null;
};

export type Post = {
    id: string;
    category_id: string | null;
    slug_ar: string | null;
    slug_en: string | null;
    title_ar: string | null;
    title_en: string | null;
    content_ar: string | null;
    content_en: string | null;
    excerpt_ar: string | null;
    excerpt_en: string | null;
    cover_image_id: string | null;
    status_ar: "draft" | "scheduled" | "published";
    status_en: "draft" | "scheduled" | "published";
    published_at_ar: string | null;
    published_at_en: string | null;
    seo_title_ar: string | null;
    seo_description_ar: string | null;
    seo_title_en: string | null;
    seo_description_en: string | null;
    created_at: string;
};

// ==================== CATEGORIES ====================

export async function getPostCategories() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("post_categories")
        .select("*")
        .order("name_en", { ascending: true });

    if (error) throw new Error(error.message);
    return data as PostCategory[];
}

export async function createPostCategory(data: Partial<PostCategory>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("post_categories").insert({
        ...data,
        created_by: user?.id,
    });

    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/posts/categories");
}

export async function updatePostCategory(id: string, data: Partial<PostCategory>) {
    const supabase = await createClient();
    const { error } = await supabase.from("post_categories").update(data).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/posts/categories");
}

export async function deletePostCategory(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("post_categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/posts/categories");
}

// ==================== POSTS ====================

export async function getPosts(filters?: { status?: string, category_id?: string, search?: string }) {
    const supabase = await createClient();
    let query = supabase
        .from("posts")
        .select(`*, category:post_categories(name_ar, name_en), cover:media(*)`)
        .order("created_at", { ascending: false });

    if (filters?.status) {
        query = query.or(`status_ar.eq.${filters.status},status_en.eq.${filters.status}`);
    }
    if (filters?.category_id) {
        query = query.eq("category_id", filters.category_id);
    }
    if (filters?.search) {
        query = query.or(`title_ar.ilike.%${filters.search}%,title_en.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
}

export async function getPost(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("posts")
        .select(`*, category:post_categories(name_ar, name_en), cover:media(*)`)
        .eq("id", id)
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function savePost(data: Partial<Post>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const payload = {
        ...data,
        updated_at: new Date().toISOString(),
    };

    let result;
    if (data.id) {
        // Update
        const { data: updated, error } = await supabase
            .from("posts")
            .update(payload)
            .eq("id", data.id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        result = updated;
    } else {
        // Insert
        const { data: inserted, error } = await supabase
            .from("posts")
            .insert({ ...payload, created_by: user?.id })
            .select()
            .single();
        if (error) throw new Error(error.message);
        result = inserted;
    }

    revalidatePath("/dashboard/posts");
    return result;
}

export async function deletePost(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/posts");
}
