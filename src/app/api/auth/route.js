import connectDB from "@/config/DatabaseConnection.js"

export async function GET(req){
    await connectDB();
    return new Response("Hello from the API");
}