import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';
import Link from 'next/link';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'] });

export default function LoginPage() {
  return (
    <main
      className={cn(
        'min-h-full flex-1 flex flex-col gap-8 items-center justify-center',
        poppins.className
      )}
    >
      <form className='flex flex-col gap-4 border border-gray-400 w-fit p-8 rounded-xl shadow-md lg:w-1/4'>
        <h1 className={'text-2xl text-center text-primary'}>Login</h1>
        <div className='flex flex-col'>
          <label>Email</label>
          <input type='email' placeholder='Enter your email' />
        </div>
        <div className='flex flex-col'>
          <label>Password</label>
          <input type='password' placeholder='Enter your password' />
        </div>
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
