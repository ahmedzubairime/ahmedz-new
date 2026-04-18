"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Utility to map Supabase snake_case to Frontend camelCase
function toCamel(obj: any): any {
    if (Array.isArray(obj)) return obj.map(v => toCamel(v));
    if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((result, key) => {
            const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
            result[camelKey] = toCamel(obj[key]);
            return result;
        }, {} as any);
    }
    return obj;
}

// Utility to map Frontend camelCase to Supabase snake_case
function toSnake(obj: any): any {
    if (Array.isArray(obj)) return obj.map(v => toSnake(v));
    if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((result, key) => {
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            result[snakeKey] = obj[key] === undefined ? null : toSnake(obj[key]); // Ensure undefined isn't swallowed incorrectly occasionally though Supabase ignores undefined.
            if (result[snakeKey] === undefined) delete result[snakeKey];
            return result;
        }, {} as any);
    }
    return obj;
}

// --- Experiences ---
export async function getExperiences() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('cms_experiences')
        .select('*, logo:media!cms_experiences_logo_id_fkey(bucket, storage_path)')
        .order('sort_order', { ascending: false })
        .order('start_date', { ascending: false });
    if (error) throw new Error(error.message);
    return toCamel(data || []);
}

export async function saveExperience(payload: any, id?: string) {
    const supabase = await createClient();
    const snakePayload = toSnake(payload);
    
    if (id) {
        const { error } = await supabase.from('cms_experiences').update(snakePayload).eq('id', id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from('cms_experiences').insert(snakePayload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/resume/experiences");
    revalidatePath("/[locale]", "layout");
}

export async function deleteExperience(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('cms_experiences').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/resume/experiences");
    revalidatePath("/[locale]", "layout");
}

// --- Skills ---
export async function getSkills() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('cms_skills')
        .select('*')
        .order('sort_order', { ascending: false })
        .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return toCamel(data || []);
}

export async function saveSkill(payload: any, id?: string) {
    const supabase = await createClient();
    const snakePayload = toSnake(payload);

    if (id) {
        const { error } = await supabase.from('cms_skills').update(snakePayload).eq('id', id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from('cms_skills').insert(snakePayload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/resume/skills");
    revalidatePath("/[locale]", "layout");
}

export async function deleteSkill(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('cms_skills').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/resume/skills");
    revalidatePath("/[locale]", "layout");
}

// --- Portfolio Projects ---
export async function getProjects() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*, cover_image:media!portfolio_projects_cover_image_id_fkey(bucket, storage_path)')
        .order('sort_order', { ascending: false })
        .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return toCamel(data || []);
}

export async function getProjectById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('portfolio_projects').select('*').eq('id', id).single();
    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return toCamel(data || null);
}

export async function saveProject(payload: any, id?: string) {
    const supabase = await createClient();
    const snakePayload = toSnake(payload);

    if (id) {
        const { error } = await supabase.from('portfolio_projects').update(snakePayload).eq('id', id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from('portfolio_projects').insert(snakePayload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/portfolio/projects");
    revalidatePath("/[locale]", "layout");
}

export async function deleteProject(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/portfolio/projects");
    revalidatePath("/[locale]", "layout");
}

// --- Portfolio Case Studies ---
export async function getCaseStudies(projectId?: string) {
    const supabase = await createClient();
    let query = supabase
        .from('portfolio_case_studies')
        .select('*, project:portfolio_projects!portfolio_case_studies_project_id_fkey(title_ar, title_en)');
    if (projectId) {
        query = query.eq('project_id', projectId);
    }
    const { data, error } = await query
        .order('sort_order', { ascending: false })
        .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return toCamel(data || []);
}

export async function saveCaseStudy(payload: any, id?: string) {
    const supabase = await createClient();
    const snakePayload = toSnake(payload);

    if (id) {
        const { error } = await supabase.from('portfolio_case_studies').update(snakePayload).eq('id', id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from('portfolio_case_studies').insert(snakePayload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/portfolio/case-studies");
    revalidatePath("/[locale]", "layout");
}

export async function deleteCaseStudy(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('portfolio_case_studies').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/portfolio/case-studies");
    revalidatePath("/[locale]", "layout");
}

// --- Gallery Albums ---
export async function getGalleryAlbums() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('cms_gallery_albums')
        .select('*, cover_image:media!cms_gallery_albums_cover_image_id_fkey(bucket, storage_path)')
        .order('sort_order', { ascending: false })
        .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return toCamel(data || []);
}

export async function saveGalleryAlbum(payload: any, id?: string) {
    const supabase = await createClient();
    const snakePayload = toSnake(payload);

    if (id) {
        const { error } = await supabase.from('cms_gallery_albums').update(snakePayload).eq('id', id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from('cms_gallery_albums').insert(snakePayload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/gallery/albums");
    revalidatePath("/[locale]", "layout");
}

export async function deleteGalleryAlbum(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('cms_gallery_albums').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/gallery/albums");
    revalidatePath("/[locale]", "layout");
}

// --- Gallery Items ---
export async function getGalleryItems(albumId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('cms_gallery_items')
        .select('*, image:media!cms_gallery_items_media_id_fkey(bucket, storage_path)')
        .eq('album_id', albumId)
        .order('sort_order', { ascending: false })
        .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return toCamel(data || []);
}

export async function saveGalleryItem(payload: any, id?: string) {
    const supabase = await createClient();
    const snakePayload = toSnake(payload);

    if (id) {
        const { error } = await supabase.from('cms_gallery_items').update(snakePayload).eq('id', id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from('cms_gallery_items').insert(snakePayload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/gallery/albums");
    revalidatePath("/[locale]", "layout");
}

export async function deleteGalleryItem(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('cms_gallery_items').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/gallery/albums");
    revalidatePath("/[locale]", "layout");
}

// --- Contact Messages ---
export async function getContactMessages() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return toCamel(data || []);
}

export async function updateMessageStatus(id: string, status: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/inbox/messages");
}

export async function deleteContactMessage(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/inbox/messages");
}
