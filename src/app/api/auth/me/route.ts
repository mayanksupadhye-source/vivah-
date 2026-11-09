import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { UserModel } from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const decoded = getUserFromRequest(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const db = await connectToDatabase();
    if (db) {
      const user = await UserModel.findOne({ id: decoded.id }).select('-password').lean();
      if (user) {
        return NextResponse.json({ success: true, data: user });
      }
    }

    return NextResponse.json({ success: true, data: decoded });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch user session' },
      { status: 500 }
    );
  }
}
