'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Calendar, Search, LayoutDashboard, PhoneCall, Heart, Menu, X, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/vendors', label: 'Explore Vendors' },
    { href: '/planner', label: 'Wedding Planner' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/negotiation', label: 'Negotiation Room' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-200/60 shadow-sm transition-all">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-amber-200 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>India&apos;s Dedicated Multi-Vendor Wedding Discovery &amp; Booking Marketplace</span>
        <span className="hidden md:inline-block text-amber-400">|</span>
        <span className="hidden md:flex items-center gap-1 text-amber-100">
          <PhoneCall className="w-3 h-3 text-amber-300" /> Concierge Support: +91 1800-VIVAH-CARE
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-700 via-rose-800 to-amber-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200 border border-amber-300/40">
              <span className="text-2xl font-serif text-amber-200 font-bold tracking-tighter">वि</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-black tracking-tight text-rose-950 flex items-center gap-1.5">
                Vivah<span className="text-amber-600 text-xs font-sans uppercase font-bold tracking-widest px-1.5 py-0.5 bg-amber-50 rounded border border-amber-200">Marketplace</span>
              </span>
              <span className="text-[11px] text-stone-500 font-medium tracking-wide">
                Discover • Compare • Negotiate • Book
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-rose-50 text-rose-800 border border-rose-200/80 shadow-xs'
                      : 'text-stone-700 hover:text-rose-900 hover:bg-stone-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/planner"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-rose-700 to-rose-800 text-white shadow-md hover:from-rose-800 hover:to-rose-900 hover:shadow-lg transition-all duration-200 border border-rose-600"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>Plan Wedding</span>
            </Link>
            <Link
              href="/dashboard?role=vendor"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Vendor Portal</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:text-rose-900 hover:bg-rose-50 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-amber-100 bg-white/98 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-semibold ${
                pathname === link.href
                  ? 'bg-rose-50 text-rose-900 font-bold border border-rose-200'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            <Link
              href="/planner"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl text-sm font-bold bg-rose-800 text-white shadow-sm"
            >
              Plan Your Wedding Events
            </Link>
            <Link
              href="/dashboard?role=vendor"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300"
            >
              Vendor &amp; Provider Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
