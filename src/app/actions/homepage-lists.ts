"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// --- FEATURES ---
export async function getFeatures() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("homepage_features")
        .select("*, feature_image:media!homepage_features_image_id_fkey(bucket, storage_path)")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function saveFeature(payload: any, id?: string) {
    const supabase = await createClient();
    let query = supabase.from("homepage_features");

    if (id) {
        const { error } = await query.update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await query.insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/homepage-content/features");
}

export async function deleteFeature(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("homepage_features").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/homepage-content/features");
}

// --- PARTNERS ---
export async function getPartners() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("homepage_partners")
        .select("*, logo:media(bucket, storage_path)")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function savePartner(payload: any, id?: string) {
    const supabase = await createClient();
    let query = supabase.from("homepage_partners");

    if (id) {
        const { error } = await query.update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await query.insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/homepage-content/partners");
}

export async function deletePartner(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("homepage_partners").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/homepage-content/partners");
}

// --- TESTIMONIALS ---
export async function getTestimonials() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("homepage_testimonials")
        .select("*, avatar:media(bucket, storage_path)")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function saveTestimonial(payload: any, id?: string) {
    const supabase = await createClient();
    let query = supabase.from("homepage_testimonials");

    if (id) {
        const { error } = await query.update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await query.insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/homepage-content/testimonials");
}

export async function deleteTestimonial(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("homepage_testimonials").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/homepage-content/testimonials");
}

// --- STATS ---
export async function getHomepageStats() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("homepage_stats")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function saveHomepageStat(payload: any, id?: string) {
    const supabase = await createClient();
    if (id) {
        const { error } = await supabase.from("homepage_stats").update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from("homepage_stats").insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/homepage-content/stats");
}

export async function deleteHomepageStat(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("homepage_stats").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/homepage-content/stats");
}

// --- FAQ ---
export async function getHomepageFaq() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("homepage_faq")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function saveHomepageFaq(payload: any, id?: string) {
    const supabase = await createClient();
    if (id) {
        const { error } = await supabase.from("homepage_faq").update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from("homepage_faq").insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/homepage-content/faq");
}

export async function deleteHomepageFaq(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("homepage_faq").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/homepage-content/faq");
}
