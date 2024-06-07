import bcrypt from 'bcryptjs';
import { connectDB, addData, findData } from "@/lib/database";
import UserModel from "@/models/UserSchema";
import { cookies } from "next/headers";
import {encrypt, decrypt, expireDuration, Payload} from "./session"


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
  await connectDB();
  const { username, email, password } = data;

  if (await checkEmailExist(email))
    return new Response("User Already Exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new UserModel({
    username: username,
    email: email,
    password: hashedPassword
  });

  const result = await addData(user);

  if (result) {
    return new Response("User Registered Successfully");
  } else {
    return new Response("User Registration Failed");
  }
}

async function loginUser(data: LoginUserData): Promise<string | Response> {
  await connectDB();
  const { email, password } = data;

  if (!await checkEmailExist(email))
    return new Response("User Not Found");

  const user = await findData(UserModel, { email: email });
  if (!user) return new Response("User Not Found");
  const hashedPassword = user[0].password;

  const match = await bcrypt.compare(password, hashedPassword);

  if (match) {
    const expires = new Date(Date.now() + expireDuration);
    const session = await encrypt({ email: email, expires: expires });
    cookies().set("session", session, { expires: expires, httpOnly: true });
    return "Login Successful";
  } else {
    return "Invalid Credentials";
  }
}

async function logoutUser(): Promise<void> {
  cookies().set("session", "", { expires: new Date(0) });
}

async function getSession(): Promise<Payload | null> {
  try {
    const session = cookies().get("session")?.value;
    if (session) {
      const data = await decrypt(session);
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error in getSession:", error);
    return null;
  }
}
export { registerUser, loginUser, logoutUser, getSession, decrypt, encrypt};

