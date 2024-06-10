import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/backend/authentication/session';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  return await updateSession(request);
}
