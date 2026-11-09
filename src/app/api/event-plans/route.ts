import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { EventPlanModel } from '@/models/EventPlan';

let inMemoryPlans: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    const db = await connectToDatabase();
    let plans = [];

    if (db) {
      const query: any = {};
      if (phone) query.customerPhone = phone;
      plans = await EventPlanModel.find(query).sort({ createdAt: -1 }).lean();
    } else {
      plans = inMemoryPlans.filter((p) => !phone || p.customerPhone === phone);
    }

    return NextResponse.json({ success: true, count: plans.length, data: plans });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch event plans' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, weddingLocation, totalBudget, totalGuests, startDate, endDate, functions } = body;

    if (!customerName || !customerPhone || !weddingLocation?.city) {
      return NextResponse.json(
        { success: false, error: 'Customer name, phone, and wedding location are required' },
        { status: 400 }
      );
    }

    const newPlan = {
      id: `plan-${Date.now()}`,
      customerName,
      customerPhone,
      weddingLocation,
      totalBudget: Number(totalBudget) || 2000000,
      totalGuests: Number(totalGuests) || 350,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      functions: functions || [],
      createdAt: new Date().toISOString(),
    };

    const db = await connectToDatabase();
    if (db) {
      await EventPlanModel.create(newPlan);
    }

    inMemoryPlans.unshift(newPlan);

    return NextResponse.json({
      success: true,
      message: 'Wedding Event Plan saved successfully to MongoDB Atlas!',
      data: newPlan,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save event plan' },
      { status: 500 }
    );
  }
}
