/**
 * Vivah API Client
 * Centralised fetch wrapper pointing to the Next.js Node.js API backend.
 * Handles JWT bearer authentication, error formatting, and type-safe payloads.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
  token?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class VivahApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('vivah_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('vivah_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vivah_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.error || data.message || `Request failed (${res.status})`,
        };
      }

      return data;
    } catch (err: any) {
      // If Express backend is unreachable, fall back to Next.js API routes
      console.warn(`Backend unreachable (${endpoint}), falling back to /api routes`);
      try {
        const fallbackRes = await fetch(`/api${endpoint}`, {
          ...options,
          headers: { 'Content-Type': 'application/json' },
        });
        return await fallbackRes.json();
      } catch {
        return { success: false, error: err.message || 'Network error' };
      }
    }
  }

  // ─── Auth ───────────────────────────────────────────────────────────

  async register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: 'customer' | 'vendor';
    city?: string;
    state?: string;
  }) {
    const res = await this.request<any>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.success && res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async login(data: { email?: string; phone?: string; password: string }) {
    const res = await this.request<any>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.success && res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async getMe() {
    return this.request<any>('/api/auth/me');
  }

  logout() {
    this.clearToken();
  }

  // ─── Vendors ────────────────────────────────────────────────────────

  async getVendors(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<any[]>(`/api/vendors${query}`);
  }

  async getVendor(id: string) {
    return this.request<any>(`/api/vendors/${id}`);
  }

  async createVendor(data: any) {
    return this.request<any>('/api/vendors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateVendor(id: string, data: any) {
    return this.request<any>(`/api/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteVendor(id: string) {
    return this.request<any>(`/api/vendors/${id}`, { method: 'DELETE' });
  }

  async addReview(vendorId: string, data: { rating: number; comment: string; event: string }) {
    return this.request<any>(`/api/vendors/${vendorId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCategoryStats() {
    return this.request<any[]>('/api/vendors/categories/stats');
  }

  async getCities() {
    return this.request<any[]>('/api/vendors/cities');
  }

  // ─── Enquiries ──────────────────────────────────────────────────────

  async getEnquiries(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<any[]>(`/api/enquiries${query}`);
  }

  async getEnquiry(id: string) {
    return this.request<any>(`/api/enquiries/${id}`);
  }

  async createEnquiry(data: {
    vendorId: string;
    vendorName: string;
    vendorCategory: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    eventType: string;
    eventDate: string;
    guestCount?: number;
    budget: number;
    city: string;
    notes?: string;
  }) {
    return this.request<any>('/api/enquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEnquiryStatus(id: string, data: { status: string; quotedPrice?: number }) {
    return this.request<any>(`/api/enquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // ─── Event Plans ────────────────────────────────────────────────────

  async getEventPlans() {
    return this.request<any[]>('/api/event-plans');
  }

  async createEventPlan(data: any) {
    return this.request<any>('/api/event-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEventPlan(id: string, data: any) {
    return this.request<any>(`/api/event-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ─── Bookings ───────────────────────────────────────────────────────

  async getBookings(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<any[]>(`/api/bookings${query}`);
  }

  async createBooking(data: { enquiryId: string; agreedPrice: number }) {
    return this.request<any>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBookingPayment(id: string, data: { amount: number; type: 'advance' | 'full' }) {
    return this.request<any>(`/api/bookings/${id}/payment`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateBookingStatus(id: string, data: { bookingStatus: string }) {
    return this.request<any>(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // ─── Negotiations ──────────────────────────────────────────────────

  async getNegotiation(enquiryId: string) {
    return this.request<any>(`/api/negotiations/${enquiryId}`);
  }

  async sendNegotiationMessage(enquiryId: string, data: { text: string; offerPrice?: number }) {
    return this.request<any>(`/api/negotiations/${enquiryId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async lockNegotiation(enquiryId: string) {
    return this.request<any>(`/api/negotiations/${enquiryId}/lock`, {
      method: 'PATCH',
    });
  }

  // ─── Admin ──────────────────────────────────────────────────────────

  async getAdminStats() {
    return this.request<any>('/api/admin/stats');
  }

  async getAdminUsers(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<any[]>(`/api/admin/users${query}`);
  }

  async updateUserRole(userId: string, role: string) {
    return this.request<any>(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async verifyVendor(vendorId: string) {
    return this.request<any>(`/api/admin/vendors/${vendorId}/verify`, {
      method: 'PATCH',
    });
  }

  // ─── Seed ───────────────────────────────────────────────────────────

  async seedDatabase() {
    return this.request<any>('/api/seed', { method: 'POST' });
  }
}

export const api = new VivahApiClient(BACKEND_URL);
export default api;
