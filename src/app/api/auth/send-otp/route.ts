import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Email is required',
        },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(email, { otp, expiresAt });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Email Verification OTP',
      html: `<h2>Your OTP is: <strong>${otp}</strong></h2><p>This OTP will expire in 10 minutes.</p>`,
    });

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Error sending OTP:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send OTP',
      },
      { status: 500 }
    );
  }
}

export { otpStore };
