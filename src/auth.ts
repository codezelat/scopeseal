import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

type ScopeSealToken = {
  authVersion?: number;
  id?: string;
  role?: "USER" | "ADMIN";
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Credentials provider requires JWT sessions (no database sessions).
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").toLowerCase().trim();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const user = await db.user.findUnique({ where: { email } });
        // Constant-ish delay to blunt brute-force timing.
        if (!user || !user.passwordHash) {
          await new Promise((r) => setTimeout(r, 300));
          return null;
        }
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          authVersion: user.authVersion,
        } as const;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const appToken = token as typeof token & ScopeSealToken;
      if (user) {
        appToken.id = user.id;
        appToken.role = (user as { role?: "USER" | "ADMIN" }).role;
        appToken.authVersion = (user as { authVersion?: number }).authVersion ?? 0;
        return appToken;
      }

      if (appToken.id) {
        const current = await db.user.findUnique({
          where: { id: appToken.id },
          select: { authVersion: true },
        });
        if (!current || current.authVersion !== (appToken.authVersion ?? 0)) return null;
      }
      return appToken;
    },
    session({ session, token }) {
      if (token && session.user) {
        const appToken = token as typeof token & ScopeSealToken;
        session.user.id = appToken.id as string;
        session.user.role = appToken.role ?? "USER";
      }
      return session;
    },
  },
});

/** Server-side current user (for server components / route handlers). */
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  };
}
