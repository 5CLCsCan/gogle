import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/backend/authentication/authentication';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    console.log('Request:', { username, email, password });

    if (!username || !email || !password) {
      return new NextResponse(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
    }

    const response = await registerUser({ username, email, password });

    if (response.status === 200) {
      return new NextResponse(JSON.stringify({ message: 'User Registered Successfully' }), { status: 200 });
    } else {
      return new NextResponse(JSON.stringify({ message: response.statusText }), { status: 400 });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
