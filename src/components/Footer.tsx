import React from 'react';
import Link from 'next/link';
import { Sparkles, PhoneCall, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t-2 border-amber-500/40 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-700 via-rose-800 to-amber-600 flex items-center justify-center border border-amber-400">
                <span className="text-xl font-serif text-amber-200 font-bold">वि</span>
              </div>
              <span className="text-2xl font-serif font-black tracking-tight text-white">
                Vivah <span className="text-amber-400 text-sm font-sans font-normal tracking-wide">Marketplace</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Discover. Compare. Connect. Celebrate. India&apos;s centralized multi-vendor wedding discovery and booking platform connecting families directly with verified local service providers.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>Helpline: +91 1800-VIVAH-CARE (+91 1800 848 242)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Support: concierge@vivahmarketplace.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Headquarters: Udaipur &bull; Mumbai &bull; New Delhi</span>
              </div>
            </div>
          </div>

          {/* Service Categories */}
          <div>
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link href="/vendors?category=Decoration+%26+Setup" className="hover:text-amber-200 transition-colors">
                  Decor &amp; Mandaps
                </Link>
              </li>
              <li>
                <Link href="/vendors?category=Photography+%26+Media" className="hover:text-amber-200 transition-colors">
                  Photographers &amp; Drones
                </Link>
              </li>
              <li>
                <Link href="/vendors?category=Food+%26+Catering" className="hover:text-amber-200 transition-colors">
                  Caterers &amp; Live Stations
                </Link>
              </li>
              <li>
                <Link href="/vendors?category=Beauty+%26+Personal+Care" className="hover:text-amber-200 transition-colors">
                  Bridal Makeup &amp; Mehendi
                </Link>
              </li>
              <li>
                <Link href="/vendors?category=Entertainment+%26+Music" className="hover:text-amber-200 transition-colors">
                  Sangeet DJs &amp; Live Dhol
                </Link>
              </li>
              <li>
                <Link href="/vendors?category=Rituals+%26+Ceremonies" className="hover:text-amber-200 transition-colors">
                  Vedic Pandits &amp; Samagri
                </Link>
              </li>
            </ul>
          </div>

          {/* Wedding Destinations */}
          <div>
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-4">
              Top Locations
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link href="/vendors?city=Udaipur" className="hover:text-amber-200 transition-colors">
                  Udaipur Palace Weddings
                </Link>
              </li>
              <li>
                <Link href="/vendors?city=Jaipur" className="hover:text-amber-200 transition-colors">
                  Jaipur Heritage Haveli
                </Link>
              </li>
              <li>
                <Link href="/vendors?city=Mumbai" className="hover:text-amber-200 transition-colors">
                  Mumbai Beachfront &amp; Lawns
                </Link>
              </li>
              <li>
                <Link href="/vendors?city=New+Delhi" className="hover:text-amber-200 transition-colors">
                  Delhi NCR Farmhouses
                </Link>
              </li>
              <li>
                <Link href="/vendors?city=Pune" className="hover:text-amber-200 transition-colors">
                  Pune Hill Station Resorts
                </Link>
              </li>
              <li>
                <Link href="/vendors?city=Bengaluru" className="hover:text-amber-200 transition-colors">
                  Bengaluru Garden Weddings
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div>
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-4">
              Platform &amp; Tools
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link href="/planner" className="hover:text-amber-200 transition-colors">
                  Event-by-Event Planner
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-200 transition-colors">
                  Wedding Budget Tracker
                </Link>
              </li>
              <li>
                <Link href="/negotiation" className="hover:text-amber-200 transition-colors">
                  Quotation Deal Room
                </Link>
              </li>
              <li>
                <Link href="/dashboard?role=vendor" className="hover:text-amber-200 transition-colors">
                  Vendor Partner Portal
                </Link>
              </li>
              <li>
                <Link href="/dashboard?role=admin" className="hover:text-amber-200 transition-colors">
                  Admin Verification Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Vivah Wedding Services Marketplace Ltd.</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-rose-400">
              Made with <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" /> for Indian Weddings
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Verified Vendors &amp; Price Transparency
            </span>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
