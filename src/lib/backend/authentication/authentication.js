import bycript from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import {connectDB, addData, findData} from "@/lib/database.js";
import UserModel from "@/models/UserSchema.js";
import {cookies} from "next/headers";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);


async function encrypt(payload) {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("10 sec from now")
      .sign(key);
}

async function decrypt(token) {
    return await new jwtVerify(token)
      .setProtectedHeader({ alg: "HS256" })
      .setAudience(process.env.JWT_SECRET)
      .verify(key);
}

async function checkEmailExist(email){
    await connectDB();
    const user = await findData(UserModel, {email: email});
    console.log(user);
    return user.length > 0;
}


async function registerUser(data){
    await connectDB();
    const {username, email, password} = data;

    if (await checkEmailExist(email))
        return new Response("User Already Exists");

    const hashedPassword = await bycript.hash(password, 10);

    const user = new UserModel({
        username: username,
        email: email,
        password: hashedPassword
    });

    const result = await addData(user);

    if(result){
        return new Response("User Registered Successfully");
    }else{
        return new Response("User Registration Failed");
    }
}

async function loginUser(data){
    await connectDB();
    const {email, password} = data;
    console.log(email, password);

    if (!await checkEmailExist(email))
        return new Response("User Not Found");

    const user = await findData(UserModel, {email: email});
    const hashedPassword = user[0].password;
    console.log(hashedPassword);

    const match = await bycript.compare(password, hashedPassword);

    if(match){
        const expires = new Date(Date.now() + 90000);
        const session = await encrypt({email: email, expires: expires});
        cookies().set("session", session, {expires: expires});
        return "Login Successful"
    }else{
        return "Login Failed"
    }
}

async function logoutUser(){
    cookies().set("session", "", {expires: new Date(0)});
}

async function getSession(){
    const session = cookies().get("session");
    if(session){
        const data = await decrypt(session);
        return data;
    }else{
        return null;
    }
}

async function updateSession(){
    const session = cookies().get("session");
    if(session){
        const data = await decrypt(session);
        const expires = new Date(Date.now() + 90000);
        const newSession = await encrypt({email: data.email, expires: expires});
        cookies().set("session", newSession, {expires: expires});
    }
}

export {registerUser, loginUser, logoutUser, getSession, updateSession};

