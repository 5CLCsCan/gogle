import { updateSession } from "@/lib/backend/authentication/authentication.js";

export async function middleware(request) {
  return await updateSession(request);
}
