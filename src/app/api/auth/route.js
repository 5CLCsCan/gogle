import {connectDB, addData} from "@/lib/database.js";
import UserModel from "@/models/UserSchema.js";
import {loginUser, logoutUser, registerUser, getSession} from "@/lib/backend/authentication/authentication.js";

export async function GET(req){
    await connectDB();
    const sessionData = await getSession();
    return new Response(JSON.stringify(sessionData), { 
        headers: { 'Content-Type': 'application/json' } 
    });
}

export async function POST(req){
    await connectDB();
    const body = await req.json();

    const {email, password} = body;
    
    try {
        const result = await loginUser(body);
        
        const sessionData = await getSession();
        return new Response(JSON.stringify(sessionData), {
            headers: { 'Content-Type': 'application/json' }
        });

        //return new Response(result);
    } catch (error) {
        console.log(error);
        return new Response("Login Error");
    }
}

