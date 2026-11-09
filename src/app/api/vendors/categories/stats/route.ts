import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { VendorModel } from '@/models/Vendor';
import { INITIAL_VENDORS } from '@/lib/mockData';

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const stats = await VendorModel.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            avgStartingPrice: { $avg: '$startingPrice' },
            avgRating: { $avg: '$rating' },
          },
        },
        { $sort: { count: -1 } },
      ]);

      if (stats.length > 0) {
        return NextResponse.json({ success: true, data: stats });
      }
    }

    // Fallback aggregation on INITIAL_VENDORS
    const map: Record<string, { count: number; totalPrice: number; totalRating: number }> = {};
    INITIAL_VENDORS.forEach((v) => {
      if (!map[v.category]) {
        map[v.category] = { count: 0, totalPrice: 0, totalRating: 0 };
      }
      map[v.category].count += 1;
      map[v.category].totalPrice += v.startingPrice;
      map[v.category].totalRating += v.rating;
    });

    const fallbackStats = Object.entries(map).map(([category, info]) => ({
      _id: category,
      count: info.count,
      avgStartingPrice: Math.round(info.totalPrice / info.count),
      avgRating: Number((info.totalRating / info.count).toFixed(2)),
    }));

    return NextResponse.json({ success: true, data: fallbackStats });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch category statistics' },
      { status: 500 }
    );
  }
}
