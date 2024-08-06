import UserModel from '@/models/UserSchema'
import { connectDB, findData } from '@/lib/backend/database'

export default async function fetchUserIDByToken(token: string): Promise<string | null> {
  try {
    await connectDB();

    const obj = JSON.parse(token);

    const userEmail = obj.email;    
    
    let user = await findData(UserModel, { email: userEmail });
    if (!user) {
      console.error('User not found');
      return null;
    }
    if (user.length > 0) {
      user = [user[0]];
    }
    if (!user[0]._id) {
      console.error('User ID not found');
      return null;
    }
    return (user[0]._id).toString();
  } catch (err) {
    console.error('Error fetching user ID:', err);
    return null;
  }
}
