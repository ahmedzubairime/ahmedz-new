"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const REVALIDATE = "/projects-management";

// --- PROJECTS ---
export async function getProjects() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("pms_projects")
        .select("*, branch:branches!branch_id(name_ar, name_en), creator:accounts!created_by(full_name, avatar_url)")
        .eq("is_archived", false)
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function getProject(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("pms_projects")
        .select("*, branch:branches!branch_id(name_ar, name_en), creator:accounts!created_by(full_name, avatar_url)")
        .eq("id", id)
        .single();
    if (error) throw new Error(error.message);
    return data;
}

export async function getMyProjects(accountId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("pms_project_members")
        .select("project:pms_projects!project_id(*, branch:branches!branch_id(name_ar, name_en), creator:accounts!created_by(full_name, avatar_url))")
        .eq("account_id", accountId);
    if (error) throw new Error(error.message);
    return (data || []).map((d: any) => d.project).filter(Boolean);
}

export async function saveProject(payload: any, id?: string) {
    const supabase = await createClient();
    const table = supabase.from("pms_projects");

    if (id) {
        const { error } = await table.update({ ...payload, updated_at: new Date().toISOString() }).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { data: user } = await supabase.auth.getUser();
        const { data: account } = await supabase.from("accounts").select("id").eq("id", user.user?.id).single();

        const { data: project, error } = await table.insert({ ...payload, created_by: account?.id }).select("id").single();
        if (error) throw new Error(error.message);

        // Auto-add creator as owner
        if (project && account) {
            await supabase.from("pms_project_members").insert({
                project_id: project.id,
                account_id: account.id,
                project_role: "owner",
            });
        }
    }
    revalidatePath(REVALIDATE);
}

export async function deleteProject(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("pms_projects").update({ is_archived: true, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(REVALIDATE);
}

// --- PROJECT MEMBERS ---
export async function getProjectMembers(projectId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("pms_project_members")
        .select("*, account:accounts!account_id(id, full_name, avatar_url, phone)")
        .eq("project_id", projectId)
        .order("joined_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
}

export async function addProjectMember(projectId: string, accountId: string, projectRole: string = "member") {
    const supabase = await createClient();
    const { error } = await supabase.from("pms_project_members").insert({
        project_id: projectId,
        account_id: accountId,
        project_role: projectRole,
    });
    if (error) throw new Error(error.message);
    revalidatePath(REVALIDATE);
}

export async function updateProjectMemberRole(id: string, projectRole: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("pms_project_members").update({ project_role: projectRole }).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(REVALIDATE);
}

export async function removeProjectMember(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("pms_project_members").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(REVALIDATE);
}

// --- STATS ---
export async function getProjectStats(accountId?: string, roles?: string[]) {
    const supabase = await createClient();
    const isAdmin = roles?.some(r => ["super-admin", "admin", "branch-manager"].includes(r));

    let projectQuery = supabase.from("pms_projects").select("id, status", { count: "exact" }).eq("is_archived", false);
    let taskQuery = supabase.from("pms_tasks").select("id, status_id, assignee_id, completed_at", { count: "exact" });

    // For non-admin, filter to their projects
    if (!isAdmin && accountId) {
        const { data: memberships } = await supabase
            .from("pms_project_members")
            .select("project_id")
            .eq("account_id", accountId);
        const projectIds = (memberships || []).map((m: any) => m.project_id);

        if (projectIds.length === 0) {
            return { totalProjects: 0, activeProjects: 0, totalTasks: 0, myTasks: 0, completedTasks: 0, completionRate: 0 };
        }

        projectQuery = projectQuery.in("id", projectIds);
        taskQuery = taskQuery.in("project_id", projectIds);
    }

    const [{ data: projects, count: totalProjects }, { data: tasks }] = await Promise.all([
        projectQuery,
        taskQuery,
    ]);

    const activeProjects = (projects || []).filter((p: any) => p.status === "active").length;
    const totalTasks = (tasks || []).length;
    const myTasks = accountId ? (tasks || []).filter((t: any) => t.assignee_id === accountId).length : 0;
    const completedTasks = (tasks || []).filter((t: any) => t.completed_at).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
        totalProjects: totalProjects || 0,
        activeProjects,
        totalTasks,
        myTasks,
        completedTasks,
        completionRate,
    };
}

export async function getRecentProjects(accountId?: string, roles?: string[], limit: number = 5) {
    const supabase = await createClient();
    const isAdmin = roles?.some(r => ["super-admin", "admin", "branch-manager"].includes(r));

    if (isAdmin) {
        const { data, error } = await supabase
            .from("pms_projects")
            .select("*, branch:branches!branch_id(name_ar, name_en), creator:accounts!created_by(full_name, avatar_url)")
            .eq("is_archived", false)
            .order("updated_at", { ascending: false })
            .limit(limit);
        if (error) throw new Error(error.message);
        return data;
    }

    // Non-admin: only their projects
    if (!accountId) return [];
    const { data } = await supabase
        .from("pms_project_members")
        .select("project:pms_projects!project_id(*, branch:branches!branch_id(name_ar, name_en), creator:accounts!created_by(full_name, avatar_url))")
        .eq("account_id", accountId)
        .order("joined_at", { ascending: false })
        .limit(limit);
    return (data || []).map((d: any) => d.project).filter((p: any) => p && !p.is_archived);
}
