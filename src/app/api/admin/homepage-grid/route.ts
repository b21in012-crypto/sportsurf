export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

async function checkAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token || !verifyAdminToken(token)) {
    throw new Error("Unauthorized");
  }
}

export async function GET() {
  try {
    const items = await prisma.homepageGridItem.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (err: any) {
    return new NextResponse(err.message || "Error fetching", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await checkAdmin();
    const { label, description, imageUrl, href, order } = await req.json();
    const item = await prisma.homepageGridItem.create({
      data: {
        label,
        description,
        imageUrl,
        href,
        order: parseInt(order) || 0,
      }
    });
    return NextResponse.json(item);
  } catch (err: any) {
    return new NextResponse(err.message || "Error creating", { status: 500 });
  }
}

