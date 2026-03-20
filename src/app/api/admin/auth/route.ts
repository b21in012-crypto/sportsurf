export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, generateAdminToken } from "@/lib/admin-auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (!password) return NextResponse.json({ error: "Password required" }, { status: 400 });

  if (verifyAdminPassword(password)) {
    const token = generateAdminToken();
    (await cookies()).set("admin_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}

export async function DELETE() {
  (await cookies()).delete("admin_token");
  return NextResponse.json({ success: true });
}

