import {withAuth} from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth(async function middleware(req) {
  console.log("look at me", req.kindeAuth);
});

export const config = {
  matcher: ["/dashboard"]
};