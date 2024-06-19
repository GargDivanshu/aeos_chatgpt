import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextResponse } from "next/server";

export default withAuth(async function middleware(req) {
  if (!req.kindeAuth) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    // console.log(url.pathname + " is not authenticated");
    return NextResponse.redirect(url);
  }
  console.log("look at me", req.kindeAuth);
});

export const config = {
  matcher: ["/dashboard"]
};