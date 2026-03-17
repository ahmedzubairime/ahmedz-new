"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AuthResult = {
    success: boolean;
    error?: string;
    redirectTo?: string;
};

export async function signUp(formData: FormData): Promise<AuthResult> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!email || !password) {
        return { success: false, error: "Email and password are required" };
    }

    if (password !== confirmPassword) {
        return { success: false, error: "Passwords do not match" };
    }

    if (password.length < 8) {
        return { success: false, error: "Password must be at least 8 characters" };
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL ? "" : "http://localhost:3000"}/auth/callback`,
        },
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return {
        success: true,
        redirectTo: "/confirm-account?email=" + encodeURIComponent(email),
    };
}

export async function signIn(formData: FormData): Promise<AuthResult> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { success: false, error: "Email and password are required" };
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    // Check if user has completed account setup using SECURITY DEFINER RPC
    // (direct table queries can fail due to RLS during session transitions)
    const { data: accountData } = await supabase.rpc("get_user_account", {
        p_user_id: data.user.id,
    });

    if (!accountData) {
        // No account record yet — need setup
        return { success: true, redirectTo: "/setup-account" };
    }

    const account = accountData as { status: string };

    if (account.status === "pending_setup") {
        return { success: true, redirectTo: "/setup-account" };
    }

    if (account.status === "suspended") {
        await supabase.auth.signOut();
        return { success: false, error: "Your account has been suspended" };
    }

    return { success: true, redirectTo: "/dashboard" };
}

export async function signOut(): Promise<void> {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}

export async function verifyOtp(formData: FormData): Promise<AuthResult> {
    const email = formData.get("email") as string;
    const token = formData.get("token") as string;

    if (!email || !token) {
        return { success: false, error: "Email and verification code are required" };
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, redirectTo: "/setup-account" };
}

export async function forgotPassword(formData: FormData): Promise<AuthResult> {
    const email = formData.get("email") as string;

    if (!email) {
        return { success: false, error: "Email is required" };
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback?next=/reset-password`,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function resetPassword(formData: FormData): Promise<AuthResult> {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password) {
        return { success: false, error: "Password is required" };
    }

    if (password !== confirmPassword) {
        return { success: false, error: "Passwords do not match" };
    }

    if (password.length < 8) {
        return { success: false, error: "Password must be at least 8 characters" };
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, redirectTo: "/login" };
}

export async function setupAccount(formData: FormData): Promise<AuthResult> {
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;

    if (!fullName) {
        return { success: false, error: "Full name is required" };
    }

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    // Use SECURITY DEFINER RPC to atomically create account + assign role
    // This bypasses RLS which would block the account_roles INSERT
    const { data, error } = await supabase.rpc("setup_user_account", {
        p_user_id: user.id,
        p_full_name: fullName,
        p_phone: phone || null,
        p_default_role: "viewer",
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, redirectTo: "/dashboard" };
}
