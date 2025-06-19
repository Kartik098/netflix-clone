import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { SessionStrategy } from "next-auth";
import prismadb from "./prismadb"; // adjust path if needed

// Custom adapter to transform expires_at
const customPrismaAdapter = {
  ...PrismaAdapter(prismadb),
  linkAccount: async (account) => {
    const transformedAccount = {
      ...account,
      expiresAt: account.expires_at ? Math.floor(account.expires_at) : null,
      expires_at: undefined,
    };
    return PrismaAdapter(prismadb).linkAccount(transformedAccount);
  },
};

const authOptions = {
  adapter: customPrismaAdapter,
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
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Email does not exist.");
        }

        const isCorrectPassword = await compare(
          credentials.password,
          user.hashedPassword
        );

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
              expiresAt: Math.floor(account.expires_at),
            },
          });
        }
      } catch (error) {
        console.error("Error in linkAccount event:", error);
      }
    },
  },
};

export default authOptions;
