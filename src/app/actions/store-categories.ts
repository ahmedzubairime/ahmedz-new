"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getStoreCategories() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("store_categories")
        .select("*, parent:store_categories!parent_id(name_ar, name_en), image:media!image_id(bucket, storage_path)")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function saveStoreCategory(payload: any, id?: string) {
    const supabase = await createClient();
    const table = supabase.from("store_categories");

    if (id) {
        const { error } = await table.update({ ...payload, updated_at: new Date().toISOString() }).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await table.insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/products");
}

export async function deleteStoreCategory(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("store_categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/products");
}
