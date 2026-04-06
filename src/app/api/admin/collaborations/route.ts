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
    const collabs = await prisma.collaboration.findMany({
      orderBy: { order: "asc" },
      include: { category: true }
    });
    return NextResponse.json(collabs);
  } catch (err: any) {
    console.error("GET Collaborations Error:", err);
    return NextResponse.json({ error: "Failed to fetch collaborations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { name, imageUrl, description, href, categoryId, isGlobal, order } = body;
    
    if (!name || !imageUrl) {
      return NextResponse.json({ error: "Partner name and logo are required" }, { status: 400 });
    }

    const item = await prisma.collaboration.create({
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
    console.error("POST Collaboration Error:", err);
    return NextResponse.json({ error: err.message || "Error creating partnership" }, { status: 500 });
  }
}
