import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth();

  if (!allowedRoles.includes(session.user.role)) {
    throw new Error("FORBIDDEN");
  }

  return session;
}
