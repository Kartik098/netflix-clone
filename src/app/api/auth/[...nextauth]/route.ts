import NextAuth, { SessionStrategy } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prismadb from "../../../../../lib/prismadb";

// Custom adapter to transform expires_at to expiresAt
const customPrismaAdapter = {
  ...PrismaAdapter(prismadb),
  linkAccount: async (account) => {
    const transformedAccount = {
      ...account,
      expiresAt: account.expires_at ? Math.floor(account.expires_at) : null, // Convert to integer
      expires_at: undefined, // Remove expires_at to prevent it from being passed
    };
    return PrismaAdapter(prismadb).linkAccount(transformedAccount);
  },
};
const authOptions =  {
  adapter: customPrismaAdapter, // Use custom adapter
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and Password required.");
        }
        const user = await prismadb.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user || !user.hashedPassword) {
          throw new Error("Email does not exist.");
        }
        const isCorrectPassword = await compare(credentials.password, user.hashedPassword);
        if (!isCorrectPassword) {
          throw new Error("Password Incorrect.");
        }
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async linkAccount({ account }) {
      try {
        if (account.expires_at !== undefined) {
          await prismadb.account.update({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            data: {
              expiresAt: Math.floor(account.expires_at), // Convert to integer
            },
          });
        }
      } catch (error) {
        console.error("Error in linkAccount event:", error);
      }
    },
  },
}
const handler = NextAuth(authOptions);
export { authOptions };
export { handler as GET, handler as POST };