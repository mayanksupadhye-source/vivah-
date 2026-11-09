'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Coins,
  CheckCircle2,
  Clock,
  PhoneCall,
  User,
  ShieldCheck,
  Plus,
  Trash2,
  ArrowUpRight,
  TrendingUp,
  Store,
  DollarSign,
  AlertCircle,
  Database,
  RefreshCw,
  Search,
  ExternalLink,
} from 'lucide-react';
import { INITIAL_ENQUIRIES, INITIAL_CHECKLIST, INITIAL_EVENT_BUDGETS } from '@/lib/mockData';
import { Enquiry, WeddingChecklist, EventBudget, WeddingEvent } from '@/types';

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'vendor' ? 'vendor' : searchParams.get('role') === 'admin' ? 'admin' : 'customer';

  const [activeTab, setActiveTab] = useState<'customer' | 'vendor' | 'admin'>(initialRole);

  // Customer State
  const [checklist, setChecklist] = useState<WeddingChecklist[]>(INITIAL_CHECKLIST);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskEvent, setNewTaskEvent] = useState<WeddingEvent>('Wedding Ceremony');
  const [budgets, setBudgets] = useState<EventBudget[]>(INITIAL_EVENT_BUDGETS);

  // Vendor & Inquiries State
  const [enquiries, setEnquiries] = useState<Enquiry[]>(INITIAL_ENQUIRIES);
  const [selectedEnquiryForQuote, setSelectedEnquiryForQuote] = useState<Enquiry | null>(null);
  const [customQuoteAmount, setCustomQuoteAmount] = useState('');

  // Admin State & DB status
  const [dbStatus, setDbStatus] = useState<'connected' | 'offline_mock' | 'checking'>('checking');
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  // Check MongoDB connection or fetch enquiries on mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/enquiries');
        if (res.ok) {
          const data = await res.json();
          if (data.data && data.data.length > 0) {
            setEnquiries(data.data);
          }
        }
      } catch (err) {
        console.warn('Using local enquiries cache');
      }

      // Check DB connectivity
      try {
        const seedCheck = await fetch('/api/seed', { method: 'GET' });
        const seedData = await seedCheck.json();
        if (seedData.success) {
          setDbStatus('connected');
        } else {
          setDbStatus('offline_mock');
        }
      } catch (e) {
        setDbStatus('offline_mock');
      }
    }

    loadData();
  }, []);

  // Customer checklist toggle
  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isDone: !item.isDone } : item))
    );
  };

  // Add task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: WeddingChecklist = {
      id: `chk-${Date.now()}`,
      title: newTaskTitle,
      category: 'General',
      isDone: false,
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      assignedEvent: newTaskEvent,
    };
    setChecklist([newTask, ...checklist]);
    setNewTaskTitle('');
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    setChecklist(checklist.filter((c) => c.id !== id));
  };

  // Vendor actions on enquiry
  const handleUpdateStatus = async (enquiryId: string, newStatus: Enquiry['status'], quote?: number) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus, ...(quote ? { quotedPrice: quote } : {}) } : e))
    );

    try {
      await fetch('/api/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: enquiryId,
          status: newStatus,
          quotedPrice: quote,
        }),
      });
    } catch (err) {
      console.warn('Updated in memory');
    }
  };

  // Trigger Database Seed
  const handleSeedMongoDB = async () => {
    setIsSeeding(true);
    setSeedNotice(null);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      setSeedNotice(data.message || 'Seeded successfully!');
      if (data.success) {
        setDbStatus('connected');
      }
    } catch (err: any) {
      setSeedNotice('Failed to connect to MongoDB Atlas. Check your MONGODB_URI in .env.local');
    } finally {
      setIsSeeding(false);
    }
  };

  // Calculate totals
  const totalAllocated = budgets.reduce((acc, curr) => acc + curr.allocated, 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
  const completedTasksCount = checklist.filter((c) => c.isDone).length;

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP TITLE & ROLE SWITCHER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-800 mb-1">
              <LayoutDashboard className="w-4 h-4" /> Vivah Platform Manager
            </div>
            <h1 className="text-3xl font-serif font-black text-rose-950">
              Wedding Operations Dashboard
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Multi-sided wedding management across Customer Planners, Vendor Portals, and System Administration.
            </p>
          </div>

          {/* Role Switcher Pill */}
          <div className="bg-stone-100 p-1.5 rounded-2xl flex items-center gap-1 border border-stone-200/80">
            <button
              onClick={() => setActiveTab('customer')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'customer'
                  ? 'bg-rose-800 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Customer Wedding Planner
            </button>
            <button
              onClick={() => setActiveTab('vendor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'vendor'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Vendor Partner Portal
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Admin Control Desk
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: CUSTOMER WEDDING PLANNER */}
        {/* ============================================================== */}
        {activeTab === 'customer' && (
          <div className="mt-8 space-y-10 animate-in fade-in duration-200">
            {/* Top Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm">
                <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider block mb-1">
                  Target Wedding Date
                </span>
                <span className="text-xl font-serif font-black text-rose-950">18 Dec 2026</span>
                <span className="text-xs text-rose-700 font-bold block mt-1">39 Days to Auspicious Muhurat</span>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm">
                <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider block mb-1">
                  Budget Utilization
                </span>
                <span className="text-xl font-serif font-black text-rose-950">
                  ₹{totalSpent.toLocaleString('en-IN')} / ₹{totalAllocated.toLocaleString('en-IN')}
                </span>
                <div className="w-full bg-stone-100 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (totalSpent / totalAllocated) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm">
                <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider block mb-1">
                  Enquiries Sent
                </span>
                <span className="text-xl font-serif font-black text-rose-950">{enquiries.length} Providers</span>
                <span className="text-xs text-emerald-700 font-semibold block mt-1">
                  {enquiries.filter((e) => e.status === 'Accepted').length} Confirmed Bookings
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm">
                <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider block mb-1">
                  Preparation Progress
                </span>
                <span className="text-xl font-serif font-black text-rose-950">
                  {completedTasksCount} / {checklist.length} Completed
                </span>
                <span className="text-xs text-amber-700 font-semibold block mt-1">
                  {Math.round((completedTasksCount / checklist.length) * 100)}% Tasks Checked Off
                </span>
              </div>
            </div>

            {/* EVENT-BY-EVENT BUDGET BREAKDOWN */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-serif font-bold text-rose-950">
                    Ceremony Budget Distribution
                  </h3>
                  <p className="text-xs text-stone-500">
                    Detailed tracking across Haldi, Mehendi, Sangeet, Wedding Ceremony, and Reception.
                  </p>
                </div>
                <Link
                  href="/planner"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold hover:bg-rose-100"
                >
                  <Calendar className="w-3.5 h-3.5" /> Re-estimate in Event Planner
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {budgets.map((b) => (
                  <div key={b.event} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-stone-800">{b.event}</span>
                      <span className="text-stone-500">
                        ₹{b.spent.toLocaleString('en-IN')} / ₹{b.allocated.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-rose-700 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (b.spent / b.allocated) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TWO COLUMN: Enquiries Status & Checklist Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Enquiries Tracker */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif font-bold text-rose-950">
                    My Service Enquiries &amp; Quotes
                  </h3>
                  <Link href="/vendors" className="text-xs text-rose-800 font-bold flex items-center gap-1">
                    <span>+ Explore More</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {enquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-stone-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-stone-900">{enq.vendorName}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 font-semibold text-stone-700">
                            {enq.eventType}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500">
                          Date: {enq.eventDate} &bull; Budget: ₹{enq.budget.toLocaleString('en-IN')} &bull; Guests: {enq.guestCount}
                        </p>
                        {enq.quotedPrice && (
                          <p className="text-xs font-bold text-amber-800">
                            Vendor Quoted: ₹{enq.quotedPrice.toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-xl ${
                            enq.status === 'Accepted'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : enq.status === 'Quotation Sent'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {enq.status}
                        </span>

                        <Link
                          href="/negotiation"
                          className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:border-amber-400 text-xs font-bold text-stone-700"
                        >
                          Deal Room
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Interactive Checklist */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-rose-950">
                    Wedding Checklist
                  </h3>
                  <p className="text-xs text-stone-500">Click checkboxes to mark items done</p>
                </div>

                {/* Add new task input */}
                <form onSubmit={handleAddTask} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add task e.g. taste sweets..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-rose-800 text-white hover:bg-rose-900 text-xs font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                        item.isDone
                          ? 'bg-emerald-50/60 border-emerald-200 text-stone-400 line-through'
                          : 'bg-stone-50 border-stone-200 text-stone-800'
                      }`}
                    >
                      <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={item.isDone}
                          onChange={() => toggleChecklist(item.id)}
                          className="accent-rose-800 rounded"
                        />
                        <span className={item.isDone ? 'line-through text-stone-400' : 'font-medium'}>
                          {item.title}
                        </span>
                      </label>
                      <button
                        onClick={() => handleDeleteTask(item.id)}
                        className="text-stone-300 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: VENDOR PARTNER PORTAL */}
        {/* ============================================================== */}
        {activeTab === 'vendor' && (
          <div className="mt-8 space-y-10 animate-in fade-in duration-200">
            {/* Vendor Portal Headline */}
            <div className="bg-gradient-to-r from-amber-900 via-rose-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-amber-300 block mb-1">
                  Vendor Control Desk
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-black">
                  Inbound Client Enquiries &amp; Direct Leads
                </h2>
                <p className="text-xs text-rose-100/80 mt-1 max-w-xl">
                  Client phone numbers are captured in real-time in MongoDB Atlas. Call families directly or submit custom quotation proposals.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/vendors/v-101"
                  className="px-4 py-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs shadow-md hover:bg-amber-300 transition-all flex items-center gap-1.5"
                >
                  <Store className="w-4 h-4" /> View Public Profile
                </Link>
              </div>
            </div>

            {/* Inquiries Stream */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-rose-950">
                    Incoming Customer Leads ({enquiries.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Families inquiring for wedding services in your location
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-5 rounded-2xl border-2 border-stone-200/90 hover:border-amber-400 bg-white transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-serif font-bold text-stone-900">
                            {enq.customerName}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                            {enq.eventType}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Location: {enq.city} &bull; Target Date: <strong>{enq.eventDate}</strong> &bull; Guest Count: {enq.guestCount}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-xl ${
                            enq.status === 'Accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : enq.status === 'Quotation Sent'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          Status: {enq.status}
                        </span>
                      </div>
                    </div>

                    {/* Customer phone number highlight (backend storage verification) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                      <div>
                        <span className="text-stone-400 block font-medium">Customer Phone (MongoDB):</span>
                        <a
                          href={`tel:${enq.customerPhone}`}
                          className="font-bold text-emerald-700 flex items-center gap-1 hover:underline"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          {enq.customerPhone}
                        </a>
                      </div>
                      <div>
                        <span className="text-stone-400 block font-medium">Client Budget Range:</span>
                        <strong className="text-stone-800">₹{enq.budget.toLocaleString('en-IN')}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 block font-medium">Special Request:</span>
                        <span className="text-stone-600 italic">{enq.notes || 'None specified'}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${enq.customerPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>WhatsApp Client</span>
                        </a>

                        <button
                          onClick={() => {
                            setSelectedEnquiryForQuote(enq);
                            setCustomQuoteAmount(enq.budget.toString());
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Send Custom Quotation</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(enq.id, 'Accepted')}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-bold text-xs"
                        >
                          Accept Booking
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(enq.id, 'Declined')}
                          className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-500 hover:bg-stone-100 text-xs"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEND QUOTE MODAL */}
            {selectedEnquiryForQuote && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-amber-400 space-y-4">
                  <h3 className="text-xl font-serif font-black text-rose-950">
                    Send Proposal to {selectedEnquiryForQuote.customerName}
                  </h3>
                  <p className="text-xs text-stone-600">
                    Event: {selectedEnquiryForQuote.eventType} on {selectedEnquiryForQuote.eventDate}
                  </p>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Proposed Price (₹)
                    </label>
                    <input
                      type="number"
                      value={customQuoteAmount}
                      onChange={(e) => setCustomQuoteAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        handleUpdateStatus(
                          selectedEnquiryForQuote.id,
                          'Quotation Sent',
                          Number(customQuoteAmount)
                        );
                        setSelectedEnquiryForQuote(null);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-rose-800 text-white font-bold text-xs"
                    >
                      Submit Quote
                    </button>
                    <button
                      onClick={() => setSelectedEnquiryForQuote(null)}
                      className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: ADMINISTRATOR CONTROL DESK */}
        {/* ============================================================== */}
        {activeTab === 'admin' && (
          <div className="mt-8 space-y-10 animate-in fade-in duration-200">
            {/* System KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm">
                <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider block mb-1">
                  Total Marketplace GMV
                </span>
                <span className="text-2xl font-serif font-black text-rose-950">₹48,25,000</span>
                <span className="text-xs text-emerald-700 font-semibold block mt-1">+18.4% this month</span>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm">
                <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider block mb-1">
                  Active Vendors
                </span>
                <span className="text-2xl font-serif font-black text-rose-950">1,540</span>
                <span className="text-xs text-stone-500 block mt-1">Across 8 Categories</span>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm">
                <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider block mb-1">
                  Pending Verifications
                </span>
                <span className="text-2xl font-serif font-black text-amber-800">14 Providers</span>
                <span className="text-xs text-amber-700 font-semibold block mt-1">Requires manual audit</span>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm">
                <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider block mb-1">
                  Platform Commission (5%)
                </span>
                <span className="text-2xl font-serif font-black text-emerald-900">₹2,41,250</span>
                <span className="text-xs text-stone-500 block mt-1">Settled automatically</span>
              </div>
            </div>

            {/* MONGODB ATLAS CONNECTION STATUS CARD */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-rose-950">
                      MongoDB Atlas Connection Status
                    </h3>
                    <p className="text-xs text-stone-500">
                      Node.js Mongoose connection pooling for high-throughput wedding bookings
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      dbStatus === 'connected'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                    <span>{dbStatus === 'connected' ? 'MongoDB Atlas Online' : 'High-Fidelity Mock Fallback'}</span>
                  </span>

                  <button
                    onClick={handleSeedMongoDB}
                    disabled={isSeeding}
                    className="px-4 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                    <span>{isSeeding ? 'Seeding...' : 'Seed Initial Data'}</span>
                  </button>
                </div>
              </div>

              {seedNotice && (
                <div className="p-3 rounded-xl bg-stone-100 border border-stone-300 text-xs text-stone-800 font-mono">
                  {seedNotice}
                </div>
              )}

              <p className="text-xs text-stone-500 leading-relaxed border-t border-stone-100 pt-3">
                To connect your live cluster: add your MongoDB connection string in <code className="bg-stone-100 px-1.5 py-0.5 rounded text-rose-800">.env.local</code> as <code className="bg-stone-100 px-1.5 py-0.5 rounded text-rose-800">MONGODB_URI=mongodb+srv://...</code>. In the meantime, the marketplace operates seamlessly with zero downtime using high-fidelity in-memory state.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen py-20 text-center text-stone-500 font-serif">Loading Operations Dashboard...</div>}>
      <DashboardContent />
    </React.Suspense>
  );
}
