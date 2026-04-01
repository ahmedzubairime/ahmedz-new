"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logActivity } from "./pms-activity";

const REVALIDATE = "/projects-management";

export async function getTeams() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("pms_teams")
        .select(`
            *,
            members:pms_team_members(account_id),
            projects:pms_project_teams(project_id)
        `)
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function saveTeam(payload: any, id?: string) {
    const supabase = await createClient();
    
    if (!id) {
        const { data: user } = await supabase.auth.getUser();
        const { data: account } = await supabase.from("accounts").select("id").eq("id", user.user?.id).single();
        payload.creator_id = account?.id;
    }

    if (id) {
        const { error } = await supabase.from("pms_teams").update(payload).eq("id", id);
        if (error) throw new Error(error.message);
        
        await logActivity({
            action_type: "update",
            entity_type: "team",
            entity_id: id,
            details: { name_en: payload.name_en }
        });
    } else {
        const { data, error } = await supabase.from("pms_teams").insert(payload).select().single();
        if (error) throw new Error(error.message);
        
        await logActivity({
            action_type: "create",
            entity_type: "team",
            entity_id: data.id,
            details: { name_en: payload.name_en }
        });
    }
    revalidatePath(REVALIDATE);
}

export async function deleteTeam(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("pms_teams").delete().eq("id", id);
    if (error) throw new Error(error.message);
    
    await logActivity({ action_type: "delete", entity_type: "team", entity_id: id });
    revalidatePath(REVALIDATE);
}

export async function getTeamMembers(teamId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("pms_team_members")
        .select(`
            role,
            created_at,
            account:accounts!account_id(id, full_name, avatar_url, phone)
        `)
        .eq("team_id", teamId)
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function addTeamMember(teamId: string, accountId: string, role: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("pms_team_members").insert({ team_id: teamId, account_id: accountId, role });
    if (error) throw new Error(error.message);
    
    await logActivity({
        action_type: "update",
        entity_type: "team",
        entity_id: teamId,
        details: { action: "Added member", account_id: accountId, role }
    });
    
    revalidatePath(REVALIDATE);
}

export async function removeTeamMember(teamId: string, accountId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("pms_team_members").delete().eq("team_id", teamId).eq("account_id", accountId);
    if (error) throw new Error(error.message);
    
    await logActivity({
        action_type: "update",
        entity_type: "team",
        entity_id: teamId,
        details: { action: "Removed member", account_id: accountId }
    });
    
    revalidatePath(REVALIDATE);
}

export async function updateTeamMemberRole(teamId: string, accountId: string, newRole: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("pms_team_members").update({ role: newRole }).eq("team_id", teamId).eq("account_id", accountId);
    if (error) throw new Error(error.message);
    revalidatePath(REVALIDATE);
}

export async function getAccountsForTeamSelect(teamId: string) {
    const supabase = await createClient();
    
    // 1. Get current members
    const { data: members } = await supabase.from("pms_team_members").select("account_id").eq("team_id", teamId);
    const memberIds = members?.map(m => m.account_id) || [];
    
    // 2. Get active accounts
    const { data: accounts, error } = await supabase
        .from("accounts")
        .select("id, full_name, avatar_url")
        .eq("status", "active")
        .order("full_name");
        
    if (error) throw new Error(error.message);
    
    // 3. Filter
    return accounts.filter(a => !memberIds.includes(a.id));
}
