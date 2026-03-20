"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAccounts() {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_all_accounts");
    if (error) throw new Error(error.message);
    return data;
}

export async function updateAccountStatus(accountId: string, status: string) {
    const supabase = await createClient();
    const { error } = await supabase.rpc("update_account_status", {
        p_account_id: accountId,
        p_status: status,
    });
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/accounts");
}

export async function updateAccountRoles(accountId: string, roleIds: string[]) {
    const supabase = await createClient();
    const { error } = await supabase.rpc("update_account_roles", {
        p_account_id: accountId,
        p_role_ids: roleIds,
    });
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/accounts");
}

export async function getRoles() {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_all_roles");
    if (error) throw new Error(error.message);
    return data;
}

export async function getPermissionMatrix() {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_permission_matrix");
    if (error) throw new Error(error.message);
    return data;
}

export async function updatePermission(
    roleId: string,
    pageId: string,
    canCreate: boolean,
    canRead: boolean,
    canUpdate: boolean,
    canDelete: boolean
) {
    const supabase = await createClient();
    const { error } = await supabase.rpc("update_permission", {
        p_role_id: roleId,
        p_page_id: pageId,
        p_can_create: canCreate,
        p_can_read: canRead,
        p_can_update: canUpdate,
        p_can_delete: canDelete,
    });
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/permissions");
}
