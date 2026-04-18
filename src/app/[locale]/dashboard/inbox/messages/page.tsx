import { getLocale } from "next-intl/server";
import { getContactMessages } from "@/app/actions/portfolio";
import { MessagesGrid } from "@/components/cms/inbox/MessagesGrid";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function MessagesDataWrapper({ locale }: { locale: string }) {
    const data = await getContactMessages();
    return <MessagesGrid locale={locale} messages={data} />;
}

export default async function MessagesPage() {
    const locale = await getLocale();

    return (
        <Suspense fallback={<TableSkeleton rowCount={5} />}>
            {/* @ts-ignore */}
            <MessagesDataWrapper locale={locale} />
        </Suspense>
    );
}
