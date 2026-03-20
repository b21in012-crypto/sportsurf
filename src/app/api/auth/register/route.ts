export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, otp } = await req.json();

    if (!name || !email || !password || !otp) {
      return new NextResponse("Missing required fields (including OTP)", { status: 400 });
    }

    // 1. Verify OTP
    const dbOtp = await prisma.otp.findUnique({
      where: { email }
    });

    if (!dbOtp || dbOtp.code !== otp) {
      return new NextResponse("Invalid verification code", { status: 400 });
    }

    const now = new Date();
    if (dbOtp.expiresAt < now) {
      return new NextResponse("Verification code expired", { status: 400 });
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return new NextResponse("User already exists with this email", { status: 409 });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
        emailVerified: new Date()
      }
    });

    // 4. Clean up OTP from DB
    await prisma.otp.delete({ where: { email } });

    console.log("👤 New User Registered:", user.id);

    return NextResponse.json({ success: true, id: user.id });
  } catch (err: any) {
    return new NextResponse(err.message || "Something went wrong", { status: 500 });
  }
}

