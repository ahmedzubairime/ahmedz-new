import { getPermissionMatrix, getRoles } from "@/app/actions/admin";
import { getLocale } from "next-intl/server";
import { PermissionsMatrix } from "./PermissionsMatrix";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function PermissionsWrapper({ locale }: { locale: string }) {
    const [matrix, roles] = await Promise.all([getPermissionMatrix(), getRoles()]);
    return <PermissionsMatrix matrix={matrix} roles={roles} locale={locale} />;
}

export default async function PermissionsPage() {
    const locale = await getLocale();

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {locale === "ar" ? "الصلاحيات" : "Permissions"}
                </h1>
                <p className="text-sm font-medium text-zinc-500">
                    {locale === "ar"
                        ? "إدارة صلاحيات الأدوار على الصفحات"
                        : "Manage role permissions for each page"}
                </p>
            </div>
            
            <Suspense fallback={<TableSkeleton rowCount={8} />}>
                {/* @ts-ignore */}
                <PermissionsWrapper locale={locale} />
            </Suspense>
        </div>
    );
}
