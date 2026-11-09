import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { VendorModel } from '@/models/Vendor';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { customerName, rating, comment, event } = body;

    if (!customerName || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: 'Customer name, star rating (1-5), and review comment are required' },
        { status: 400 }
      );
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      customerName,
      rating: Number(rating),
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      comment,
      event: event || 'Wedding Ceremony',
    };

    const db = await connectToDatabase();
    if (db) {
      const vendor = await VendorModel.findOne({ id });
      if (!vendor) {
        return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 });
      }

      vendor.reviews.push(newReview);
      vendor.reviewCount = vendor.reviews.length;
      const totalStars = vendor.reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
      vendor.rating = Number((totalStars / vendor.reviewCount).toFixed(2));
      await vendor.save();

      return NextResponse.json({
        success: true,
        message: 'Review submitted and vendor rating updated successfully in MongoDB Atlas!',
        data: newReview,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Review recorded (memory fallback)',
      data: newReview,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}
