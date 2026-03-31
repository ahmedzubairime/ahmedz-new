"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// --- COUPONS ---
export async function getCoupons() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("store_coupons")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function saveCoupon(payload: any, id?: string) {
    const supabase = await createClient();
    const table = supabase.from("store_coupons");

    if (id) {
        const { error } = await table.update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await table.insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/offers-coupons/coupons");
}

export async function deleteCoupon(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("store_coupons").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/offers-coupons/coupons");
}

// --- CAMPAIGNS ---
export async function getCampaigns() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("store_campaigns")
        .select("*, banner:media!banner_image_id(bucket, storage_path)")
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function saveCampaign(payload: any, id?: string) {
    const supabase = await createClient();
    const table = supabase.from("store_campaigns");

    if (id) {
        const { error } = await table.update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await table.insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/offers-coupons/campaigns");
}

export async function deleteCampaign(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("store_campaigns").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/offers-coupons/campaigns");
}

// --- OFFERS ---
export async function getOffers() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("store_offers")
        .select("*, product:store_products!product_id(title_ar, title_en), category:store_categories!category_id(name_ar, name_en), banner:media!banner_image_id(bucket, storage_path)")
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function saveOffer(payload: any, id?: string) {
    const supabase = await createClient();
    const table = supabase.from("store_offers");

    if (id) {
        const { error } = await table.update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await table.insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/offers-coupons/offers");
}

export async function deleteOffer(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("store_offers").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/offers-coupons/offers");
}
