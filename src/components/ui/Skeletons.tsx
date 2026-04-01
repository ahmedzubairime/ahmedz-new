// src/components/ui/Skeletons.tsx
import React from 'react';

/**
 * Basic universal skeleton component
 */
export function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800 ${className}`}
            {...props}
        />
    );
}

/**
 * Skeleton for standard Dashboard Stats Cards
 */
export function StatsCardSkeleton() {
    return (
        <div className="rounded-xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
            <Skeleton className="h-4 w-1/3 mb-2" />
            <div className="mt-2 flex items-end justify-between">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
            </div>
        </div>
    );
}

/**
 * Skeleton for a Data Grid/Table layout
 */
export function TableSkeleton({ rowCount = 5 }: { rowCount?: number }) {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white/50 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50 overflow-hidden">
            {/* Header Row */}
            <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 px-6 py-4 flex gap-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
            </div>
            
            {/* Body Rows */}
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {Array.from({ length: rowCount }).map((_, i) => (
                    <div key={i} className="px-6 py-4 flex items-center gap-4">
                        <div className="flex w-1/4 items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div className="flex w-full flex-col gap-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/4" />
                        <div className="flex w-1/4 justify-end gap-2">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Skeleton for forms and settings pages
 */
export function FormSkeleton({ fieldCount = 4 }: { fieldCount?: number }) {
    return (
        <div className="space-y-6 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="space-y-5">
                {Array.from({ length: fieldCount }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full rounded-xl" />
                    </div>
                ))}
            </div>
            <div className="pt-4 flex justify-end gap-3">
                <Skeleton className="h-10 w-24 rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
        </div>
    );
}

/**
 * Skeleton for detail view headers (like Post Editor, Settings Page Headers)
 */
export function PageHeaderSkeleton() {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="space-y-2 w-full max-w-sm">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
    );
}
