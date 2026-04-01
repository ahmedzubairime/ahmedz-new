"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logActivity } from "./pms-activity";

const REVALIDATE = "/projects-management";

// --- TASK STATUSES ---
export async function getTaskStatuses() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("pms_task_statuses")
        .select("*")
        .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
}

export async function saveTaskStatus(payload: any, id?: string) {
    const supabase = await createClient();
    if (id) {
        const { error } = await supabase.from("pms_task_statuses").update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from("pms_task_statuses").insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath(REVALIDATE);
}

// --- LABELS ---
export async function getLabels() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("pms_labels")
        .select("*")
        .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
}

export async function saveLabel(payload: any, id?: string) {
    const supabase = await createClient();
    if (id) {
        const { error } = await supabase.from("pms_labels").update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase.from("pms_labels").insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath(REVALIDATE);
}

export async function deleteLabel(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("pms_labels").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(REVALIDATE);
}

// --- TASKS ---
export async function getTasks(projectId?: string) {
    const supabase = await createClient();
    let query = supabase
        .from("pms_tasks")
        .select(`
            *,
            status:pms_task_statuses!status_id(id, name_ar, name_en, color, icon),
            assignee:accounts!assignee_id(id, full_name, avatar_url),
            reporter:accounts!reporter_id(id, full_name, avatar_url),
            project:pms_projects!project_id(id, title_ar, title_en, slug, color),
            labels:pms_task_labels(label:pms_labels!label_id(id, name_ar, name_en, color)),
            subtasks:pms_tasks!parent_task_id(id, title_ar, title_en, completed_at)
        `)
        .is("parent_task_id", null)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

    if (projectId) {
        query = query.eq("project_id", projectId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
}

export async function getMyTasks(accountId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("pms_tasks")
        .select(`
            *,
            status:pms_task_statuses!status_id(id, name_ar, name_en, color, icon),
            project:pms_projects!project_id(id, title_ar, title_en, slug, color),
            labels:pms_task_labels(label:pms_labels!label_id(id, name_ar, name_en, color))
        `)
        .eq("assignee_id", accountId)
        .is("parent_task_id", null)
        .is("completed_at", null)
        .order("priority", { ascending: false })
        .order("due_date", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
}

export async function getTask(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("pms_tasks")
        .select(`
            *,
            status:pms_task_statuses!status_id(*),
            assignee:accounts!assignee_id(id, full_name, avatar_url),
            reporter:accounts!reporter_id(id, full_name, avatar_url),
            project:pms_projects!project_id(id, title_ar, title_en, slug, color),
            labels:pms_task_labels(label:pms_labels!label_id(*)),
            subtasks:pms_tasks!parent_task_id(id, title_ar, title_en, status_id, completed_at, assignee:accounts!assignee_id(full_name, avatar_url)),
            comments:pms_task_comments(*, author:accounts!author_id(id, full_name, avatar_url)),
            attachments:pms_task_attachments(*, uploader:accounts!uploader_id(full_name)),
            time_entries:pms_time_entries(*, account:accounts!account_id(full_name))
        `)
        .eq("id", id)
        .single();
    if (error) throw new Error(error.message);
    return data;
}

export async function saveTask(payload: any, id?: string) {
    const supabase = await createClient();

    if (id) {
        const { labels, ...rest } = payload;
        const { error } = await supabase.from("pms_tasks").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
        if (error) throw new Error(error.message);

        // Sync labels
        if (labels !== undefined) {
            await supabase.from("pms_task_labels").delete().eq("task_id", id);
            if (labels.length > 0) {
                await supabase.from("pms_task_labels").insert(
                    labels.map((labelId: string) => ({ task_id: id, label_id: labelId }))
                );
            }
        }
    } else {
        const { labels, ...rest } = payload;
        const { data: user } = await supabase.auth.getUser();
        const { data: account } = await supabase.from("accounts").select("id").eq("id", user.user?.id).single();

        const { data: task, error } = await supabase.from("pms_tasks")
            .insert({ ...rest, reporter_id: account?.id })
            .select("id")
            .single();
        if (error) throw new Error(error.message);

        // Attach labels
        if (task && labels && labels.length > 0) {
            await supabase.from("pms_task_labels").insert(
                labels.map((labelId: string) => ({ task_id: task.id, label_id: labelId }))
            );
        }

        if (task) {
            await logActivity({
                action_type: "create",
                entity_type: "task",
                entity_id: task.id,
                project_id: rest.project_id || null,
                task_id: task.id,
                details: { title: payload.title_en }
            });
        }
    }
    revalidatePath(REVALIDATE);
}

export async function updateTaskStatus(taskId: string, statusId: string) {
    const supabase = await createClient();
    // Check if the status is "final" → mark completed
    const { data: status } = await supabase.from("pms_task_statuses").select("is_final").eq("id", statusId).single();
    const updates: any = { status_id: statusId, updated_at: new Date().toISOString() };
    if (status?.is_final) {
        updates.completed_at = new Date().toISOString();
    } else {
        updates.completed_at = null;
    }
    const { error } = await supabase.from("pms_tasks").update(updates).eq("id", taskId);
    if (error) throw new Error(error.message);

    await logActivity({
        action_type: "status_change",
        entity_type: "task",
        entity_id: taskId,
        task_id: taskId,
        details: { status_id: statusId, completed: status?.is_final || false }
    });

    revalidatePath(REVALIDATE);
}

export async function deleteTask(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("pms_tasks").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(REVALIDATE);
}

// --- COMMENTS ---
export async function addComment(taskId: string, contentText: string) {
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();
    const { data: account } = await supabase.from("accounts").select("id").eq("id", user.user?.id).single();
    if (!account) throw new Error("Not authenticated");

    const { error } = await supabase.from("pms_task_comments").insert({
        task_id: taskId,
        author_id: account.id,
        content_text: contentText,
    });
    if (error) throw new Error(error.message);

    await logActivity({
        action_type: "comment",
        entity_type: "comment",
        entity_id: taskId,
        task_id: taskId,
        details: { text: contentText }
    });

    revalidatePath(REVALIDATE);
}

export async function updateComment(id: string, contentText: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("pms_task_comments").update({
        content_text: contentText, updated_at: new Date().toISOString()
    }).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(REVALIDATE);
}

export async function deleteComment(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("pms_task_comments").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(REVALIDATE);
}

// --- TIME ENTRIES ---
export async function addTimeEntry(taskId: string, durationMinutes: number, description?: string) {
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();
    const { data: account } = await supabase.from("accounts").select("id").eq("id", user.user?.id).single();
    if (!account) throw new Error("Not authenticated");

    const { error } = await supabase.from("pms_time_entries").insert({
        task_id: taskId,
        account_id: account.id,
        duration_minutes: durationMinutes,
        description: description || null,
    });
    if (error) throw new Error(error.message);

    // Update logged_hours on task
    const hours = durationMinutes / 60;
    await supabase.rpc("increment_logged_hours", { p_task_id: taskId, p_hours: hours }).then(() => {});

    await logActivity({
        action_type: "log_time",
        entity_type: "task",
        entity_id: taskId,
        task_id: taskId,
        details: { duration_minutes: durationMinutes, description }
    });

    revalidatePath(REVALIDATE);
}

export async function deleteTimeEntry(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("pms_time_entries").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(REVALIDATE);
}

// --- ACCOUNTS LIST (for selectors) ---
export async function getAllAccounts() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("accounts")
        .select("id, full_name, avatar_url, phone, status, roles:account_roles(role_id)")
        .eq("status", "active")
        .order("full_name", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
}
