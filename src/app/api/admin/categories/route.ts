export const dynamic = "force-dynamic";

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
    const categories = await prisma.category.findMany({ 
      include: { subCategories: true }, 
      orderBy: { order: "asc" } 
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { 
      label, order, description, icon, iconSvg, navbarIconUrl, imageUrl, href,
      collabTitle, collabSubtitle, collabDescription, collabCtaText, collabCtaLink 
    } = await req.json();
    const item = await prisma.category.create({
      data: {
        label,
        description,
        icon,
        iconSvg,
        navbarIconUrl,
        href,
        order: parseInt(order) || 0,
        imageUrl,
        collabTitle,
        collabSubtitle,
        collabDescription,
        collabCtaText,
        collabCtaLink
      }
    });
    return NextResponse.json(item);
  } catch (err: any) {
    return new NextResponse(err.message || "Error creating", { status: 500 });
  }
}

