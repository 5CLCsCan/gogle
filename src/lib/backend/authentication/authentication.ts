import bcrypt from 'bcryptjs';
import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { connectDB, addData, findData } from "@/lib/database";
import UserModel from "@/models/UserSchema";
import { cookies } from "next/headers";

const expireDuration = 24 * 60 * 60 * 1000;
const secretKey = process.env.JWT_SECRET!;
const key = new TextEncoder().encode(secretKey);

interface Payload extends JWTPayload{
  email: string;
  expires: Date;
}

interface RegisterUserData {
  username: string;
  email: string;
  password: string;
}

interface LoginUserData {
  email: string;
  password: string;
}

async function encrypt(payload: Payload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

async function decrypt(input: string): Promise<Payload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"]
  });
  return payload as Payload;
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

