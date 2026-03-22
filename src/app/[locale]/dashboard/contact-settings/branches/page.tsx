import { getLocale } from "next-intl/server";
import { getBranches } from "@/app/actions/external-lists";
import { BranchesGrid } from "@/components/cms/BranchesGrid";

export default async function BranchesPage() {
    const locale = await getLocale();
    const data = await getBranches();

    return <BranchesGrid locale={locale} branches={data} />;
}
