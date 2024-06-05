'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'] });

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
});

export default function LoginPage() {
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log(values);
  };

  return (
    <main
      className={cn(
        'min-h-full flex-1 flex flex-col gap-8 items-center justify-center',
        poppins.className
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
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='password'
                    placeholder='Enter your password'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <div className='flex flex-col gap-2'>
            <Button className='rounded-full text-lg py-6 font-normal'>
              Login
            </Button>
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
        <p className='text-md text-gray-600'>Don't have an account yet?</p>
        <Button
          variant='outline'
          className='rounded-full text-primary hover:text-primary border-black text-lg py-6 font-normal lg:w-1/4'
        >
          Create new account
        </Button>
      </section>
    </main>
  );
}
