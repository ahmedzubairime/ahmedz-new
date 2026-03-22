"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// --- SOCIAL LINKS ---
export async function getSocialLinks() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function saveSocialLink(payload: any, id?: string) {
    const supabase = await createClient();
    let query = supabase.from("social_links");

    if (id) {
        const { error } = await query.update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await query.insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/contact-settings/social");
}

export async function deleteSocialLink(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/contact-settings/social");
}

// --- BRANCHES ---
export async function getBranches() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("branches")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function saveBranch(payload: any, id?: string) {
    const supabase = await createClient();
    let query = supabase.from("branches");

    if (id) {
        const { error } = await query.update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await query.insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/contact-settings/branches");
}

export async function deleteBranch(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("branches").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/contact-settings/branches");
}
