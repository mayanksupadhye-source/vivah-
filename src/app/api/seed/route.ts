import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { VendorModel } from '@/models/Vendor';
import { EnquiryModel } from '@/models/Enquiry';
import { UserModel } from '@/models/User';
import { BookingModel } from '@/models/Booking';
import { NegotiationModel } from '@/models/Negotiation';
import { INITIAL_VENDORS, INITIAL_ENQUIRIES } from '@/lib/mockData';
import bcrypt from 'bcryptjs';

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

    // 1. Seed Vendors
    await VendorModel.deleteMany({});
    await VendorModel.insertMany(INITIAL_VENDORS);

    // 2. Seed Enquiries
    await EnquiryModel.deleteMany({});
    await EnquiryModel.insertMany(INITIAL_ENQUIRIES);

    // 3. Seed Demo Users
    await UserModel.deleteMany({});
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Vivah@2026', salt);

    await UserModel.insertMany([
      {
        id: 'usr-admin-1',
        name: 'Mayank Upadhye (Platform Admin)',
        email: 'admin@vivahmarketplace.com',
        phone: '+91 98200 99999',
        password: hashedPassword,
        role: 'admin',
        city: 'Udaipur',
        state: 'Rajasthan',
        isActive: true,
      },
      {
        id: 'usr-vendor-1',
        name: 'Rajesh Sharma (Royal Marwar)',
        email: 'contact@royalmarwarweddings.com',
        phone: '+91 98290 14523',
        password: hashedPassword,
        role: 'vendor',
        vendorId: 'v-101',
        city: 'Udaipur',
        state: 'Rajasthan',
        isActive: true,
      },
      {
        id: 'usr-cust-1',
        name: 'Aarav Malhotra',
        email: 'aarav.malhotra@gmail.com',
        phone: '+91 98199 44321',
        password: hashedPassword,
        role: 'customer',
        city: 'Mumbai',
        state: 'Maharashtra',
        isActive: true,
      },
    ]);

    // 4. Seed Confirmed Bookings
    await BookingModel.deleteMany({});
    await BookingModel.create({
      id: 'bk-1001',
      bookingNumber: 'VIVAH-BK-8921',
      enquiryId: 'enq-901',
      vendorId: 'v-101',
      vendorName: 'Royal Marwar Mandaps & Decorators',
      customerName: 'Aarav Malhotra',
      customerPhone: '+91 98199 44321',
      customerEmail: 'aarav.malhotra@gmail.com',
      eventType: 'Wedding Ceremony',
      eventDate: '2026-12-18',
      agreedPrice: 248000,
      advancePaid: 50000,
      totalPaid: 50000,
      paymentStatus: 'advance_paid',
      bookingStatus: 'confirmed',
      notes: 'Includes high-density Mogra floral canopy and revolving Varmala stage with cold pyros.',
      createdAt: new Date(),
    });

    // 5. Seed Negotiation Thread
    await NegotiationModel.deleteMany({});
    await NegotiationModel.create({
      id: 'neg-101',
      enquiryId: 'enq-901',
      vendorId: 'v-101',
      vendorName: 'Royal Marwar Mandaps & Decorators',
      customerName: 'Aarav Malhotra',
      customerPhone: '+91 98199 44321',
      originalPrice: 275000,
      currentOffer: 248000,
      isLocked: false,
      messages: [
        {
          id: 'msg-1',
          sender: 'customer',
          text: 'Namaste Rajesh ji! We loved your Royal Heritage Gold Mandap package for our lakeside wedding at Fateh Garh, Udaipur on Dec 18. Could we customize the floral backdrop to include more white Mogra and marigolds?',
          time: '10:30 AM',
        },
        {
          id: 'msg-2',
          sender: 'vendor',
          text: 'Pranam Aarav ji! Yes, we can certainly do a high-density fresh Mogra canopy with brass urlis. Our standard quotation for this setup with the revolving Varmala stage is ₹2,75,000.',
          offerPrice: 275000,
          time: '10:45 AM',
        },
        {
          id: 'msg-3',
          sender: 'customer',
          text: 'Our target decor budget for this function is ₹2,40,000. If we confirm advance payment today via Vivah, could you adjust the quotation to ₹2,45,000?',
          offerPrice: 245000,
          time: '11:15 AM',
        },
        {
          id: 'msg-4',
          sender: 'vendor',
          text: 'We respect your family celebration and want to make it memorable. We can agree to ₹2,48,000 if we include the Cold Spark Pyros as a complimentary blessing for the Varmala entry!',
          offerPrice: 248000,
          time: '11:30 AM',
        },
      ],
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: '✨ Successfully seeded MongoDB Atlas with Vendors, Users, Enquiries, Bookings, and Deal Room threads!',
      vendorsSeeded: INITIAL_VENDORS.length,
      enquiriesSeeded: INITIAL_ENQUIRIES.length,
      usersSeeded: 3,
      bookingsSeeded: 1,
    });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Seeding failed' },
      { status: 500 }
    );
  }
}
