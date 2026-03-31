import { getLocale } from "next-intl/server";
import { getUserAccount, getUserPagePermissions } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";
import { BranchesGrid } from "@/components/pms/BranchesGrid";

export default async function BranchesPage() {
    const locale = await getLocale();
    const account = await getUserAccount();
    if (!account) return null;

    const perms = await getUserPagePermissions("pms.branches");

    const supabase = await createClient();
    const { data: branches } = await supabase
        .from("branches")
        .select("*")
        .order("sort_order", { ascending: true });

    return (
        <BranchesGrid
            locale={locale}
            branches={branches || []}
            perms={perms}
        />
    );
}
