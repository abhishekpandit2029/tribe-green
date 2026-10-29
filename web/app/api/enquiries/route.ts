import { NextRequest, NextResponse } from "next/server";
import { getPool } from "../../../lib/db";
import { isAdmin, unauthorized } from "../../../lib/server";

export const dynamic = "force-dynamic";
const STATUSES = ["New", "Contacted", "Converted", "Lost"];
const SOURCES = ["Website", "Mobile app"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ENQUIRY_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function enquiryResponse(body: unknown, status: number) {
  return NextResponse.json(body, {
    status,
    headers: ENQUIRY_CORS_HEADERS,
  });
}

function asEnquiry(row: Record<string, unknown>) {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    phone: row.phone,
    email: row.email,
    occasion: row.occasion,
    units: row.units,
    budget: row.budget,
    products: row.products,
    customisations: row.customisations,
    giftMessage: row.gift_message ?? row.message ?? "",
    source: row.source,
    status: row.status,
    createdAt: row.created_at,
  };
}

function failure(message: string, error: unknown) {
  return NextResponse.json(
    {
      error: message,
      ...(process.env.NODE_ENV !== "production" && error instanceof Error
        ? { details: error.message }
        : {}),
    },
    { status: 503 },
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const phone = String(body?.phone || "").replace(/\D/g, "");
  const units = Number(body?.units);
  if (
    !body ||
    !String(body.name || "").trim() ||
    !String(body.company || "").trim()
  )
    return enquiryResponse({ error: "Name and company are required." }, 400);
  if (!emailPattern.test(String(body.email || "")))
    return enquiryResponse({ error: "Enter a valid email address." }, 400);
  if (phone.length < 10 || phone.length > 15)
    return enquiryResponse({ error: "Enter a valid phone number." }, 400);
  if (!Number.isInteger(units) || units < 1)
    return enquiryResponse({ error: "Quantity must be at least one." }, 400);
  if (!body.occasion || !body.budget || !SOURCES.includes(body.source))
    return enquiryResponse(
      { error: "Choose an occasion, budget, and valid enquiry source." },
      400,
    );

  try {
    const { rows } = await (await getPool()).query(
      `insert into public.enquiries
        (name, company, phone, email, occasion, units, budget,
         products, customisations, gift_message, source, status)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'New')
       returning *`,
      [
        String(body.name).trim(), String(body.company).trim(), phone,
        String(body.email).trim(), String(body.occasion), units,
        String(body.budget),
        Array.isArray(body.products) ? body.products.map(String) : [],
        Array.isArray(body.customisations) ? body.customisations.map(String) : [],
        String(body.giftMessage ?? body.message ?? ""), body.source,
      ],
    );
    const data = rows[0];
    if (!data) throw new Error("PostgreSQL returned no inserted enquiry.");
    return enquiryResponse(asEnquiry(data), 201);
  } catch (error) {
    console.error("Could not save enquiry", error);
    const response = failure(
      "We could not save your enquiry. Please try again.",
      error,
    );
    Object.entries(ENQUIRY_CORS_HEADERS).forEach(([name, value]) =>
      response.headers.set(name, value),
    );
    return response;
  }
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: ENQUIRY_CORS_HEADERS,
  });
}

export async function GET(request: NextRequest) {
  try {
    if (!isAdmin(request)) return unauthorized();
    const { rows } = await (await getPool()).query(
      "select * from public.enquiries order by created_at desc",
    );
    return NextResponse.json(rows.map(asEnquiry), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("Configure ADMIN_SESSION_SECRET") ||
        error.message.includes("DATABASE_URL must be configured"))
    )
      return NextResponse.json({ error: error.message }, { status: 500 });
    console.error("Could not load enquiries", error);
    return failure("Could not load enquiries.", error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!isAdmin(request)) return unauthorized();
    const body = await request.json().catch(() => null);
    if (!body?.id || !STATUSES.includes(body.status))
      return NextResponse.json(
        { error: "A valid enquiry ID and status are required." },
        { status: 400 },
      );
    const { rows } = await (await getPool()).query(
      "update public.enquiries set status = $1 where id = $2 returning *",
      [body.status, String(body.id)],
    );
    const data = rows[0];
    if (!data)
      return NextResponse.json(
        { error: "Enquiry not found." },
        { status: 404 },
      );
    return NextResponse.json(asEnquiry(data));
  } catch (error) {
    console.error("Could not update enquiry", error);
    return failure("Could not update the enquiry.", error);
  }
}
