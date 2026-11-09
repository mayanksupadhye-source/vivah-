import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { NegotiationModel } from '@/models/Negotiation';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const db = await connectToDatabase();
    let thread = null;

    if (db) {
      thread = await NegotiationModel.findOne({
        $or: [{ id }, { enquiryId: id }],
      }).lean();
    }

    if (!thread) {
      return NextResponse.json(
        { success: false, error: 'Negotiation thread not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: thread });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch thread' },
      { status: 500 }
    );
  }
}

// POST message / counter-offer
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { sender = 'customer', text, offerPrice } = body;

    if (!text && !offerPrice) {
      return NextResponse.json(
        { success: false, error: 'Message text or counter offer price is required' },
        { status: 400 }
      );
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender,
      text: text || `Proposed revised quotation of ₹${Number(offerPrice).toLocaleString('en-IN')}`,
      offerPrice: offerPrice ? Number(offerPrice) : undefined,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const db = await connectToDatabase();
    if (db) {
      const thread = await NegotiationModel.findOne({
        $or: [{ id }, { enquiryId: id }],
      });

      if (!thread) {
        return NextResponse.json({ success: false, error: 'Thread not found' }, { status: 404 });
      }

      if (thread.isLocked) {
        return NextResponse.json(
          { success: false, error: 'This deal has already been locked and confirmed' },
          { status: 400 }
        );
      }

      thread.messages.push(newMsg);
      if (offerPrice) {
        thread.currentOffer = Number(offerPrice);
      }
      await thread.save();

      return NextResponse.json({
        success: true,
        message: 'Message sent to vendor in Deal Room',
        data: thread,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent (memory fallback)',
      data: newMsg,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to post message' },
      { status: 500 }
    );
  }
}

// PATCH lock deal
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { agreedPrice } = body;

    const db = await connectToDatabase();
    if (db) {
      const thread = await NegotiationModel.findOne({
        $or: [{ id }, { enquiryId: id }],
      });

      if (!thread) {
        return NextResponse.json({ success: false, error: 'Thread not found' }, { status: 404 });
      }

      thread.isLocked = true;
      thread.agreedPrice = Number(agreedPrice) || thread.currentOffer;
      await thread.save();

      return NextResponse.json({
        success: true,
        message: '🎉 Deal locked and terms confirmed!',
        data: thread,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Deal locked (memory fallback)',
      data: { id, isLocked: true, agreedPrice },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to lock deal' },
      { status: 500 }
    );
  }
}
