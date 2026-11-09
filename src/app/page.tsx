'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Search,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Star,
  CheckCircle2,
  ChevronRight,
  HeartHandshake,
  BadgePercent,
  SlidersHorizontal,
  Flame,
  ArrowRight,
  Music,
  Camera,
  Utensils,
  Palette,
  Flower2,
  Car,
  Scroll,
  Gift,
  Coins,
} from 'lucide-react';
import { INITIAL_VENDORS } from '@/lib/mockData';
import { VendorCategory, WeddingEvent } from '@/types';

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<string>('Wedding Ceremony');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Budget Calculator state
  const [calcGuests, setCalcGuests] = useState<number>(350);
  const [calcDays, setCalcDays] = useState<number>(2);
  const [calcIncludeDecor, setCalcIncludeDecor] = useState<boolean>(true);
  const [calcIncludePhoto, setCalcIncludePhoto] = useState<boolean>(true);
  const [calcIncludeCatering, setCalcIncludeCatering] = useState<boolean>(true);
  const [calcIncludeDJ, setCalcIncludeDJ] = useState<boolean>(true);

  // Quick live calculated budget
  const cateringCost = calcIncludeCatering ? calcGuests * 1650 * (calcDays > 1 ? 1.6 : 1) : 0;
  const decorCost = calcIncludeDecor ? 175000 * calcDays : 0;
  const photoCost = calcIncludePhoto ? 95000 * calcDays : 0;
  const djCost = calcIncludeDJ ? 50000 : 0;
  const totalEstimatedCost = Math.round(cateringCost + decorCost + photoCost + djCost);

  const categories = [
    {
      name: 'Decoration & Setup',
      icon: Flower2,
      count: '340+ Vendors',
      desc: 'Mandaps, floral arches, entrance pathways & ambient palace lighting',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Photography & Media',
      icon: Camera,
      count: '280+ Studios',
      desc: 'Candid wedding stories, 4K cinematic teasers, aerial drone & pre-weddings',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Food & Catering',
      icon: Utensils,
      count: '190+ Caterers',
      desc: 'Royal Awadhi, Marwari, South Indian feasts, live chaat & artisan dessert bars',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Beauty & Personal Care',
      icon: Palette,
      count: '420+ Artists',
      desc: 'HD Airbrush bridal glam, organic Sojat mehendi & celebrity styling',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Entertainment & Music',
      icon: Music,
      count: '160+ Troupes',
      desc: 'High-octane Sangeet DJs, live Punjabi Dhol, Sufi bands & interactive emcees',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Rituals & Ceremonies',
      icon: Flame,
      count: '95+ Acharyas',
      desc: 'Vedic pandits, authenticated havan samagri & bilingual vow ceremonies',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Wedding Logistics',
      icon: Car,
      count: '80+ Providers',
      desc: 'Vintage Baraat convertibles, guest coaches, AC tents & valet operations',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Invitations & Gifts',
      icon: Gift,
      count: '120+ Designers',
      desc: 'Velvet laser-cut invitation boxes, video invites & handcrafted trousseau',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const weddingEventsList = [
    'Engagement',
    'Haldi',
    'Mehendi',
    'Sangeet',
    'Wedding Ceremony',
    'Varmala',
    'Reception',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF9]">
      {/* HERO SECTION */}
      <section className="relative bg-royal-mesh text-white pt-16 pb-24 md:pt-24 md:pb-36 overflow-hidden border-b-4 border-amber-500/80">
        {/* Decorative ambient glowing orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-rose-600/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top royal pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-300/40 text-amber-200 text-xs sm:text-sm font-semibold tracking-wide mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Discover. Compare. Negotiate. Celebrate.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Plan Your Dream Wedding with Verified Local Providers
          </h1>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-rose-100 max-w-2xl mx-auto font-light leading-relaxed">
            Eliminate traditional event planner markups. Connect directly with independent caterers, decorators, photographers, and makeup artists across every function.
          </p>

          {/* MAIN DISCOVERY SEARCH CONSOLE */}
          <div className="mt-10 max-w-4xl mx-auto bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-amber-300 text-stone-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Location Selector */}
              <div className="text-left border-b sm:border-b-0 sm:border-r border-stone-200 pb-3 sm:pb-0 sm:pr-4">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-700" /> Wedding Location
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full text-sm font-semibold text-stone-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="">All Regions (India)</option>
                  <option value="Udaipur">Udaipur, Rajasthan</option>
                  <option value="Jaipur">Jaipur, Rajasthan</option>
                  <option value="Mumbai">Mumbai, Maharashtra</option>
                  <option value="New Delhi">New Delhi &amp; NCR</option>
                  <option value="Pune">Pune, Maharashtra</option>
                  <option value="Bengaluru">Bengaluru, Karnataka</option>
                  <option value="Ahmedabad">Ahmedabad, Gujarat</option>
                </select>
              </div>

              {/* Ceremony Selector */}
              <div className="text-left border-b sm:border-b-0 sm:border-r border-stone-200 pb-3 sm:pb-0 sm:pr-4">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" /> Wedding Ceremony
                </label>
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full text-sm font-semibold text-stone-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  {weddingEventsList.map((evt) => (
                    <option key={evt} value={evt}>
                      {evt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Category */}
              <div className="text-left">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" /> Required Service
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-sm font-semibold text-stone-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="">All Wedding Services</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Action CTA */}
            <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-stone-500">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Verified Profiles
                </span>
                <span>&bull;</span>
                <span>Direct WhatsApp &amp; Phone Inquiries</span>
              </div>
              <Link
                href={`/vendors?city=${encodeURIComponent(selectedCity)}&event=${encodeURIComponent(
                  selectedEvent
                )}&category=${encodeURIComponent(selectedCategory)}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all"
              >
                <Search className="w-4 h-4 text-amber-300" />
                <span>Search Local Vendors</span>
              </Link>
            </div>
          </div>

          {/* Quick stats banner */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <span className="block text-2xl sm:text-3xl font-serif font-black text-amber-300">1,500+</span>
              <span className="text-xs text-rose-200">Verified Vendors</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <span className="block text-2xl sm:text-3xl font-serif font-black text-amber-300">₹0</span>
              <span className="text-xs text-rose-200">Hidden Middleman Fees</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <span className="block text-2xl sm:text-3xl font-serif font-black text-amber-300">4.92 ★</span>
              <span className="text-xs text-rose-200">Average Client Rating</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <span className="block text-2xl sm:text-3xl font-serif font-black text-amber-300">28+</span>
              <span className="text-xs text-rose-200">Cities &amp; Talukas Covered</span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE WEDDING CATEGORIES GRID */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-rose-700" /> Full Category Coverage
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-rose-950 tracking-tight">
            Every Wedding Service in One Marketplace
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            From the sacred Saptapadi vows and Haldi marigolds to the late-night Sangeet DJ bass drops, find trusted specialists for each ritual.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/vendors?category=${encodeURIComponent(cat.name)}`}
                className="group relative rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-stone-800 text-[11px] font-bold">
                    {cat.count}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/90 flex items-center justify-center text-white shadow-md">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-serif font-bold text-white group-hover:text-amber-200 transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between bg-stone-50/50">
                  <p className="text-xs text-stone-600 leading-relaxed mb-3">
                    {cat.desc}
                  </p>
                  <div className="flex items-center text-xs font-bold text-rose-800 group-hover:text-amber-700">
                    <span>Explore Specialists</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED VERIFIED VENDORS */}
      <section className="py-16 bg-gradient-to-b from-stone-50 via-rose-50/30 to-stone-50 border-y border-amber-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-amber-700 tracking-widest uppercase flex items-center gap-1.5 mb-2">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> Handpicked Verified Masters
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-rose-950">
                Trending Wedding Providers
              </h2>
              <p className="text-stone-600 text-sm mt-1">
                Top rated by hundreds of families with genuine reviews and transparent service packages.
              </p>
            </div>
            <Link
              href="/vendors"
              className="inline-flex items-center gap-2 text-sm font-bold text-rose-800 hover:text-rose-950 transition-colors"
            >
              <span>View All 1,500+ Vendors</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {INITIAL_VENDORS.slice(0, 6).map((vendor) => (
              <div
                key={vendor.id}
                className="rounded-3xl bg-white border border-stone-200/80 shadow-md hover:shadow-2xl hover:border-amber-400 transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Image header */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={vendor.coverImage}
                    alt={vendor.businessName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-black/20" />

                  {/* Verification pill */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600/95 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1 shadow-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Verified Partner</span>
                  </div>

                  {/* Location badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-medium bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-md">
                    <MapPin className="w-3.5 h-3.5 text-amber-300" />
                    <span>
                      {vendor.city}, {vendor.state}
                    </span>
                  </div>

                  {/* Rating badge */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-amber-400 text-amber-950 px-2.5 py-1 rounded-full font-bold text-xs shadow-md">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{vendor.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-amber-900">({vendor.reviewCount})</span>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-semibold text-rose-800 uppercase tracking-wider mb-1">
                      {vendor.category}
                    </div>
                    <h3 className="text-lg font-serif font-bold text-stone-900 group-hover:text-rose-900 transition-colors">
                      {vendor.businessName}
                    </h3>
                    <p className="text-xs text-stone-500 italic mt-0.5 mb-3 line-clamp-1">
                      &quot;{vendor.tagline}&quot;
                    </p>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {vendor.description}
                    </p>

                    {/* Tags */}
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

                  {/* Pricing and Action */}
                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-stone-400 block font-medium">Starting from</span>
                      <span className="text-lg font-bold text-stone-900">
                        ₹{vendor.startingPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-stone-500 ml-1 font-normal">/{vendor.priceUnit}</span>
                    </div>

                    <Link
                      href={`/vendors/${vendor.id}`}
                      className="px-4 py-2 rounded-xl bg-rose-50 text-rose-800 hover:bg-rose-800 hover:text-white border border-rose-200 text-xs font-bold transition-all duration-200"
                    >
                      View Packages
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE WEDDING BUDGET ESTIMATOR WIDGET */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-rose-950 via-stone-900 to-amber-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border-2 border-amber-400/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left information */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
                <Coins className="w-3.5 h-3.5" /> Instant Smart Calculator
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight leading-snug">
                Estimate Your Multi-Day Wedding Budget in Seconds
              </h2>
              <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed">
                Take the guesswork out of wedding expenses. Adjust your guest count, number of event days, and required service categories to preview realistic market quotations from verified local vendors.
              </p>

              {/* Slider 1: Guests */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-stone-300 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-400" /> Expected Guests:
                  </span>
                  <span className="text-amber-300 font-bold text-base">{calcGuests} People</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="50"
                  value={calcGuests}
                  onChange={(e) => setCalcGuests(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Slider 2: Days */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-stone-300 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-400" /> Wedding Duration:
                  </span>
                  <span className="text-amber-300 font-bold text-base">{calcDays} Day{calcDays > 1 ? 's' : ''}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={calcDays}
                  onChange={(e) => setCalcDays(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={calcIncludeCatering}
                    onChange={(e) => setCalcIncludeCatering(e.target.checked)}
                    className="accent-amber-400 rounded"
                  />
                  <span>Royal Catering Spread</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={calcIncludeDecor}
                    onChange={(e) => setCalcIncludeDecor(e.target.checked)}
                    className="accent-amber-400 rounded"
                  />
                  <span>Mandap &amp; Floral Decor</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={calcIncludePhoto}
                    onChange={(e) => setCalcIncludePhoto(e.target.checked)}
                    className="accent-amber-400 rounded"
                  />
                  <span>4K Photo &amp; Cinema</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={calcIncludeDJ}
                    onChange={(e) => setCalcIncludeDJ(e.target.checked)}
                    className="accent-amber-400 rounded"
                  />
                  <span>Sangeet DJ &amp; Sound</span>
                </label>
              </div>
            </div>

            {/* Right Result Card */}
            <div className="lg:col-span-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-amber-300/40 text-center flex flex-col justify-between h-full space-y-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-amber-300 block mb-1">
                  Estimated Average Investment
                </span>
                <div className="text-4xl sm:text-5xl font-serif font-black text-white text-gold-gradient">
                  ₹{totalEstimatedCost.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-rose-200/80 mt-2">
                  Based on current market averages for {calcGuests} guests over {calcDays} celebration day{calcDays > 1 ? 's' : ''}.
                </p>
              </div>

              {/* Service cost breakdown pill */}
              <div className="space-y-2 text-left bg-black/30 rounded-xl p-4 text-xs">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-stone-300">Catering &amp; Live Counters:</span>
                  <span className="font-bold text-amber-300">₹{cateringCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-stone-300">Floral Decor &amp; Mandaps:</span>
                  <span className="font-bold text-amber-300">₹{decorCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-stone-300">Photography, Films &amp; Drone:</span>
                  <span className="font-bold text-amber-300">₹{photoCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-300">Sangeet DJ &amp; Audio:</span>
                  <span className="font-bold text-amber-300">₹{djCost.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/planner"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-sm shadow-md transition-all text-center"
                >
                  Create Custom Plan
                </Link>
                <Link
                  href="/vendors"
                  className="flex-1 py-3 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm transition-all text-center border border-white/20"
                >
                  Browse Packages
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW VIVAH WORKS 4-STEP BLUEPRINT */}
      <section className="py-20 bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-widest block mb-2">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-rose-950">
              How the Vivah Marketplace Works
            </h2>
            <p className="mt-3 text-stone-600 text-sm sm:text-base">
              Say goodbye to juggling dozens of separate phone calls and unverified recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm relative group hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-lg mb-4">
                01
              </div>
              <h3 className="text-base font-serif font-bold text-stone-900 mb-2">
                Specify Location &amp; Dates
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Enter your state, district, taluka, and target wedding dates to activate location-based proximity filtering.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm relative group hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-4">
                02
              </div>
              <h3 className="text-base font-serif font-bold text-stone-900 mb-2">
                Configure Functions
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Add Haldi, Mehendi, Sangeet, Wedding Ceremony, and Reception with customized services for each event.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm relative group hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-lg mb-4">
                03
              </div>
              <h3 className="text-base font-serif font-bold text-stone-900 mb-2">
                Compare Transparent Quotes
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Review verified portfolios, high-resolution past wedding galleries, client testimonials, and tiered pricing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm relative group hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-4">
                04
              </div>
              <h3 className="text-base font-serif font-bold text-stone-900 mb-2">
                Negotiate &amp; Book Direct
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Send booking enquiries, adjust package requirements in the Deal Room, and connect on phone or WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="py-16 bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/20">
            <HeartHandshake className="w-4 h-4" /> Are You a Professional Wedding Service Provider?
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight">
            Grow Your Wedding Bookings on Vivah
          </h2>
          <p className="text-sm sm:text-base text-rose-100 max-w-xl mx-auto font-light leading-relaxed">
            Register your business, list your packages, showcase your portfolio, and receive genuine booking requests directly from families in your district.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/dashboard?role=vendor"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm shadow-xl transition-all"
            >
              Register as Wedding Vendor
            </Link>
            <Link
              href="/planner"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/20 transition-all"
            >
              Open Wedding Event Planner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
