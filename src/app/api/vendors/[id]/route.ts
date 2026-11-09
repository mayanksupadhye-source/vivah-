import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { VendorModel } from '@/models/Vendor';
import { INITIAL_VENDORS } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const db = await connectToDatabase();
    let vendor = null;

    if (db) {
      vendor = (await VendorModel.findOne({ id }).lean()) as unknown as any;
    }

    if (!vendor) {
      vendor = INITIAL_VENDORS.find((v) => v.id === id);
    }

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: vendor,
    });
  } catch (error: any) {
    console.error('Error fetching vendor by id:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch vendor' },
      { status: 500 }
    );
  }
}
