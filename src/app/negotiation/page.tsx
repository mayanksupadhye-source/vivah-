'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  DollarSign,
  CheckCircle2,
  PhoneCall,
  Calendar,
  Send,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  FileText,
  BadgePercent,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Message {
  id: string;
  sender: 'customer' | 'vendor' | 'system';
  text: string;
  time: string;
  offerPrice?: number;
}

export default function NegotiationRoomPage() {
  const [selectedDealId, setSelectedDealId] = useState('deal-1');

  // Negotiation thread state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'customer',
      text: 'Namaste Rajesh ji! We loved your Royal Heritage Gold Mandap package for our lakeside wedding at Fateh Garh, Udaipur on Dec 18. Could we customize the floral backdrop to include more white Mogra and marigolds?',
      time: '10:30 AM',
    },
    {
      id: 'm-2',
      sender: 'vendor',
      text: 'Pranam Aarav ji! Yes, we can certainly do a high-density fresh Mogra canopy with brass urlis. Our standard quotation for this setup with the revolving Varmala stage is ₹2,75,000.',
      time: '10:45 AM',
      offerPrice: 275000,
    },
    {
      id: 'm-3',
      sender: 'customer',
      text: 'Our target decor budget for this function is ₹2,40,000. If we confirm advance payment today via Vivah, could you adjust the quotation to ₹2,45,000?',
      time: '11:15 AM',
      offerPrice: 245000,
    },
    {
      id: 'm-4',
      sender: 'vendor',
      text: 'We respect your family celebration and want to make it memorable. We can agree to ₹2,48,000 if we include the Cold Spark Pyros as a complimentary blessing for the Varmala entry!',
      time: '11:30 AM',
      offerPrice: 248000,
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [counterOfferInput, setCounterOfferInput] = useState('');
  const [currentAgreedPrice, setCurrentAgreedPrice] = useState<number>(248000);
  const [isDealLocked, setIsDealLocked] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !counterOfferInput.trim()) return;

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: 'customer',
      text: inputMessage || `Proposed revised counter-offer of ₹${Number(counterOfferInput).toLocaleString('en-IN')}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      offerPrice: counterOfferInput ? Number(counterOfferInput) : undefined,
    };

    setMessages([...messages, newMsg]);
    if (counterOfferInput) {
      setCurrentAgreedPrice(Number(counterOfferInput));
      setCounterOfferInput('');
    }
    setInputMessage('');
  };

  const handleLockDeal = () => {
    setIsDealLocked(true);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#881337', '#D97706', '#F59E0B', '#10B981'],
    });
  };

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <Link href="/dashboard" className="hover:text-rose-900">Dashboard</Link>
            <span>/</span>
            <span className="text-rose-900 font-semibold">Deal Room &amp; Negotiation</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-rose-950">
            Customer-Vendor Deal Room
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
            Transparent price negotiation, customized package revisions, and formal booking confirmation.
          </p>
        </div>

        {/* MAIN WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: ACTIVE DEALS LIST (3 COLS) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Active Negotiations ({messages.length ? '2' : '0'})
            </h3>

            <div
              onClick={() => setSelectedDealId('deal-1')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                selectedDealId === 'deal-1'
                  ? 'border-amber-400 bg-amber-50/50 shadow-sm'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">Royal Marwar Decorators</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                  In Negotiation
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Udaipur &bull; Wedding Ceremony (Dec 18, 2026)
              </p>
              <div className="text-xs font-bold text-rose-900 flex items-center justify-between pt-1 border-t border-stone-200/60">
                <span>Offer on Table:</span>
                <span>₹{currentAgreedPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div
              onClick={() => setSelectedDealId('deal-2')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                selectedDealId === 'deal-2'
                  ? 'border-amber-400 bg-amber-50/50 shadow-sm'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">Drishti CineWeddings</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  Quotation Sent
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Mumbai &bull; Sangeet Night (Dec 15, 2026)
              </p>
              <div className="text-xs font-bold text-stone-700 flex items-center justify-between pt-1 border-t border-stone-200/60">
                <span>Offer on Table:</span>
                <span>₹1,95,000</span>
              </div>
            </div>
          </div>

          {/* CENTER: MESSAGING STREAM (5 COLS) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-stone-200 flex flex-col h-[600px]">
            {/* Header */}
            <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Chat with Rajesh Sharma
                </h3>
                <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Royal Marwar Mandaps &bull; Online
                </span>
              </div>
              <a
                href="tel:+919829014523"
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
                title="Call Vendor"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === 'customer' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                      m.sender === 'customer'
                        ? 'bg-rose-800 text-white rounded-tr-none'
                        : 'bg-stone-100 text-stone-800 rounded-tl-none border border-stone-200'
                    }`}
                  >
                    <p>{m.text}</p>
                    {m.offerPrice && (
                      <div className="mt-2 pt-1.5 border-t border-white/20 flex items-center justify-between font-bold">
                        <span>Quoted Price:</span>
                        <span className="text-amber-300">₹{m.offerPrice.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Input form */}
            {isDealLocked ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-center text-xs font-bold text-emerald-800">
                ✓ Deal Locked &amp; Confirmed at ₹{currentAgreedPrice.toLocaleString('en-IN')}!
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-stone-100 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type message or package modification request..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-rose-800 text-white hover:bg-rose-900 text-xs font-bold flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-500 font-semibold whitespace-nowrap">
                    Propose Price (₹):
                  </span>
                  <input
                    type="number"
                    placeholder="e.g. 240000"
                    value={counterOfferInput}
                    onChange={(e) => setCounterOfferInput(e.target.value)}
                    className="w-28 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold"
                  >
                    Send Counter
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT: DEAL SUMMARY & LOCK ACTIONS (3 COLS) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-amber-300 space-y-4">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
                Agreed Terms Summary
              </span>
              <h3 className="text-lg font-serif font-black text-rose-950">
                Customized Mandap Setup
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Original Listing:</span>
                  <span className="line-through text-stone-400">₹2,75,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100 font-bold">
                  <span className="text-stone-700">Negotiated Rate:</span>
                  <span className="text-rose-900 text-base">₹{currentAgreedPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100 text-emerald-700 font-semibold">
                  <span>Savings:</span>
                  <span>-₹{(275000 - currentAgreedPrice).toLocaleString('en-IN')} (10%)</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <span className="font-bold block text-stone-800">Included Enhancements:</span>
                <p>&bull; High-density fresh White Mogra canopy</p>
                <p>&bull; Complimentary Cold Spark Pyros on Varmala</p>
                <p>&bull; 4-Pillar Carved Wooden Mandap</p>
              </div>

              <div className="pt-3">
                {isDealLocked ? (
                  <div className="p-3 bg-emerald-100 rounded-2xl text-center text-xs font-bold text-emerald-900">
                    Booking Confirmed! Advance Payment Receipt #VIVAH-8921 Generated.
                  </div>
                ) : (
                  <button
                    onClick={handleLockDeal}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lock Deal &amp; Confirm Booking</span>
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-700" /> Vivah Price Protection
              </span>
              <p className="text-[11px] leading-relaxed">
                All agreed terms in this Deal Room are digitally recorded in the contract. Vendors cannot alter prices after confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
