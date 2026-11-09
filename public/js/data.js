// Vivah Wedding Services Marketplace - Initial Data
const INITIAL_VENDORS = [
  {
    id: 'v-101',
    name: 'Rajesh & Pooja Sharma',
    businessName: 'Royal Marwar Mandaps & Decorators',
    tagline: 'Palace Style Mandaps & Floral Symphonies for Dream Weddings',
    category: 'Decoration & Setup',
    subcategories: ['Mandap Decoration', 'Floral Designers', 'Theme Lighting', 'Varmala Stages'],
    description: 'With over 14 years of turning royal palace dreams into reality across Udaipur, Jaipur, and Delhi NCR, Royal Marwar creates bespoke mandaps, ethereal floral canopies, and fairy-lit stages tailored to your family heritage.',
    phone: '+91 98290 14523',
    email: 'contact@royalmarwarweddings.com',
    state: 'Rajasthan',
    district: 'Udaipur',
    taluka: 'Girwa',
    city: 'Udaipur',
    locality: 'Fateh Sagar Road',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545232979-fbf68fe9f094?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80'
    ],
    startingPrice: 125000,
    priceUnit: 'per event',
    rating: 4.95,
    reviewCount: 48,
    isVerified: true,
    yearsOfExperience: 14,
    featured: true,
    supportedEvents: ['Engagement', 'Mehendi', 'Sangeet', 'Wedding Ceremony', 'Reception'],
    packages: [
      {
        id: 'pkg-1',
        name: 'Silver Bloom Elegance',
        price: 125000,
        description: 'Ideal for Haldi, Mehendi or intimate engagement ceremonies.',
        features: [
          'Exotic Marigold & Jasmine Floral Backdrop',
          'Traditional Low-seating Diwan & Bolsters (Baithak)',
          'Fairy lights canopy & brass urlis with floating candles',
          'Entrance gate archway with welcome signage',
          'Setup & on-site breakdown team included'
        ]
      },
      {
        id: 'pkg-2',
        name: 'Royal Heritage Gold Mandap',
        price: 275000,
        description: 'Complete Wedding ceremony setup with 4-pillar Carved Mandap.',
        isPopular: true,
        features: [
          'Grand 4-Pillar Carved Wooden Mandap with Fresh Lotus & Rose Drapes',
          'Varmala Hydraulic Revolving Stage with Pyros & Cold Sparks',
          'Pathway runner with floral pillars and antique lanterns',
          'Bride & Groom Royal Throne Chairs with Hawan Kund setup',
          'Complete Ambient LED Uplighting for 500 guests venue'
        ]
      },
      {
        id: 'pkg-3',
        name: 'Maharaja Palace Extravaganza',
        price: 550000,
        description: 'Turn-key 3-day multi-function royal setup for mega destination weddings.',
        features: [
          'Comprehensive 3-day themes (Sangeet LED stage + Mandap + Reception)',
          'High-density Imported Dutch Roses & Orchids installation',
          'Truss structure with moving head beam lights & laser effects',
          'Dedicated creative director and 30-member round-the-clock crew',
          'Custom 3D walkthrough preview before execution'
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        customerName: 'Ananya & Siddharth Singhania',
        rating: 5,
        date: 'Oct 2026',
        event: 'Wedding Ceremony',
        comment: 'Rajesh ji and his team created sheer magic at Jagmandir Island for our pheras. The floral mandap looked straight out of a royal miniature painting. Our guests are still raving about the decor!'
      },
      {
        id: 'rev-2',
        customerName: 'Vikram Mehta',
        rating: 5,
        date: 'Aug 2026',
        event: 'Sangeet',
        comment: 'Flawless execution! Delivered beyond what was promised in the 3D render. The lighting created such an energetic vibe for the sangeet performances.'
      }
    ]
  },
  {
    id: 'v-102',
    name: 'Karan Mehra',
    businessName: 'Drishti CineWeddings & Photography',
    tagline: 'Timeless Stories, Cinematic 4K Teasers & Drone Masterpieces',
    category: 'Photography & Media',
    subcategories: ['Candid Wedding Photography', 'Cinematic Films', 'Drone Footage', 'Pre-Wedding Shoots'],
    description: 'Award-winning team of visual storytellers specializing in capturing unscripted family emotions, royal bridal portraits, and high-energy sangeet music videos.',
    phone: '+91 98112 87640',
    email: 'karan@drishticineweddings.in',
    state: 'Maharashtra',
    district: 'Mumbai',
    taluka: 'Andheri',
    city: 'Mumbai',
    locality: 'Juhu Tara Road',
    coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80'
    ],
    startingPrice: 85000,
    priceUnit: 'per day',
    rating: 4.92,
    reviewCount: 39,
    isVerified: true,
    yearsOfExperience: 9,
    featured: true,
    supportedEvents: ['Engagement', 'Haldi', 'Mehendi', 'Sangeet', 'Wedding Ceremony', 'Reception'],
    packages: [
      {
        id: 'pkg-201',
        name: 'Classic Candid Day',
        price: 85000,
        description: 'Complete photo coverage for a single main ceremony day.',
        features: [
          '1 Senior Candid Photographer + 1 Traditional Photographer',
          '350+ Retouched High-Resolution Color-Graded Digital Photos',
          'Live Sneak Peek gallery delivered within 48 hours for Instagram',
          'Premium Hardbound Leatherette Coffee Table Album (35 leaves)'
        ]
      },
      {
        id: 'pkg-202',
        name: 'The Royal Cinematic Chronicle',
        price: 195000,
        description: 'Full 2-day wedding film & photography with 4K Drone coverage.',
        isPopular: true,
        features: [
          '2 Candid Photographers + 2 Cinematographers + 1 Licensed Drone Pilot',
          '3 to 5 Minute Bollywood-style Cinematic Teaser',
          'Full-length 30-45 Minute Wedding Documentary Film with audio vows',
          '2 Deluxe Velvet-finished Albums + Parent Minibooks',
          'Raw footage provided on encrypted 1TB SSD drive'
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-201',
        customerName: 'Rhea & Aditya Kapoor',
        rating: 5,
        date: 'Sep 2026',
        event: 'Wedding Ceremony',
        comment: 'Karan captured tears and smiles we didn’t even realize happened. The 4K wedding trailer made our entire extended family cry happy tears. Highly recommend!'
      }
    ]
  },
  {
    id: 'v-103',
    name: 'Chef Harinder Singh & Brothers',
    businessName: 'Shahi Dawat Caterers & Live Counters',
    tagline: 'Royal Awadhi, Rajasthani & Continental Gastronomic Feasts',
    category: 'Food & Catering',
    subcategories: ['Multi-cuisine Catering', 'Live Food Counters', 'Artisan Desserts', 'Beverages & Mocktails'],
    description: 'Serving unforgettable culinary journeys across Delhi, Punjab, and Rajasthan. From authentic Dal Baati Churma and fragrant Awadhi Dum Biryanis to live Mexican and wood-fired Pizza stations.',
    phone: '+91 99100 45892',
    email: 'bookings@shahidawat.com',
    state: 'Delhi',
    district: 'New Delhi',
    taluka: 'South Delhi',
    city: 'New Delhi',
    locality: 'Chattarpur Enclave',
    coverImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
    ],
    startingPrice: 1450,
    priceUnit: 'per plate',
    rating: 4.88,
    reviewCount: 64,
    isVerified: true,
    yearsOfExperience: 18,
    featured: true,
    supportedEvents: ['Engagement', 'Sangeet', 'Wedding Ceremony', 'Reception'],
    packages: [
      {
        id: 'pkg-301',
        name: 'Regal Feast Buffet',
        price: 1450,
        description: 'Exquisite 75-item spread with 4 live interactive counters.',
        features: [
          '8 Welcome Mocktails & Shakes with dry-ice presentation',
          '12 Starters (Paneer Tikka, Galouti Kebabs, Dimsums, Chaat Station)',
          'Full Course North Indian, Continental & Pan-Asian Main Course',
          'Hot Jalebis with Rabri, Gulab Jamuns, Nitrogen Ice-Cream Bar',
          'Trained uniformed stewards & royal copper buffet tableware'
        ]
      },
      {
        id: 'pkg-302',
        name: 'The Imperial Grand Banquet',
        price: 2250,
        description: 'Ultra-luxury gourmet dining for high-profile receptions.',
        isPopular: true,
        features: [
          '12 Live Global Specialty Stations (Turkish Mezze, Sushi, Teppanyaki)',
          'Gold-rimmed Bone China crockery and silver cutlery service',
          'Artisan Mithai Tasting Lounge & Handcrafted Belgian Chocolate fountain',
          'Dedicated VIP Butler table service for immediate family members'
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-301',
        customerName: 'Gaurav Aggarwal',
        rating: 5,
        date: 'Nov 2026',
        event: 'Reception',
        comment: 'The food was the biggest highlight of our wedding! Every guest praised the live chaat counter and the Dal Bukhara. Cleanliness and presentation were immaculate.'
      }
    ]
  },
  {
    id: 'v-104',
    name: 'Zareen & Nazia Khan',
    businessName: 'Noor Bridal Studio & Organic Mehendi',
    tagline: 'HD Airbrush Bridal Glamour & Intricate Bridal Henna Stories',
    category: 'Beauty & Personal Care',
    subcategories: ['Bridal Makeup', 'Airbrush Makeup', 'Organic Mehendi', 'Hairstyling'],
    description: 'Celebrity-endorsed bridal makeup artists trained in London and Mumbai. Using 100% natural organic Rajasthani Sojat henna and top international beauty brands like Charlotte Tilbury, Dior, and MAC.',
    phone: '+91 97654 32189',
    email: 'noorbridalstudio@gmail.com',
    state: 'Rajasthan',
    district: 'Jaipur',
    taluka: 'Sanganer',
    city: 'Jaipur',
    locality: 'C-Scheme',
    coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80'
    ],
    startingPrice: 28000,
    priceUnit: 'per bride',
    rating: 4.96,
    reviewCount: 52,
    isVerified: true,
    yearsOfExperience: 10,
    featured: true,
    supportedEvents: ['Engagement', 'Haldi', 'Mehendi', 'Sangeet', 'Wedding Ceremony', 'Reception'],
    packages: [
      {
        id: 'pkg-401',
        name: 'Bridal Glow HD Makeover',
        price: 28000,
        description: 'Complete high-definition makeover for the bride on her D-Day.',
        features: [
          'Pre-bridal skin prep and hydration treatment',
          'Luxury HD Waterproof Makeup (MAC, Huda Beauty, NARS)',
          'Elaborate bridal hair styling with fresh floral accessories',
          'Dupatta draping and jewelry setting assistance',
          'Mini touch-up emergency kit included'
        ]
      },
      {
        id: 'pkg-402',
        name: 'Royal Bride & Family Trio Package',
        price: 55000,
        description: 'Bridal airbrush makeup + hair & makeup for Mother & Sister.',
        isPopular: true,
        features: [
          'Ultra-long lasting Airbrush makeup with Dior & Charlotte Tilbury',
          'Intricate customized bridal henna depicting couple portrait & vows',
          'Makeup & Hair for 2 close family members (Mother / Sister of Bride)',
          'On-venue traveling team anywhere in the city'
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-401',
        customerName: 'Priyanka Rathore',
        rating: 5,
        date: 'Jul 2026',
        event: 'Wedding Ceremony',
        comment: 'Zareen made me look and feel like a true Rajput princess without feeling cakey or heavy. The makeup lasted 14 hours through emotional pheras and reception without a smudge!'
      }
    ]
  },
  {
    id: 'v-105',
    name: 'DJ Neil & The Beats Collective',
    businessName: 'Dhol & Decibels Entertainment',
    tagline: 'High-Octane Sangeet DJs, Live Punjabi Dhol Troupes & Emcees',
    category: 'Entertainment & Music',
    subcategories: ['Wedding DJ', 'Punjabi Dhol', 'Anchor & Emcee', 'LED Dance Floor'],
    description: 'We bring concerts to wedding sangeets! Featuring top-chart Bollywood, Punjabi, Retro, and EDM sets with state-of-the-art JBL VTX Line Arrays, smoke blasters, and synchronized visual screens.',
    phone: '+91 98205 77612',
    email: 'contact@dholdecibels.com',
    state: 'Maharashtra',
    district: 'Pune',
    taluka: 'Haveli',
    city: 'Pune',
    locality: 'Koregaon Park',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'
    ],
    startingPrice: 45000,
    priceUnit: 'per night',
    rating: 4.87,
    reviewCount: 31,
    isVerified: true,
    yearsOfExperience: 8,
    supportedEvents: ['Sangeet', 'Cocktail Night', 'Reception'],
    packages: [
      {
        id: 'pkg-501',
        name: 'Club Sangeet Stunner',
        price: 45000,
        description: '5-hour high energy party set with DJ & professional sound console.',
        features: [
          'Professional Wedding DJ with bilingual Anchor/Emcee',
          'High fidelity Line Array Sound System (up to 400 pax)',
          '4 Sharp Moving Heads + 2 CO2 Fog Jets for dramatic drops',
          'Curated customized song track edits for family dance performances'
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-501',
        customerName: 'Kunal Deshmukh',
        rating: 5,
        date: 'Oct 2026',
        event: 'Sangeet',
        comment: 'Nobody left the dance floor until 4 AM! DJ Neil kept the energy peaked throughout. The family choreography music mixing was spot on.'
      }
    ]
  },
  {
    id: 'v-106',
    name: 'Pandit Vidyadhar Shastri',
    businessName: 'Vedic Mangal Vivah Sanskar',
    tagline: 'Authentic Sanatan Rituals with English & Hindi Meaningful Explanations',
    category: 'Rituals & Ceremonies',
    subcategories: ['Vedic Pandits', 'Havan Kund Setup', 'Pooja Samagri', 'Kundali Matching'],
    description: 'Honoring ancient Sanskrit wedding mantras with deep emotional warmth. Pandit ji explains the spiritual significance of the Seven Pheras and vows so both the couple and foreign or modern guests deeply resonate.',
    phone: '+91 94140 68211',
    email: 'shastriji@vedicmangal.org',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    taluka: 'Bengaluru North',
    city: 'Bengaluru',
    locality: 'Malleshwaram',
    coverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'],
    startingPrice: 21000,
    priceUnit: 'per ceremony',
    rating: 4.98,
    reviewCount: 44,
    isVerified: true,
    yearsOfExperience: 22,
    supportedEvents: ['Engagement', 'Wedding Ceremony'],
    packages: [
      {
        id: 'pkg-601',
        name: 'Sampoorna Vedic Pheras',
        price: 21000,
        description: 'Complete sacred wedding solemnization with authentic Vedic chanting.',
        features: [
          'Senior Shastri ji + Assistant Acharya',
          'Complete pure organic Pooja Samagri kit (pure desi ghee, gangajal, hawan samagri)',
          'Clear bilingual explanation of Saptapadi (7 Vows) in Hindi and English',
          'Lagna Kundali manuscript blessing certificate for the newlywed couple'
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-601',
        customerName: 'Tanvi & Rahul Iyer',
        rating: 5,
        date: 'Sep 2026',
        event: 'Wedding Ceremony',
        comment: 'Shastri ji made our ceremony so memorable and soulful. Even our friends from abroad understood the profound beauty behind every vow.'
      }
    ]
  },
  {
    id: 'v-107',
    name: 'Vikramaditya Rathore',
    businessName: 'Rajputana Vintage Car & Guest Logistics',
    tagline: 'Classic 1930s Convertibles, Luxury Fleets & Seamless Airport Transfers',
    category: 'Wedding Logistics',
    subcategories: ['Vintage Cars', 'Luxury Coaches', 'Guest Shuttles', 'Valet Management'],
    description: 'Ensure your guests travel in comfort and the groom makes a head-turning grand entry in restored vintage Rolls Royces, Impalas, and Jaguars, backed by a fleet of pristine Toyota Innova Hycross and Volvo coaches.',
    phone: '+91 98292 90014',
    email: 'fleet@rajputanavintage.com',
    state: 'Rajasthan',
    district: 'Jaipur',
    taluka: 'Amer',
    city: 'Jaipur',
    locality: 'MI Road',
    coverImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'],
    startingPrice: 35000,
    priceUnit: 'per rental',
    rating: 4.89,
    reviewCount: 28,
    isVerified: true,
    yearsOfExperience: 12,
    supportedEvents: ['Wedding Ceremony', 'Reception'],
    packages: [
      {
        id: 'pkg-701',
        name: 'Royal Groom Vintage Entry',
        price: 35000,
        description: 'Chauffeured open-top Vintage Car decorated for the royal Baraat entry.',
        features: [
          'Choice of restored 1948 Chevrolet Fleetmaster or 1936 Ford Cabriolet',
          'Dressed chauffeur in royal Rajputana attire with turban',
          'Custom floral garland embellishment',
          '4 hours on-site coverage with fuel and permits'
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-701',
        customerName: 'Devendra Shekhawat',
        rating: 5,
        date: 'Nov 2026',
        event: 'Wedding Ceremony',
        comment: 'The car was immaculate and started on the first crank. Groom entry photos turned out magnificent!'
      }
    ]
  },
  {
    id: 'v-108',
    name: 'Sunita & Deepali Jain',
    businessName: 'Patrika Royal Laser Invitations & Gifting',
    tagline: 'Velvet Box Invites, Gold Foil Motifs & Curated Dry Fruit Trousseau Hampers',
    category: 'Invitations & Gifts',
    subcategories: ['Custom Box Invites', 'Digital Video Invites', 'Return Favors', 'Trousseau Packing'],
    description: 'First impressions of your wedding begin with the invitation. We craft bespoke silk and velvet invitation suites with personalized wax seals, NFC embedded smart cards, and artisanal gourmet return favors.',
    phone: '+91 98201 12344',
    email: 'info@patrikainvites.com',
    state: 'Gujarat',
    district: 'Ahmedabad',
    taluka: 'Ahmedabad City',
    city: 'Ahmedabad',
    locality: 'Bodakdev',
    coverImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'],
    startingPrice: 180,
    priceUnit: 'per invitation',
    rating: 4.91,
    reviewCount: 35,
    isVerified: true,
    yearsOfExperience: 7,
    supportedEvents: ['Engagement', 'Wedding Ceremony', 'Reception'],
    packages: [
      {
        id: 'pkg-801',
        name: 'Royal Velvet Suede Suite',
        price: 350,
        description: 'Luxury box with laser-cut gold foil inserts and brass monogram lock.',
        features: [
          'Rigid imported box wrapped in royal burgundy velvet',
          '4 Multi-color gold embossed ceremony insert cards',
          'Personalized couple monogram brass coin',
          'Complementary MP4 animated WhatsApp invite for mobile broadcast'
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-801',
        customerName: 'Bhavna Kothari',
        rating: 5,
        date: 'Oct 2026',
        event: 'Engagement',
        comment: 'The quality of paper and gold foil finishing was beyond our expectations. All our relatives called us just to compliment the wedding cards!'
      }
    ]
  }
];

const INITIAL_ENQUIRIES = [
  {
    id: 'enq-901',
    vendorId: 'v-101',
    vendorName: 'Royal Marwar Mandaps & Decorators',
    vendorCategory: 'Decoration & Setup',
    customerName: 'Aarav Malhotra',
    customerPhone: '+91 98199 44321',
    customerEmail: 'aarav.malhotra@gmail.com',
    eventType: 'Wedding Ceremony',
    eventDate: '2026-12-18',
    guestCount: 450,
    budget: 300000,
    city: 'Udaipur',
    notes: 'Require a royal lotus-themed mandap for lakeside wedding at Fateh Garh.',
    status: 'Pending',
    createdAt: '2026-11-08T10:30:00Z'
  },
  {
    id: 'enq-902',
    vendorId: 'v-102',
    vendorName: 'Drishti CineWeddings & Photography',
    vendorCategory: 'Photography & Media',
    customerName: 'Simran Bajaj',
    customerPhone: '+91 98200 87654',
    customerEmail: 'simran.b@outlook.com',
    eventType: 'Sangeet',
    eventDate: '2026-12-15',
    guestCount: 300,
    budget: 180000,
    city: 'Mumbai',
    notes: 'Looking for 4K drone + teaser video with candid moments.',
    status: 'Quotation Sent',
    quotedPrice: 195000,
    createdAt: '2026-11-07T14:15:00Z'
  },
  {
    id: 'enq-903',
    vendorId: 'v-104',
    vendorName: 'Noor Bridal Studio & Organic Mehendi',
    vendorCategory: 'Beauty & Personal Care',
    customerName: 'Ishita Sen',
    customerPhone: '+91 98711 23456',
    customerEmail: 'ishita.sen@yahoo.com',
    eventType: 'Wedding Ceremony',
    eventDate: '2026-12-22',
    guestCount: 200,
    budget: 50000,
    city: 'Jaipur',
    notes: 'Need airbrush bridal makeup and styling for mother of the bride.',
    status: 'Accepted',
    quotedPrice: 52000,
    createdAt: '2026-11-06T09:00:00Z'
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { INITIAL_VENDORS, INITIAL_ENQUIRIES };
}
