import { getLocale } from "next-intl/server";
import { getUserAccount, getUserPagePermissions } from "@/lib/permissions";
import { getProjects, getMyProjects } from "@/app/actions/pms-projects";
import { getAllAccounts } from "@/app/actions/pms-tasks";
import { ProjectsGrid } from "@/components/pms/ProjectsGrid";
import { createClient } from "@/lib/supabase/server";

export default async function AllProjectsPage() {
    const locale = await getLocale();
    const account = await getUserAccount();
    if (!account) return null;

    const perms = await getUserPagePermissions("pms.all-projects");
    const isAdmin = account.roles.some(r => ["super-admin", "admin", "branch-manager"].includes(r));

    const projects = isAdmin ? await getProjects() : await getMyProjects(account.id);
    const accounts = perms.can_create ? await getAllAccounts() : [];

    // Get branches for the project form
    const supabase = await createClient();
    const { data: branches } = await supabase.from("branches").select("id, name_ar, name_en").eq("is_active", true).order("sort_order");

    return (
        <ProjectsGrid
            locale={locale}
            projects={projects}
            accounts={accounts}
            branches={branches || []}
            perms={perms}
            currentAccountId={account.id}
        />
    );
}
