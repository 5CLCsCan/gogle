import bcrypt from 'bcryptjs';
import { connectDB, addData, findData } from "@/lib/database";
import UserModel from "@/models/UserSchema";
import {encrypt, decrypt, expireDuration, Payload} from "./session"
import { cookies } from "next/headers";


interface RegisterUserData {
  username: string;
  email: string;
  password: string;
}

interface LoginUserData {
  email: string;
  password: string;
}


async function checkEmailExist(email: string): Promise<boolean> {
  await connectDB();
  const user = await findData(UserModel, { email: email });
  if (!user) return false;
  return user.length > 0;
}

async function registerUser(data: RegisterUserData): Promise<Response> {
  try{
    await connectDB();
    const { username, email, password } = data;

    if (await checkEmailExist(email)){
      return new Response(JSON.stringify({success: false, error: "Email already exists"}), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      username: username,
      email: email,
      password: hashedPassword
    });

    const result = await addData(user);
    return new Response(JSON.stringify({success: true, data: user}), { status: 200 });
  }
  catch(error){
    return new Response(JSON.stringify({success: false, error: error}), { status: 500 });
  }
}

async function loginUser(data: LoginUserData): Promise<string | Response> {
  try{
    await connectDB();
    const { email, password } = data;

    const user = await findData(UserModel, { email: email });
    if (!user)
      return new Response(JSON.stringify({success: false, error: "User not found"}), { status: 404 });

    const hashedPassword = user[0].password;

    const match = await bcrypt.compare(password, hashedPassword);

    if (match) {
      const expires = new Date(Date.now() + expireDuration);
      const session = await encrypt({ email: email, expires: expires });
      cookies().set("session", session, { expires: expires, httpOnly: true });
      return new Response(JSON.stringify({success: true, data: user}), { status: 200 });
    } else {
      return new Response(JSON.stringify({success: false, error: "Invalid credentials"}), { status: 400 });
    }
  }
  catch{
    return new Response(JSON.stringify({success: false, error: "Internal Server Error"}), { status: 500 });
  }
}

async function logoutUser(): Promise<void> {
  cookies().set("session", "", { expires: new Date(0) });
}

export { registerUser, loginUser, logoutUser};

