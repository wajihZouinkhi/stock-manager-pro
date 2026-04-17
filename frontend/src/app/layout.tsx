import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'StockManager Pro - Gestion de stock',
  description: 'Application moderne de gestion de stock',
};

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export default function RootLayout({ children }: {children: React.ReactNode}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={sans.variable}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
