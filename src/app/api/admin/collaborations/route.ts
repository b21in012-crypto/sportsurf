import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

async function checkAdmin() {
  const token = (await cookies()).get("admin_token")?.value;
  return token ? verifyAdminToken(token) : false;
}

export async function GET() {
  try {
    const collabs = await (prisma as any).collaboration.findMany({
      orderBy: { order: "asc" }
    });
    return NextResponse.json(collabs);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch collaborations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { name, imageUrl, description, href, categoryId, isGlobal, order } = await req.json();
    const item = await (prisma as any).collaboration.create({
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
    return NextResponse.json({ error: err.message || "Error creating" }, { status: 500 });
  }
}
