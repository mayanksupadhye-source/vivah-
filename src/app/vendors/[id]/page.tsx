'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  Star,
  ShieldCheck,
  MapPin,
  PhoneCall,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ChevronLeft,
  Share2,
  Heart,
  Send,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';
import { INITIAL_VENDORS } from '@/lib/mockData';
import { Vendor, ServicePackage, WeddingEvent } from '@/types';

export default function VendorProfilePage() {
  const params = useParams();
  const vendorId = params?.id as string;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [eventType, setEventType] = useState<WeddingEvent>('Wedding Ceremony');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('350');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    // Find vendor from mock or fetch from /api/vendors/[id]
    const found = INITIAL_VENDORS.find((v) => v.id === vendorId);
    if (found) {
      setVendor(found);
      if (found.packages.length > 0) {
        setSelectedPackage(found.packages[0]);
        setBudget(found.packages[0].price.toString());
      }
    }
  }, [vendorId]);

  if (!vendor) {
    return (
      <div className="min-h-screen py-24 text-center bg-[#FFFDF9]">
        <h2 className="text-2xl font-serif font-bold text-stone-800">Loading Vendor Details...</h2>
        <Link href="/vendors" className="mt-4 inline-block text-sm text-rose-800 font-bold underline">
          Back to Directory
        </Link>
      </div>
    );
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: vendor.id,
          vendorName: vendor.businessName,
          vendorCategory: vendor.category,
          customerName,
          customerPhone,
          customerEmail,
          eventType,
          eventDate: eventDate || '2026-12-15',
          guestCount: Number(guestCount) || 300,
          budget: Number(budget) || vendor.startingPrice,
          city: vendor.city,
          notes: `${selectedPackage ? `Package: ${selectedPackage.name}. ` : ''}${notes}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${vendor.businessName}! I saw your profile on Vivah Marketplace and would like to inquire about availability for my ${eventType} on ${eventDate || 'upcoming wedding dates'}.`
  );

  return (
    <div className="bg-[#FFFDF9] min-h-screen pb-20">
      {/* Top Navigation */}
      <div className="bg-white border-b border-stone-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-stone-600">
          <Link href="/vendors" className="flex items-center gap-1 font-semibold text-rose-900 hover:underline">
            <ChevronLeft className="w-4 h-4" /> Back to Vendor Directory
          </Link>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:text-stone-900">
              <Share2 className="w-3.5 h-3.5" /> Share Profile
            </button>
            <button className="flex items-center gap-1 hover:text-rose-700 text-rose-800 font-semibold">
              <Heart className="w-3.5 h-3.5" /> Save to Shortlist
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* VENDOR HEADER CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold uppercase tracking-wider">
                  {vendor.category}
                </span>
                {vendor.isVerified && (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Vivah Verified Partner
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" /> {vendor.yearsOfExperience} Years of Excellence
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-black text-rose-950">
                {vendor.businessName}
              </h1>

              <p className="text-sm font-medium text-amber-800 italic">
                &quot;{vendor.tagline}&quot;
              </p>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-stone-600">
                <span className="flex items-center gap-1 font-semibold text-stone-800">
                  <MapPin className="w-4 h-4 text-rose-700" />
                  {vendor.locality ? `${vendor.locality}, ` : ''}{vendor.city}, {vendor.district}, {vendor.state}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  {vendor.phone}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  {vendor.email}
                </span>
              </div>
            </div>

            {/* Quick Ratings & Price callout */}
            <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-stone-100">
              <div className="flex items-center gap-1.5 bg-amber-400 text-amber-950 px-3.5 py-1.5 rounded-2xl font-black text-sm shadow-sm mb-2">
                <Star className="w-4 h-4 fill-current" />
                <span>{vendor.rating.toFixed(2)}</span>
                <span className="text-xs font-normal">({vendor.reviewCount} Reviews)</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-400 block font-medium">Starting from</span>
                <span className="text-2xl font-serif font-black text-rose-950">
                  ₹{vendor.startingPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-stone-500 block">/{vendor.priceUnit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PHOTO GALLERY SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="md:col-span-3 relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-md">
            <Image
              src={vendor.gallery[activeImageIndex] || vendor.coverImage}
              alt={vendor.businessName}
              fill
              className="object-cover transition-all duration-300"
            />
          </div>
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {vendor.gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative h-20 md:h-28 w-28 md:w-full rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                  activeImageIndex === idx ? 'border-amber-500 scale-102 shadow-md' : 'border-transparent opacity-75'
                }`}
              >
                <Image src={img} alt="thumbnail" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* MAIN TWO-COLUMN BODY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN: Overview, Packages, Reviews */}
          <div className="lg:col-span-7 space-y-10">
            {/* About / Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-4">
              <h2 className="text-xl font-serif font-bold text-rose-950">About {vendor.businessName}</h2>
              <p className="text-sm text-stone-700 leading-relaxed">
                {vendor.description}
              </p>

              {/* Supported Ceremonies */}
              <div className="pt-4 border-t border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Ceremonies Covered
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.supportedEvents.map((evt) => (
                    <span
                      key={evt}
                      className="px-3 py-1 rounded-xl bg-rose-50 text-rose-900 border border-rose-200 text-xs font-semibold"
                    >
                      {evt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* PACKAGES ACCORDION / TABS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
                  Transparent Deliverables
                </span>
                <h2 className="text-2xl font-serif font-black text-rose-950">
                  Service Packages &amp; Pricing
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Select a package to populate your custom booking request or negotiate modifications in the Deal Room.
                </p>
              </div>

              <div className="space-y-4">
                {vendor.packages.map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setBudget(pkg.price.toString());
                      }}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/40 shadow-md'
                          : 'border-stone-200 hover:border-amber-300 bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-serif font-bold text-stone-900">
                              {pkg.name}
                            </h3>
                            {pkg.isPopular && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-700 text-white text-[10px] font-bold">
                                Most Popular
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5">{pkg.description}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-xl font-serif font-black text-rose-950 block">
                            ₹{pkg.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-stone-400 font-medium">Fixed Transparent Price</span>
                        </div>
                      </div>

                      {/* Deliverables list */}
                      <ul className="space-y-1.5 pt-3 border-t border-stone-100 text-xs text-stone-700">
                        {pkg.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 pt-3 flex justify-end">
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                            isSelected
                              ? 'bg-amber-500 text-stone-950'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {isSelected ? '✓ Selected for Booking' : 'Select Package'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* VERIFIED CLIENT REVIEWS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif font-bold text-rose-950">Verified Family Reviews</h2>
                  <p className="text-xs text-stone-500">Real feedback from completed wedding bookings on Vivah</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-xl">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{vendor.rating.toFixed(1)} / 5.0</span>
                </div>
              </div>

              <div className="space-y-4">
                {vendor.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-stone-900 block">{rev.customerName}</span>
                        <span className="text-stone-500">{rev.event} &bull; {rev.date}</span>
                      </div>
                      <div className="flex text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 italic leading-relaxed">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY INSTANT BOOKING & ENQUIRY WIDGET */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-300 space-y-6">
              {submittedSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
                  <h3 className="text-2xl font-serif font-black text-rose-950">
                    Booking Request Sent!
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Thank you <strong>{customerName}</strong>! Your inquiry for <strong>{vendor.businessName}</strong> has been registered in the Vivah MongoDB database.
                  </p>
                  <p className="text-xs text-stone-500">
                    The vendor will reach out to your phone number <strong>{customerPhone}</strong> within 2 hours.
                  </p>
                  <Link
                    href="/dashboard"
                    className="inline-block mt-2 px-6 py-2.5 rounded-xl bg-rose-800 text-white font-bold text-xs"
                  >
                    View in Customer Dashboard
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-rose-800 uppercase tracking-widest block">
                      Direct Vendor Inquiry
                    </span>
                    <h3 className="text-xl font-serif font-black text-stone-900">
                      Reserve Date or Request Quote
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      No commitment required. Speak directly with the provider.
                    </p>
                  </div>

                  {/* Selected package badge */}
                  {selectedPackage && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs flex justify-between items-center">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-800 block">Selected Package</span>
                        <strong className="text-stone-900">{selectedPackage.name}</strong>
                      </div>
                      <span className="font-bold text-rose-900">₹{selectedPackage.price.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Meera Kapoor"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800/20"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Your Phone Number (Backend MongoDB Storage) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98200 12345"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800/20"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Your Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="meera@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">
                          Ceremony
                        </label>
                        <select
                          value={eventType}
                          onChange={(e: any) => setEventType(e.target.value)}
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
                          Event Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">
                          Guests Count
                        </label>
                        <input
                          type="number"
                          placeholder="350"
                          value={guestCount}
                          onChange={(e) => setGuestCount(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">
                          Budget (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="150000"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Specific Requirements / Notes
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Mention colors, venue location, timing, or special requests..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4 text-amber-300" />
                      <span>{isSubmitting ? 'Sending Request...' : 'Send Booking Enquiry'}</span>
                    </button>

                    <a
                      href={`https://wa.me/919829014523?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp Directly</span>
                    </a>
                  </div>

                  <div className="pt-2 text-[11px] text-stone-400 text-center flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Zero spam. Your phone number is only shared with this vendor.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
