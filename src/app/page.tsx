'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Poppins } from 'next/font/google'
import { motion } from 'framer-motion'
import { LucideCircleChevronDown } from 'lucide-react'
import SparklesText from '@/components/magicui/sparkles-text'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'] })

const motionProps = {
  transition: {
    duration: 1,
  },
  viewport: {
    once: true,
  },
}

export default function Home() {
  return (
    <main className='flex flex-col items-center px-24'>
      <motion.section
        className='flex flex-col items-center justify-between gap-20 mb-20 mt-14'
        initial={{
          opacity: 0,
          y: 100,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        {...motionProps}
      >
        <div className='flex w-full lg:w-[80%] justify-evenly gap-20'>
          <div className='flex flex-col gap-4'>
            <h1
              className={cn(
                'text-6xl font-semibold leading-snug tracking-wider',
                poppins.className,
              )}
            >
              Planning Your<br></br> Wonderful{' '}
              <span className='text-primary relative'>
                Trip!!
                <span className='block absolute -top-1 -left-4 w-52 -z-10'>
                  <img src='highlight.svg'></img>
                </span>
              </span>
            </h1>
            <p className='text-balance mb-20 text-md text-gray-500'>
              Discover the ultimate travel experience with our cutting-edge trip
              planner. <br></br> Utilize the latest AI technology to create
              personalized itineraries, find hidden gems, and optimize your
              journey effortlessly.
            </p>
            <Button className='w-fit text-3xl rounded-full px-10 py-10'>
              Create trip now!
            </Button>
          </div>
          <img
            className='hidden lg:block'
            src='https://placeholder.co/500'
            alt='placeholder'
          />
        </div>
      </motion.section>
      <motion.section
        className='flex flex-col gap-10 w-[70%]'
        initial={{
          opacity: 0,
        }}
        whileInView={{
          opacity: 1,
        }}
        {...motionProps}
      >
        <motion.h2
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          {...motionProps}
          className={cn('text-5xl text-center', poppins.className)}
        >
          Your{' '}
          <SparklesText text='AI-powered' className='text-primary font-bold' />{' '}
          Trip
        </motion.h2>
        <div className='grid grid-cols-7 grid-rows-2 gap-4 auto-rows-min'>
          <motion.img
            src='https://placeholder.co/600?text='
            className='row-span-2 col-span-3 rounded-3xl block h-full'
            initial={{
              opacity: 0,
              x: -100,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            {...motionProps}
          ></motion.img>
          <motion.img
            src='https://placeholder.co/600x300?text='
            className='col-span-4 rounded-3xl block'
            initial={{
              opacity: 0,
              x: 100,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            {...motionProps}
          ></motion.img>
          <motion.img
            src='https://placeholder.co/600x300?text='
            className='col-span-4 rounded-3xl block'
            initial={{
              opacity: 0,
              x: 100,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            {...motionProps}
          ></motion.img>
        </div>
      </motion.section>
    </main>
  )
}
