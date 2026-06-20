import { NextRequest, NextResponse } from 'next/server';
import { otpStore } from '../send-otp/route';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and OTP are required',
        },
        { status: 400 }
      );
    }

    const storedOtpData = otpStore.get(email);

    if (!storedOtpData) {
      return NextResponse.json(
        {
          success: false,
          message: 'OTP not found or expired',
        },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete(email);
      return NextResponse.json(
        {
          success: false,
          message: 'OTP has expired',
        },
        { status: 400 }
      );
    }

    if (storedOtpData.otp !== otp) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid OTP',
        },
        { status: 400 }
      );
    }

    otpStore.delete(email);

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to verify OTP',
      },
      { status: 500 }
    );
  }
}
