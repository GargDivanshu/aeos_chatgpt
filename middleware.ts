import {
    authMiddleware,
    withAuth,
  } from "@kinde-oss/kinde-auth-nextjs/middleware";
  import { type NextRequest } from 'next/server'
  
  export default function middleware(req: NextRequest) {
    console.log(req + " :backend ")
    return withAuth(req);
  }
  
  export const config = {
    matcher: ["/dashboard"],
  };