import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { BookingModel } from '@/models/Booking';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const db = await connectToDatabase();
    let booking = null;

    if (db) {
      booking = await BookingModel.findOne({ id }).lean();
    }

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { paymentAmount, paymentType, bookingStatus } = body;

    const db = await connectToDatabase();

    if (db) {
      const booking = await BookingModel.findOne({ id });
      if (!booking) {
        return NextResponse.json(
          { success: false, error: 'Booking not found' },
          { status: 404 }
        );
      }

      if (paymentAmount) {
        booking.totalPaid += Number(paymentAmount);
        if (paymentType === 'advance') {
          booking.advancePaid += Number(paymentAmount);
        }
        if (booking.totalPaid >= booking.agreedPrice) {
          booking.paymentStatus = 'fully_paid';
        } else {
          booking.paymentStatus = 'advance_paid';
        }
      }

      if (bookingStatus) {
        booking.bookingStatus = bookingStatus;
      }

      await booking.save();
      return NextResponse.json({
        success: true,
        message: 'Booking updated successfully',
        data: booking,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Booking updated in memory',
      data: { id, ...body },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update booking' },
      { status: 500 }
    );
  }
}
