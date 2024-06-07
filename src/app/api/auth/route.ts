import { getSession } from "@/lib/backend/authentication/session";
import { decrypt } from "@/lib/backend/authentication/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        console.log("Session:", session);
        if (session === null) {
            return new NextResponse(JSON.stringify({ message: "No session found" }), { status: 401 });
        }
        return new NextResponse(JSON.stringify({ message: "Session found" }), { status: 200 });
    } catch (error) {
        console.error("Error getting session:", error);
        return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}