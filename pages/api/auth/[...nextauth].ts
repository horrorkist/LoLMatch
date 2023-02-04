import { NextAuthOptions, Session, User } from "next-auth";
import NextAuth from "next-auth/next";
import NaverProvider from "next-auth/providers/naver";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../../../lib/server/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const API_ENTRY_POINT = "https://localhost:3000";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID || "",
      clientSecret: process.env.NAVER_CLIENT_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user = {
        ...session.user,
        id: user.id,
      };
      return session;
    },
  },
  pages: {
    signIn: "/signIn",
  },
};

export default NextAuth(authOptions);
