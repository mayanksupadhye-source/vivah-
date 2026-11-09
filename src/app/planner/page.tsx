'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Users,
  Coins,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Flower2,
  Camera,
  Utensils,
  Palette,
  Music,
  Flame,
  Car,
  Gift,
  ArrowRight,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { INITIAL_VENDORS } from '@/lib/mockData';
import { WeddingEvent } from '@/types';

interface EventConfig {
  name: WeddingEvent;
  selected: boolean;
  date: string;
  guests: number;
  services: string[];
}

export default function PlannerPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Basics
  const [city, setCity] = useState('Udaipur');
  const [state, setState] = useState('Rajasthan');
  const [days, setDays] = useState(3);
  const [totalGuests, setTotalGuests] = useState(400);
  const [targetBudget, setTargetBudget] = useState(2500000);
  const [startDate, setStartDate] = useState('2026-12-18');

  // Step 2 & 3: Events configuration
  const [events, setEvents] = useState<EventConfig[]>([
    {
      name: 'Engagement',
      selected: true,
      date: '2026-12-17',
      guests: 200,
      services: ['Decoration & Setup', 'Photography & Media', 'Food & Catering'],
    },
    {
      name: 'Haldi',
      selected: true,
      date: '2026-12-18',
      guests: 250,
      services: ['Decoration & Setup', 'Photography & Media', 'Beauty & Personal Care'],
    },
    {
      name: 'Mehendi',
      selected: true,
      date: '2026-12-18',
      guests: 250,
      services: ['Beauty & Personal Care', 'Photography & Media', 'Food & Catering'],
    },
    {
      name: 'Sangeet',
      selected: true,
      date: '2026-12-19',
      guests: 350,
      services: ['Entertainment & Music', 'Decoration & Setup', 'Photography & Media', 'Food & Catering'],
    },
    {
      name: 'Wedding Ceremony',
      selected: true,
      date: '2026-12-20',
      guests: 400,
      services: [
        'Decoration & Setup',
        'Food & Catering',
        'Photography & Media',
        'Beauty & Personal Care',
        'Rituals & Ceremonies',
        'Wedding Logistics',
      ],
    },
    {
      name: 'Reception',
      selected: true,
      date: '2026-12-20',
      guests: 450,
      services: ['Food & Catering', 'Decoration & Setup', 'Photography & Media', 'Entertainment & Music'],
    },
  ]);

  const allAvailableServices = [
    { name: 'Decoration & Setup', icon: Flower2, estCost: 150000 },
    { name: 'Photography & Media', icon: Camera, estCost: 85000 },
    { name: 'Food & Catering', icon: Utensils, estCost: 280000 },
    { name: 'Beauty & Personal Care', icon: Palette, estCost: 35000 },
    { name: 'Entertainment & Music', icon: Music, estCost: 55000 },
    { name: 'Rituals & Ceremonies', icon: Flame, estCost: 21000 },
    { name: 'Wedding Logistics', icon: Car, estCost: 40000 },
    { name: 'Invitations & Gifts', icon: Gift, estCost: 30000 },
  ];

  const toggleEventSelection = (name: WeddingEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.name === name ? { ...e, selected: !e.selected } : e))
    );
  };

  const toggleEventService = (eventName: WeddingEvent, serviceName: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.name !== eventName) return e;
        const exists = e.services.includes(serviceName);
        return {
          ...e,
          services: exists
            ? e.services.filter((s) => s !== serviceName)
            : [...e.services, serviceName],
        };
      })
    );
  };

  // Calculations
  const selectedEvents = events.filter((e) => e.selected);
  const totalServicesSelected = selectedEvents.reduce(
    (sum, e) => sum + e.services.length,
    0
  );

  // Estimate total dynamically
  const calculatedGrandTotal = selectedEvents.reduce((total, ev) => {
    let eventSum = 0;
    ev.services.forEach((srv) => {
      const match = allAvailableServices.find((s) => s.name === srv);
      if (match) {
        if (srv === 'Food & Catering') {
          eventSum += ev.guests * 1350;
        } else {
          eventSum += match.estCost;
        }
      }
    });
    return total + eventSum;
  }, 0);

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Wizard Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-700" /> Multi-Event Architecture
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-rose-950">
            Interactive Wedding Event Builder
          </h1>
          <p className="text-stone-600 text-sm mt-1 max-w-xl mx-auto">
            Design your custom wedding itinerary, select independent service categories per function, and get instant pricing benchmarks.
          </p>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-8">
            {[
              { num: 1, label: 'Location & Dates' },
              { num: 2, label: 'Select Functions' },
              { num: 3, label: 'Assign Services' },
              { num: 4, label: 'Estimate & Matches' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    step === s.num
                      ? 'bg-rose-800 text-white shadow-md ring-4 ring-rose-200'
                      : step > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <span
                  className={`hidden sm:inline text-xs font-bold ${
                    step === s.num ? 'text-rose-900' : 'text-stone-500'
                  }`}
                >
                  {s.label}
                </span>
                {s.num < 4 && <div className="w-4 sm:w-8 h-0.5 bg-stone-200" />}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: BASICS */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200 space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-serif font-black text-rose-950">
                Step 1: Where &amp; When is the Celebration?
              </h2>
              <p className="text-xs text-stone-500">
                Geographic location enables Vivah to rank verified providers nearest to your venue.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Wedding Destination City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-800/20"
                >
                  <option value="Udaipur">Udaipur, Rajasthan (Palace &amp; Lake)</option>
                  <option value="Jaipur">Jaipur, Rajasthan (Heritage Haveli)</option>
                  <option value="Mumbai">Mumbai, Maharashtra (Seaside &amp; Lawns)</option>
                  <option value="New Delhi">New Delhi &amp; NCR (Farmhouses)</option>
                  <option value="Pune">Pune, Maharashtra (Resort)</option>
                  <option value="Bengaluru">Bengaluru, Karnataka (Garden Lawns)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Celebration Start Date *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-800/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Wedding Days Duration
                </label>
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-semibold text-stone-900 focus:outline-none"
                >
                  <option value={1}>1 Day (Express Wedding &amp; Reception)</option>
                  <option value={2}>2 Days (Sangeet + Wedding)</option>
                  <option value={3}>3 Days (Mehendi, Sangeet, Wedding, Reception)</option>
                  <option value={4}>4 Days (Royal Grandeur Celebration)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Peak Guest Count
                </label>
                <input
                  type="number"
                  value={totalGuests}
                  onChange={(e) => setTotalGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-semibold text-stone-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-700 to-rose-800 text-white font-bold text-sm shadow-md hover:from-rose-800 hover:to-rose-900 transition-all flex items-center gap-2"
              >
                <span>Continue to Functions</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT FUNCTIONS */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200 space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-serif font-black text-rose-950">
                Step 2: Select Which Functions You Are Hosting
              </h2>
              <p className="text-xs text-stone-500">
                Toggle the ceremonies taking place over your {days}-day wedding in {city}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {events.map((evt) => (
                <div
                  key={evt.name}
                  onClick={() => toggleEventSelection(evt.name)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    evt.selected
                      ? 'border-rose-700 bg-rose-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 opacity-60'
                  }`}
                >
                  <div className="space-y-1">
                    <h3 className="text-base font-serif font-bold text-stone-900">
                      {evt.name}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {evt.services.length} services recommended
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      evt.selected ? 'bg-rose-800 text-white' : 'bg-stone-200 text-stone-400'
                    }`}
                  >
                    {evt.selected ? '✓' : '+'}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-stone-100 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2.5 rounded-2xl border border-stone-300 text-stone-700 font-bold text-xs"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-700 to-rose-800 text-white font-bold text-sm shadow-md flex items-center gap-2"
              >
                <span>Customize Services Per Event</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CUSTOMIZE SERVICES PER FUNCTION */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200 space-y-8 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-serif font-black text-rose-950">
                Step 3: Assign Services to Each Ceremony
              </h2>
              <p className="text-xs text-stone-500">
                Select or unselect vendors required for each function independently according to your budget.
              </p>
            </div>

            <div className="space-y-8">
              {selectedEvents.map((ev) => (
                <div key={ev.name} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <h3 className="text-lg font-serif font-bold text-rose-950">
                      {ev.name}
                    </h3>
                    <span className="text-xs text-stone-500 font-semibold">
                      {ev.services.length} Services Selected
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {allAvailableServices.map((srv) => {
                      const isIncluded = ev.services.includes(srv.name);
                      const Icon = srv.icon;
                      return (
                        <button
                          key={srv.name}
                          type="button"
                          onClick={() => toggleEventService(ev.name, srv.name)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all text-left ${
                            isIncluded
                              ? 'bg-white border-amber-500 text-rose-950 shadow-xs'
                              : 'bg-stone-100 border-transparent text-stone-400'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isIncluded ? 'text-amber-600' : 'text-stone-400'}`} />
                          <span className="truncate">{srv.name.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-stone-100 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-2xl border border-stone-300 text-stone-700 font-bold text-xs"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-700 to-rose-800 text-white font-bold text-sm shadow-md flex items-center gap-2"
              >
                <span>Calculate Total &amp; Match Vendors</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ESTIMATE & VENDOR MATCHES */}
        {step === 4 && (
          <div className="space-y-8 animate-in fade-in">
            {/* Grand Summary Card */}
            <div className="bg-gradient-to-br from-rose-950 via-stone-900 to-amber-950 rounded-3xl p-8 sm:p-10 text-white shadow-2xl border-2 border-amber-400">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-amber-300 block mb-1">
                    Custom Wedding Itinerary Benchmark
                  </span>
                  <h2 className="text-3xl font-serif font-black">
                    {city} Wedding Blueprint
                  </h2>
                  <p className="text-xs text-rose-200 mt-1">
                    {selectedEvents.length} Ceremonies &bull; {totalGuests} Guests &bull; {days} Days Duration
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right">
                  <span className="text-[11px] text-stone-300 block uppercase font-bold">Estimated Total</span>
                  <span className="text-3xl font-serif font-black text-amber-300">
                    ₹{calculatedGrandTotal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-rose-200 block">Direct Local Provider Rates</span>
                </div>
              </div>

              {/* Event breakdown pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/15 text-xs">
                {selectedEvents.map((ev) => (
                  <div key={ev.name} className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <strong className="block text-amber-200">{ev.name}</strong>
                    <span className="text-stone-300">{ev.services.join(', ')}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Itinerary</span>
                </button>
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs"
                >
                  Save to My Customer Dashboard
                </Link>
              </div>
            </div>

            {/* RECOMMENDED MATCHING VENDORS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-rose-950">
                    Verified Providers Matched in {city}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Available specialists covering your selected ceremonies
                  </p>
                </div>
                <Link href="/vendors" className="text-xs font-bold text-rose-800">
                  View Full Directory &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {INITIAL_VENDORS.slice(0, 3).map((v) => (
                  <div key={v.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                        {v.category}
                      </span>
                      <h4 className="text-sm font-serif font-bold text-stone-900">{v.businessName}</h4>
                      <p className="text-xs text-stone-500 line-clamp-1">{v.tagline}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200">
                      <span className="font-bold text-stone-800">₹{v.startingPrice.toLocaleString('en-IN')}</span>
                      <Link
                        href={`/vendors/${v.id}`}
                        className="px-3 py-1 rounded-lg bg-rose-800 text-white font-bold text-[11px]"
                      >
                        Inquire
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-2xl border border-stone-300 text-stone-700 font-bold text-xs"
              >
                Back to Edit Services
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
