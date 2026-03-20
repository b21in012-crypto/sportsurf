export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true, // Use SSL for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    // Upsert OTP in DB (Create or Update if already exists)
    await prisma.otp.upsert({
      where: { email },
      update: { code, expiresAt },
      create: { email, code, expiresAt }
    });

    // Send Email
    await transporter.sendMail({
      from: `"SPORTSURF Verification" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `[SPORTSURF] Verification Code: ${code}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 500px; border: 1px solid #e5e7eb; rounded-lg: 8px;">
          <h2 style="color: #6366f1; text-align: center;">SPORTSURF</h2>
          <p>Hello,</p>
          <p>You requested a verification code to create an account with SPORTSURF.</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #111827; background: #f3f4f6; padding: 10px 20px; border-radius: 6px; border: 1px solid #d1d5db;">
              ${code}
            </span>
          </div>
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            This code will expire in 10 minutes. If you didn't request this, please ignore this email.
          </p>
        </div>
      `
    });

    return NextResponse.json({ success: true, message: "OTP Sent successfully" });
  } catch (err: any) {
    console.error("❌ Send OTP Error Details:", err);
    return new NextResponse(err.message || "Failed to send OTP", { status: 500 });
  }
}

