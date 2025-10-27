import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/utils"

export default NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        const { password, email } = credentials;
        const user = await prisma.members.findFirst({
          where: {
            email,
            password,
          },
        });
        if (user) {
          if (user.password === password && user.email === email) {
            return user;
          }
          return null;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma) as any,
});
