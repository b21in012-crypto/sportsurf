export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

async function checkAdmin() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token || !verifyAdminToken(token)) {
    throw new Error("Unauthorized");
  }
}

export async function GET() {
  const items = await prisma.tickerUpdate.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  try {
    await checkAdmin();
    const { text, order } = await req.json();
    const item = await prisma.tickerUpdate.create({ data: { text, order: parseInt(order) || 0 } });
    return NextResponse.json(item);
  } catch (err: any) {
    return new NextResponse(err.message || "Error creating", { status: 500 });
  }
}

