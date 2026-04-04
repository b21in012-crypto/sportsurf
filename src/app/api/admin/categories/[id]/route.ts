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
    const { 
      label, order, description, icon, iconSvg, navbarIconUrl, imageUrl, videoUrl, href,
      heroTag, ctaText, ctaLink, cta2Text, cta2Link, backgroundColor,
      imageUrl2, imageLabel2, imageUrl3, imageLabel3,
      collabTitle, collabSubtitle, collabDescription, collabCtaText, collabCtaLink 
    } = await req.json();
    const item = await prisma.category.update({
      where: { id: params.id },
      data: {
        label,
        description,
        icon,
        iconSvg,
        navbarIconUrl,
        href,
        order: parseInt(order) || 0,
        imageUrl,
        videoUrl,
        heroTag,
        ctaText,
        ctaLink,
        cta2Text,
        cta2Link,
        backgroundColor,
        imageUrl2,
        imageLabel2,
        imageUrl3,
        imageLabel3,
        collabTitle,
        collabSubtitle,
        collabDescription,
        collabCtaText,
        collabCtaLink
      }
    });
    return NextResponse.json(item);
  } catch (err: any) {
    return new NextResponse(err.message || "Error updating", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const cat = await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json(cat);
  } catch (err: any) {
    return new NextResponse(err.message || "Error deleting", { status: 500 });
  }
}
