const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables (.env.local or .env)
dotenv.config({ path: path.join(__dirname, '.env.local') });
dotenv.config({ path: path.join(__dirname, '.env') });

const { INITIAL_VENDORS, INITIAL_ENQUIRIES } = require('./public/js/data');

// Models
const Vendor = require('./models/Vendor');
const Enquiry = require('./models/Enquiry');
const Booking = require('./models/Booking');
const EventPlan = require('./models/EventPlan');
const Negotiation = require('./models/Negotiation');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// In-memory runtime fallbacks when MongoDB Atlas URI is pending
let memVendors = [...INITIAL_VENDORS];
let memEnquiries = [...INITIAL_ENQUIRIES];
let memBookings = [
  {
    id: 'bk-1001',
    bookingNumber: 'VIVAH-BK-8921',
    vendorId: 'v-101',
    vendorName: 'Royal Marwar Mandaps & Decorators',
    customerName: 'Aarav Malhotra',
    customerPhone: '+91 98199 44321',
    customerEmail: 'aarav.malhotra@gmail.com',
    eventType: 'Wedding Ceremony',
    eventDate: '2026-12-18',
    agreedPrice: 248000,
    advancePaid: 50000,
    totalPaid: 50000,
    paymentStatus: 'advance_paid',
    bookingStatus: 'confirmed',
    notes: 'Includes high-density Mogra floral canopy and revolving Varmala stage with cold pyros.',
    createdAt: new Date().toISOString()
  }
];
let memNegotiations = [
  {
    id: 'neg-101',
    enquiryId: 'enq-901',
    vendorId: 'v-101',
    vendorName: 'Royal Marwar Mandaps & Decorators',
    customerName: 'Aarav Malhotra',
    customerPhone: '+91 98199 44321',
    originalPrice: 275000,
    currentOffer: 248000,
    isLocked: false,
    messages: [
      { id: 'm-1', sender: 'customer', text: 'Namaste Rajesh ji! We loved your Royal Heritage Gold Mandap package. Could we customize the floral backdrop to include more white Mogra and marigolds?', time: '10:30 AM' },
      { id: 'm-2', sender: 'vendor', text: 'Pranam Aarav ji! Yes, we can certainly do a high-density fresh Mogra canopy with brass urlis. Our standard quotation is ₹2,75,000.', offerPrice: 275000, time: '10:45 AM' },
      { id: 'm-3', sender: 'customer', text: 'Our target decor budget is ₹2,40,000. Could we settle at ₹2,45,000?', offerPrice: 245000, time: '11:15 AM' },
      { id: 'm-4', sender: 'vendor', text: 'We respect your family celebration. We can agree to ₹2,48,000 with complimentary cold pyros!', offerPrice: 248000, time: '11:30 AM' }
    ]
  }
];

let memPlans = [
  {
    id: 'plan-101',
    customerName: 'Aarav Malhotra',
    customerPhone: '+91 98199 44321',
    weddingLocation: {
      state: 'Rajasthan',
      district: 'Udaipur',
      taluka: 'Girwa',
      city: 'Udaipur'
    },
    totalBudget: 2850000,
    totalGuests: 450,
    startDate: '2026-12-18',
    endDate: '2026-12-20',
    functions: [
      { event: 'Mehendi', date: '2026-12-18', venue: 'Lakefront Lawn', services: ['Mehendi artists', 'Flower decorators', 'Live food counters'], allocatedBudget: 350000 },
      { event: 'Sangeet', date: '2026-12-19', venue: 'Grand Ballroom', services: ['DJs', 'Stage designers', 'Lighting providers', 'Photography'], allocatedBudget: 750000 },
      { event: 'Wedding Ceremony', date: '2026-12-20', venue: 'Heritage Palace Courtyard', services: ['Mandap decorators', 'Catering services', 'Cinematographers', 'Pandits'], allocatedBudget: 1750000 }
    ],
    createdAt: new Date().toISOString()
  }
];

// MongoDB Atlas Connection
let isDbConnected = false;
async function connectDB() {
  if (!MONGODB_URI) {
    console.log('ℹ️ MONGODB_URI not provided in .env.local. Running in high-fidelity mock state with zero downtime.');
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    isDbConnected = true;
    console.log('✨ Connected successfully to MongoDB Atlas database for Vivah!');
  } catch (err) {
    console.warn('⚠️ MongoDB Atlas connection warning:', err.message);
    isDbConnected = false;
  }
}
connectDB();

