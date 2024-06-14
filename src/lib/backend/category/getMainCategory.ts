import { CategoryModel } from '@/models/CategorySchema';
import { connectDB, findData } from '@/lib/database';

export default async function getMainCategory(): Promise<string[]> {
    await connectDB();
    const category = await findData(CategoryModel, { type: 'mainCategory' });
    if (!category) return [];

    const categoryNames: string[] = [];
    category.forEach((element: any) => {
        categoryNames.push(element.name);
    });
    return categoryNames;
}
