import type { Metadata } from 'next';
import { Instrument_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { clsx } from 'clsx';
import BackgroundMusic from '@/components/BackgroundMusic';

const font = Instrument_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cozy Mission',
  description: 'Take a break, earn rewards.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(font.className, "antialiased")}>
        <Providers>{children}</Providers>
        <BackgroundMusic />
      </body>
    </html>
  );
}
