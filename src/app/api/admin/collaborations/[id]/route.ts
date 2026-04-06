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
    const body = await req.json();
    const { name, imageUrl, description, href, categoryId, isGlobal, order } = body;

    const item = await prisma.collaboration.update({
      where: { id: params.id },
      data: {
        name,
        imageUrl,
        description: description || null,
        href: href || null,
        categoryId: categoryId || null,
        isGlobal: isGlobal ?? true,
        order: Number(order) || 0
      }
    });

    return NextResponse.json(item);
  } catch (err: any) {
    console.error("PUT Collaboration Error:", err);
    return NextResponse.json({ error: err.message || "Error updating partnership" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const item = await prisma.collaboration.delete({ where: { id: params.id } });
    return NextResponse.json(item);
  } catch (err: any) {
    console.error("DELETE Collaboration Error:", err);
    return NextResponse.json({ error: err.message || "Error deleting partnership" }, { status: 500 });
  }
}
