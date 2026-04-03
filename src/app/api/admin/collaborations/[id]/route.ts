import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

async function checkAdmin() {
  const token = (await cookies()).get("admin_token")?.value;
  return token ? verifyAdminToken(token) : false;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await req.json();
    const { name, imageUrl, description, href, categoryId, isGlobal, order } = data;
    const item = await (prisma as any).collaboration.update({
      where: { id: params.id },
      data: {
        name,
        imageUrl,
        description,
        href,
        categoryId: categoryId || null,
        isGlobal: isGlobal ?? true,
        order: parseInt(order) || 0
      }
    });
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error updating" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const item = await (prisma as any).collaboration.delete({ where: { id: params.id } });
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error deleting" }, { status: 500 });
  }
}
