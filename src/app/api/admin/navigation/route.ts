export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

async function checkAdmin() {
  const token = (await cookies()).get("admin_token")?.value;
  return token ? verifyAdminToken(token) : false;
}

// GET all nav items
export async function GET() {
  const items = await prisma.navigationItem.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

// POST new nav item
export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const item = await prisma.navigationItem.create({ data });
  return NextResponse.json(item);
}

