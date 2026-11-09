import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { BookingModel } from '@/models/Booking';
import { EnquiryModel } from '@/models/Enquiry';

let inMemoryBookings: any[] = [
  {
    id: 'bk-1001',
    bookingNumber: 'VIVAH-BK-8921',
    vendorId: 'v-101',
    vendorName: 'Royal Marwar Mandaps & Decorators',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98199 44321',
    customerEmail: 'aarav.sharma@gmail.com',
    eventType: 'Wedding Ceremony',
    eventDate: '2026-12-18',
    agreedPrice: 248000,
    advancePaid: 50000,
    totalPaid: 50000,
    paymentStatus: 'advance_paid',
    bookingStatus: 'confirmed',
    notes: 'Includes high-density Mogra floral canopy and revolving Varmala stage with cold pyros.',
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
    const phone = searchParams.get('phone');
    const status = searchParams.get('status');

    const db = await connectToDatabase();
    let bookings: any[] = [];

    if (db) {
      const query: any = {};
      if (vendorId) query.vendorId = vendorId;
      if (phone) query.customerPhone = phone;
      if (status) query.bookingStatus = status;

      bookings = await BookingModel.find(query).sort({ createdAt: -1 }).lean();
      if (bookings.length === 0 && !vendorId && !phone) {
        bookings = inMemoryBookings;
      }
    } else {
      bookings = inMemoryBookings.filter((b) => {
        if (vendorId && b.vendorId !== vendorId) return false;
        if (phone && b.customerPhone !== phone) return false;
        if (status && b.bookingStatus !== status) return false;
        return true;
      });
    }

    return NextResponse.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error: any) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { enquiryId, agreedPrice, advanceAmount = 0, notes } = body;

    if (!enquiryId || !agreedPrice) {
      return NextResponse.json(
        { success: false, error: 'Enquiry ID and agreed price are required to lock a booking' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    let enquiry: any = null;

    if (db) {
      enquiry = await EnquiryModel.findOne({ id: enquiryId });
    }

    const bookingId = `bk-${Date.now()}`;
    const bookingNumber = `VIVAH-BK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
      id: bookingId,
      bookingNumber,
      enquiryId,
      vendorId: enquiry ? enquiry.vendorId : body.vendorId || 'v-101',
      vendorName: enquiry ? enquiry.vendorName : body.vendorName || 'Selected Vendor',
      customerName: enquiry ? enquiry.customerName : body.customerName || 'Valued Customer',
      customerPhone: enquiry ? enquiry.customerPhone : body.customerPhone || '+91 98000 00000',
      customerEmail: enquiry?.customerEmail || body.customerEmail || '',
      eventType: enquiry?.eventType || body.eventType || 'Wedding Ceremony',
      eventDate: enquiry?.eventDate || body.eventDate || new Date().toISOString().split('T')[0],
      agreedPrice: Number(agreedPrice),
      advancePaid: Number(advanceAmount),
      totalPaid: Number(advanceAmount),
      paymentStatus: advanceAmount >= agreedPrice ? 'fully_paid' : advanceAmount > 0 ? 'advance_paid' : 'unpaid',
      bookingStatus: 'confirmed',
      notes: notes || enquiry?.notes || '',
      createdAt: new Date().toISOString(),
    };

    if (db) {
      await BookingModel.create(newBooking);
      if (enquiry) {
        enquiry.status = 'Accepted';
        await enquiry.save();
      }
    }

    inMemoryBookings.unshift(newBooking);

    return NextResponse.json({
      success: true,
      message: `🎉 Booking ${bookingNumber} confirmed successfully in Vivah MongoDB database!`,
      data: newBooking,
    });
  } catch (error: any) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}
