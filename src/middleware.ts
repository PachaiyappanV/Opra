import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Origin": "*", // Allow all origins
};

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/payment(.*)"]);
const isHomeRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  const origin = req.headers.get("origin") ?? "";

  // Handle preflight requests (CORS)
  if (req.method === "OPTIONS") {
    return NextResponse.json({}, { headers: corsOptions });
  }

  // Handle protected routes
  const { userId } = await auth();

  if (userId && isHomeRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!userId && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  // Handle normal requests
  const response = NextResponse.next();

  // Apply CORS headers
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
