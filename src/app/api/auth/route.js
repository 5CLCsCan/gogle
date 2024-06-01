import UserModel from "@/models/UserSchema.js";
import {connectDB, addData} from "@/lib/database.js";
import {loginUser, logoutUser, registerUser} from "@/lib/backend/authentication/authentication.js";
import { register } from "module";

export async function GET(req){
    await connectDB();

    const test_user = new UserModel({
        username: "test12",
        email: "abc1@gmail.com",
        password: "test12"
    });

    await registerUser(test_user);

    return new Response("Hello from the API");
}

export async function POST(req){
    await connectDB();
    const body = await req.json();

    const {email, password} = body;
    
    try {
        const result = await loginUser(body);
        return new Response(result);
    } catch (error) {
        console.log(error);
        return new Response("Login Failed");
    }
}

