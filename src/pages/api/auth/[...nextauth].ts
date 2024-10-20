import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../../prisma/client";
import { UserService } from "../../../app/service/user.service";

// Define types for the credentials and user
interface Credentials {
  email: string;
  password: string;
}

// Separate function for user authorization to simplify tests
export const authorizeUser = async (
  credentials: Credentials | undefined,
  prismaClient: typeof prisma
): Promise<User | null> => {
  if (!credentials) {
    return null; // Return null if credentials are not defined
  }

  const { email, password } = credentials;
  const userService = new UserService(prismaClient);

  const user = await userService.login(email, password);
  if (!user) {
    return null;
  }

  // If credentials are valid, return the user object including id (required by NextAuth)
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email
  } as User; // Ensure type compatibility
};

// Main NextAuth export
export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === 'production',
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
        return authorizeUser(credentials, prisma);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name
      };
      return session;
    },
  },
});
