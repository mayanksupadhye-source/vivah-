import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Vivah - India’s Premier Multi-Vendor Wedding Services Marketplace',
  description:
    'Discover, compare, negotiate and book verified wedding decorators, caterers, photographers, bridal makeup artists, DJs, and pandits for your dream wedding across India.',
  keywords: [
    'wedding marketplace',
    'indian wedding planner',
    'wedding decorators',
    'wedding photography',
    'caterers',
    'bridal makeup',
    'mandap decoration',
    'sangeet dj',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased selection:bg-rose-900 selection:text-amber-200">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
