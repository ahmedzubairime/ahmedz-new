"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { verifyOtp } from "@/app/actions/auth";
import { useState, useTransition, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export default function ConfirmAccountPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="size-8 animate-spin rounded-full border-2 border-zinc-300 border-t-sky-600" /></div>}>
            <ConfirmAccountForm />
        </Suspense>
    );
}

function ConfirmAccountForm() {
    const t = useTranslations("auth.confirmAccount");
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [otp, setOtp] = useState<string[]>(new Array(8).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    function handleChange(index: number, value: string) {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 7) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    function handlePaste(e: React.ClipboardEvent) {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);
        const nextEmptyIndex = Math.min(pastedData.length, 7);
        inputRefs.current[nextEmptyIndex]?.focus();
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        const token = otp.join("");

        if (token.length !== 8) {
            setError("Please enter the complete 8-digit code");
            return;
        }

        const formData = new FormData();
        formData.set("email", email);
        formData.set("token", token);

        startTransition(async () => {
            const result = await verifyOtp(formData);
            if (!result.success) {
                setError(result.error || "Verification failed");
            } else if (result.redirectTo) {
                router.push(result.redirectTo);
            }
        });
    }

    return (
        <div className="w-full max-w-md">
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/30">
                        <svg className="size-8 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{t("title")}</h1>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        {email ? t("subtitleWithEmail", { email }) : t("subtitle")}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-3 block text-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            {t("code")}
                        </label>
                        <div className="flex justify-center gap-2" dir="ltr" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="size-10 rounded-lg border border-zinc-300 bg-white text-center text-lg font-semibold text-zinc-900 transition-colors focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 sm:size-12"
                                    disabled={isPending}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending || otp.join("").length !== 8}
                        className="w-full rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500 dark:hover:bg-sky-600"
                    >
                        {isPending ? t("submitting") : t("submit")}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    {t("resend")}{" "}
                    <button className="font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400">
                        {t("resendLink")}
                    </button>
                </p>
            </div>
        </div>
    );
}
