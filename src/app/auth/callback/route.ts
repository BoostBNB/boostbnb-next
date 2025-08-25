import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
        const supabase = await createClient();
        await supabase.auth.exchangeCodeForSession(code);
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/log-in`);

}