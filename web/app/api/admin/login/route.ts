import { NextRequest, NextResponse } from "next/server";
import { setAdminSession } from "../../../../lib/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    return NextResponse.json(
      {
        error:
          "Admin login is unavailable until ADMIN_USERNAME and ADMIN_PASSWORD are configured.",
      },
      { status: 503 },
    );
  }
  if (body?.username !== username || body?.password !== password) {
    return NextResponse.json(
      { error: "Incorrect username or password." },
      { status: 401 },
    );
  }
  const response = NextResponse.json({ ok: true });
  setAdminSession(response);
  return response;
}
