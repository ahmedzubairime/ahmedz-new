export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -start-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute -bottom-40 -end-40 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
            </div>
            <div className="relative w-full max-w-md">
                {children}
            </div>
        </div>
    );
}
