// import { NextResponse } from "next/server";
// import { getSession } from "@auth0/nextjs-auth0/edge";

// export async function middleware(req) {
//   const res = NextResponse.next();
//   const session = await getSession(req, res);

//   if (!session?.user) {
//     return NextResponse.redirect(new URL("/api/auth/login", req.url));
//   }

//   const roles = session.user["https://coral-reef-capstone.app/roles"] || [];

//   if (!roles.includes("Administrator")) {
//     return new NextResponse("Forbidden", { status: 403 });
//   }

//   return res;
// }

// export const config = {
//   matcher: ["/api/assignRoles", "/api/createData", "/api/deleteData","/api/getUserList","/api/takeRoles"],
// };

import type { NextRequest } from "next/server";

import { auth0 } from "./src/lib/auth0"; // Adjust path if your auth0 client is elsewhere

export async function proxy(request: NextRequest) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
