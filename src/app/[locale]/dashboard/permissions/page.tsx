import { getPermissionMatrix, getRoles } from "@/app/actions/admin";
import { getLocale } from "next-intl/server";
import { PermissionsMatrix } from "./PermissionsMatrix";

export default async function PermissionsPage() {
    const locale = await getLocale();
    const [matrix, roles] = await Promise.all([getPermissionMatrix(), getRoles()]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {locale === "ar" ? "الصلاحيات" : "Permissions"}
                </h1>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {locale === "ar"
                        ? "إدارة صلاحيات الأدوار على الصفحات"
                        : "Manage role permissions for each page"}
                </p>
            </div>
            <PermissionsMatrix matrix={matrix} roles={roles} locale={locale} />
        </div>
    );
}
