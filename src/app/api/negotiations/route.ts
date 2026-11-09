import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { NegotiationModel } from '@/models/Negotiation';

let inMemoryNegotiations: any[] = [
  {
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
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const enquiryId = searchParams.get('enquiryId');
    const phone = searchParams.get('phone');

    const db = await connectToDatabase();
    let threads = [];

    if (db) {
      const query: any = {};
      if (enquiryId) query.enquiryId = enquiryId;
      if (phone) query.customerPhone = phone;
      threads = await NegotiationModel.find(query).sort({ createdAt: -1 }).lean();
      if (threads.length === 0 && !enquiryId && !phone) {
        threads = inMemoryNegotiations;
      }
    } else {
      threads = inMemoryNegotiations.filter((n) => {
        if (enquiryId && n.enquiryId !== enquiryId) return false;
        if (phone && n.customerPhone !== phone) return false;
        return true;
      });
    }

    return NextResponse.json({ success: true, count: threads.length, data: threads });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch negotiations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { enquiryId, vendorId, vendorName, customerName, customerPhone, originalPrice } = body;

    const newThread = {
      id: `neg-${Date.now()}`,
      enquiryId: enquiryId || `enq-${Date.now()}`,
      vendorId: vendorId || 'v-101',
      vendorName: vendorName || 'Selected Vendor',
      customerName: customerName || 'Customer',
      customerPhone: customerPhone || '+91 98000 00000',
      originalPrice: Number(originalPrice) || 100000,
      currentOffer: Number(originalPrice) || 100000,
      isLocked: false,
      messages: body.initialMessage
        ? [
            {
              id: `msg-${Date.now()}`,
              sender: 'customer',
              text: body.initialMessage,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]
        : [],
      createdAt: new Date().toISOString(),
    };

    const db = await connectToDatabase();
    if (db) {
      await NegotiationModel.create(newThread);
    }

    inMemoryNegotiations.unshift(newThread);

    return NextResponse.json({
      success: true,
      message: 'Deal Room negotiation thread created!',
      data: newThread,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create negotiation' },
      { status: 500 }
    );
  }
}
