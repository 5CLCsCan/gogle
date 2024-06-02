import bycript from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { connectDB, addData, findData } from "@/lib/database.js";
import UserModel from "@/models/UserSchema.js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


// expire in 24 hours
const expireDuration = 24 * 60 * 60 * 1000;
const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);


async function encrypt(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24 hours from now")
        .sign(key);
}

async function decrypt(input) {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"]
    })
    return payload;
}

async function checkEmailExist(email) {
    await connectDB();
    const user = await findData(UserModel, { email: email });
    //console.log(user);
    return user.length > 0;
}


async function registerUser(data) {
    await connectDB();
    const { username, email, password } = data;

    if (await checkEmailExist(email))
        return new Response("User Already Exists");

    const hashedPassword = await bycript.hash(password, 10);

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

async function loginUser(data) {
    await connectDB();
    const { email, password } = data;
    //console.log(email, password);

    if (!await checkEmailExist(email))
        return new Response("User Not Found");

    const user = await findData(UserModel, { email: email });
    const hashedPassword = user[0].password;
    // console.log(hashedPassword);

    const match = await bycript.compare(password, hashedPassword);

    if (match) {
        const expires = new Date(Date.now() + expireDuration);
        const session = await encrypt({ email: email, expires: expires });
        cookies().set("session", session, { expires: expires, httpOnly: true });
        return "Login Successful";
    } else {
        return "Invalid Credentials";
    }
}

async function logoutUser() {
    cookies().set("session", "", { expires: new Date(0) });
}


async function getSession() {
    try {
        const session = cookies().get("session")?.value;
        if (session) {
            console.log("Session found:", session);
            const data = await decrypt(session);
            console.log("Decrypted data:", data);
            return data;
        } else {
            console.log("No session found");
            return null;
        }
    } catch (error) {
        console.error("Error in getSession:", error);
        return null;
    }
}

async function updateSession(request) {
    try {
        const session = request.cookies.get("session")?.value;
        if (!session) return NextResponse.next(); 

        const parsed = await decrypt(session);

        parsed.expires = new Date(Date.now() + expireDuration);
        console.log("Updated session:", parsed);

        const encryptedSession = await encrypt(parsed);

        const res = NextResponse.next();
        res.cookies.set({
            name: "session",
            value: encryptedSession,
            httpOnly: true,
            expires: parsed.expires,
        });

        return res;
    } catch (error) {
        console.error("Error in updateSession:", error);
        return NextResponse.next();
    }
}


export { registerUser, loginUser, logoutUser, getSession, updateSession };

