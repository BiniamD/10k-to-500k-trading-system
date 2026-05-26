import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '10k → 500k Trading System',
  description: 'AI-Powered Algorithmic Trading Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#05090f] text-white">
        {children}
      </body>
    </html>
  );
}