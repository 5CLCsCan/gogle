'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Poppins } from 'next/font/google'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import useAuthRedirect from '@/hooks/useAuthRedirect'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'] })

const loginSchema = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters long',
  }),
  email: z.string().email(),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const respone = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!respone.ok) {
      const data = await respone.json()
      switch (data.error) {
        case 'Username already exists':
          loginForm.setError('username', {
            type: 'manual',
            message: 'Username already existed',
          })
          break
        case 'Email already exists':
          loginForm.setError('email', {
            type: 'manual',
            message: 'Email already exists',
          })
          break
      }
      return
    }

    const data = await respone.json()
    localStorage.setItem('accessToken', data.token)
    window.location.href = '/'
  }

  return !useAuthRedirect() ? (
    <main
      className={cn(
        'min-h-full flex-1 flex flex-col gap-8 items-center justify-center',
        poppins.className,
      )}
    >
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit(onSubmit)}
          className='flex flex-col gap-4 border border-gray-400 w-fit p-8 rounded-xl shadow-md lg:w-4/12'
        >
          <div className='text-center'>
            <h1 className={'text-3xl text-primary'}>Create an account</h1>
            <p className='text-sm font-normal text-gray-500'>
              Already have an account?{' '}
              <Link className='underline hover:text-primary' href={'/login'}>
                Login
              </Link>
            </p>
          </div>
          <FormField
            control={loginForm.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>What should we call you?</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='text'
                    placeholder='Enter your profile name'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>What&#39;s your email?</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='email'
                    placeholder='Enter your email'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name='password'
            render={({ field }) => (
              <FormItem className='relative'>
                <div className='flex justify-between items-center'>
                  <FormLabel>Create a password</FormLabel>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='h-auto'
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? (
                      <>
                        <EyeSlashIcon className='size-4 text-black mr-1' />
                        Hide
                      </>
                    ) : (
                      <>
                        <EyeIcon className='size-4 text-black mr-1' />
                        Show
                      </>
                    )}
                    <span className='sr-only'>
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <div className='flex flex-col gap-2'>
            <p className='text-sm text-gray-500 text-center text-pretty'>
              By creating an account, you agree to the{' '}
              <Link
                href={'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
                className='underline'
              >
                Terms of use
              </Link>{' '}
              and{' '}
              <Link
                href={'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
                className='underline'
              >
                Privacy Policy.
              </Link>
            </p>
            <Button className='rounded-full text-lg py-6 font-normal'>
              Create
            </Button>
          </div>
        </form>
      </Form>
    </main>
  ) : null
}
