import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './lib/backend/authentication/jwt';

export async function middleware(request: NextRequest) {
    // get token from bearer token
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
        return NextResponse.json({error: "Token not existed"});
    }

    // decrypt token
    const { pathname } = request.nextUrl;
    const result = await decrypt(token);
    if (result.error){
        if (result.error === 'Token expired' && pathname === "/api/auth/gettoken"){
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('decoded', JSON.stringify(result.payload));
            return NextResponse.next({
                request: {
                    headers: requestHeaders
                }
            });
        }
        else return NextResponse.json(result);
    }
    request.headers.set('decoded', JSON.stringify(result.payload));
    return NextResponse.next();
}
 
export const config = {
    matcher: ['/api/auth/((?!signin|signup).*)']
}
