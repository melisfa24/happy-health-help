import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import {
  desktopBlockedRedirect,
  shouldBlockDesktopAccess,
} from "./lib/mobile-access.server";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

const mobileOnlyMiddleware = createMiddleware().server(async ({ request, next }) => {
  if (shouldBlockDesktopAccess(request)) {
    return desktopBlockedRedirect();
  }
  return next();
});

export const startInstance = createStart(() => ({
  requestMiddleware: [mobileOnlyMiddleware, errorMiddleware],
}));
