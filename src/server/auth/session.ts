import { getServerSession } from "next-auth";
import { authOptions } from "./options";

/**
 * Helper function to get the current session on the server side.
 * Use this in server components, API routes, and server actions.
 */
export async function getSession() {
  return await getServerSession(authOptions);
}
