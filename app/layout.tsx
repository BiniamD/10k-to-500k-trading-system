import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '10k → 500k | Trading System',
  description: 'Algorithmic trading command center',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}