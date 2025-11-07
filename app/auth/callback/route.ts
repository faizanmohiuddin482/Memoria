import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type"); // Can be "signup", "recovery", etc.

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin;

  // Check if this is a password recovery BEFORE exchanging the code
  const isRecovery =
    type === "recovery" || requestUrl.searchParams.get("type") === "recovery";

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    // If there's an error, redirect to login
    if (error) {
      return NextResponse.redirect(
        new URL("/auth/login?error=invalid_link", appUrl)
      );
    }

    // If this is a password recovery, redirect to reset password page
    if (isRecovery) {
      return NextResponse.redirect(new URL("/auth/reset-password", appUrl));
    }

    // If no session after exchange, redirect to login
    if (!data.session) {
      return NextResponse.redirect(new URL("/auth/login", appUrl));
    }
  }

  // Final check for recovery type (in case code wasn't present)
  if (isRecovery) {
    return NextResponse.redirect(new URL("/auth/reset-password", appUrl));
  }

  // Otherwise, redirect to app (email confirmation)
  return NextResponse.redirect(new URL("/app", appUrl));
}
