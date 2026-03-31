import { getLocale } from "next-intl/server";
import { getUserAccount, getUserPagePermissions } from "@/lib/permissions";
import { getProjectStats, getRecentProjects } from "@/app/actions/pms-projects";
import { getMyTasks } from "@/app/actions/pms-tasks";
import { PmsDashboard } from "@/components/pms/PmsDashboard";

export default async function ProjectsManagementPage() {
    const locale = await getLocale();
    const account = await getUserAccount();
    if (!account) return null;

    const perms = await getUserPagePermissions("pms.all-projects");
    const stats = await getProjectStats(account.id, account.roles);
    const recentProjects = await getRecentProjects(account.id, account.roles, 6);
    const myTasks = await getMyTasks(account.id);

    return (
        <PmsDashboard
            locale={locale}
            account={account}
            perms={perms}
            stats={stats}
            recentProjects={recentProjects}
            myTasks={myTasks}
        />
    );
}
