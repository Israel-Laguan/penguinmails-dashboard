import { db } from "../db";
import type { User } from "types";
import { createErrorResponse } from "../../response";

/**
 * Authorizes a request based on a JWT bearer token and user roles.
 * It mimics a protected route middleware.
 *
 * @param request The incoming request object, expected to have an `Authorization` header.
 * @param allowedRoles An array of role strings that are permitted to access the resource.
 * @returns A tuple containing either the authorized user object or an error Response object.
 */
export const authorize = async (
  request: Request,
): Promise<[User | null, Response | null]> => {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const errorResponse = createErrorResponse("UNAUTHORIZED");
    return [null, new Response(JSON.stringify(errorResponse), { status: 401 })];
  }

  const token = authHeader.split(" ")[1];
  const userId = token.replace("mock-token-for-id-", "");
  const user = db.users.findFirst({ where: { id: userId } });

  if (!user) {
    const errorResponse = createErrorResponse("UNAUTHORIZED");
    return [null, new Response(JSON.stringify(errorResponse), { status: 401 })];
  }

  return [user, null];
};
