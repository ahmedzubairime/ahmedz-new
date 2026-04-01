"use server";

import { createClient } from "@/lib/supabase/server";

export async function logActivity({ action_type, entity_type, entity_id, project_id, task_id, details }: {
    action_type: "create" | "update" | "delete" | "status_change" | "comment" | "assign" | "log_time";
    entity_type: "project" | "task" | "comment" | "team",
    entity_id: string,
    project_id?: string,
    task_id?: string,
    details?: any
}) {
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return; // Silent fail if not authed

    const { data: account } = await supabase.from("accounts").select("id").eq("id", user.user.id).single();
    if (!account) return;

    await supabase.from("pms_activity_logs").insert({
        account_id: account.id,
        action_type,
        entity_type,
        entity_id,
        project_id: project_id || null,
        task_id: task_id || null,
        details: details || {}
    });
}

export async function getActivityLogs({ limit = 50, projectId, taskId }: { limit?: number, projectId?: string, taskId?: string }) {
    const supabase = await createClient();
    let query = supabase
        .from("pms_activity_logs")
        .select(`
            *,
            account:accounts!account_id(id, full_name, avatar_url),
            project:pms_projects!project_id(id, title_ar, title_en),
            task:pms_tasks!task_id(id, title_ar, title_en)
        `)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (projectId) query = query.eq("project_id", projectId);
    if (taskId) query = query.eq("task_id", taskId);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
}
