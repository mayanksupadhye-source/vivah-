import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, password } = body;

    if ((!email && !phone) || !password) {
      return NextResponse.json(
        { success: false, error: 'Provide either email or phone along with password' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (db) {
      const query: any = {};
      if (email) query.email = email.toLowerCase();
      else if (phone) query.phone = phone;

      const user = await UserModel.findOne(query);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Invalid credentials or user not registered' },
          { status: 401 }
        );
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const token = signToken({
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        name: user.name,
      });

      return NextResponse.json({
        success: true,
        message: 'Welcome back to Vivah Marketplace!',
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

    // Offline mock demo login
    const demoUser = {
      id: 'usr-demo-1',
      name: 'Mayank Upadhye',
      email: email || 'mayank@example.com',
      phone: phone || '+91 98200 12345',
      role: 'customer' as const,
      city: 'Udaipur',
      state: 'Rajasthan',
    };

    const token = signToken(demoUser);

    return NextResponse.json({
      success: true,
      message: 'Demo login successful!',
      token,
      data: demoUser,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to authenticate' },
      { status: 500 }
    );
  }
}
