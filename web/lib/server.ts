import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE = "tg_admin_session";

function sessionToken() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.DATABASE_URL ||
    (process.env.NODE_ENV !== "production"
      ? process.env.ADMIN_PASSWORD || "tribe-green-local-admin"
      : "");
  if (!secret)
    throw new Error(
      "Configure ADMIN_SESSION_SECRET before enabling admin access.",
    );
  return createHmac("sha256", secret).update("tribe-green-admin").digest("hex");
}

export function setAdminSession(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export function clearAdminSession(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

export function isAdmin(request: NextRequest) {
  const actual = request.cookies.get(ADMIN_COOKIE)?.value || "";
  const expected = sessionToken();
  const actualBytes = Buffer.from(actual);
  const expectedBytes = Buffer.from(expected);
  return (
    actualBytes.length === expectedBytes.length &&
    timingSafeEqual(actualBytes, expectedBytes)
  );
}

export function unauthorized() {
  return NextResponse.json(
    { error: "Please sign in as an administrator." },
    { status: 401 },
  );
}
