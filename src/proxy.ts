import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // api, _next, 정적파일(favicon.ico 등) 제외하고 전부 매칭
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
