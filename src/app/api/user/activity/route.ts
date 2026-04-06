import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const activity = await prisma.contactRequest.findMany({
      where: {
        email: session.user.email
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10
    });

    return NextResponse.json({
      activity,
      stats: {
        activeQuotes: activity.length,
        siteVisits: activity.filter(a => a.message.toLowerCase().includes("site visit") || a.status === "confirmed").length,
        serviceRequests: 0 // Placeholder for now unless we have a separate model
      }
    });
  } catch (err: any) {
    return new NextResponse(err.message || "Error fetching activity", { status: 500 });
  }
}
