import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { EnquiryModel } from '@/models/Enquiry';
import { INITIAL_ENQUIRIES } from '@/lib/mockData';
import { Enquiry } from '@/types';

// In-memory runtime enquiries cache
let inMemoryEnquiries: Enquiry[] = [...INITIAL_ENQUIRIES];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
    const phone = searchParams.get('phone');

    const db = await connectToDatabase();
    let enquiries: Enquiry[] = [];

    if (db) {
      const query: any = {};
      if (vendorId) query.vendorId = vendorId;
      if (phone) query.customerPhone = phone;

      enquiries = (await EnquiryModel.find(query).sort({ createdAt: -1 }).lean()) as unknown as Enquiry[];
      if (enquiries.length === 0 && !vendorId && !phone) {
        enquiries = inMemoryEnquiries;
      }
    } else {
      enquiries = inMemoryEnquiries.filter((item) => {
        if (vendorId && item.vendorId !== vendorId) return false;
        if (phone && item.customerPhone !== phone) return false;
        return true;
      });
    }

    return NextResponse.json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error: any) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.customerPhone || !body.customerName || !body.vendorId) {
      return NextResponse.json(
        { success: false, error: 'Customer name, phone number, and vendor are required' },
        { status: 400 }
      );
    }

    const newEnquiry: Enquiry = {
      id: `enq-${Date.now()}`,
      vendorId: body.vendorId,
      vendorName: body.vendorName || 'Selected Vendor',
      vendorCategory: body.vendorCategory || 'General',
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || '',
      eventType: body.eventType || 'Wedding Ceremony',
      eventDate: body.eventDate || new Date().toISOString().split('T')[0],
      guestCount: Number(body.guestCount) || 250,
      budget: Number(body.budget) || 100000,
      city: body.city || 'India',
      notes: body.notes || '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const db = await connectToDatabase();
    if (db) {
      await EnquiryModel.create(newEnquiry);
    }

    inMemoryEnquiries.unshift(newEnquiry);

    return NextResponse.json({
      success: true,
      message: 'Booking enquiry submitted successfully! The vendor will call or message your phone.',
      data: newEnquiry,
    });
  } catch (error: any) {
    console.error('Error submitting enquiry:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, quotedPrice } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Enquiry id and status are required' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    if (db) {
      await EnquiryModel.updateOne(
        { id },
        { $set: { status, ...(quotedPrice ? { quotedPrice } : {}) } }
      );
    }

    const idx = inMemoryEnquiries.findIndex((e) => e.id === id);
    if (idx !== -1) {
      inMemoryEnquiries[idx].status = status;
      if (quotedPrice) {
        inMemoryEnquiries[idx].quotedPrice = quotedPrice;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Enquiry updated to ${status}`,
      data: inMemoryEnquiries[idx],
    });
  } catch (error: any) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update enquiry' },
      { status: 500 }
    );
  }
}
