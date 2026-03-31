"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// --- PRODUCTS ---
export async function getStoreProducts() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("store_products")
        .select("*, category:store_categories!category_id(name_ar, name_en), cover:media!cover_image_id(bucket, storage_path)")
        .eq("is_deleted", false)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function saveStoreProduct(payload: any, id?: string) {
    const supabase = await createClient();
    const table = supabase.from("store_products");

    if (id) {
        const { error } = await table.update({ ...payload, updated_at: new Date().toISOString() }).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await table.insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/products");
}

export async function deleteStoreProduct(id: string) {
    // Soft delete - mark as deleted, don't truly remove
    const supabase = await createClient();
    const { error } = await supabase.from("store_products").update({ is_deleted: true, is_active: false, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/products");
}

// --- VARIANTS ---
export async function getVariantsByProduct(productId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("store_product_variants")
        .select("*, image:media!image_id(bucket, storage_path)")
        .eq("product_id", productId)
        .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
}

export async function getAllVariants() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("store_product_variants")
        .select("*, product:store_products!product_id(title_ar, title_en, slug), image:media!image_id(bucket, storage_path)")
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function saveVariant(payload: any, id?: string) {
    const supabase = await createClient();
    const table = supabase.from("store_product_variants");

    if (id) {
        const { error } = await table.update({ ...payload, updated_at: new Date().toISOString() }).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await table.insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/products/variants");
    revalidatePath("/dashboard/products");
}

export async function deleteVariant(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("store_product_variants").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/products/variants");
}

// --- REVIEWS ---
export async function getReviews() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("store_product_reviews")
        .select("*, product:store_products!product_id(title_ar, title_en)")
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function toggleReviewApproval(id: string, is_approved: boolean) {
    const supabase = await createClient();
    const { error } = await supabase.from("store_product_reviews").update({ is_approved }).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/products/reviews");
}

export async function deleteReview(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("store_product_reviews").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/products/reviews");
}