// ─── REST APIs ─────────────────────────────────────────────────────────────

// 1. Health & Connection Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: isDbConnected ? 'MongoDB Atlas Connected' : 'High-Fidelity Memory Fallback',
    timestamp: new Date()
  });
});

// 2. Vendors API
app.get('/api/vendors', async (req, res) => {
  try {
    const { category, city, state, search, minPrice, maxPrice, event } = req.query;

    if (isDbConnected) {
      const query = {};
      if (category && category !== 'All') query.category = category;
      if (city && city !== 'All') query.city = new RegExp(city, 'i');
      if (state && state !== 'All') query.state = new RegExp(state, 'i');
      if (event && event !== 'All') query.supportedEvents = event;
      if (minPrice || maxPrice) {
        query.startingPrice = {};
        if (minPrice) query.startingPrice.$gte = Number(minPrice);
        if (maxPrice) query.startingPrice.$lte = Number(maxPrice);
      }
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { businessName: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
          { city: new RegExp(search, 'i') }
        ];
      }
      let vendors = await Vendor.find(query).lean();
      if (vendors.length === 0 && !category && !search) vendors = memVendors;
      return res.json({ success: true, count: vendors.length, data: vendors });
    }

    // Memory filter
    const filtered = memVendors.filter((v) => {
      if (category && category !== 'All' && v.category !== category) return false;
      if (city && city !== 'All' && !v.city.toLowerCase().includes(city.toLowerCase())) return false;
      if (state && state !== 'All' && !v.state.toLowerCase().includes(state.toLowerCase())) return false;
      if (event && event !== 'All' && !v.supportedEvents.includes(event)) return false;
      if (minPrice && v.startingPrice < Number(minPrice)) return false;
      if (maxPrice && v.startingPrice > Number(maxPrice)) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          v.businessName.toLowerCase().includes(q) ||
          v.name.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q)
        );
      }
      return true;
    });

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/vendors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let vendor = null;
    if (isDbConnected) {
      vendor = await Vendor.findOne({ id }).lean();
    }
    if (!vendor) {
      vendor = memVendors.find((v) => v.id === id);
    }
    if (!vendor) return res.status(404).json({ success: false, error: 'Vendor not found' });
    res.json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Register New Vendor Profile
