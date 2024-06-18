import { NextRequest, NextResponse } from 'next/server';
import getMainCategory from '@/lib/backend/category/getMainCategory';

/**
 * @swagger
 * /api/maincategory:
 *   get:
 *     summary: Retrieve a list of main categories
 *     description: Fetches a list of main categories from the database.
 *     responses:
 *       200:
 *         description: A JSON array of category names
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categoryList:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const categoryList = await getMainCategory();
        return NextResponse.json({ categoryList }, { status: 200 });
    } catch (error) {
        console.error('Error fetching main categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
