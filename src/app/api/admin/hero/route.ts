export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

async function checkAdmin() {
  const token = (await cookies()).get("admin_token")?.value;
  return token ? verifyAdminToken(token) : false;
}

export async function GET() {
  const heroes = await prisma.heroSection.findMany();
  return NextResponse.json(heroes);
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
     const data = await req.json();
     const hero = await prisma.heroSection.create({ data });
     return NextResponse.json(hero);
  } catch (err: any) {
     console.error("Hero create error:", err);
     return NextResponse.json({ error: err.message || "Failed to create hero section" }, { status: 500 });
  }
}

