
import { compare } from "bcrypt";
import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../lib/prisma";

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env?.NODE_ENV === 'production',
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null; // Return null if credentials are undefined
        }

        const { email, password } = credentials;

        // Fetch the user from the database using Prisma
        const user = await prisma.user.findUnique({
          where: { email },
        });

        // If user doesn't exist, return null
        if (!user) {
          return null;
        }

        // Compare the hashed password with the user's provided password
        const isValidPassword = await compare(password, user.password);

        // If password doesn't match, return null
        if (!isValidPassword) {
          return null;
        }

        // If credentials are valid, return the user object including id (required by NextAuth)
        return {
          id: user.id,
          name: user.firstName,
          email: user.email,
          role: 'admin'
        } as unknown as User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role
      };
      return session;
    },
  }
});