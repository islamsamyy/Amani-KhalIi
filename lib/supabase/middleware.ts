import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_SUPABASE_URL, DEFAULT_PUBLISHABLE_KEY } from "./config";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Config comes ONLY from server env / constants — never from request cookies.
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || DEFAULT_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    DEFAULT_PUBLISHABLE_KEY;

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Only check admin membership when it matters (admin routes).
  let isAdmin = false;
  if (user && isAdminRoute) {
    const { data } = await supabase.rpc("is_admin");
    isAdmin = data === true;
  }

  if (isAdminRoute && !isLoginRoute && !isAdmin) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("next", pathname);
    if (user) loginUrl.searchParams.set("error", "not_admin");
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && isAdmin) {
    const nextPath = request.nextUrl.searchParams.get("next") || "/admin";
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = nextPath.startsWith("/admin") && nextPath !== "/admin/login" ? nextPath : "/admin";
    adminUrl.search = "";
    return NextResponse.redirect(adminUrl);
  }

  return supabaseResponse;
}
