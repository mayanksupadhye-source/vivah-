const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env.local') });
dotenv.config({ path: path.join(__dirname, '.env') });

const { INITIAL_VENDORS, INITIAL_ENQUIRIES } = require('./public/js/data');

const Vendor = require('./models/Vendor');
const Enquiry = require('./models/Enquiry');
const Booking = require('./models/Booking');
const Negotiation = require('./models/Negotiation');

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env.local or .env');
    console.log('👉 Please add your MongoDB Atlas connection string:');
    console.log('   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/vivah?retryWrites=true&w=majority');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    // 1. Seed Vendors
    await Vendor.deleteMany({});
    await Vendor.insertMany(INITIAL_VENDORS);
    console.log(`✓ Seeded ${INITIAL_VENDORS.length} verified vendors across Rajasthan, Maharashtra, Delhi NCR, and Karnataka.`);

    // 2. Seed Enquiries
    await Enquiry.deleteMany({});
    await Enquiry.insertMany(INITIAL_ENQUIRIES);
    console.log(`✓ Seeded ${INITIAL_ENQUIRIES.length} customer inquiries capturing phone numbers.`);

    // 3. Seed Confirmed Booking
    await Booking.deleteMany({});
    await Booking.create({
      id: 'bk-1001',
      bookingNumber: 'VIVAH-BK-8921',
      enquiryId: 'enq-901',
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
      createdAt: new Date()
    });
    console.log('✓ Seeded initial confirmed booking record.');

    // 4. Seed Negotiation Thread
    await Negotiation.deleteMany({});
    await Negotiation.create({
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
        { id: 'm-1', sender: 'customer', text: 'Namaste Rajesh ji! We loved your Royal Heritage Gold Mandap package. Could we customize the floral backdrop?', time: '10:30 AM' },
        { id: 'm-2', sender: 'vendor', text: 'Pranam Aarav ji! Yes, we can do a high-density fresh Mogra canopy. Standard quotation is ₹2,75,000.', offerPrice: 275000, time: '10:45 AM' },
        { id: 'm-3', sender: 'customer', text: 'Our decor budget is ₹2,40,000. Could we settle at ₹2,45,000?', offerPrice: 245000, time: '11:15 AM' },
        { id: 'm-4', sender: 'vendor', text: 'We can agree to ₹2,48,000 with complimentary cold pyros!', offerPrice: 248000, time: '11:30 AM' }
      ]
    });
    console.log('✓ Seeded initial Deal Room quotation negotiation thread.');

    console.log('\n✨ Database seeding completed successfully! You can now start the server with npm start.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
