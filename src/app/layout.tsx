import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gogle - The trip planning app',
  description: 'Best project ever',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={cn('min-h-screen flex flex-col', inter.className)}>
        <Header />
        {children}
        <footer className='mt-20 flex px-60 justify-between items-center py-8'>
          <img src='/logo.png' alt='logo' className='h-[50px]' />
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
  )
}
