import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "../../../../lib/server";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  try {
    const authenticated = isAdmin(request);
    return NextResponse.json(
      { authenticated },
      {
        status: authenticated ? 200 : 401,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not check admin session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
