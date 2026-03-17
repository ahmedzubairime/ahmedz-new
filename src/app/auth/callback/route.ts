import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/dashboard";
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    const supabase = await createClient();

    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(`${origin}/ar${next}`);
        }
    }

    if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as "email" | "recovery" | "email_change",
        });
        if (!error) {
            return NextResponse.redirect(`${origin}/ar${next}`);
        }
    }

    // If there's an error, redirect to login with error
    return NextResponse.redirect(`${origin}/ar/login?error=auth_callback_failed`);
}
