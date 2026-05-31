import process from "node:process";

const MOBILE_UA_PATTERN =
  /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;

export function isMobileOnlyAccessEnabled(): boolean {
  return process.env.MOBILE_ONLY_ACCESS === "1";
}

export function isMobileUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return MOBILE_UA_PATTERN.test(userAgent);
}

export function shouldBlockDesktopAccess(request: Request): boolean {
  if (!isMobileOnlyAccessEnabled()) return false;

  const { pathname } = new URL(request.url);
  if (pathname.startsWith("/api/")) return false;

  return !isMobileUserAgent(request.headers.get("user-agent"));
}

export function desktopBlockedRedirect(): Response {
  return Response.redirect("https://google.com", 302);
}
