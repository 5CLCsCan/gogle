'use client'

import { useEffect, useState } from 'react'
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
import { withPublic } from '@/utils/withPublic'
import ButtonLoading from '@/components/ButtonLoading'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'] })

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
})

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true)
    const respone = await fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    setIsLoading(false)

    if (!respone.ok) {
      const data = await respone.json()
      console.log(data)

      loginForm.setError('root.generic', {
        type: 'manual',
        message: data.error,
      })
    } else {
      const data = await respone.json()
      localStorage.setItem('accessToken', data.token)
      window.location.href = '/'
    }
  }

  useEffect(() => {
    if (window.localStorage.getItem('accessToken')) {
      window.location.href = '/'
    }
  }, [])

  return (
    <main
      className={cn(
        'min-h-full flex-1 flex flex-col gap-8 items-center justify-center',
        poppins.className,
      )}
    >
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit(onSubmit)}
          className='flex flex-col gap-4 border border-gray-400 w-fit p-8 rounded-xl shadow-md lg:w-1/4'
        >
          <h1 className={'text-2xl text-center text-primary'}>Login</h1>
          <FormField
            control={loginForm.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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
                  <FormLabel>Password</FormLabel>
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
          {loginForm.formState.errors.root?.generic && (
            <FormMessage className='text-red-500'>
              {loginForm.formState.errors.root.generic.message}
            </FormMessage>
          )}
          <div className='flex flex-col gap-2'>
            <ButtonLoading
              isLoading={isLoading}
              text='Login'
              onClick={loginForm.handleSubmit(onSubmit)}
            />
            <Link
              className='text-center text-gray-500 text-sm hover:text-primary'
              href={'/register'}
            >
              Forgotten password?
            </Link>
          </div>
        </form>
      </Form>
      <section className='w-full flex items-center flex-col gap-1'>
        <p className='text-md text-gray-600'>Don&#39;t have an account yet?</p>
        <Button
          variant='outline'
          className='rounded-full text-primary hover:text-primary border-black text-lg py-6 font-normal lg:w-1/4'
          onClick={() => {
            window.location.href = '/signup'
          }}
        >
          Create new account
        </Button>
      </section>
    </main>
  )
}

export default withPublic(LoginPage)