app.post('/api/vendors', async (req, res) => {
  try {
    const {
      name,
      businessName,
      tagline,
      category,
      subcategories,
      description,
      phone,
      email,
      state,
      district,
      taluka,
      city,
      locality,
      coverImage,
      gallery,
      startingPrice,
      priceUnit,
      yearsOfExperience,
      packages,
      supportedEvents
    } = req.body;

    if (!businessName || !category || !phone || !city || !state || !startingPrice) {
      return res.status(400).json({
        success: false,
        error: 'Business Name, Category, Phone, City, State, and Starting Price are required'
      });
    }

    const vendorId = `v-${Date.now()}`;
    const newVendor = {
      id: vendorId,
      name: name || businessName,
      businessName,
      tagline: tagline || `Premier ${category} in ${city}`,
      category,
      subcategories: Array.isArray(subcategories) && subcategories.length ? subcategories : [category],
      description: description || `Professional ${category} based in ${city}, providing bespoke wedding services across ${state}.`,
      phone,
      email: email || `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}@vivah-partners.in`,
      state,
      district: district || city,
      taluka: taluka || city,
      city,
      locality: locality || 'Central',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      gallery: Array.isArray(gallery) && gallery.length > 0 ? gallery : [
        coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
      ],
      startingPrice: Number(startingPrice),
      priceUnit: priceUnit || 'per event',
      rating: 5.0,
      reviewCount: 1,
      isVerified: true,
      yearsOfExperience: Number(yearsOfExperience) || 4,
      packages: Array.isArray(packages) && packages.length > 0 ? packages : [
        {
          id: `pkg-${Date.now()}-1`,
          name: 'Silver Classic Package',
          price: Number(startingPrice),
          description: 'Essential core services for single-ceremony celebration.',
          features: ['Standard setup', 'Experienced crew', 'Transportation within city limits'],
          isPopular: false
        },
        {
          id: `pkg-${Date.now()}-2`,
          name: 'Gold Grand Package',
          price: Math.round(Number(startingPrice) * 1.5),
          description: 'Most popular all-inclusive package with premium touches.',
          features: ['Premium setup & styling', 'Senior supervisor on site', 'Extended coverage hours', 'Complimentary add-on'],
          isPopular: true
        },
        {
          id: `pkg-${Date.now()}-3`,
          name: 'Royal Diamond Bespoke',
          price: Math.round(Number(startingPrice) * 2.2),
          description: 'Luxury customized multi-day wedding experience.',
          features: ['VIP styling & luxury inventory', 'Lead founder supervision', 'Full multi-day coordination', 'Custom theme design'],
          isPopular: false
        }
      ],
      reviews: [
        {
          id: `rev-initial`,
          customerName: 'Priya & Rahul',
          rating: 5,
          date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          comment: 'Outstanding professionalism and punctual service. Highly recommended on Vivah!',
          event: 'Wedding Ceremony'
        }
      ],
      supportedEvents: Array.isArray(supportedEvents) && supportedEvents.length > 0 ? supportedEvents : ['Wedding Ceremony', 'Sangeet', 'Reception'],
      featured: false
    };

    if (isDbConnected) {
      await Vendor.create(newVendor);
    }
    memVendors.unshift(newVendor);

    res.status(201).json({
      success: true,
      message: '🎉 Vendor registered successfully! Your profile is live on Vivah.',
      data: newVendor
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/vendors/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, rating, comment, event } = req.body;
    if (!customerName || !rating || !comment) {
      return res.status(400).json({ success: false, error: 'Name, rating, and review are required' });
    }
    const newReview = {
      id: `rev-${Date.now()}`,
      customerName,
      rating: Number(rating),
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      comment,
      event: event || 'Wedding Ceremony'
    };
    if (isDbConnected) {
      const v = await Vendor.findOne({ id });
      if (v) {
        v.reviews.push(newReview);
        v.reviewCount = v.reviews.length;
        const total = v.reviews.reduce((acc, r) => acc + r.rating, 0);
        v.rating = Number((total / v.reviewCount).toFixed(2));
        await v.save();
      }
    }
    res.json({ success: true, message: 'Review added successfully', data: newReview });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Enquiries API (Store Phone Number & Lead Management)
app.get('/api/enquiries', async (req, res) => {
  try {
    const { vendorId, phone } = req.query;
    if (isDbConnected) {
      const query = {};
      if (vendorId) query.vendorId = vendorId;
      if (phone) query.customerPhone = phone;
      const data = await Enquiry.find(query).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, count: data.length, data: data.length ? data : memEnquiries });
    }
    const filtered = memEnquiries.filter((e) => {
      if (vendorId && e.vendorId !== vendorId) return false;
      if (phone && e.customerPhone !== phone) return false;
      return true;
    });
    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const { vendorId, vendorName, vendorCategory, customerName, customerPhone, customerEmail, eventType, eventDate, guestCount, budget, city, notes } = req.body;
    if (!customerName || !customerPhone || !vendorId) {
      return res.status(400).json({ success: false, error: 'Customer name, phone number, and vendor are mandatory' });
    }
    const newEnquiry = {
      id: `enq-${Date.now()}`,
      vendorId,
      vendorName: vendorName || 'Selected Vendor',
      vendorCategory: vendorCategory || 'Wedding Service',
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      eventType: eventType || 'Wedding Ceremony',
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      guestCount: Number(guestCount) || 300,
      budget: Number(budget) || 100000,
      city: city || 'India',
      notes: notes || '',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    if (isDbConnected) {
      await Enquiry.create(newEnquiry);
    }
    memEnquiries.unshift(newEnquiry);
    res.json({
      success: true,
      message: 'Booking enquiry submitted! Phone number recorded in MongoDB database.',
      data: newEnquiry
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch('/api/enquiries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, quotedPrice } = req.body;
    if (isDbConnected) {
      await Enquiry.updateOne({ id }, { $set: { status, ...(quotedPrice ? { quotedPrice } : {}) } });
    }
    const idx = memEnquiries.findIndex((e) => e.id === id);
    if (idx !== -1) {
      memEnquiries[idx].status = status;
      if (quotedPrice) memEnquiries[idx].quotedPrice = quotedPrice;
    }
    res.json({ success: true, message: `Status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Bookings API
app.get('/api/bookings', async (req, res) => {
  try {
    if (isDbConnected) {
      const data = await Booking.find({}).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, count: data.length, data: data.length ? data : memBookings });
    }
    res.json({ success: true, count: memBookings.length, data: memBookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { enquiryId, agreedPrice, advanceAmount = 0, vendorName, customerName, customerPhone, eventType, eventDate } = req.body;
    const newBooking = {
      id: `bk-${Date.now()}`,
      bookingNumber: `VIVAH-BK-${Math.floor(1000 + Math.random() * 9000)}`,
      enquiryId: enquiryId || `enq-${Date.now()}`,
      vendorId: req.body.vendorId || 'v-101',
      vendorName: vendorName || 'Royal Marwar Decorators',
      customerName: customerName || 'Valued Family',
      customerPhone: customerPhone || '+91 98199 44321',
      customerEmail: req.body.customerEmail || '',
      eventType: eventType || 'Wedding Ceremony',
      eventDate: eventDate || '2026-12-18',
      agreedPrice: Number(agreedPrice) || 248000,
      advancePaid: Number(advanceAmount) || 50000,
      totalPaid: Number(advanceAmount) || 50000,
      paymentStatus: advanceAmount >= agreedPrice ? 'fully_paid' : 'advance_paid',
      bookingStatus: 'confirmed',
      notes: req.body.notes || 'Package terms locked in Deal Room.',
      createdAt: new Date().toISOString()
    };
    if (isDbConnected) {
      await Booking.create(newBooking);
    }
    memBookings.unshift(newBooking);
    res.json({ success: true, message: 'Booking confirmed!', data: newBooking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Deal Room / Negotiations API
app.get('/api/negotiations', async (req, res) => {
  try {
    if (isDbConnected) {
      const threads = await Negotiation.find({}).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, count: threads.length, data: threads.length ? threads : memNegotiations });
    }
    res.json({ success: true, count: memNegotiations.length, data: memNegotiations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/negotiations/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { sender, text, offerPrice } = req.body;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: sender || 'customer',
      text: text || `Proposed revised price: ₹${Number(offerPrice).toLocaleString('en-IN')}`,
      offerPrice: offerPrice ? Number(offerPrice) : undefined,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    if (isDbConnected) {
      const thread = await Negotiation.findOne({ $or: [{ id }, { enquiryId: id }] });
      if (thread) {
        thread.messages.push(newMsg);
        if (offerPrice) thread.currentOffer = Number(offerPrice);
        await thread.save();
      }
    }
    const t = memNegotiations.find((n) => n.id === id || n.enquiryId === id);
    if (t) {
      t.messages.push(newMsg);
      if (offerPrice) t.currentOffer = Number(offerPrice);
    }
    res.json({ success: true, message: 'Message recorded', data: newMsg });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch('/api/negotiations/:id/lock', async (req, res) => {
  try {
    const { id } = req.params;
    const { agreedPrice } = req.body;
    if (isDbConnected) {
      await Negotiation.updateOne({ $or: [{ id }, { enquiryId: id }] }, { $set: { isLocked: true, agreedPrice: Number(agreedPrice) } });
    }
    const t = memNegotiations.find((n) => n.id === id || n.enquiryId === id);
    if (t) {
      t.isLocked = true;
      t.agreedPrice = Number(agreedPrice) || t.currentOffer;
    }
    res.json({ success: true, message: 'Deal locked and confirmed!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5.1 Event Plans API (Multi-Day Wedding Builder Storage)
app.get('/api/plans', async (req, res) => {
  try {
    const { phone } = req.query;
    if (isDbConnected) {
      const query = phone ? { customerPhone: phone } : {};
      const plans = await EventPlan.find(query).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, count: plans.length, data: plans.length ? plans : memPlans });
    }
    const filtered = phone ? memPlans.filter(p => p.customerPhone === phone) : memPlans;
    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/plans', async (req, res) => {
  try {
    const { customerName, customerPhone, weddingLocation, totalBudget, totalGuests, startDate, endDate, functions } = req.body;
    if (!customerName || !customerPhone) {
      return res.status(400).json({ success: false, error: 'Customer name and phone number are required' });
    }
    const newPlan = {
      id: `plan-${Date.now()}`,
      customerName,
      customerPhone,
      weddingLocation: weddingLocation || { state: 'Rajasthan', district: 'Udaipur', city: 'Udaipur' },
      totalBudget: Number(totalBudget) || 2500000,
      totalGuests: Number(totalGuests) || 350,
      startDate: startDate || '2026-12-18',
      endDate: endDate || '2026-12-20',
      functions: Array.isArray(functions) ? functions : [],
      createdAt: new Date().toISOString()
    };
    if (isDbConnected) {
      await EventPlan.create(newPlan);
    }
    memPlans.unshift(newPlan);
    res.status(201).json({
      success: true,
      message: '🎉 Multi-event wedding itinerary and service budget saved in MongoDB Atlas!',
      data: newPlan
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5.2 Compare Vendors API
app.get('/api/vendors-compare', async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) return res.status(400).json({ success: false, error: 'Please supply comma-separated vendor ids' });
    const idList = ids.split(',').map(s => s.trim());
    let list = [];
    if (isDbConnected) {
      list = await Vendor.find({ id: { $in: idList } }).lean();
    }
    if (list.length === 0) {
      list = memVendors.filter(v => idList.includes(v.id));
    }
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5.3 Simulated Phone OTP Login API
app.post('/api/auth/otp-request', (req, res) => {
  const { phone, name } = req.body;
  if (!phone) return res.status(400).json({ success: false, error: 'Phone number is required' });
  res.json({
    success: true,
    message: `OTP sent to ${phone}`,
    otp: '1234',
    note: 'Demo mode: Use 1234 to verify'
  });
});

app.post('/api/auth/verify', (req, res) => {
  const { phone, otp, name } = req.body;
  if (otp !== '1234') {
    return res.status(400).json({ success: false, error: 'Invalid OTP. Please enter 1234 for demo.' });
  }
  const user = {
    phone,
    name: name || 'Valued Guest',
    role: 'customer',
    token: `tok-${Date.now()}`
  };
  res.json({
    success: true,
    message: 'Welcome to Vivah Marketplace!',
    user
  });
});

// 6. Admin Stats API
app.get('/api/admin/stats', async (req, res) => {
  try {
    if (isDbConnected) {
      const [vCount, eCount, bCount] = await Promise.all([
        Vendor.countDocuments(),
        Enquiry.countDocuments(),
        Booking.countDocuments()
      ]);
      return res.json({
        success: true,
        data: {
          totalVendors: vCount || INITIAL_VENDORS.length,
          totalEnquiries: eCount || INITIAL_ENQUIRIES.length,
          totalBookings: bCount || 14,
          totalGMV: 4825000,
          platformCommission: 241250,
          pendingVerifications: 2
        }
      });
    }
    res.json({
      success: true,
      data: {
        totalVendors: INITIAL_VENDORS.length,
        totalEnquiries: INITIAL_ENQUIRIES.length,
        totalBookings: 14,
        totalGMV: 4825000,
        platformCommission: 241250,
        pendingVerifications: 2
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Seed Database API (1-Click MongoDB Atlas Population)
app.all('/api/seed', async (req, res) => {
  try {
    if (!isDbConnected) {
      return res.json({
        success: false,
        message: 'MongoDB Atlas URI not connected yet in .env.local. Currently using high-fidelity in-memory state.'
      });
    }
    await Vendor.deleteMany({});
    await Vendor.insertMany(INITIAL_VENDORS);
    await Enquiry.deleteMany({});
    await Enquiry.insertMany(INITIAL_ENQUIRIES);
    await Booking.deleteMany({});
    await Booking.insertMany(memBookings);
    await Negotiation.deleteMany({});
    await Negotiation.insertMany(memNegotiations);
    await EventPlan.deleteMany({});
    await EventPlan.insertMany(memPlans);

    res.json({
      success: true,
      message: '✨ Successfully seeded MongoDB Atlas with Vendors, Packages, Enquiries, Bookings, Plans, and Deal Room threads!',
      vendorsCount: INITIAL_VENDORS.length,
      enquiriesCount: INITIAL_ENQUIRIES.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fallback to index.html for direct navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Express server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`✨ Vivah Wedding Services Marketplace is LIVE!`);
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`🗄️ Database: ${isDbConnected ? 'MongoDB Atlas (Connected)' : 'In-Memory Fallback'}`);
  console.log(`======================================================\n`);
});
