import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={cn('min-h-screen flex flex-col', inter.className)}>
        <header className='flex justify-between px-24 py-8'>
          <img src='/logo.svg' alt='logo' />
          <div className='flex gap-2'>
            <Button className='bg-transparent text-md hover:bg-transparent rounded-full text-primary hover:opacity-80'>
              Login
            </Button>
            <Button className='bg-[#0077B6] text-md rounded-full'>
              Sign Up
            </Button>
          </div>
        </header>
        {children}
        <footer className='mt-20 flex px-60 justify-between py-8'>
          <Image src='/logo.svg' alt='logo' width={100} height={100} />
          <section className='flex flex-col'>
            <h3 className='font-bold text-lg'>Gogle</h3>
            <ul>
              <li>About Us</li>
              <li>Help</li>
              <li>FAQs</li>
              <li>Teams</li>
            </ul>
          </section>
          <section className='flex flex-col'>
            <h3 className='font-bold text-lg'>Gogle</h3>
            <ul>
              <li>About Us</li>
              <li>Help</li>
              <li>FAQs</li>
              <li>Teams</li>
            </ul>
          </section>
          <section className='flex flex-col'>
            <h3 className='font-bold text-lg'>Gogle</h3>
            <ul>
              <li>About Us</li>
              <li>Help</li>
              <li>FAQs</li>
              <li>Teams</li>
            </ul>
          </section>
        </footer>
      </body>
    </html>
  );
}
