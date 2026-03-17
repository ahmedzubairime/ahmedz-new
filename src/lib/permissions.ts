import { createClient } from "@/lib/supabase/server";

export type PagePermission = {
    page_id: string;
    page_name_ar: string;
    page_name_en: string;
    page_path: string;
    page_icon: string | null;
    page_sort: number;
    page_parent_id: string | null;
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
};

export type SidebarGroup = {
    id: string;
    name_ar: string;
    name_en: string;
    icon: string | null;
    sort_order: number;
    pages: PagePermission[];
};

export type SidebarSection = {
    id: string;
    name_ar: string;
    name_en: string;
    path: string;
    icon: string | null;
    sort_order: number;
    groups: SidebarGroup[];
};

export type UserAccount = {
    id: string;
    full_name: string;
    avatar_url: string | null;
    status: string;
    roles: string[];
};

export async function getUserAccount(): Promise<UserAccount | null> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Use SECURITY DEFINER RPC to bypass RLS issues during session transitions
    const { data, error } = await supabase.rpc("get_user_account", {
        p_user_id: user.id,
    });

    if (error || !data) return null;

    // The RPC returns a JSON object; parse roles from json array
    const result = data as { id: string; full_name: string; avatar_url: string | null; status: string; roles: string[] };

    return {
        id: result.id,
        full_name: result.full_name,
        avatar_url: result.avatar_url,
        status: result.status,
        roles: Array.isArray(result.roles) ? result.roles : [],
    };
}

export async function getUserSidebar(sectionId: string): Promise<SidebarSection | null> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: permissions, error } = await supabase.rpc("get_user_permissions", {
        user_id: user.id,
    });

    if (error || !permissions || permissions.length === 0) return null;

    // Filter to the requested section
    const sectionPerms = permissions.filter(
        (p: Record<string, unknown>) => p.section_id === sectionId
    );

    if (sectionPerms.length === 0) return null;

    const first = sectionPerms[0];

    // Build groups map
    const groupsMap = new Map<string, SidebarGroup>();

    for (const perm of sectionPerms) {
        const groupId = perm.group_id as string;

        if (!groupsMap.has(groupId)) {
            groupsMap.set(groupId, {
                id: groupId,
                name_ar: perm.group_name_ar as string,
                name_en: perm.group_name_en as string,
                icon: perm.group_icon as string | null,
                sort_order: perm.group_sort as number,
                pages: [],
            });
        }

        groupsMap.get(groupId)!.pages.push({
            page_id: perm.page_id as string,
            page_name_ar: perm.page_name_ar as string,
            page_name_en: perm.page_name_en as string,
            page_path: perm.page_path as string,
            page_icon: perm.page_icon as string | null,
            page_sort: perm.page_sort as number,
            page_parent_id: perm.page_parent_id as string | null,
            can_create: perm.can_create as boolean,
            can_read: perm.can_read as boolean,
            can_update: perm.can_update as boolean,
            can_delete: perm.can_delete as boolean,
        });
    }

    // Sort groups and their pages
    const groups = Array.from(groupsMap.values())
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((group) => ({
            ...group,
            pages: group.pages.sort((a, b) => a.page_sort - b.page_sort),
        }));

    return {
        id: first.section_id as string,
        name_ar: first.section_name_ar as string,
        name_en: first.section_name_en as string,
        path: first.section_path as string,
        icon: first.section_icon as string | null,
        sort_order: first.section_sort as number,
        groups,
    };
}
