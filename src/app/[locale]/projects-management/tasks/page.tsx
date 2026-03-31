import { getLocale } from "next-intl/server";
import { getUserAccount, getUserPagePermissions } from "@/lib/permissions";
import { getTasks, getTaskStatuses, getLabels, getAllAccounts } from "@/app/actions/pms-tasks";
import { getProjects, getMyProjects } from "@/app/actions/pms-projects";
import { TasksKanban } from "@/components/pms/TasksKanban";

export default async function TasksPage() {
    const locale = await getLocale();
    const account = await getUserAccount();
    if (!account) return null;

    const perms = await getUserPagePermissions("pms.tasks");
    const isAdmin = account.roles.some(r => ["super-admin", "admin", "branch-manager"].includes(r));

    const [tasks, statuses, labels, projects, accounts] = await Promise.all([
        getTasks(),
        getTaskStatuses(),
        getLabels(),
        isAdmin ? getProjects() : getMyProjects(account.id),
        perms.can_create ? getAllAccounts() : Promise.resolve([]),
    ]);

    return (
        <TasksKanban
            locale={locale}
            tasks={tasks}
            statuses={statuses}
            labels={labels}
            projects={projects}
            accounts={accounts}
            perms={perms}
            currentAccountId={account.id}
            userRoles={account.roles}
        />
    );
}
