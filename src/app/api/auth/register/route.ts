import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password, role = 'customer', city, state } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, phone, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const userId = `usr-${Date.now()}`;

    if (db) {
      // Check existing user by email or phone
      const existing = await UserModel.findOne({
        $or: [{ email: email.toLowerCase() }, { phone }],
      });

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'User with this email or phone number already exists' },
          { status: 409 }
        );
      }

      const user = await UserModel.create({
        id: userId,
        name,
        email: email.toLowerCase(),
        phone,
        password, // Pre-save hook hashes it
        role,
        city,
        state,
        isActive: true,
      });

      const token = signToken({
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        name: user.name,
      });

      return NextResponse.json({
        success: true,
        message: 'Account registered successfully in Vivah Marketplace!',
        token,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          city: user.city,
          state: user.state,
        },
      });
    }

    // Memory fallback when MongoDB Atlas URI is pending
    const token = signToken({
      id: userId,
      email: email.toLowerCase(),
      phone,
      role: role as any,
      name,
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully (local session)!',
      token,
      data: { id: userId, name, email, phone, role, city, state },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to register account' },
      { status: 500 }
    );
  }
}
