export type VendorCategory =
  | 'Decoration & Setup'
  | 'Photography & Media'
  | 'Food & Catering'
  | 'Beauty & Personal Care'
  | 'Entertainment & Music'
  | 'Wedding Logistics'
  | 'Rituals & Ceremonies'
  | 'Invitations & Gifts';

export type WeddingEvent =
  | 'Engagement'
  | 'Haldi'
  | 'Mehendi'
  | 'Sangeet'
  | 'Wedding Ceremony'
  | 'Varmala'
  | 'Reception'
  | 'Cocktail Night';

export interface ServicePackage {
  id: string;
  name: string; // e.g. "Royal Heritage Package", "Essential Gold", "Silver Sparkle"
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  event: string;
}

export interface Vendor {
  _id?: string;
  id: string;
  name: string;
  businessName: string;
  tagline: string;
  category: VendorCategory;
  subcategories: string[];
  description: string;
  phone: string;
  email: string;
  state: string;
  district: string;
  taluka: string;
  city: string;
  locality: string;
  coverImage: string;
  gallery: string[];
  startingPrice: number;
  priceUnit: string; // e.g., 'per day', 'per plate', 'per event'
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  yearsOfExperience: number;
  packages: ServicePackage[];
  reviews: Review[];
  supportedEvents: WeddingEvent[];
  featured?: boolean;
}

export interface Enquiry {
  _id?: string;
  id: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventType: WeddingEvent;
  eventDate: string;
  guestCount: number;
  budget: number;
  city: string;
  notes?: string;
  status: 'Pending' | 'Quotation Sent' | 'Accepted' | 'Declined' | 'Completed';
  quotedPrice?: number;
  createdAt: string;
}

export interface WeddingChecklist {
  id: string;
  title: string;
  category: string;
  isDone: boolean;
  dueDate: string;
  assignedEvent: WeddingEvent;
}

export interface EventBudget {
  event: WeddingEvent;
  allocated: number;
  spent: number;
}
