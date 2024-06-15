import { NextRequest, NextResponse } from 'next/server';
import getMainCategory from '@/lib/backend/category/getMainCategory';

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const categoryList = await getMainCategory();
        return NextResponse.json({ categoryList }, { status: 200 });
    } catch (error) {
        console.error('Error fetching main categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
