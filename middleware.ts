import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
    '/login',
    '/signup',
    '/',
    '/search',
    '/register'
]

function isPublicPath(pathname: string) {
    if (PUBLIC_PATHS.includes(pathname)) return true;

    // Allow Next.js / public files (by extension)
    if (pathname.match(/\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml|map)$/)) return true;

    return false;
}

export function middleware(req: NextRequest) {
    const {pathname} = req.nextUrl;

    if(isPublicPath(pathname)) return NextResponse.next()

    // cookie based auth (middleware can't use localstorage)
    const token = req.cookies.get("access_token")?.value;

    if(!token){
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = '/login';
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next()
}

// Apply to all routes except Next internals + API + static assets
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)",
  ],
};