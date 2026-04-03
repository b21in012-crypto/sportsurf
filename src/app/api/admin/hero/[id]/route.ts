import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

async function checkAdmin() {
  const token = (await cookies()).get("admin_token")?.value;
  return token ? verifyAdminToken(token) : false;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
     const data = await req.json();
     const hero = await prisma.heroSection.update({ where: { id: params.id }, data });
     return NextResponse.json(hero);
  } catch (err: any) {
     console.error("Hero update error:", err);
     return NextResponse.json({ error: err.message || "Failed to update hero section" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
     await prisma.heroSection.delete({ where: { id: params.id } });
     return NextResponse.json({ success: true });
  } catch (err: any) {
     console.error("Hero delete error:", err);
     return NextResponse.json({ error: err.message || "Failed to delete hero section" }, { status: 500 });
  }
}
