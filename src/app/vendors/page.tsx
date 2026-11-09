'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Filter,
  SlidersHorizontal,
  PhoneCall,
  Calendar,
  X,
  CheckCircle2,
  ChevronRight,
  Map,
  Grid,
  Send,
  Sparkles,
} from 'lucide-react';
import { INITIAL_VENDORS } from '@/lib/mockData';
import { Vendor, VendorCategory, WeddingEvent } from '@/types';

function VendorsDirectoryContent() {
  const searchParams = useSearchParams();

  // Search & Filters state initialized from URL query params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'All'
  );
  const [selectedCity, setSelectedCity] = useState<string>(
    searchParams.get('city') || 'All'
  );
  const [selectedEvent, setSelectedEvent] = useState<string>(
    searchParams.get('event') || 'All'
  );
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'priceAsc' | 'priceDesc' | 'experience'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Quick Enquiry Modal state
  const [enquiryModalVendor, setEnquiryModalVendor] = useState<Vendor | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEventDate, setCustomerEventDate] = useState('');
  const [customerEventType, setCustomerEventType] = useState<WeddingEvent>('Wedding Ceremony');
  const [customerBudget, setCustomerBudget] = useState('150000');
  const [customerNotes, setCustomerNotes] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'All',
    'Decoration & Setup',
    'Photography & Media',
    'Food & Catering',
    'Beauty & Personal Care',
    'Entertainment & Music',
    'Wedding Logistics',
    'Rituals & Ceremonies',
    'Invitations & Gifts',
  ];

  const cities = ['All', 'Udaipur', 'Jaipur', 'Mumbai', 'New Delhi', 'Pune', 'Bengaluru', 'Ahmedabad'];

  const weddingEvents: ('All' | WeddingEvent)[] = [
    'All',
    'Engagement',
    'Haldi',
    'Mehendi',
    'Sangeet',
    'Wedding Ceremony',
    'Reception',
  ];

  // Filtered & Sorted Vendors
  const filteredVendors = useMemo(() => {
    return INITIAL_VENDORS.filter((v) => {
      if (selectedCategory !== 'All' && v.category !== selectedCategory) return false;
      if (selectedCity !== 'All' && !v.city.toLowerCase().includes(selectedCity.toLowerCase())) return false;
      if (selectedEvent !== 'All' && !v.supportedEvents.includes(selectedEvent as WeddingEvent)) return false;
      if (onlyVerified && !v.isVerified) return false;
      if (v.startingPrice > maxPrice) return false;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matches =
          v.businessName.toLowerCase().includes(query) ||
          v.name.toLowerCase().includes(query) ||
          v.description.toLowerCase().includes(query) ||
          v.subcategories.some((s) => s.toLowerCase().includes(query)) ||
          v.city.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'priceAsc') return a.startingPrice - b.startingPrice;
      if (sortBy === 'priceDesc') return b.startingPrice - a.startingPrice;
      if (sortBy === 'experience') return b.yearsOfExperience - a.yearsOfExperience;
      return 0;
    });
  }, [selectedCategory, selectedCity, selectedEvent, onlyVerified, maxPrice, searchTerm, sortBy]);

  // Submit Enquiry Handler
  const handleQuickEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone || !customerName || !enquiryModalVendor) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: enquiryModalVendor.id,
          vendorName: enquiryModalVendor.businessName,
          vendorCategory: enquiryModalVendor.category,
          customerName,
          customerPhone,
          eventType: customerEventType,
          eventDate: customerEventDate || '2026-12-15',
          budget: Number(customerBudget) || 100000,
          city: enquiryModalVendor.city,
          notes: customerNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEnquirySuccess(true);
        setTimeout(() => {
          setEnquirySuccess(false);
          setEnquiryModalVendor(null);
          setCustomerName('');
          setCustomerPhone('');
          setCustomerNotes('');
        }, 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <Link href="/" className="hover:text-rose-900">Home</Link>
            <span>/</span>
            <span className="text-rose-900 font-semibold">Vendor Discovery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-rose-950">
            Wedding Service Specialists Directory
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            Discover {filteredVendors.length} verified vendors across Rajasthan, Maharashtra, Delhi NCR, and beyond.
          </p>
        </div>

        {/* TOP FILTER BAR */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200 mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search vendor, mandap, photo, DJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-800/20"
              />
            </div>

            {/* Category Select */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-800/20"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Service Categories' : c}
                  </option>
                ))}
              </select>
            </div>

            {/* City Select */}
            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-800/20"
              >
                {cities.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct === 'All' ? 'All Locations (India)' : ct}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Select */}
            <div>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-800/20"
              >
                {weddingEvents.map((evt) => (
                  <option key={evt} value={evt}>
                    {evt === 'All' ? 'All Ceremonies' : evt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SECONDARY CONTROLS (Price, Verified, Sorting, View Mode) */}
          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4 text-xs">
            {/* Price slider */}
            <div className="flex items-center gap-3">
              <span className="text-stone-500 font-semibold whitespace-nowrap">
                Max Price: <strong className="text-stone-900">₹{maxPrice.toLocaleString('en-IN')}</strong>
              </span>
              <input
                type="range"
                min="5000"
                max="600000"
                step="10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-rose-800 w-28 sm:w-40"
              />
            </div>

            {/* Verified toggle */}
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="accent-emerald-600 rounded"
              />
              <span className="flex items-center gap-1 text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Partners Only
              </span>
            </label>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-stone-100 border-none font-bold text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="rating">Top Rated (★)</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="experience">Years of Experience</option>
              </select>
            </div>

            {/* Grid / Map toggle */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg flex items-center gap-1 transition-all ${
                  viewMode === 'grid' ? 'bg-white text-rose-900 shadow-xs font-bold' : 'text-stone-500'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-lg flex items-center gap-1 transition-all ${
                  viewMode === 'map' ? 'bg-white text-rose-900 shadow-xs font-bold' : 'text-stone-500'
                }`}
              >
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline">Map View</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAP VIEW SIMULATION */}
        {viewMode === 'map' && (
          <div className="mb-10 bg-gradient-to-br from-amber-50 to-stone-100 rounded-3xl p-6 border-2 border-dashed border-amber-300 relative overflow-hidden text-center">
            <div className="max-w-md mx-auto py-8">
              <MapPin className="w-12 h-12 text-rose-700 mx-auto mb-3 animate-bounce" />
              <h3 className="text-xl font-serif font-bold text-rose-950 mb-1">
                Geospatial &amp; Distance Discovery Mode
              </h3>
              <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                Visualizing vendor clusters across Rajasthan, Delhi NCR, and Maharashtra. Powered by OpenStreetMap / PostGIS distance sorting.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-rose-900 border border-amber-200">
                  Udaipur: 12 Vendors (0-15 km radius)
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-rose-900 border border-amber-200">
                  Jaipur: 18 Vendors (0-25 km radius)
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-rose-900 border border-amber-200">
                  Mumbai: 24 Vendors (0-30 km radius)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* VENDORS GRID */}
        {filteredVendors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
            <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="text-xl font-serif font-bold text-stone-800">No wedding specialists matched your filter</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Try adjusting your max price budget or selecting &apos;All Service Categories&apos;.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedCity('All');
                setSelectedEvent('All');
                setMaxPrice(600000);
                setSearchTerm('');
              }}
              className="mt-4 px-5 py-2.5 bg-rose-800 text-white text-xs font-bold rounded-xl"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="rounded-3xl bg-white border border-stone-200/80 shadow-md hover:shadow-2xl hover:border-amber-400 transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={vendor.coverImage}
                    alt={vendor.businessName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-black/20" />

                  {vendor.isVerified && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600/95 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1 shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Verified</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-medium bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-md">
                    <MapPin className="w-3.5 h-3.5 text-amber-300" />
                    <span>
                      {vendor.city}, {vendor.state}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-amber-400 text-amber-950 px-2.5 py-1 rounded-full font-bold text-xs shadow-md">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{vendor.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-amber-900">({vendor.reviewCount})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                        {vendor.category}
                      </span>
                      <span className="text-[11px] text-stone-500 font-medium">
                        {vendor.yearsOfExperience} yrs experience
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-stone-900 group-hover:text-rose-900 transition-colors">
                      {vendor.businessName}
                    </h3>
                    <p className="text-xs text-stone-500 italic mt-0.5 mb-2 line-clamp-1">
                      &quot;{vendor.tagline}&quot;
                    </p>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {vendor.description}
                    </p>

                    {/* Subcategories tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {vendor.subcategories.slice(0, 3).map((sub) => (
                        <span
                          key={sub}
                          className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Pricing */}
                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-medium">Starts from</span>
                      <span className="text-lg font-bold text-stone-900">
                        ₹{vendor.startingPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-stone-500 ml-1">/{vendor.priceUnit}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEnquiryModalVendor(vendor)}
                        className="p-2 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 transition-colors"
                        title="Send Fast Enquiry"
                      >
                        <PhoneCall className="w-4 h-4 text-amber-700" />
                      </button>

                      <Link
                        href={`/vendors/${vendor.id}`}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-white font-bold text-xs shadow-sm transition-all"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QUICK ENQUIRY POPUP MODAL */}
      {enquiryModalVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-amber-300 relative">
            <button
              onClick={() => setEnquiryModalVendor(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            {enquirySuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
                <h3 className="text-2xl font-serif font-black text-rose-950">
                  Enquiry Successfully Sent!
                </h3>
                <p className="text-xs text-stone-600 max-w-xs mx-auto">
                  <strong>{enquiryModalVendor.businessName}</strong> has received your phone number ({customerPhone}) and will contact you directly with tailored quotations.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuickEnquiry} className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
                    Direct Booking Enquiry
                  </span>
                  <h3 className="text-xl font-serif font-black text-stone-900">
                    Contact {enquiryModalVendor.businessName}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Location: {enquiryModalVendor.city} &bull; Starting at ₹{enquiryModalVendor.startingPrice.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Your WhatsApp / Phone Number (For Vendor to Call You) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Ceremony Type
                      </label>
                      <select
                        value={customerEventType}
                        onChange={(e: any) => setCustomerEventType(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none"
                      >
                        <option value="Wedding Ceremony">Wedding Ceremony</option>
                        <option value="Sangeet">Sangeet</option>
                        <option value="Mehendi">Mehendi</option>
                        <option value="Haldi">Haldi</option>
                        <option value="Engagement">Engagement</option>
                        <option value="Reception">Reception</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Target Date
                      </label>
                      <input
                        type="date"
                        value={customerEventDate}
                        onChange={(e) => setCustomerEventDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Budget Range (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="150000"
                      value={customerBudget}
                      onChange={(e) => setCustomerBudget(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Special Requirements / Message
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Lotus mandap, 400 guests, need setup completed by 4 PM"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>{isSubmitting ? 'Sending Enquiry...' : 'Submit Booking Enquiry'}</span>
                  </button>
                  <p className="text-[11px] text-stone-400 text-center mt-2">
                    Stored securely in Vivah MongoDB database. No spam guaranteed.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function VendorsDirectoryPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen py-20 text-center text-stone-500 font-serif">Loading Wedding Specialists Directory...</div>}>
      <VendorsDirectoryContent />
    </React.Suspense>
  );
}
