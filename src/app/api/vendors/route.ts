import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { VendorModel } from '@/models/Vendor';
import { INITIAL_VENDORS } from '@/lib/mockData';
import { Vendor } from '@/types';

// In-memory runtime cache for serverless environments when MongoDB URI is pending
let inMemoryVendors: Vendor[] = [...INITIAL_VENDORS];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const search = searchParams.get('search')?.toLowerCase();
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null;
    const event = searchParams.get('event');

    const db = await connectToDatabase();
    let vendors: Vendor[] = [];

    if (db) {
      const query: any = {};
      if (category && category !== 'All') query.category = category;
      if (city) query.city = new RegExp(city, 'i');
      if (state) query.state = new RegExp(state, 'i');
      if (minPrice !== null || maxPrice !== null) {
        query.startingPrice = {};
        if (minPrice !== null) query.startingPrice.$gte = minPrice;
        if (maxPrice !== null) query.startingPrice.$lte = maxPrice;
      }
      if (event) query.supportedEvents = event;
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { businessName: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
          { city: new RegExp(search, 'i') },
        ];
      }

      vendors = (await VendorModel.find(query).lean()) as unknown as Vendor[];
      if (vendors.length === 0 && !search && !category) {
        // If DB is empty, use inMemoryVendors
        vendors = inMemoryVendors;
      }
    } else {
      vendors = inMemoryVendors.filter((v) => {
        if (category && category !== 'All' && v.category !== category) return false;
        if (city && !v.city.toLowerCase().includes(city.toLowerCase())) return false;
        if (state && !v.state.toLowerCase().includes(state.toLowerCase())) return false;
        if (minPrice !== null && v.startingPrice < minPrice) return false;
        if (maxPrice !== null && v.startingPrice > maxPrice) return false;
        if (event && !v.supportedEvents.includes(event as any)) return false;
        if (search) {
          const matched =
            v.name.toLowerCase().includes(search) ||
            v.businessName.toLowerCase().includes(search) ||
            v.city.toLowerCase().includes(search) ||
            v.category.toLowerCase().includes(search) ||
            v.description.toLowerCase().includes(search);
          if (!matched) return false;
        }
        return true;
      });
    }

    return NextResponse.json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (error: any) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newVendor: Vendor = {
      ...body,
      id: body.id || `v-${Date.now()}`,
      rating: body.rating || 5.0,
      reviewCount: body.reviewCount || 1,
      isVerified: true,
      reviews: body.reviews || [],
      packages: body.packages || [],
      supportedEvents: body.supportedEvents || ['Wedding Ceremony'],
    };

    const db = await connectToDatabase();
    if (db) {
      await VendorModel.create(newVendor);
    }

    inMemoryVendors.unshift(newVendor);

    return NextResponse.json({
      success: true,
      message: 'Vendor registered successfully in Vivah Marketplace!',
      data: newVendor,
    });
  } catch (error: any) {
    console.error('Error adding vendor:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create vendor' },
      { status: 500 }
    );
  }
}
