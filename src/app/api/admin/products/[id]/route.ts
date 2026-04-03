import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

async function checkAdmin() {
  const token = (await cookies()).get("admin_token")?.value;
  return token ? verifyAdminToken(token) : false;
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
     const data = await req.json();
     const product = await prisma.product.update({ where: { id: params.id }, data });
     return NextResponse.json(product);
  } catch (err: any) {
     console.error("Product update error:", err);
     return NextResponse.json({ error: err.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
     await prisma.product.delete({ where: { id: params.id } });
     return NextResponse.json({ success: true });
  } catch (err: any) {
     console.error("Product delete error:", err);
     return NextResponse.json({ error: err.message || "Failed to delete product" }, { status: 500 });
  }
}
