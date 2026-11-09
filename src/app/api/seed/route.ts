import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { VendorModel } from '@/models/Vendor';
import { EnquiryModel } from '@/models/Enquiry';
import { INITIAL_VENDORS, INITIAL_ENQUIRIES } from '@/lib/mockData';

export async function GET() {
  return seedDatabase();
}

export async function POST() {
  return seedDatabase();
}

async function seedDatabase() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({
        success: false,
        message:
          'MongoDB Atlas URI is not configured yet in .env.local (MONGODB_URI). Using high-fidelity mock state.',
      });
    }

    // Seed Vendors
    await VendorModel.deleteMany({});
    await VendorModel.insertMany(INITIAL_VENDORS);

    // Seed Enquiries
    await EnquiryModel.deleteMany({});
    await EnquiryModel.insertMany(INITIAL_ENQUIRIES);

    return NextResponse.json({
      success: true,
      message: '✨ Successfully seeded MongoDB Atlas with initial vendors, packages, and enquiries!',
      vendorsSeeded: INITIAL_VENDORS.length,
      enquiriesSeeded: INITIAL_ENQUIRIES.length,
    });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Seeding failed' },
      { status: 500 }
    );
  }
}
