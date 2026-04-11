"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const ABOUT_PATH = "/dashboard/about-content";

// ========== SINGLETON GETTERS ==========

export async function getAboutHero() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("about_hero")
        .select("*, background:media!about_hero_background_image_id_fkey(id, bucket, storage_path)")
        .eq("id", 1)
        .single();
    if (error) return null;
    return data;
}

export async function getAboutCompany() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("about_company")
        .select("*, cover:media!about_company_cover_image_id_fkey(id, bucket, storage_path)")
        .eq("id", 1)
        .single();
    if (error) return null;
    return data;
}

export async function getAboutMission() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("about_mission")
        .select("*")
        .eq("id", 1)
        .single();
    if (error) return null;
    return data;
}

export async function getAboutSeo() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("about_seo")
        .select("*, og_image:media!about_seo_og_image_id_fkey(id, bucket, storage_path)")
        .eq("id", 1)
        .single();
    if (error) return null;
    return data;
}

// ========== SINGLETON SAVES ==========

export async function saveAboutHero(payload: Record<string, unknown>) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("about_hero")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", 1);
    if (error) throw new Error(error.message);
    revalidatePath(ABOUT_PATH);
}

export async function saveAboutCompany(payload: Record<string, unknown>) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("about_company")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", 1);
    if (error) throw new Error(error.message);
    revalidatePath(ABOUT_PATH);
}

export async function saveAboutMission(payload: Record<string, unknown>) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("about_mission")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", 1);
    if (error) throw new Error(error.message);
    revalidatePath(ABOUT_PATH);
}

export async function saveAboutSeo(payload: Record<string, unknown>) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("about_seo")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", 1);
    if (error) throw new Error(error.message);
    revalidatePath(ABOUT_PATH);
}

// ========== LIST GETTERS ==========

export async function getAboutValues() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("about_values")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function getAboutTimeline() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("about_timeline")
        .select("*, image:media(id, bucket, storage_path)")
        .order("sort_order", { ascending: true })
        .order("year", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function getAboutTeamMembers() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("about_team_members")
        .select("*, avatar:media(id, bucket, storage_path)")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function getAboutStats() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("about_stats")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function getAboutCertificates() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("about_certificates")
        .select("*, image:media(id, bucket, storage_path)")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

// ========== LIST CRUD ==========

export async function saveAboutValue(payload: Record<string, unknown>, id?: string) {
    const supabase = await createClient();
    if (id) {
        const { error } = await supabase.from("about_values").update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from("about_values").insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath(ABOUT_PATH);
}

export async function deleteAboutValue(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("about_values").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(ABOUT_PATH);
}

export async function saveAboutTimeline(payload: Record<string, unknown>, id?: string) {
    const supabase = await createClient();
    if (id) {
        const { error } = await supabase.from("about_timeline").update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from("about_timeline").insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath(ABOUT_PATH);
}

export async function deleteAboutTimeline(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("about_timeline").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(ABOUT_PATH);
}

export async function saveAboutTeamMember(payload: Record<string, unknown>, id?: string) {
    const supabase = await createClient();
    if (id) {
        const { error } = await supabase.from("about_team_members").update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from("about_team_members").insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath(ABOUT_PATH);
}

export async function deleteAboutTeamMember(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("about_team_members").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(ABOUT_PATH);
}

export async function saveAboutStat(payload: Record<string, unknown>, id?: string) {
    const supabase = await createClient();
    if (id) {
        const { error } = await supabase.from("about_stats").update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from("about_stats").insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath(ABOUT_PATH);
}

export async function deleteAboutStat(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("about_stats").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(ABOUT_PATH);
}

export async function saveAboutCertificate(payload: Record<string, unknown>, id?: string) {
    const supabase = await createClient();
    if (id) {
        const { error } = await supabase.from("about_certificates").update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from("about_certificates").insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath(ABOUT_PATH);
}

export async function deleteAboutCertificate(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("about_certificates").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(ABOUT_PATH);
}
