"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// --- CATEGORIES ---
export async function getCategories() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("services_categories")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function saveCategory(payload: any, id?: string) {
    const supabase = await createClient();
    let query = supabase.from("services_categories");

    if (id) {
        const { error } = await query.update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await query.insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/services-content/categories");
    revalidatePath("/dashboard/services-content/list"); // Update both because list uses categories
}

export async function deleteCategory(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("services_categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/services-content/categories");
    revalidatePath("/dashboard/services-content/list");
}

// --- SERVICES ---
export async function getServices() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("services")
        .select(`*, category:services_categories(name_ar, name_en), image:media(bucket, storage_path)`)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function saveService(payload: any, id?: string) {
    const supabase = await createClient();
    let query = supabase.from("services");

    if (id) {
        const { error } = await query.update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await query.insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/services-content/list");
}

export async function deleteService(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/services-content/list");
}

// --- SERVICE PROCESS (Per-service steps) ---
export async function getServiceProcess(serviceId?: string) {
    const supabase = await createClient();
    let query = supabase.from("services_process").select("*").order("sort_order", { ascending: true });
    if (serviceId) query = query.eq("service_id", serviceId);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
}

export async function saveServiceProcess(payload: any, id?: string) {
    const supabase = await createClient();
    if (id) {
        const { error } = await supabase.from("services_process").update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from("services_process").insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/services-content/process");
}

export async function deleteServiceProcess(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("services_process").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/services-content/process");
}

// --- SERVICE PRICING (Per-service tiers) ---
export async function getServicePricing(serviceId?: string) {
    const supabase = await createClient();
    let query = supabase.from("services_pricing").select("*").order("sort_order", { ascending: true });
    if (serviceId) query = query.eq("service_id", serviceId);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
}

export async function saveServicePricing(payload: any, id?: string) {
    const supabase = await createClient();
    if (id) {
        const { error } = await supabase.from("services_pricing").update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from("services_pricing").insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/services-content/pricing");
}

export async function deleteServicePricing(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("services_pricing").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/services-content/pricing");
}

