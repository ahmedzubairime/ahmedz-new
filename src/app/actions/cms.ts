"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type HomepageHero = {
    id: number;
    title_ar: string;
    title_en: string;
    subtitle_ar: string | null;
    subtitle_en: string | null;
    cta_primary_text_ar: string | null;
    cta_primary_text_en: string | null;
    cta_primary_link: string | null;
    image_id: string | null;
};

export async function getHomepageHero() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("homepage_hero")
        .select("*, cover:media(bucket, storage_path)")
        .eq("id", 1)
        .single();

    if (error) {
        // If row doesn't exist, we return a fallback empty object, 
        // but our migration guarantees id=1 exists.
        return null;
    }
    return data;
}

export async function saveHomepageHero(payload: Partial<HomepageHero>) {
    const supabase = await createClient();
    // Enforcing single-row ID safety mechanism.
    const { data, error } = await supabase
        .from("homepage_hero")
        .update({
            ...payload,
            updated_at: new Date().toISOString()
        })
        .eq("id", 1);

    if (error) throw new Error(error.message);

    revalidatePath("/dashboard/homepage-content/hero");
    return data;
}

export type ContactInfo = {
    id: number;
    email_primary: string | null;
    email_support: string | null;
    phone_primary: string | null;
    phone_secondary: string | null;
    address_ar: string | null;
    address_en: string | null;
};

export async function getContactInfo() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("contact_info")
        .select("*")
        .eq("id", 1)
        .single();

    if (error) return null;
    return data;
}

export async function saveContactInfo(payload: Partial<ContactInfo>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("contact_info")
        .update({
            ...payload,
            updated_at: new Date().toISOString()
        })
        .eq("id", 1);

    if (error) throw new Error(error.message);

    revalidatePath("/dashboard/contact-settings/info");
    return data;
}
