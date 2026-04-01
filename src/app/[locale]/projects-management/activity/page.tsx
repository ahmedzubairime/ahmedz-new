import { getLocale } from "next-intl/server";
import { getUserAccount, getUserPagePermissions } from "@/lib/permissions";
import { getActivityLogs } from "@/app/actions/pms-activity";
import { ActivityFeed } from "@/components/pms/ActivityFeed";

export default async function ActivityPage() {
    const locale = await getLocale();
    const account = await getUserAccount();
    const perms = await getUserPagePermissions("pms.activity");

    if (!perms.can_read) {
        return (
            <div className="flex h-[50vh] items-center justify-center p-8 text-center text-zinc-500">
                {locale === 'ar' ? "ليس لديك صلاحية لعرض هذه الصفحة." : "You do not have permission to view this page."}
            </div>
        );
    }

    const logs = await getActivityLogs({ limit: 100 });

    return (
        <ActivityFeed
            locale={locale}
            logs={logs}
            perms={perms}
        />
    );
}
